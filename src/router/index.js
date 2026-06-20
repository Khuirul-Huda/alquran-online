import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/read/:surat",
    name: "SuratView",
    component: () => import("../views/SuratView.vue"),
  },
  {
    path: "/juz/:juz",
    name: "JuzView",
    component: () => import("../views/JuzView.vue"),
  },
  {
    path: "/doa",
    name: "DoaView",
    component: () => import("../views/DoaView.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
