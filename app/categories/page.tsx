import { getProducts } from "@/services/getProducts";
import { ProductType } from "@/models/Product";

const Categories = async () => {
  const products: ProductType[] = await getProducts();

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  ).sort();

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Product Categories</h1>

      {categories.length > 0 ? (
        <ul className="list-disc list-inside custom-marker-size">
          {categories.map((category) => (
            <li key={category} className="text-lg text-gray-700 mb-2">
              {category}
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories found.</p>
      )}
    </>
  );
};

export default Categories;
