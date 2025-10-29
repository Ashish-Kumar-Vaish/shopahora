"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "@/components/ProductCard";
import Filter from "@/components/Filter";
import { useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const searchTerm = useSearchParams().get("search") || "";
  const { products, productsLoading } = useAppContext();

  // function to capitalize the first letter of each word in a string
  function upperCaseFirstLetter(str: String) {
    const words = str.split(" ");

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    return words.join(" ");
  }

  // products that are higlighted on the homepage
  // based on the `highlight` property in the product data
  const highlightedProducts = useMemo(() => {
    return products.filter((product) => product.highlight);
  }, [products]);

  // stoponinteraction is set to false to allow autoplay to continue,
  // even when the user interacts with the carousel,
  // but can be set to true if you want to pause autoplay on interaction.
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(
            (category): category is string => typeof category === "string"
            // ensure category is a string
            // and not undefined or null
          )
      )
    );

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // filter by both search term and
    // selected category if both are provided
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          (product.category?.toLowerCase() || "").includes(searchLower)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          (product.category?.toLowerCase() || "") === selectedCategory
      );
    }

    // to do: sort option should be there when searchTerm is provided
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortOption, searchTerm]);

  return (
    <>
      {!searchTerm && (
        <section className="text-center py-4 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            ShopAhora
          </h1>

          <p className="max-w-xl mx-auto text-base text-muted-foreground sm:text-md font-semibold">
            Discover our curated collection of minimalist products.
          </p>

          <Carousel
            className="w-[95%] sm:h-[280px] md:h-[420px] mx-auto mt-12"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <div className="h-full overflow-hidden flex items-center rounded-sm">
              <CarouselContent>
                {highlightedProducts.map((product, index) => (
                  <CarouselItem key={index}>
                    <Link href={`/products/${product._id}`}>
                      {product.highlight && (
                        <img
                          src={product.highlight}
                          alt={product.name}
                          className="w-full object-cover"
                          onError={() => {
                            console.error(
                              "Image failed to load:",
                              product.highlight
                            );
                          }}
                        />
                      )}
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      )}

      <section className="mx-auto lg:px-4 space-y-8">
        {productsLoading ? (
          <div className="flex justify-center items-center gap-2">
            <Loader2Icon className="animate-spin" />
            <h1 className="text-2xl font-semibold">Loading...</h1>
          </div>
        ) : (
          <>
            {!searchTerm && (
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Our Products
              </h2>
            )}

            <div
              className={`flex flex-col sm:flex-row justify-between gap-4 mx-auto ${
                searchTerm ? "w-full" : "max-w-4xl"
              }`}
            >
              <Filter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </div>

            {searchTerm && (
              <h2 className="text-2xl font-semibold text-gray-800 text-left">
                {`Search Results for "${searchTerm}" in ${upperCaseFirstLetter(
                  selectedCategory
                )}`}
              </h2>
            )}
          </>
        )}

        {!productsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}

            {filteredAndSortedProducts.length === 0 && (
              <p className="col-span-full text-center mx-auto py-8 text-gray-500">
                No products found. Try adjusting your search or filters.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
