import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";
import Address from "@/models/Address";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { addressData } = await request.json();

    if (!addressData) {
      return NextResponse.json(
        { success: false, message: "Missing address data" },
        { status: 400 }
      );
    }

    await dbConnect();

    const address = await Address.create({
      userId,
      ...addressData,
    });

    return NextResponse.json(
      { success: true, data: { address } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/user/add-address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
