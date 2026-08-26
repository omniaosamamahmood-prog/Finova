import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  if (mode === "production" && !env.VITE_API_URL?.trim()) {
    throw new Error(
      "VITE_API_URL is required for production builds (e.g. https://finova-4ekd.onrender.com)"
    );
  }

  return {
    plugins: [react(), tailwindcss()],
  };
});
