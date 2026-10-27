import { defineConfig } from "vitest/config";

export default defineConfig({
  // Understand the "@/…" imports from tsconfig.json.
  resolve: { tsconfigPaths: true },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
