<template>
  <div
    class="flex flex-col min-h-screen transition-colors duration-300"
    :class="
      preferencesStore.theme === 'dark'
        ? 'bg-slate-955'
        : preferencesStore.theme === 'sepia'
        ? 'bg-[#fdfaf2]'
        : 'bg-quran-bg'
    "
  >
    <!-- Sticky Navbar -->
    <header
      ref="navbarRef"
      class="sticky top-0 z-50 border-b py-4 px-6 transition-all duration-300"
      :class="
        preferencesStore.theme === 'dark'
          ? 'bg-slate-900 border-slate-800 shadow-md'
          : preferencesStore.theme === 'sepia'
          ? 'bg-[#fffdf0] border-amber-200/40 shadow-sm'
          : 'bg-white border-quran-medium/10 shadow-sm'
      "
    >
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <!-- Brand / Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2.5 text-xl font-bold group"
          :class="
            preferencesStore.theme === 'dark' ? 'text-white' : 'text-quran-deep'
          "
        >
          <i
            class="fa-solid fa-book-quran text-quran-gold text-2xl transition-transform duration-300 group-hover:scale-110"
          ></i>
          <span>Al-Quran <span class="text-quran-gold">Online</span></span>
        </router-link>

        <!-- Desktop Navigation Links (hidden on mobile) -->
        <nav ref="navLinksRef" class="hidden md:flex items-center gap-2.5">
          <!-- Beranda -->
          <router-link
            to="/"
            class="nav-link text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/')
                ? preferencesStore.theme === 'dark'
                  ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm'
                  : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm'
                : preferencesStore.theme === 'dark'
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg',
            ]"
          >
            <i class="fa-solid fa-house text-xs"></i> Beranda
          </router-link>

          <!-- Doa Harian -->
          <router-link
            to="/doa"
            class="nav-link text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/doa')
                ? preferencesStore.theme === 'dark'
                  ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm'
                  : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm'
                : preferencesStore.theme === 'dark'
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg',
            ]"
          >
            <i class="fa-solid fa-hands-praying text-xs"></i> Doa Harian
          </router-link>

          <!-- Pengaturan -->
          <router-link
            to="/settings"
            class="nav-link text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/settings')
                ? preferencesStore.theme === 'dark'
                  ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm'
                  : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm'
                : preferencesStore.theme === 'dark'
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg',
            ]"
          >
            <i class="fa-solid fa-gear text-xs"></i> Pengaturan
          </router-link>

          <!-- Tentang -->
          <router-link
            to="/about"
            class="nav-link text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/about')
                ? preferencesStore.theme === 'dark'
                  ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm'
                  : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm'
                : preferencesStore.theme === 'dark'
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg',
            ]"
          >
            <i class="fa-solid fa-circle-info text-xs"></i> Tentang
          </router-link>
        </nav>

        <!-- Hamburger Icon (visible on mobile) -->
        <button
          @click="openMobileMenu"
          class="md:hidden p-2 rounded-xl border focus:outline-none transition-colors cursor-pointer"
          :class="
            preferencesStore.theme === 'dark'
              ? 'border-slate-800 hover:bg-slate-800 text-white'
              : 'border-gray-200 hover:bg-gray-100 text-quran-deep'
          "
          aria-label="Menu"
        >
          <i class="fa-solid fa-bars text-lg"></i>
        </button>
      </div>
    </header>

    <!-- Mobile Navigation Drawer -->
    <Transition
      :css="false"
      @enter="onDrawerEnter"
      @leave="onDrawerLeave"
    >
      <div
        v-if="isMobileMenuOpen"
        ref="drawerWrapRef"
        class="fixed inset-0 z-[100] flex justify-end"
      >
        <!-- Backdrop Overlay -->
        <div
          ref="backdropRef"
          @click="closeMobileMenu"
          class="fixed inset-0 bg-black/60 backdrop-blur-xs"
        ></div>

        <!-- Sliding Sidebar Drawer -->
        <aside
          ref="drawerRef"
          class="relative w-72 max-w-xs h-full shadow-2xl p-6 flex flex-col gap-6 z-10"
          :class="
            preferencesStore.theme === 'dark'
              ? 'bg-slate-900 border-l border-slate-800 text-white'
              : preferencesStore.theme === 'sepia'
              ? 'bg-[#fffdf0] border-l border-amber-200/40 text-amber-955'
              : 'bg-white border-l border-gray-100 text-quran-deep'
          "
        >
          <div
            class="flex justify-between items-center pb-4 border-b"
            :class="
              preferencesStore.theme === 'dark'
                ? 'border-slate-800'
                : 'border-gray-100'
            "
          >
            <span class="font-bold text-base flex items-center gap-2">
              <i class="fa-solid fa-book-quran text-quran-gold"></i> Menu Navigasi
            </span>
            <button
              @click="closeMobileMenu"
              class="p-2 rounded-lg hover:bg-gray-50/50 dark:hover:bg-slate-800 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <nav class="flex flex-col gap-3">
            <!-- Beranda -->
            <router-link
              to="/"
              @click="closeMobileMenu"
              class="drawer-link text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent"
              :class="[
                isActive('/')
                  ? preferencesStore.theme === 'dark'
                    ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm'
                    : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm'
                  : preferencesStore.theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg',
              ]"
            >
              <i class="fa-solid fa-house text-sm"></i> Beranda
            </router-link>

            <!-- Doa Harian -->
            <router-link
              to="/doa"
              @click="closeMobileMenu"
              class="drawer-link text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent"
              :class="[
                isActive('/doa')
                  ? preferencesStore.theme === 'dark'
                    ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm'
                    : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm'
                  : preferencesStore.theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg',
              ]"
            >
              <i class="fa-solid fa-hands-praying text-sm"></i> Doa Harian
            </router-link>

            <!-- Pengaturan -->
            <router-link
              to="/settings"
              @click="closeMobileMenu"
              class="drawer-link text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent"
              :class="[
                isActive('/settings')
                  ? preferencesStore.theme === 'dark'
                    ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm'
                    : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm'
                  : preferencesStore.theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg',
              ]"
            >
              <i class="fa-solid fa-gear text-sm"></i> Pengaturan
            </router-link>

            <!-- Tentang -->
            <router-link
              to="/about"
              @click="closeMobileMenu"
              class="drawer-link text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent"
              :class="[
                isActive('/about')
                  ? preferencesStore.theme === 'dark'
                    ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm'
                    : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm'
                  : preferencesStore.theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg',
              ]"
            >
              <i class="fa-solid fa-circle-info text-sm"></i> Tentang
            </router-link>
          </nav>
        </aside>
      </div>
    </Transition>

    <!-- Main Content Body with Page Transitions -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <Transition :css="false" @enter="pageEnter" @leave="pageLeave" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer
      class="bg-quran-deep text-white py-8 px-6 text-center rounded-t-[2rem] border-t border-quran-gold/10 shadow-lg mt-12 transition-colors duration-300"
      :class="preferencesStore.theme === 'dark' ? 'bg-slate-900 border-slate-800' : ''"
    >
      <div class="max-w-6xl mx-auto flex flex-col gap-2.5">
        <p class="font-medium text-sm tracking-wide opacity-90">
          &copy; {{ new Date().getFullYear() }} Al-Quran Online. Hak Cipta
          Dilindungi.
        </p>
        <p class="text-xs opacity-75">
          <a
            class="text-quran-gold hover:text-white font-semibold underline transition-colors"
            href="https://github.com/Khuirul-Huda/alquran-online"
            target="_blank"
            rel="noopener noreferrer"
          >
            This app is open source!
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import { useRoute } from "vue-router";
import { gsap } from "gsap";
import { usePreferencesStore } from "./stores/preferences";
import {
  slideInLeft,
  slideOutRight,
  fadeIn,
  fadeOut,
  pageEnter,
  pageLeave,
} from "./composables/useGsap";

