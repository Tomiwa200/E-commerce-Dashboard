import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Simulates a browser environment in Node.js
    globals: true,        // Allows using 'describe', 'it', 'expect' without explicit imports
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Resolves your Next.js path aliases
    },
  },
});
