export type Theme = 'light' | 'dark';

type OrdersDashboardProps = {
  theme: Theme;
}

const OrdersDashboard = ({ theme }: OrdersDashboardProps) => {
  return (
    <div
      data-theme={theme}
      className="min-h-40 rounded-lg border border-line bg-surface p-6 text-ink"
    >
      <h2 className="text-lg font-medium">Orders</h2>
      <p className="mt-1 text-sm text-ink-muted">Placeholder content - real order data comes in the next step</p>
      <button
        type='button'
        className="mt-4 rounded-md bg-accent px-4 py-2 text-sm text-accent-ink"
      >
        View all orders
      </button>
    </div>
  )
}

export default OrdersDashboard;