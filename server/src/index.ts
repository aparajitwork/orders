import express from "express";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4002;

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'orders-mock-api' })
})

app.listen(PORT, () => {
  console.log(`orders mock-api listening on http://localhost:${PORT}`)
})