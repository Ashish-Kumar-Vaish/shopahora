"use client";

import { useAppContext } from "@/contexts/AppContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddressType } from "@/types/address";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon, PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";

const OrderSummary = () => {
  const router = useRouter();
  const { getCartCount, getCartAmount, user, cartItems, setCartItems } =
    useAppContext();
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null,
  );
  const [userAddresses, setUserAddresses] = useState<AddressType[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchUserAddresses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/get-address`,
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUserAddresses(data.data.addresses);

        if (data.data.addresses.length > 0) {
          setSelectedAddress(data.data.addresses[0]);
        }
      } else {
        console.error("Failed to fetch user addresses:", data.message);
      }
    } catch (error: any) {
      console.error("Error fetching user addresses:", error.message);
    }
  };

  const handleAddressSelect = (address: AddressType) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.error("Please select a shipping address.");
        return;
      }

      if (!cartItems || Object.keys(cartItems).length === 0) {
        toast.error("Cart is unavailable. Please try again.");
        return;
      }

      let itemsArray = Object.keys(cartItems)
        .map((key) => {
          return {
            productId: key,
            quantity: cartItems[key],
          };
        })
        .filter((item) => item.quantity > 0);

      if (itemsArray.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: selectedAddress.id,
            items: itemsArray,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCartItems({});
        router.push("/order-placed");
        toast.success("Order placed successfully!");
      } else {
        toast.error(`Failed to place order: ${data.message}`);
      }
    } catch (error: any) {
      console.error("Error creating order:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  return (
    <div className="space-y-4 p-4 rounded-lg shadow w-full md:w-1/3">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Order Summary
      </h2>

      <div className="flex flex-col gap-2 justify-center">
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedAddress
              ? `${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zipCode}`
              : "Select Shipping Address"}
            {isDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white rounded-md shadow-lg z-10 border border-gray-300 py-2">
              <div className="px-4 py-2">
                <Button
                  className="flex cursor-pointer w-full"
                  variant="outline"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/add-address");
                  }}
                >
                  <PlusCircleIcon />
                  <span>Add New Address</span>
                </Button>

                {userAddresses.map((address, index) => (
                  <Button
                    variant="outline"
                    key={index}
                    className="flex justify-between cursor-pointer w-full mt-2"
                    onClick={() => handleAddressSelect(address)}
                  >
                    <span>{address.fullName}</span>
                    <span>{address.area + ", " + address.city}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-200 pt-2">
          <div className="text-gray-600 text-sm flex justify-between">
            <span>{getCartCount()} Items Subtotal</span>
            <span className="font-semibold">
              {process.env.NEXT_PUBLIC_CURRENCY +
                " " +
                getCartAmount().toFixed(2)}
            </span>
          </div>

          <div className="text-gray-600 text-sm flex justify-between">
            <span>Shipping Fee</span>
            <span className="font-semibold">Free</span>
          </div>

          <div className="text-gray-600 text-sm flex justify-between">
            <span>Tax (2%)</span>
            <span className="font-semibold">
              {process.env.NEXT_PUBLIC_CURRENCY +
                " " +
                (getCartAmount() * 0.02).toFixed(2)}
            </span>
          </div>

          <div className="text-gray-600 flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>
              {process.env.NEXT_PUBLIC_CURRENCY +
                " " +
                (getCartAmount() * 1.02).toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          className="w-full mt-4"
          onClick={createOrder}
          disabled={!selectedAddress}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
