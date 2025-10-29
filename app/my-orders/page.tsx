"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2Icon,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MyOrders = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/list`
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data.data.orders.reverse());
      } else {
        toast.error("Failed to fetch orders:", data.message);
      }
    } catch (error: any) {
      toast.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center gap-2">
          <Loader2Icon className="animate-spin" />
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center gap-y-4 my-32">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            You have no orders yet!
          </h2>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/cart")}>
              <ArrowLeft />
              <span>Back to Cart</span>
            </Button>
            <Button onClick={() => router.push("/")}>
              <span>Browse Products</span>
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <>
          <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            My Orders
          </h1>

          <div className="overflow-x-auto bg-white rounded-lg shadow md:w-[90%] mx-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Ordered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (Incl. Tax)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 cursor-pointer">
                {orders.map((order: any) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="hover:bg-gray-50"
                      onClick={() => toggleExpand(order._id)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 flex gap-x-2">
                        {expandedOrder === order._id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        <span>{order._id}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {process.env.NEXT_PUBLIC_CURRENCY +
                          " " +
                          order.amount.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          order.status === "completed"
                            ? "text-green-500"
                            : order.status === "processing"
                            ? "text-blue-500"
                            : order.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {order.status}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.address.area +
                          ", " +
                          order.address.city +
                          ", " +
                          order.address.state +
                          ", " +
                          order.address.zipCode +
                          ", " +
                          order.address.country}
                      </td>
                    </tr>

                    {expandedOrder === order._id && (
                      <tr className="cursor-default">
                        <td colSpan={5} className="bg-gray-50 px-6 py-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                              Items in this order:
                            </h3>

                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                              Subtotal
                            </h3>
                          </div>

                          <ul className="space-y-1">
                            {order.items.map((item: any) => (
                              <li
                                key={item.product._id}
                                className="flex justify-between py-1 text-sm"
                              >
                                <div
                                  className="flex items-center gap-x-2 cursor-pointer hover:underline"
                                  onClick={() =>
                                    router.push(`products/${item.product._id}`)
                                  }
                                >
                                  <img
                                    className="w-10 h-10 rounded-sm object-cover border"
                                    src={item.product.imageUrls[0]}
                                    alt={item.product.name}
                                  />

                                  <span>
                                    {item.quantity + " x " + item.product.name}
                                  </span>
                                </div>

                                <span>
                                  {process.env.NEXT_PUBLIC_CURRENCY +
                                    " " +
                                    (
                                      item.quantity * item.product.price
                                    ).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default MyOrders;
