"use client";

import React, { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
import OrdersTable from "@/components/OrdersTable";
import { OrderType } from "@/types/order";

const page = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/seller-orders`,
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(data.data.orders);
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Seller Orders</h1>

      {loading ? (
        <div className="flex justify-center items-center gap-2 py-8">
          <Loader2Icon className="animate-spin" />
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No orders found</div>
      ) : (
        <OrdersTable orders={orders} role="seller" />
      )}
    </div>
  );
};

export default page;
