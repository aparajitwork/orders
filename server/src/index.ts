import express from "express";
import cors from "cors";
import { ordersRouter } from "./routes/order";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'orders-mock-api' })
})

app.use("/api/orders", ordersRouter);

app.listen(PORT, () => {
  console.log(`orders mock-api listening on http://localhost:${PORT}`)
})