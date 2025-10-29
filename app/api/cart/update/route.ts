import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";
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

    const { cartData } = await request.json();

    if (!cartData) {
      return NextResponse.json(
        { success: false, message: "Missing cart data" },
        { status: 400 }
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

    user.cartItems = cartData;
    user.save();

    return NextResponse.json(
      { success: true, message: "Item updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/cart/update error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
