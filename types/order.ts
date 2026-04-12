import { ProductType } from "./product";

export type OrderType = {
  id: string;
  userId: string;
  items: {
    product: ProductType;
    quantity: number;
    unitPrice: number;
  }[];
  amount: number;
  address: {
    fullName: string;
    phoneNumber: string;
    area: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: string;
  date: Date;
  createdAt: Date;
};
