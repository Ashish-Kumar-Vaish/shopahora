"use client";

import { useState } from "react";
import { ProductType } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useAppContext();

  const imageUrl =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : null;

  const discountPercentage = (product: ProductType) => {
    if (!product.salePrice || !product.price) {
      return 0;
    }

    return ((product.price - product.salePrice) / product.price) * 100;
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-sm">
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full">
            {imageUrl && !imageError ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={() => {
                  console.error("Image failed to load:", imageUrl);
                  setImageError(true);
                }}
                unoptimized={true}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 text-center text-sm p-2">
                {imageUrl === null ? "No Image Available" : "Image Load Error"}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-semibold mb-1">
            {product.name}
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground h-16 overflow-hidden text-ellipsis">
            {product.description}
          </CardDescription>

          <div className="mt-2 flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-primary mr-2">
                  ${product.salePrice?.toFixed(2)}
                </span>

                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>

                <span className="ml-auto text-sm font-semibold text-green-600">
                  {discountPercentage(product).toFixed(0)}% Off
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="pb-4">
        <Button
          onClick={() => addToCart(product.id)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
