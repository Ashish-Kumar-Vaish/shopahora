"use client";

import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  ArrowLeft,
  ArrowRight,
  Loader2Icon,
  Trash,
  Triangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OrderSummary from "@/components/OrderSummary";
import { useRouter } from "next/navigation";

const Cart = () => {
  const router = useRouter();
  const { products, cartItems, addToCart, updateCartQuantity, cartLoading } =
    useAppContext();

  return (
    <>
      {cartLoading ? (
        <div className="flex justify-center items-center gap-2">
          <Loader2Icon className="animate-spin" />
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      ) : Object.keys(cartItems).length === 0 ? (
        <div className="flex flex-col items-center gap-y-4 my-32">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Cart is empty!
          </h2>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft />
              <span>Continue Shopping</span>
            </Button>
            <Button onClick={() => router.push("/my-orders")}>
              <span>View Your Orders</span>
              <ArrowRight />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Shopping Cart
          </h1>

          <div className="flex gap-y-6 flex-col md:flex-row md:gap-x-8 justify-center">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.keys(cartItems).map((itemId) => {
                    const product = products.find((p) => p.id === itemId);
                    const quantity = cartItems[itemId];

                    if (!product || cartItems[itemId] <= 0) {
                      return null;
                    }

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/products/${product.id}`}
                              className="block mr-4"
                            >
                              <div className="flex items-center cursor-pointer">
                                <div className="flex-shrink-0 w-10 h-10">
                                  <img
                                    className="w-10 h-10 rounded-md object-cover"
                                    src={product.imageUrls[0]}
                                    alt={product.name}
                                  />
                                </div>

                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.category}
                                  </div>
                                </div>
                              </div>
                            </Link>

                            <Button
                              value="outline"
                              onClick={() => updateCartQuantity(product.id, 0)}
                            >
                              <Trash />
                            </Button>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center items-center md:gap-2 gap-1">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                product.id,
                                cartItems[itemId] - 1,
                              )
                            }
                          >
                            <Triangle className="rotate-270 w-3 h-3" />
                          </button>

                          <input
                            onChange={(e) =>
                              updateCartQuantity(
                                product.id,
                                Number(e.target.value),
                              )
                            }
                            type="number"
                            value={cartItems[itemId]}
                            className="w-16 border text-center no-spinner outline-none"
                          ></input>

                          <button onClick={() => addToCart(product.id)}>
                            <Triangle className="rotate-90 w-3 h-3" />
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {product.currency +
                            " " +
                            (product.salePrice || product.price).toFixed(2)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {product.currency +
                            " " +
                            (
                              (product.salePrice || product.price) * quantity
                            ).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <OrderSummary />
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
