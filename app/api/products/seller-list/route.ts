import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/services/authSeller";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import dbConnect from "@/lib/mongodb";

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
    const products = await Product.find({});

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "No products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { products } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/products/seller-list error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
