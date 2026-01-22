import { OrderType } from "./order";

export type AddressType = {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  area: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  orders: OrderType[];
  createdAt: Date;
};
