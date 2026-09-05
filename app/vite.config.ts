import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";

const PORT = 5174;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "orders",
      filename: "remoteEntry.js",
      exposes: {
        "./OrdersDashboard": "./src/OrdersDashboard.tsx"
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    })
  ],
  server: {
    port: PORT,
    origin: `http://localhost:${PORT}`,
  },
  preview: {
    port: PORT,
  },
  build: {
    target: "esnext"
  }
})