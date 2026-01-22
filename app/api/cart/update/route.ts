import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { cartData } = await request.json();

    if (!cartData || Object.keys(cartData).length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing cart data" },
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

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    const cartItemsToCreate = Object.entries(cartData).map(
      ([productId, quantity]) => ({
        userId: user.id,
        product: productId,
        quantity: quantity as number,
      }),
    );

    if (cartItemsToCreate.length > 0) {
      await prisma.cartItem.createMany({
        data: cartItemsToCreate,
      });
    }

    return NextResponse.json(
      { success: true, message: "Item updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("POST /api/cart/update error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
