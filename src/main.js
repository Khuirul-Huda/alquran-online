import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

import { createPinia } from "pinia";

// Register Vite PWA service worker in production
if (import.meta.env.PROD) {
  registerSW({ immediate: true });
}

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
