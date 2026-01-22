"use client";

import { ProductType } from "@/types/product";
import { UserType } from "@/types/user";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AppContextType {
  user: ReturnType<typeof useUser>["user"];
  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserType | null;
  fetchUserData: () => Promise<void>;
  products: ProductType[];
  fetchProductData: () => Promise<void>;
  productsLoading: boolean;
  cartItems: Record<string, number>;
  setCartItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  addToCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  getCartCount: () => number;
  getCartAmount: () => number;
  cartLoading: boolean;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
};

export const AppContextProvider = (props: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartLoading, setCartLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  // PRODUCT DATA FETCHING
  const fetchProductData = async () => {
    try {
      setProductsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/list`,
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setProducts(data.data.products);
      } else {
        toast.error("Failed to fetch products: " + data.message);
        setProducts([]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch products: " + error.message);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // USER DATA FETCHING
  const fetchUserData = async () => {
    try {
      setCartLoading(true);

      if (user?.publicMetadata.role === "seller") {
        setIsSeller(true);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/data`,
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUserData(data.data.user);
        setCartItems(data.data.user.cartItems);
      } else {
        toast.error("Failed to fetch user data: " + data.message);
        setUserData(null);

        if (data.signOut) {
          await signOut();
          router.push("/");
        }
      }
    } catch (error: any) {
      toast.error("Failed to fetch user data: " + error.message);
      setIsSeller(false);
    } finally {
      setCartLoading(false);
    }
  };

  // CART FUNCTIONS
  const addToCart = async (itemId: string) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);

    if (user) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cartData }),
          },
        );

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Item added to cart");
        } else {
          toast.error("Failed to add item to cart: " + data.message);
        }
      } catch (error: any) {
        toast.error("Failed to add item to cart: " + error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    let cartData = structuredClone(cartItems);

    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    setCartItems(cartData);

    if (user) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cartData }),
          },
        );

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Cart updated");
        } else {
          toast.error("Failed to add item to cart: " + data.message);
        }
      } catch (error: any) {
        toast.error("Failed to add item to cart: " + error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;

    for (const items in cartItems) {
      totalCount += cartItems[items];
    }

    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      let itemInfo = products.find((product) => product.id === items);

      if (itemInfo && cartItems[items] > 0) {
        totalAmount += itemInfo.price * cartItems[items];
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    if (products.length === 0) {
      fetchProductData();
    }
  }, [products]);

  useEffect(() => {
    if (user && !userData) {
      fetchUserData();
    }
  }, [user, userData]);

  const value = {
    user,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    productsLoading,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    cartLoading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
