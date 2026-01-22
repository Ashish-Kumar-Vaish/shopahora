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
        cartItems: {
          include: {
            productRef: true,
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

    // Transform cartItems array to object format { productId: quantity }
    const cartItemsMap: Record<string, number> = {};
    user.cartItems.forEach((item: any) => {
      cartItemsMap[item.product] = item.quantity;
    });

    return NextResponse.json(
      { success: true, data: { cartItems: cartItemsMap } },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET /api/cart/get error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
