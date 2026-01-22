import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        addresses: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            area: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (!user.addresses || user.addresses.length === 0) {
      return NextResponse.json(
        { success: false, message: "No addresses found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: { addresses: user.addresses } },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET /api/user/get-address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
