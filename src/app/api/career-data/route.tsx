import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connectMongoDB from "@/lib/mongoDB/mongoDB";

// This seems to be for fetching a single career for viewing/editing
export async function POST(request: Request) {
  try {
    const { id, orgID } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const query: any = { _id: new ObjectId(id) };
    if (orgID) {
      query.orgID = orgID;
    }

    // Now fetches from careers, which includes drafts
    const career = await db.collection("careers").findOne(query);

    if (!career) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json(
      { error: "Failed to fetch career data" },
      { status: 500 }
    );
  }
}

// This function now correctly handles GET requests
export async function GET(request: Request) {
  try {
    // Read 'id' and 'orgID' from URL search parameters, not the body
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const orgID = searchParams.get('orgID');

    if (!id) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const query: any = { _id: new ObjectId(id) };
    if (orgID) {
      query.orgID = orgID;
    }

    // Now fetches from careers, which includes drafts
    const career = await db.collection("careers").findOne(query);

    if (!career) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }

    // Return the career data with a success flag
    return NextResponse.json({ success: true, career: career });

  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json(
      { error: "Failed to fetch career data" },
      { status: 500 }
    );
  }
}

// For saving a draft
export async function PUT(request: Request) {
  try {
    const { careerData, orgID, user } = await request.json();
    const { db } = await connectMongoDB();

    const careerId = careerData._id ? new ObjectId(careerData._id) : new ObjectId();
    
    const careerDocument = {
      ...careerData,
      orgID,
      lastEditedBy: user,
      updatedAt: new Date(),
      status: 'draft', // Always a draft when saved from the wizard's save draft function
    };
    delete careerDocument._id;


    await db.collection("careers").updateOne(
      { _id: careerId },
      { 
        $set: careerDocument,
      
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, id: careerId });

  } catch (error) {
    console.error("Error saving draft to careers:", error);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 }
    );
  }
}

// For publishing a career (changing status from draft to active/inactive)
export async function PATCH(request: Request) {
  try {
    const { careerData, orgID, user, status } = await request.json(); // status will be 'active' or 'inactive'
    const { db } = await connectMongoDB();

    if (!careerData._id) {
      return NextResponse.json({ error: "Career ID is required to publish" }, { status: 400 });
    }

    const careerId = new ObjectId(careerData._id);
    
    const updateDoc: any = {
        $set: {
            ...careerData,
            orgID,
            lastEditedBy: user,
            status, // 'active' or 'inactive'
            updatedAt: new Date(),
        }
    };
    
    // Check if it's the first time publishing this career (i.e., it's a draft)
    const existingCareer = await db.collection("careers").findOne({ _id: careerId });
    if (existingCareer && existingCareer.status === 'draft') {
        updateDoc.$set.createdBy = user;
    }
    
    delete updateDoc.$set._id;

    await db.collection("careers").updateOne({ _id: careerId }, updateDoc);

    return NextResponse.json({ success: true, id: careerId });
  } catch (error) {
    console.error("Error publishing career:", error);
    return NextResponse.json(
      { error: "Failed to publish career" },
      { status: 500 }
    );
  }
}
