"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center gap-2">
        <Loader2Icon className="animate-spin" />
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (!isSignedIn) {
    return <h1 className="text-2xl font-semibold">Please sign in.</h1>;
  }

  const publicMetadata = user?.publicMetadata;
  if (publicMetadata.role !== "seller") {
    return <h1 className="text-2xl font-semibold">You are not a seller!</h1>;
  }

  return (
    <div className="flex md:flex-row flex-col gap-8">
      <div className="flex md:flex-col gap-4 w-fit h-fit bg-gray-100 p-4 rounded-sm border border-gray-200">
        <Button
          variant={pathname === "/seller/add-product" ? "default" : "outline"}
          onClick={() => router.push("/seller/add-product")}
        >
          Add Product
        </Button>
        <Button
          variant={pathname === "/seller/product-list" ? "default" : "outline"}
          onClick={() => router.push("/seller/product-list")}
        >
          Product List
        </Button>
        <Button
          variant={pathname === "/seller/orders" ? "default" : "outline"}
          onClick={() => router.push("/seller/orders")}
        >
          Orders
        </Button>
      </div>

      <div className="flex-grow space-y-8">{children}</div>
    </div>
  );
};

export default Layout;
