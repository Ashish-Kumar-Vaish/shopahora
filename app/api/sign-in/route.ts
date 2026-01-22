import { getAuth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (existingUser) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name:
          user.fullName || user.emailAddresses[0]?.emailAddress.split("@")[0],
      },
    });

    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  } catch (error: any) {
    console.error("GET /api/sign-in error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
