import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "img/icons/*"],
      manifest: {
        name: "Al-Quran Online",
        short_name: "Al-Quran",
        description: "Membaca Al-Quran Online Lengkap Dengan Terjemahan dan Tafsir",
        theme_color: "#1b4332",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "img/icons/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "img/icons/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return (
                url.origin === "https://aqa.khuirulhuda.me.eu.org" &&
                (url.pathname.startsWith("/surah") || url.pathname.startsWith("/juz"))
              );
            },
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "quran-api-cache",
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern: ({ request }) => request.destination === "audio",
            handler: "CacheFirst",
            options: {
              cacheName: "audio-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
