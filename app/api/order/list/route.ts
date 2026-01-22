import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

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
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        addressRef: true,
        items: {
          include: {
            productRef: true,
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
      date: order.date,
      amount: order.amount,
      status: order.status,
      address: order.addressRef,
      items: order.items.map((item) => ({
        quantity: item.quantity,
        product: item.productRef,
      })),
    }));

    return NextResponse.json(
      { success: true, data: { orders: transformedOrders } },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET /api/order/list error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
