import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const { address, items } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const productPrices = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        return (product.salePrice || product.price) * item.quantity;
      }),
    );

    const amount = productPrices.reduce((total, price) => total + price, 0);

    // Use transaction for Order + OrderItems + Cart Clearance
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          amount: amount + Math.floor(amount * 0.02),
          address: address,
          status: "pending",
          date: new Date(),
          items: {
            create: items.map((item: any) => ({
              product: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });

      return newOrder;
    });

    return NextResponse.json(
      { success: true, data: { order }, message: "Order placed" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("POST /api/order/create error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
