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
        name: "Logiki-ניהול חכם ",
        short_name: "Logiki",
        description: "ניהול לוגיסטי",
        display: "standalone",
        background_color: "transparent",
        theme_color: "#000000",
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
            urlPattern: /^https:\/\/logiki-smart.onrender\.com\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "v0.00.1",
              expiration: {
                maxAgeSeconds: 24 * 60 * 60, // 1 day cache expiry
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
