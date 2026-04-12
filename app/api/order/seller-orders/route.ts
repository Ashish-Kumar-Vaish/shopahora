import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/services/authSeller";
import { NextRequest, NextResponse } from "next/server";
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

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform orders to match expected structure
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      date: order.createdAt,
      amount: order.totalAmount,
      status: order.status,
      address: order.addressSnapshot,
      items: order.items.map((item) => ({
        quantity: item.quantity,
        product: item.product,
        unitPrice: item.unitPrice,
      })),
    }));

    return NextResponse.json(
      { success: true, data: { orders: transformedOrders } },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET /api/order/seller-orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
