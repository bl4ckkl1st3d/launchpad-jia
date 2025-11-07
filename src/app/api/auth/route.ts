import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";

export async function POST(request: Request) {
  try {
    const { name, email, image } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    // 1. Check admins collection
    const admin = await db.collection("admins").findOne({ email: email });
    if (admin) {
      await db.collection("admins").updateOne(
        { email: email },
        {
          $set: {
            name: name,
            image: image,
            lastSeen: new Date(),
          },
        }
      );
      console.log(`[AUTH] User ${email} found in 'admins'. Role: ${admin.role}`);
      return NextResponse.json(admin);
    }

    // 2. ***NEW***: Check members collection
    const member = await db.collection("members").findOne({ email: email });
    if (member) {
      // Also update their details
      await db.collection("members").updateOne(
        { email: email },
        {
          $set: {
            name: name,
            image: image,
            lastSeen: new Date(),
          },
        }
      );
      // Return the member document. This document MUST have a 'role'
      // property (e.g., "admin") for AuthGuard to work.
      console.log(`[AUTH] User ${email} found in 'members'. Role: ${member.role}`);
      return NextResponse.json(member);
    }
    
    // 3. Check applicants collection
    const applicant = await db
      .collection("applicants")
      .findOne({ email: email });

    if (applicant) {
      // You may want to update applicant details here too
      console.log(`[AUTH] User ${email} found in 'applicants'. Role: ${applicant.role}`);
      return NextResponse.json(applicant);
    }

    // 4. If not in any collection, create a new applicant
    if (!applicant) { // This condition is true if we've reached this point
      await db.collection("applicants").insertOne({
        email: email,
        name: name,
        image: image,
        createdAt: new Date(),
        lastSeen: new Date(),
        role: "applicant",
      });

      // ***FIXED***: Find and return the new applicant
      const newApplicant = await db.collection("applicants").findOne({ email: email });
      console.log(`[AUTH] User ${email} NOT found. Created new 'applicant'. Role: ${newApplicant.role}`);
      return NextResponse.json(newApplicant);
    }

    // This fallback should no longer be reached
    return NextResponse.json({
      message: "Default Fallback",
    });

  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}