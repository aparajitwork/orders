export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  itemCount: number;
  total: number;
  createdAt: string;
}

export const orders: Order[] = [
  {
    id: "ord_1001",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@example.com",
    status: "delivered",
    itemCount: 2,
    total: 147,
    createdAt: "2026-08-21T09:12:00Z"
  },
  {
    id: "ord_1002",
    customerName: "Arjun Mehta",
    customerEmail: "arjun.mehta@example.com",
    status: "shipped",
    itemCount: 1,
    total: 219,
    createdAt: "2026-08-24T12:03:00Z"
  },
  {
    id: "ord_1003",
    customerName: "Sara Fernandes",
    customerEmail: "sara.f@example.com",
    status: "processing",
    itemCount: 3,
    total: 242,
    createdAt: "2026-03-29T02:21:29Z"
  }
]