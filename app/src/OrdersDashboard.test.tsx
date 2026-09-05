import { fetchOrders, Order } from "./api/orders";
import OrdersDashboard from "./OrdersDashboard";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("./api/orders", () => ({
  fetchOrders: jest.fn()
}))

const mockedFetchOrders = jest.mocked(fetchOrders);

const sampleOrders: Order[] = [
  {
    id: "ord_1001",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@example.com",
    status: "delivered",
    itemCount: 2,
    total: 147,
    createdAt: "2026-08-21T09:12:00Z",
  }
]

beforeEach(() => {
  mockedFetchOrders.mockReset();
})

test('shows a loading skeleton before the fetch resolves', () => {
  mockedFetchOrders.mockReturnValue(new Promise(() => { }));

  render(<OrdersDashboard theme='light' />)

  expect(screen.getByText('Orders')).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
})

test('renders orders once the fetch resolves successfully', async () => {
  mockedFetchOrders.mockResolvedValue(sampleOrders);

  render(<OrdersDashboard theme='light' />)
  
  expect(await screen.findByText("Priya Nair")).toBeInTheDocument();
  expect(screen.getByText("$147")).toBeInTheDocument();
})

test("shows an empty state when there are no orders", async () => {
  mockedFetchOrders.mockResolvedValue([]);

  render(<OrdersDashboard theme="light" />);

  expect(await screen.findByText("No orders yet.")).toBeInTheDocument();
});

test("shows an error message and recovers via Retry", async () => {
  mockedFetchOrders.mockRejectedValueOnce(new Error("Network down"));

  render(<OrdersDashboard theme="light" />);

  expect(
    await screen.findByText(/Couldn't load orders: Network down/),
  ).toBeInTheDocument();

  mockedFetchOrders.mockResolvedValueOnce(sampleOrders);
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));

  expect(await screen.findByText("Priya Nair")).toBeInTheDocument();
});