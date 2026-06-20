import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
    meta: {
      title: "Al-Quran Online - Baca & Tafsir Lengkap",
      description: "Membaca Al-Quran Online Lengkap Dengan Terjemahan dan Tafsir Bahasa Indonesia dan Inggris secara gratis."
    }
  },
  {
    path: "/read/:surat",
    name: "SuratView",
    component: () => import("../views/SuratView.vue"),
    meta: {
      title: "Al-Quran Online - Baca Surat",
      description: "Baca Al-Quran online per surah lengkap dengan terjemahan, exegesis (tafsir), dan pemutar audio murottal per ayat."
    }
  },
  {
    path: "/juz/:juz",
    name: "JuzView",
    component: () => import("../views/JuzView.vue"),
    meta: {
      title: "Al-Quran Online - Baca Juz",
      description: "Baca Al-Quran online per Juz lengkap dengan pembagian surah, terjemahan, exegesis (tafsir) dan pemutar audio."
    }
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      title: "Pengaturan - Al-Quran Online",
      description: "Sesuaikan preferensi tampilan Al-Quran, seperti ukuran font arab, jenis terjemahan, tema gelap/terang, dan bahasa aplikasi."
    }
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      title: "Tentang - Al-Quran Online",
      description: "Informasi mengenai pengembangan aplikasi Al-Quran Online, sumber data API, kebijakan privasi, dan fitur-fitur aplikasi."
    }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash };
    }
    return { top: 0 };
  }
});

router.afterEach((to) => {
  // Set document title
  const defaultTitle = "Al-Quran Online";
  document.title = to.meta.title || defaultTitle;

  // Set meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', to.meta.description || "Membaca Al-Quran Online Lengkap Dengan Terjemahan dan Tafsir");
});

export default router;
