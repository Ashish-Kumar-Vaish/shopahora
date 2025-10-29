import { getAuth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    await dbConnect();

    const existingUser = await User.findOne({ clerkId: user.id });
    if (existingUser) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    await User.insertOne({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.fullName,
      image: user.imageUrl,
    });

    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  } catch (error: any) {
    console.error("GET /api/sign-in error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
