"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/models/Product";
import { ArrowUpRightIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductList = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/seller-list`
      );

      const data = await response.json();

      if (response.ok) {
        setProducts(data.data.products);
      } else {
        toast.error("Failed to fetch products: " + data.message);
      }
    } catch (error: any) {
      toast.error("Failed to fetch products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Product List</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-16 w-16 relative">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${product.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.salePrice ? `$${product.salePrice}` : "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => router.push(`/products/${product._id}`)}
                  >
                    Visit
                    <ArrowUpRightIcon className="ml-1 h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading ? (
          <div className="flex justify-center items-center gap-2 py-8">
            <Loader2Icon className="animate-spin" />
            <h1 className="text-2xl font-semibold">Loading...</h1>
          </div>
        ) : (
          products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductList;
