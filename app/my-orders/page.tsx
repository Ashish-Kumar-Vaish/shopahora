"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2Icon } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OrdersTable from "@/components/OrdersTable";

const MyOrders = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/list`,
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
    <>
      {loading ? (
        <div className="flex justify-center items-center gap-2">
          <Loader2Icon className="animate-spin" />
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      ) : orders.length === 0 ? (
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
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            My Orders
          </h1>

          <OrdersTable orders={orders} role="customer" />
        </>
      )}
    </>
  );
};

export default MyOrders;
