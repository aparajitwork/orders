import { useEffect, useState } from "react";
import { fetchOrders, Order } from "./api/orders";
import OrdersSkeleton from "./OrdersSkeleton";

export type Theme = 'light' | 'dark';

type OrdersDashboardProps = {
  theme: Theme;
}

type LoadState = 
  | { status: "loading" }
  | { status: "error", message: string }
  | { status: "success", orders: Order[]}

const OrdersDashboard = ({ theme }: OrdersDashboardProps) => {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchOrders()
      .then((orders) => {
        if (!cancelled) setState({ status: "success", orders });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Something went wrong";
          setState({ status: "error", message })
        }
      })
    
    return () => { cancelled = true };
  }, [reloadKey])

  function handleRetry() {
    setState({ status: 'loading' });
    setReloadKey(prev => prev + 1);
  }

  return (
    <div
      data-theme={theme}
      className="min-h-40 rounded-lg border border-line bg-surface p-6 text-ink"
    >
      <h2 className="text-lg font-medium">Orders</h2>

      {state.status === 'loading' && <OrdersSkeleton />}

      {state.status === 'error' && (
        <div className="mt-3">
          <p className="text-sm text-ink-muted">Couldn't load orders: {state.message}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-md border border-line px-3 py-1.5 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === 'success' && state.orders.length === 0 && (
        <p className="mt-3 text-sm text-ink-muted">No orders yet.</p>
      )}

      {state.status === 'success' && state.orders.length > 0 && (
        <ul className="mt-3 divide-y divide-line">
          {state.orders.map(order => (
            <li key={order.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-ink-muted">
                  {order.id} · {order.itemCount} item{order.itemCount === 1 ? '' : 's'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.total}</p>
                <p className="text-ink-muted capitalize">{order.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OrdersDashboard;