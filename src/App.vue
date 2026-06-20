<template>
  <div class="flex flex-col min-h-screen transition-colors duration-300" :class="activeTheme === 'dark' ? 'bg-slate-950' : (activeTheme === 'sepia' ? 'bg-[#fdfaf2]' : 'bg-quran-bg')">
    <!-- Sticky Navbar -->
    <header class="sticky top-0 z-50 border-b py-4 px-6 transition-all duration-300" :class="activeTheme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-md' : (activeTheme === 'sepia' ? 'bg-[#fffdf0] border-amber-200/40 shadow-sm' : 'bg-white border-quran-medium/10 shadow-sm')">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Brand / Logo -->
        <router-link to="/" class="flex items-center gap-2.5 text-xl font-bold group" :class="activeTheme === 'dark' ? 'text-white' : 'text-quran-deep'">
          <i class="fa-solid fa-book-quran text-quran-gold text-2xl transition-transform duration-300 group-hover:scale-110"></i>
          <span>Al-Quran <span class="text-quran-gold">Online</span></span>
        </router-link>

        <!-- Navigation Links -->
        <nav class="flex flex-wrap justify-center gap-2 sm:gap-3">
          <!-- Beranda -->
          <router-link 
            to="/" 
            class="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-house text-[10px] sm:text-xs"></i> Beranda
          </router-link>

          <!-- Doa Harian -->
          <router-link 
            to="/doa" 
            class="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/doa') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-hands-praying text-[10px] sm:text-xs"></i> Doa Harian
          </router-link>

          <!-- Pengaturan -->
          <router-link 
            to="/settings" 
            class="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/settings') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-gear text-[10px] sm:text-xs"></i> Pengaturan
          </router-link>

          <!-- Tentang -->
          <router-link 
            to="/about" 
            class="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-transparent"
            :class="[
              isActive('/about') 
                ? (activeTheme === 'dark' ? 'text-quran-gold bg-slate-800 border-slate-700/50 shadow-sm' : 'text-quran-deep bg-quran-accent/15 border-quran-accent/15 shadow-sm') 
                : (activeTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-quran-medium hover:bg-quran-bg')
            ]"
          >
            <i class="fa-solid fa-circle-info text-[10px] sm:text-xs"></i> Tentang
          </router-link>
        </nav>
      </div>
    </header>

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
          Dibuat dengan penuh cinta oleh
          <a class="text-quran-gold hover:text-white font-semibold underline transition-colors" href="https://instagram.com/khuirul_huda" target="_blank" rel="noopener noreferrer">
            Khuirul Huda
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
