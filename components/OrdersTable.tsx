"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderType } from "@/types/order";

const OrdersTable = ({
  orders,
  role,
}: {
  orders: OrderType[];
  role: string;
}) => {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div
      className={`overflow-x-auto bg-white rounded-lg shadow ${role === "seller" ? "w-full" : "md:w-[90%] mx-auto"}`}
    >
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
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr
                className="hover:bg-gray-50"
                onClick={() => toggleExpand(order.id)}
              >
                <td className="px-6 py-4 text-sm text-gray-900 flex gap-x-2">
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <span>{order.id}</span>
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

              {expandedOrder === order.id && (
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
                      {order.items.map((item) => (
                        <li
                          key={item.product.id}
                          className="flex justify-between py-1 text-sm"
                        >
                          <div
                            className="flex items-center gap-x-2 cursor-pointer hover:underline"
                            onClick={() =>
                              router.push(`products/${item.product.id}`)
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
                              (item.quantity * item.product.price).toFixed(2)}
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
  );
};

export default OrdersTable;