const route = useRoute();
const preferencesStore = usePreferencesStore();
const isMobileMenuOpen = ref(false);

// Template refs
const navbarRef = ref(null);
const navLinksRef = ref(null);
const drawerRef = ref(null);
const backdropRef = ref(null);

const isActive = (routePath) => {
  return route.path === routePath;
};

// ── Mobile drawer ──────────────────────────────────────────────────────────
const openMobileMenu = () => {
  isMobileMenuOpen.value = true;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// GSAP Transition hooks for drawer
const onDrawerEnter = (el, done) => {
  nextTick(() => {
    const drawer = el.querySelector("aside");
    const backdrop = el.querySelector(".fixed.inset-0.bg-black\\/60");

    if (backdrop) fadeIn(backdrop, 0.22);
    if (drawer) {
      gsap.fromTo(
        drawer,
        { x: 320, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.38, ease: "power3.out", onComplete: done }
      );

      // Stagger nav links inside drawer
      const links = drawer.querySelectorAll(".drawer-link");
      if (links.length) {
        gsap.fromTo(
          links,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, stagger: 0.06, ease: "power2.out", delay: 0.15 }
        );
      }
    } else {
      done();
    }
  });
};

const onDrawerLeave = (el, done) => {
  const drawer = el.querySelector("aside");
  const backdrop = el.querySelector(".fixed.inset-0.bg-black\\/60");

  if (backdrop) fadeOut(backdrop, null, 0.18);
  if (drawer) {
    slideOutRight(drawer, done);
  } else {
    done();
  }
};

// ── Navbar stagger on first load ───────────────────────────────────────────
onMounted(() => {
  document.body.className = "theme-" + preferencesStore.theme;

  if (navLinksRef.value) {
    const links = navLinksRef.value.querySelectorAll(".nav-link");
    gsap.fromTo(
      links,
      { y: -12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.1 }
    );
  }
});
</script>

<style scoped>
/* All layouts styled via Tailwind CSS utility classes. */
</style>
