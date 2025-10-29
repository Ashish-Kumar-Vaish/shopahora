import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default async function authSeller(userId: string) {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (user.publicMetadata.role === "seller") {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
