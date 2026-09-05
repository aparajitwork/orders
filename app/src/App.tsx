import { useState } from "react"
import OrdersDashboard, { type Theme } from "./OrdersDashboard"

// just for testing in local, actual exposed component will be OrdersDashboard
const App = () => {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <div data-theme={theme} className="min-h-screen bg-surface p-8 text-ink">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders remote — dev harness</h1>
        <button
          type="button"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          className="rounded-md border border-line px-3 py-1.5 text-sm"
        >
          Toggle theme ({theme})
        </button>
      </div>

      <OrdersDashboard theme={theme} />
    </div>
  )
}

export default App