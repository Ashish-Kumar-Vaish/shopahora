import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/getProducts";
import { ProductType } from "@/models/Product";

const Sale = async () => {
  const products: ProductType[] = await getProducts();
  const saleProducts = products.filter((product) => product.salePrice);

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Products on Sale</h1>

      {saleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {saleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No items are currently on sale.</p>
        </div>
      )}
    </>
  );
};

export default Sale;
