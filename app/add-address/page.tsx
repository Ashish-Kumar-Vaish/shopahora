"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddAddress = () => {
  const router = useRouter();
  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    area: "",
    city: "",
    state: "",
    zipCode: "", // TODO: Add zip code validation
    country: "", // TODO: Add country automatic detection
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^\d{5,6}$/.test(address.zipCode)) {
      toast.error("Invalid zip code");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/add-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressData: address,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Address added successfully");
        router.push("/cart");
      } else {
        toast.error("Failed to add address: " + data.message);
      }
    } catch (error: any) {
      toast.error("Failed to add address: " + error.message);
    }
  };

  return (
    <div className="flex items-start justify-between">
      <img
        className="hidden md:block w-[45%] object-contain sticky top-16 z-10"
        src="/add-address-img.png"
        alt="Add Address"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[50%] p-2 md:p-4 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-8 text-center">Add Address</h1>

        <div className="mb-4 flex flex-col gap-2 justify-center">
          <Label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </Label>
          <Input
            type="text"
            name="fullName"
            id="fullName"
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
            className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
          />
        </div>

        <div className="mb-4 flex flex-col gap-2 justify-center">
          <Label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </Label>
          <Input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={address.phoneNumber}
            onChange={(e) =>
              setAddress({ ...address, phoneNumber: e.target.value })
            }
            className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
          />
        </div>

        <div className="mb-4 flex flex-col gap-2 justify-center">
          <Label
            htmlFor="area"
            className="block text-sm font-medium text-gray-700"
          >
            Area
          </Label>
          <Textarea
            name="area"
            id="area"
            value={address.area}
            onChange={(e) => setAddress({ ...address, area: e.target.value })}
            className="break-all block w-full resize-none border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
          />
        </div>

        <div className="mb-4 flex flex-col gap-2 justify-center">
          <Label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </Label>
          <Input
            type="text"
            name="city"
            id="city"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
          />
        </div>

        <div className="mb-4 flex flex-col gap-2 justify-center">
          <Label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </Label>
          <Input
            type="text"
            name="state"
            id="state"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
          />
        </div>

        <div className="mb-4 flex flex-col gap-2 justify-center">
          <Label
            htmlFor="zipCode"
            className="block text-sm font-medium text-gray-700"
          >
            Zip Code
          </Label>
          <Input
            type="text"
            name="zipCode"
            id="zipCode"
            value={address.zipCode}
            onChange={(e) =>
              setAddress({ ...address, zipCode: e.target.value })
            }
            className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
          />
        </div>

        <div className="mb-4 flex flex-col gap-2 justify-center">
          <Label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </Label>
          <Input
            type="text"
            name="country"
            id="country"
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
            className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={() => handleSubmit}
            disabled={
              !address.fullName ||
              !address.phoneNumber ||
              !address.area ||
              !address.city ||
              !address.state ||
              !address.zipCode ||
              !address.country
            }
          >
            Add Address
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
