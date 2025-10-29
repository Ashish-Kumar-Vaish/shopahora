import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import Address from "@/models/Address";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const addresses = await Address.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!addresses || addresses.length === 0) {
      return NextResponse.json(
        { success: false, message: "No addresses found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { addresses } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/user/get-address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
