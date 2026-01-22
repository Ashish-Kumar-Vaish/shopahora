"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { ProductType } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Loader2Icon, ShoppingCart } from "lucide-react";

const ProductPage = ({
  params,
}: {
  params: Promise<{
    productId: string;
  }>;
}) => {
  const { productId } = React.use(params);
  const { products, addToCart, productsLoading } = useAppContext();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (productsLoading) return;

    const foundProduct = products.find((p) => p.id === productId) || null;

    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.imageUrls[0]);
    }
  }, [products, productId, productsLoading]);

  return (
    <>
      {productsLoading ? (
        <div className="flex justify-center items-center gap-2 py-8">
          <Loader2Icon className="animate-spin" />
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      ) : !product ? (
        <h2 className="text-2xl font-semibold text-gray-800 text-center py-8">
          404 - Product not found
        </h2>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
              <div className="order-2 md:order-1">
                <div className="flex md:flex-col gap-2 h-full md:h-140 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {product.imageUrls.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 xl:w-28 xl:h-28 cursor-pointer rounded-md border ${
                        selectedImage === image
                          ? "border-primary"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 md:order-2 flex-1">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full object-contain bg-white rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-6 w-full md:w-1/2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex items-center gap-x-2">
                  <p
                    className={`mt-2 text-xl font-semibold text-primary ${
                      product.salePrice ? "line-through" : ""
                    }`}
                  >
                    {product.currency + " " + product.price.toFixed(2)}
                  </p>
                  {product.salePrice && (
                    <p className="mt-2 text-xl font-semibold text-green-600">
                      {product.currency + " " + product.salePrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 pb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="flex gap-x-12">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Category
                  </h3>
                  <p className="text-gray-600 capitalize">{product.category}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sizes</h3>
                  <p className="text-gray-600">
                    {product.sizes.length > 0 ? (
                      product.sizes.map((size, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="mr-2 mb-2"
                        >
                          {size}
                        </Button>
                      ))
                    ) : (
                      <i>Not mentioned</i>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">Colors</h3>
                <p className="text-gray-600">
                  {product.colors.length > 0 ? (
                    product.colors.map((color, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="mr-2 mb-2"
                      >
                        {color}
                      </Button>
                    ))
                  ) : (
                    <i>Not mentioned</i>
                  )}
                </p>
              </div>

              {product.stock && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Stock</h3>
                  <p
                    className={`font-semibold ${
                      product.stock > 5 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock}
                  </p>
                </div>
              )}

              <Button
                onClick={() => addToCart(product.id)}
                className="w-full md:w-auto"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
