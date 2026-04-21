import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-dom") || id.includes("react-router") || /node_modules\/(react|scheduler)\//.test(id)) {
            return "react-vendor";
          }
          if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("cmdk") || id.includes("vaul") || id.includes("sonner")) {
            return "ui-vendor";
          }
          if (id.includes("@tanstack") || id.includes("@supabase")) {
            return "data-vendor";
          }
          if (id.includes("recharts") || id.includes("d3-")) {
            return "chart-vendor";
          }
          if (id.includes("react-hook-form") || id.includes("zod") || id.includes("framer-motion") || id.includes("@hookform")) {
            return "form-vendor";
          }
          return "vendor";
        },
      },
    },
  },
}));
