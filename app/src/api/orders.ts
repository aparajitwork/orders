export type OrderStatus = 
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  itemCount: number;
  total: number;
  createdAt: string;
}

type OrderResponse = {
  orders: Order[];
  count: number
}

const API_BASE_URL = import.meta.env.VITE_ORDERS_API_URL;

export const fetchOrders = async (): Promise<Order[]> => {
  if (!API_BASE_URL)
    throw new Error("VITE_ORDERS_API_URL is not set");

  const response = await fetch(`${API_BASE_URL}/api/orders`);

  if (!response.ok)
    throw new Error(`Failed to load orders: ${response.status}`);

  const data: OrderResponse = await response.json();
  return data.orders;
}