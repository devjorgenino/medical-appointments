import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@src/types": path.resolve(__dirname, "./src/types"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  // Build optimizations
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React vendor chunk
          "vendor-react": ["react", "react-dom"],
          // Router chunk
          "vendor-router": ["react-router-dom"],
          // UI components chunk (Radix UI)
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-label",
          ],
          // Charts chunk (heavy library)
          "vendor-charts": ["recharts"],
          // Date utilities
          "vendor-dates": ["date-fns", "react-day-picker"],
          // Other utilities
          "vendor-utils": ["axios", "jwt-decode", "clsx", "tailwind-merge"],
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 500,
    // Source maps only in development
    sourcemap: mode !== "production",
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "date-fns",
    ],
  },
  // esbuild optimizations for development
  esbuild: {
    // Remove console in production builds
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
