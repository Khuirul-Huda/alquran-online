<template>
  <div class="flex flex-col min-h-screen transition-colors duration-300" :class="activeTheme === 'dark' ? 'bg-slate-950' : (activeTheme === 'sepia' ? 'bg-[#fdfaf2]' : 'bg-quran-bg')">
    <!-- Sticky Navbar -->
    <header class="sticky top-0 z-50 border-b py-4 px-6 transition-all duration-300" :class="activeTheme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-md' : (activeTheme === 'sepia' ? 'bg-[#fffdf0] border-amber-200/40 shadow-sm' : 'bg-white border-quran-medium/10 shadow-sm')">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <!-- Brand / Logo -->
        <router-link to="/" class="flex items-center gap-2.5 text-xl font-bold group" :class="activeTheme === 'dark' ? 'text-white' : 'text-quran-deep'">
          <i class="fa-solid fa-book-quran text-quran-gold text-2xl transition-transform duration-300 group-hover:scale-110"></i>
          <span>Al-Quran <span class="text-quran-gold">Online</span></span>
        </router-link>

        <!-- Desktop Navigation Links (hidden on mobile) -->
        <nav class="hidden md:flex items-center gap-2.5">
          <!-- Beranda -->
          <router-link 
            to="/" 
            class="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-house text-xs"></i> Beranda
          </router-link>

          <!-- Doa Harian -->
          <router-link 
            to="/doa" 
            class="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/doa') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-hands-praying text-xs"></i> Doa Harian
          </router-link>

          <!-- Pengaturan -->
          <router-link 
            to="/settings" 
            class="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/settings') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-gear text-xs"></i> Pengaturan
          </router-link>

          <!-- Tentang -->
          <router-link 
            to="/about" 
            class="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/about') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-circle-info text-xs"></i> Tentang
          </router-link>
        </nav>

        <!-- Hamburger Icon (visible on mobile) -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen" 
          class="md:hidden p-2 rounded-xl border focus:outline-none transition-colors cursor-pointer"
          :class="activeTheme === 'dark' ? 'border-slate-800 hover:bg-slate-800 text-white' : 'border-gray-200 hover:bg-gray-100 text-quran-deep'"
          aria-label="Menu"
        >
          <i class="fa-solid fa-bars text-lg"></i>
        </button>
      </div>
    </header>

    <!-- Mobile Navigation Drawer -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[100] flex justify-end animate-fade-in">
      <!-- Backdrop Overlay -->
      <div @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"></div>

      <!-- Sliding Sidebar Drawer -->
      <aside 
        class="relative w-72 max-w-xs h-full shadow-2xl p-6 flex flex-col gap-6 z-10 transition-transform duration-300 transform"
        :class="activeTheme === 'dark' ? 'bg-slate-900 border-l border-slate-800 text-white' : (activeTheme === 'sepia' ? 'bg-[#fffdf0] border-l border-amber-200/40 text-amber-950' : 'bg-white border-l border-gray-100 text-quran-deep')"
      >
        <div class="flex justify-between items-center pb-4 border-b" :class="activeTheme === 'dark' ? 'border-slate-800' : 'border-gray-100'">
          <span class="font-bold text-base flex items-center gap-2">
            <i class="fa-solid fa-book-quran text-quran-gold"></i> Menu Navigasi
          </span>
          <button 
            @click="isMobileMenuOpen = false" 
            class="p-2 rounded-lg hover:bg-gray-50/50 dark:hover:bg-slate-800 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <nav class="flex flex-col gap-3">
          <!-- Beranda -->
          <router-link 
            to="/" 
            @click="isMobileMenuOpen = false"
            class="text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent"
            :class="[
              isActive('/') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-house text-sm"></i> Beranda
          </router-link>

          <!-- Doa Harian -->
          <router-link 
            to="/doa" 
            @click="isMobileMenuOpen = false"
            class="text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent"
            :class="[
              isActive('/doa') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-hands-praying text-sm"></i> Doa Harian
          </router-link>

          <!-- Pengaturan -->
          <router-link 
            to="/settings" 
            @click="isMobileMenuOpen = false"
            class="text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent"
            :class="[
              isActive('/settings') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-gear text-sm"></i> Pengaturan
          </router-link>

          <!-- Tentang -->
          <router-link 
            to="/about" 
            @click="isMobileMenuOpen = false"
            class="text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent"
            :class="[
              isActive('/about') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-circle-info text-sm"></i> Tentang
          </router-link>
        </nav>
      </aside>
    </div>

    <!-- Main Content Body -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-quran-deep text-white py-8 px-6 text-center rounded-t-[2rem] border-t border-quran-gold/10 shadow-lg mt-12 transition-colors duration-300" :class="activeTheme === 'dark' ? 'bg-slate-900 border-slate-800' : ''">
      <div class="max-w-6xl mx-auto flex flex-col gap-2.5">
        <p class="font-medium text-sm tracking-wide opacity-90">
          &copy; {{ new Date().getFullYear() }} Al-Quran Online. Hak Cipta Dilindungi.
        </p>
        <p class="text-xs opacity-75">
          <a class="text-quran-gold hover:text-white font-semibold underline transition-colors" href="https://github.com/Khuirul-Huda/alquran-online" target="_blank" rel="noopener noreferrer">
           This app is open source!
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      activeTheme: "light",
      isMobileMenuOpen: false,
    };
  },
  mounted() {
    this.updateGlobalTheme();
    window.addEventListener("theme-changed", this.updateGlobalTheme);
  },
  beforeUnmount() {
    window.removeEventListener("theme-changed", this.updateGlobalTheme);
  },
  methods: {
    updateGlobalTheme() {
      this.activeTheme = localStorage.getItem("quran_pref_theme") || "light";
      document.body.className = "theme-" + this.activeTheme;
    },
    isActive(routePath) {
      return this.$route.path === routePath;
    },
  },
};
</script>

<style scoped>
/* All layouts styled natively via Tailwind CSS utility classes. */
</style>
