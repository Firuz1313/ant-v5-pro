import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    watch: null,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 999999,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  server: {
    host: "::",
    port: 8081,
    // 🔧 FIX: Enable HMR but configure it properly
    hmr: {
      port: 8082,
      overlay: false,
    },
    // 🔧 FIX: Enable file watching to prevent polling fallback
    watch: {
      usePolling: false,
      interval: 100,
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
    middlewareMode: false,
    // 🔧 FIX: Don't force dependency pre-bundling
    force: false,
    clearScreen: false,
    strictPort: true,
    // 🔧 FIX: Disable aggressive optimizations that cause restarts
    warmup: {
      clientFiles: ['./src/main.tsx'],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: false,
        timeout: 30000,
        proxyTimeout: 30000,
        configure: (proxy) => {
          // 🔧 FIX: Reduce logging verbosity to prevent console spam
          proxy.on("proxyReq", (proxyReq, req) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(
                "[🔄 PROXY] Request:",
                req.method,
                req.url,
                "→ localhost:3000",
              );
            }
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            if (process.env.NODE_ENV === 'development' && proxyRes.statusCode >= 400) {
              console.log(
                "[✅ PROXY] Response:",
                proxyRes.statusCode,
                "for",
                req.url,
              );
            }
          });
          proxy.on("error", (err, req) => {
            console.log("[❌ PROXY] Error:", err.message, "for", req.url);
          });
        },
      },
    },
  },
  plugins: [
    react({
      // 🔧 FIX: Enable fast refresh for better development experience
      fastRefresh: true,
      jsxImportSource: '@emotion/react',
      // 🔧 FIX: Reduce babel transformations that cause re-renders
      babel: {
        plugins: [],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 🔧 FIX: Add development-specific optimizations
  define: {
    __DEV__: mode === 'development',
  },
}));
