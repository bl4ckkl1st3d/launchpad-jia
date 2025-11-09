import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orgID = searchParams.get("orgID");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userEmail = searchParams.get("userEmail");
    const search = searchParams.get("search");
    const sortConfigParam = searchParams.get("sortConfig");
    const status = searchParams.get("status");

    try {
        const { db } = await connectMongoDB();

        const authUserRole = await db.collection("members").findOne({ email: userEmail, orgID });
        
        const filter: any = { orgID };
        if (authUserRole?.role === "hiring_manager" && authUserRole?.careers?.length > 0) {
            filter._id = { $in: authUserRole.careers.map(id => new ObjectId(id)) };
        }
        if (search) {
            filter.jobTitle = { $regex: search, $options: "i" };
        }
        
        if (status && status !== "All Statuses") {
            if (status === "Published") {
                filter.status = "active";
            } else if (status === "Unpublished") {
                filter.status = "inactive";
            } else if (status === "Draft") {
                filter.status = "draft";
            }
        }

        const sortConfig = sortConfigParam ? JSON.parse(sortConfigParam) : null;
        const sortKey = sortConfig?.key;
        const sortDirection = sortConfig?.direction === 'ascending' ? 1 : -1;
        
        let sortStage: any = { $sort: { lastActivityAt: -1, _id: -1 } };
        if (sortKey) {
            sortStage = { $sort: { [sortKey]: sortDirection, _id: -1 } };
        }
        
        const correctedPipeline = [
            { $match: filter },
            { $lookup: { from: "interviews", localField: "_id", foreignField: "careerId", as: "interviews" } },
            { $unwind: { path: "$interviews", preserveNullAndEmptyArrays: true } },
            { $match: { $or: [ { "interviews.currentStep": { $ne: "Applied" } }, { interviews: { $exists: false } } ] } },
            { 
                $group: {
                    _id: "$_id",
                    jobTitle: { $first: "$jobTitle" },
                    status: { $first: "$status" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    lastActivityAt: { $first: "$lastActivityAt" },
                    orgID: { $first: "$orgID" },
                    interviewsInProgress: { $sum: { $cond: { if: { $and: [ { $or: [ { $eq: ["$interviews.applicationStatus", "Ongoing"] }, { $eq: ["$interviews.applicationStatus", null] } ] }, { $ne: ["$interviews.createdAt", null] } ] }, then: 1, else: 0 } } },
                    dropped: { $sum: { $cond: { if: { $in: ["$interviews.applicationStatus", ["Dropped", "Cancelled"]] }, then: 1, else: 0 } } },
                    hired: { $sum: { $cond: { if: { $eq: ["$interviews.applicationStatus", "Hired"] }, then: 1, else: 0 } } }
                }
            },
            { $addFields: { lastActivityAt: { $ifNull: ["$lastActivityAt", "$updatedAt", "$createdAt"] } } },
            sortStage,
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ];


        const careers = await db.collection("careers").aggregate(correctedPipeline).toArray();

        const totalCareers = await db.collection("careers").countDocuments(filter);
        const totalPages = Math.ceil(totalCareers / limit);
        const totalActiveCareers = await db.collection("careers").countDocuments({ orgID, status: "active" });

        return NextResponse.json({
            careers,
            totalCareers,
            totalPages,
            currentPage: page,
            totalActiveCareers,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 });
    }
}