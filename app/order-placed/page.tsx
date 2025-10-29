"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const OrderPlaced = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-y-4 my-32">
        <CircleCheck size={64} />
        <h1 className="text-3xl font-bold text-gray-800">Order Placed</h1>
        <p className="text-gray-600">
          Your order has been placed successfully. We will send you an email
          with your order details shortly.
        </p>

        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft />
            <span>Continue Shopping</span>
          </Button>
          <Button onClick={() => router.push("/my-orders")}>
            View Your Orders
          </Button>
        </div>
      </div>
    </>
  );
};

export default OrderPlaced;
