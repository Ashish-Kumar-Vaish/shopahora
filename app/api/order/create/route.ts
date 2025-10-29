import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const { address, items } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const productPrices = await Promise.all(
      items.map(async (item: any) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        return (product.salePrice || product.price) * item.quantity;
      })
    );

    const amount = productPrices.reduce((total, price) => total + price, 0);

    const order = await Order.create({
      userId,
      items: items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
      amount: amount + Math.floor(amount * 0.02),
      address,
      status: "pending",
      date: new Date(),
    });

    const user = await User.findOne({ clerkId: userId });
    user.cartItems = {};
    await user.save();

    return NextResponse.json(
      { success: true, data: { order }, message: "Order placed" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/order/create error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
