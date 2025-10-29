export async function getProducts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/list`
    );

    if (!response.ok) {
      console.error("Failed to fetch products:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
