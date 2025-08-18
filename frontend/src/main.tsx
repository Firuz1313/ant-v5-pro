import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

// Suppress harmless ResizeObserver warnings
window.addEventListener("error", (e) => {
  if (e.message.includes("ResizeObserver loop")) {
    e.stopImmediatePropagation();
  }
});

// Suppress React Router future flag warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.("React Router Future Flag Warning")) {
    return;
  }
  originalWarn.apply(console, args);
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408 (timeout)
        if (error && typeof error === "object" && "status" in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500 && status !== 408) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
