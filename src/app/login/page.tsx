/* import { NextResponse } from "next/server";
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

      return NextResponse.json(admin);
    } else {
      const applicant = await db
        .collection("applicants")
        .findOne({ email: email });

      if (applicant) {
        return NextResponse.json(applicant);
      }

      if (!applicant) {
        await db.collection("applicants").insertOne({
          email: email,
          name: name,
          image: image,
          createdAt: new Date(),
          lastSeen: new Date(),
          role: "applicant",
        });
      }
    }

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
} */ 

  //Commented for vercel build error 
  // Type error: Page "src/app/login/page.tsx" does not match the required types of a Next.js Page.
  //"POST" is not a valid Page export field.


  "use client";

export default function LoginPage() {
  // You would put your login form JSX here.
  // The form's submit action would call the `/login` API route.
  return (
    <div>
      <h1>Login Page</h1>
    </div>
  );
}