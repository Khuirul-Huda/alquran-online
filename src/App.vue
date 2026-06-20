<template>
  <div class="flex flex-col min-height-screen min-h-screen">
    <!-- Sticky Navbar -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-quran-medium/10 shadow-sm py-4 px-6 transition-all duration-300">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Brand / Logo -->
        <router-link to="/" class="flex items-center gap-2.5 text-xl font-bold text-quran-deep group">
          <i class="fa-solid fa-book-quran text-quran-gold text-2xl transition-transform duration-300 group-hover:scale-110"></i>
          <span>Al-Quran <span class="text-quran-gold">Online</span></span>
        </router-link>

        <!-- Navigation Links -->
        <nav class="flex gap-3">
          <router-link 
            to="/" 
            class="text-sm font-semibold text-gray-600 px-4 py-2 rounded-lg transition-all duration-200 hover:text-quran-medium hover:bg-quran-bg flex items-center gap-2"
            active-class="text-quran-deep bg-quran-accent/10 border border-quran-accent/10 shadow-sm"
          >
            <i class="fa-solid fa-house text-xs"></i> Beranda
          </router-link>
          <router-link 
            to="/doa" 
            class="text-sm font-semibold text-gray-600 px-4 py-2 rounded-lg transition-all duration-200 hover:text-quran-medium hover:bg-quran-bg flex items-center gap-2"
            active-class="text-quran-deep bg-quran-accent/10 border border-quran-accent/10 shadow-sm"
          >
            <i class="fa-solid fa-hands-praying text-xs"></i> Doa Harian
          </router-link>
          <router-link 
            to="/about" 
            class="text-sm font-semibold text-gray-600 px-4 py-2 rounded-lg transition-all duration-200 hover:text-quran-medium hover:bg-quran-bg flex items-center gap-2"
            active-class="text-quran-deep bg-quran-accent/10 border border-quran-accent/10 shadow-sm"
          >
            <i class="fa-solid fa-circle-info text-xs"></i> Tentang
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-quran-deep text-white py-8 px-6 text-center rounded-t-3xl border-t border-quran-gold/10 shadow-lg mt-12">
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
};
</script>

<style scoped>
/* Scoped styles are not needed here since all layouts are styled natively via Tailwind CSS utility classes. */
</style>
