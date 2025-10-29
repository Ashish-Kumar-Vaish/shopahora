import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/services/authSeller";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Address from "@/models/Address";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    Address.length;

    const orders = await Order.find({})
      .populate("address")
      .populate("items.product");

    return NextResponse.json(
      { success: true, data: { orders } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/order/seller-orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
