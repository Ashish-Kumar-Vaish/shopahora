import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User";
import Product, { ProductType } from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const cartProducts: { product: ProductType; quantity: number }[] = [];

    for (const cartItem in user.cartItems) {
      const product = await Product.findOne({ _id: cartItem });

      if (product) {
        cartProducts.push({
          product,
          quantity: user.cartItems[cartItem],
        });
      } else {
        console.error("Product not found:", cartItem);
      }
    }

    return NextResponse.json(
      { success: true, data: { cartProducts: cartProducts } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/cart/get error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
