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

    const userAddress = await prisma.address.findUnique({
      where: { id: address },
    });

    if (!userAddress) {
      return NextResponse.json(
        { success: false, message: "Selected address not found" },
        { status: 404 },
      );
    }

    const addressSnapshot = {
      fullName: userAddress.fullName,
      phoneNumber: userAddress.phoneNumber,
      area: userAddress.area,
      city: userAddress.city,
      state: userAddress.state,
      zipCode: userAddress.zipCode,
      country: userAddress.country,
    };

    const enrichedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        const currentPrice = product.salePrice || product.price;

        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: currentPrice,
          totalLinePrice: currentPrice * item.quantity,
        };
      }),
    );

    const subtotal = enrichedItems.reduce(
      (total, item) => total + item.totalLinePrice,
      0,
    );

    const finalTotalAmount = subtotal + Math.round(subtotal * 0.02);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: finalTotalAmount,
          currency: "USD",
          addressSnapshot: addressSnapshot,
          status: "pending",
          items: {
            create: enrichedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              currency: "USD",
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
