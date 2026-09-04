import { Router } from 'express';
import { orders } from '../data/orders';

export const ordersRouter = Router();

ordersRouter.get('/', (req, res) => {
  const { status } = req.query;
  let results = orders;

  if (typeof status === 'string') {
    results = results.filter((order) => order.status === status);
  }

  res.json({ orders: results, count: results.length });
})

ordersRouter.get("/:id", (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
})