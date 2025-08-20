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
        // Don't retry on 4xx errors except 408 (timeout) and 429 (rate limit)
        if (error && typeof error === "object" && "status" in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false;
          }
          // Allow retry for 429 rate limiting
          if (status === 429) {
            return failureCount < 2;
          }
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex, error) => {
        // For 429 errors, use exponential backoff starting from 2 seconds
        if (error && typeof error === "object" && "status" in error) {
          const status = error.status as number;
          if (status === 429) {
            return Math.min(2000 * Math.pow(2, attemptIndex), 10000);
          }
        }
        return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on 4xx errors except 429
        if (error && typeof error === "object" && "status" in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500 && status !== 429) {
            return false;
          }
          if (status === 429) {
            return failureCount < 1; // Only retry once for mutations
          }
        }
        return false;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
