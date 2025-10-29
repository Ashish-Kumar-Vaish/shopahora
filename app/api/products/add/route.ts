import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/services/authSeller";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "You are not a seller" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const salePrice = formData.get("salePrice");
    const currency = formData.get("currency");
    const stock = formData.get("stock");
    const colors = formData.getAll("colors");
    const sizes = formData.getAll("sizes");

    if (!name || !price || !currency || !description || !stock) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const images = formData.getAll("images");

    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required images" },
        { status: 400 }
      );
    }

    const result = await Promise.all(
      images.map(async (images: any) => {
        const arrayBuffer = await images.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(buffer);
        });
      })
    );

    await dbConnect();
    
    const imageUrls = result.map((result: any) => result.url);

    const newProduct = await Product.create({
      name,
      price: Number(price),
      currency,
      salePrice: salePrice ? Number(salePrice) : undefined,
      description,
      category,
      stock,
      colors,
      sizes,
      imageUrls,
    });

    return NextResponse.json(
      { success: true, data: { newProduct } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/products/add error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
