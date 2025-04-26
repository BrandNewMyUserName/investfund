// import { defineConfig } from "vite";
// import pugPlugin from "vite-plugin-pug";

// const options = {pretty: true}
// const locals = {name: "My Pug"}

// export default defineConfig({
//     plugins: [pugPlugin(undefined, {pagesUrl: "./pages/"})],
//     build: {
//         minify: false,
//         rollupOptions: {
//             output: {
//                 assetFileNames: "assets/[name].[ext]",
//             },
//         },
//     },
//     server: {
//         port: 3000,
//     },
// });

import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug';

const options = { pretty: true };
const locals = { name: 'My Pug' };

export default defineConfig({
  plugins: [pugPlugin(undefined, { pagesUrl: './pages/' })],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
});