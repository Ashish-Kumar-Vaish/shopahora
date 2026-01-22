import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { addressData } = await request.json();

    if (!addressData) {
      return NextResponse.json(
        { success: false, message: "Missing address data" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        ...addressData,
      },
    });

    return NextResponse.json(
      { success: true, data: { address } },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST /api/user/add-address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
