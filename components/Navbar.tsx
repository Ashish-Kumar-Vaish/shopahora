"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Search,
  X,
  ShoppingCartIcon,
  ShoppingBagIcon,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SignedOut, useClerk, SignedIn, UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setSearchTerm(searchParams.get("search") || "");
    }
  }, [searchParams]);

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="flex w-full gap-2 sm:max-w-[60%] md:max-w-[45%] mx-2">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleInputKeyPress}
          className="w-full border-gray-400 focus:border-gray-500 pr-8 focus-visible:ring-[2px]"
        />

        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchTerm("");
            }}
            className="hidden sm:block absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={handleSearch}
          size="icon"
          className="sm:hidden absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={handleSearch} className="hidden sm:flex">
        <Search className="h-4 w-4" />
        <span>Search</span>
      </Button>
    </div>
  );
}

const Navbar = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  // const searchParams = useSearchParams();
  const { openSignIn } = useClerk();
  const { isSeller, getCartCount } = useAppContext();
  const itemCount = getCartCount();

  // useEffect(() => {
  //   if (searchParams) {
  //     setSearchTerm(searchParams.get("search") || "");
  //   }
  // }, []);

  // const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

  // const handleSearch = () => {
  //   if (searchTerm.trim()) {
  //     router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
  //   }
  // };

  return (
    <nav className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 text-gray-800 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex justify-between items-center gap-1">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="ShopAhora Logo" className="h-6" />
          <span className="hidden md:inline-block text-lg font-semibold">
            ShopAhora
          </span>
        </Link>

        <Suspense
          fallback={
            <div className="flex w-full gap-2 sm:max-w-[60%] md:max-w-[45%] mx-2">
              <Input
                disabled
                placeholder="Loading search..."
                className="w-full"
              />
            </div>
          }
        >
          <SearchInput />
        </Suspense>

        {/* <div className="flex w-full gap-2 sm:max-w-[60%] md:max-w-[45%] mx-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleInputKeyPress}
              className="w-full border-gray-400 focus:border-gray-500 pr-8 focus-visible:ring-[2px]"
            />

            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchTerm("");
                }}
                className="hidden sm:block absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={handleSearch}
              size="icon"
              className="sm:hidden absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={handleSearch} className="hidden sm:flex">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </div> */}

        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-600 hover:text-gray-800"
            >
              <ShoppingCart className="h-5 w-5" />

              {itemCount > 0 && (
                <Badge
                  className="h-5 w-5 rounded-full p-1 tabular-nums absolute -right-2 -top-2 bg-red-500 text-white"
                  variant="destructive"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          <SignedOut>
            <Button variant="ghost" onClick={() => openSignIn()}>
              <span>Sign in / Sign up</span>
            </Button>
          </SignedOut>

          <SignedIn>
            {isSeller && (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Seller Dashboard"
                    labelIcon={<LayoutDashboard size="icon" />}
                    onClick={() => router.push("/seller")}
                  />
                  <UserButton.Action
                    label="My Cart"
                    labelIcon={<ShoppingCartIcon size="icon" />}
                    onClick={() => router.push("/cart")}
                  />
                  <UserButton.Action
                    label="My Orders"
                    labelIcon={<ShoppingBagIcon size="icon" />}
                    onClick={() => router.push("/my-orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}

            {!isSeller && (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Cart"
                    labelIcon={<ShoppingCartIcon size="icon" />}
                    onClick={() => router.push("/cart")}
                  />
                  <UserButton.Action
                    label="My Orders"
                    labelIcon={<ShoppingBagIcon size="icon" />}
                    onClick={() => router.push("/my-orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
