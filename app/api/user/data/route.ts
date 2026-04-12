import { NextRequest, NextResponse } from "next/server";
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
            product: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found", signOut: true },
        { status: 404 },
      );
    }

    // Transform cartItems array to object format { productId: quantity }
    const cartItemsMap: Record<string, number> = {};
    user.cartItems.forEach((item: any) => {
      cartItemsMap[item.product] = item.quantity;
    });

    const userData = {
      ...user,
      cartItems: cartItemsMap,
    };

    return NextResponse.json(
      { success: true, data: { user: userData } },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET /api/user/data error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
