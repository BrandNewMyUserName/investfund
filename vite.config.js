import { defineConfig } from "vite";
import pugPlugin from "vite-plugin-pug";

export default defineConfig({
  plugins: [pugPlugin(undefined, { pagesUrl: "./pages/" })],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  server: {
    port: 3000, // Фронтенд на 3000
    proxy: {
      "/api": {
        target: "http://localhost:5000/api/", // !!! весь /api іде на 5000
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Прибрати "/api" в реальному запиті
      },
      "/ws": {
        target: "ws://localhost:5000", // WebSocket окремо на 8080
        ws: true,
      },
    },
  },
});
