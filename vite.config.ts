import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';
import path from "path";

export default defineConfig({
  base: "/hieronymus/",
  plugins: [
    react(),
    mdPlugin({
      mode: [Mode.MARKDOWN],
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  assetsInclude: ['**/*.md'],
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
