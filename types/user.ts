export interface UserType {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  cartItems: Record<string, number>;
}