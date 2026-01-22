import { AddressType } from "./address";
import { ProductType } from "./product";

export type OrderType = {
  id: string;
  userId: string;
  items: {
    product: ProductType;
    quantity: number;
  }[];
  amount: number;
  address: AddressType;
  status: string;
  date: Date;
  createdAt: Date;
};
