import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@react-pdf/renderer"],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "חפ״ק 162",
        short_name: "חפ״ק 162",
        description: "ניהול לוגיסטי",
        display: "standalone",
        background_color: "transparent",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/hapak162.onrender\.com\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "v0.00.1",
            },
          },
        ],
      },
    }),
  ],
});
