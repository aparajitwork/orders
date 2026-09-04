import { Router } from 'express';
import { orders } from '../data/orders';
import { randomDelay } from '../utils/delay';

export const ordersRouter = Router();

ordersRouter.get('/', async (req, res) => {
  await randomDelay();

  const { status } = req.query;
  let results = orders;

  if (typeof status === 'string') {
    results = results.filter((order) => order.status === status);
  }

  res.json({ orders: results, count: results.length });
})

ordersRouter.get("/:id", async (req, res) => {
  await randomDelay();
  
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
})