"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("currency", currency);
    data.append("salePrice", salePrice);
    data.append("description", description);
    data.append("category", category);
    data.append("stock", stock);
    data.append("colors", colors.join(","));
    data.append("sizes", sizes.join(","));

    for (const file of files) {
      data.append("images", file);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/add`,
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        toast.success("Product added successfully!");
        setFiles([]);
        setDescription("");
        setName("");
        setPrice("");
        setSalePrice("");
        setCurrency("");
        setCategory("");
        setStock("");
        setColors([]);
        setSizes([]);
      } else {
        toast.error("Failed to add product: " + response.statusText);
      }
    } catch (error: any) {
      toast.error("Failed to add product: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <div className="flex items-start justify-between">
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-[55%] p-4 rounded-lg shadow"
        >
          <div className="mb-4 flex gap-2 justify-center items-center">
            <label
              htmlFor="name"
              className="block text-md font-medium text-gray-700"
            >
              Name
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />
          </div>

          <div className="mb-4 flex gap-2 justify-center items-center">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <Input
              type="text"
              name="price"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />

            <label
              htmlFor="salePrice"
              className="block text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              Sale Price
            </label>
            <Input
              type="text"
              name="salePrice"
              id="salePrice"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />
          </div>

          <div className="mb-4 flex gap-2 justify-center items-center">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Currency {/* TODO: Add currency dropdown */}
            </label>
            <Input
              type="text"
              name="currency"
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />

            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category {/* TODO: Add category dropdown */}
            </label>
            <Input
              type="text"
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />
          </div>

          <div className="mb-4 flex flex-col gap-2 justify-center">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="break-all block w-full resize-none border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />
          </div>

          <div className="mb-4 flex gap-2 justify-center items-center">
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock
            </label>
            <Input
              type="text"
              name="stock"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />

            <label
              htmlFor="sizes"
              className="block text-sm font-medium text-gray-700"
            >
              Sizes {/* TODO: Add size dropdown */}
            </label>
            <Input
              type="text"
              name="sizes"
              id="sizes"
              value={sizes.join(", ")}
              onChange={(e) => setSizes(e.target.value.split(","))}
              className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />
          </div>

          <div className="mb-4 flex gap-2 justify-center items-center">
            <label
              htmlFor="colors"
              className="block text-sm font-medium text-gray-700"
            >
              Colors {/* TODO: Add color dropdown with swatches */}
            </label>
            <Input
              type="text"
              name="colors"
              id="colors"
              value={colors.join(", ")}
              onChange={(e) => setColors(e.target.value.split(","))}
              className="block w-full border-gray-400 focus:border-gray-500 focus-visible:ring-[2px]"
            />
          </div>

          <div className="mb-4 flex gap-2 justify-center">
            <div className="block text-sm font-medium text-gray-700 mt-2">
              Files
            </div>

            <div className="flex w-full gap-2 flex-wrap">
              <Label
                htmlFor="files"
                className="relative flex items-center justify-center w-25 h-25 border border-dashed border-gray-400 rounded-sm cursor-pointer hover:bg-gray-100"
              >
                <PlusIcon className="h-10 w-10 text-gray-400" />
                <Input
                  type="file"
                  id="files"
                  name="files"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);

                      const uniqueFiles = newFiles.filter(
                        (newFile) =>
                          !files.some(
                            (existingFile) => existingFile.name === newFile.name
                          )
                      );

                      if (uniqueFiles.length > 0) {
                        setFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);
                      }
                    }
                  }}
                />
              </Label>

              {files.map((file: File, index: number) => (
                <div
                  key={index}
                  className="flex border border-gray-500 h-25 w-25 rounded-sm overflow-hidden relative"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="default"
                    type="button"
                    className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                      setFiles((prevFiles) =>
                        prevFiles.filter((f) => f.name !== file.name)
                      )
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={() => handleSubmit}
              disabled={
                !name || !price || !currency || !description || !stock || !files
              }
            >
              Add Product
            </Button>
          </div>
        </form>

        <img
          className="hidden md:block w-[40%] object-contain sticky top-16 z-10"
          src="/add-product-img.png"
          alt="Add Product"
        />
      </div>
    </div>
  );
};

export default AddProduct;
