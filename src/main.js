import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Register Vite PWA service worker in production
if (import.meta.env.PROD) {
  registerSW({ immediate: true });
}

createApp(App).use(router).mount("#app");
