export interface ProductType {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  currency: string;
  description: string;
  category?: string | null;
  imageUrls: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  characteristics?: Record<string, any> | null;
  highlight?: string | null;
}
