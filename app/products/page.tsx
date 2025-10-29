import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/getProducts";
import { ProductType } from "@/models/Product";

const AllProducts = async () => {
  const products: ProductType[] = await getProducts();

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default AllProducts;
