import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "No products found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: { products } },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET /api/products/list error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
