<template>
  <div class="min-h-screen transition-colors duration-300 pb-16" :class="activeTheme === 'dark' ? 'bg-slate-950 text-slate-100' : (activeTheme === 'sepia' ? 'bg-amber-50/20 text-amber-950' : 'bg-quran-bg text-quran-deep')">
    <div class="max-w-4xl mx-auto px-4 py-6">
      
      <!-- Back Navigation Link -->
      <div class="mb-4">
        <router-link to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-quran-medium hover:text-quran-deep">
          <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda
        </router-link>
      </div>

      <!-- Page Header -->
      <div class="relative overflow-hidden bg-gradient-to-br from-quran-deep to-quran-medium text-white rounded-2xl p-6 md:p-8 shadow-md border border-quran-gold/20 mb-6">
        <div class="flex justify-between items-center relative z-10">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-white">Doa Harian</h1>
            <p class="text-xs font-semibold text-quran-gold-light mt-1.5 flex items-center gap-1.5">
              <i class="fa-solid fa-hands-praying"></i>
              <span>Kumpulan Doa & Dzikir Pilihan dari Sumber Terpercaya</span>
            </p>
          </div>
          <i class="fa-solid fa-book-open-reader text-5xl text-quran-gold/45 hidden sm:block"></i>
        </div>
      </div>

      <!-- Sticky Search and Filter Controls -->
      <div 
        class="sticky top-[80px] lg:top-[90px] z-30 border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-6 transition-all duration-300"
        :class="activeTheme === 'dark' ? 'bg-slate-900/95 border-slate-800' : (activeTheme === 'sepia' ? 'bg-amber-50/95 border-amber-200/40' : 'bg-white/95 border-quran-medium/10')"
      >
        <!-- Search Input -->
        <div class="relative w-full md:w-1/2 shadow-sm">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari doa berdasarkan nama atau terjemahan..." 
            class="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light text-quran-deep transition-all"
            :class="activeTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-gray-50 border-gray-200 text-quran-deep'"
          />
        </div>

        <!-- Category Dropdown Filter -->
        <div class="flex items-center gap-2 w-full md:w-1/2 justify-end">
          <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">Kategori:</span>
          <select 
            v-model="selectedGroup" 
            class="w-full bg-quran-bg border border-gray-200 rounded-lg text-xs font-bold p-1.5 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light cursor-pointer text-quran-deep"
          >
            <option value="">Semua Kategori</option>
            <option v-for="g in uniqueGroups" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && doas.length === 0" class="flex flex-col gap-6">
        <div v-for="h in 4" :key="h" class="border rounded-2xl p-6 h-48 flex flex-col justify-between" :class="activeTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'">
          <div class="animate-shimmer w-1/3 h-5 rounded-md"></div>
          <div class="animate-shimmer w-11/12 h-10 rounded-md self-end my-4"></div>
          <div class="animate-shimmer w-2/3 h-4 rounded-md"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error && doas.length === 0" class="flex justify-center items-center py-16">
        <div class="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-sm shadow-sm">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
          <h3 class="font-bold text-lg text-gray-900 mb-2">Gagal Memuat Doa</h3>
          <p class="text-sm text-gray-500 mb-6">{{ errMsg }}</p>
          <button @click="fetchDoas" class="bg-quran-medium hover:bg-quran-deep text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm">
            Coba Lagi
          </button>
        </div>
      </div>

      <!-- Prayers List -->
      <div v-else class="space-y-5">
        <!-- Empty Results -->
        <div v-if="filteredDoas.length === 0" class="text-center py-16">
          <i class="fa-solid fa-box-open text-gray-300 text-5xl mb-4"></i>
          <p class="text-gray-500 font-medium">Tidak ada doa yang cocok dengan kriteria Anda</p>
        </div>

        <!-- Cards List -->
        <div 
          v-for="doa in filteredDoas" 
          :key="doa.id"
          class="border rounded-2xl p-6 md:p-8 transition-all duration-300 relative group flex flex-col"
          :class="[
            activeTheme === 'light' ? 'bg-white border-quran-medium/10 shadow-sm hover:shadow-md' : '',
            activeTheme === 'sepia' ? 'bg-[#fffdf0] border-amber-200/50 shadow-sm hover:shadow-md' : '',
            activeTheme === 'dark' ? 'bg-slate-900 border-slate-800/80 shadow-sm hover:shadow-md' : ''
          ]"
        >
          <!-- Category and Actions -->
          <div class="flex justify-between items-start gap-4 mb-4">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-quran-medium bg-quran-bg border border-quran-gold-light px-2.5 py-1 rounded-full">
                {{ doa.grup }}
              </span>
            </div>

            <!-- Copy Button -->
            <button 
              @click="copyDoa(doa)" 
              class="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-quran-accent/10 hover:text-quran-deep transition-all cursor-pointer bg-quran-bg text-gray-500"
              :class="{'!bg-quran-medium !text-white !border-quran-medium': copiedId === doa.id}"
            >
              <i :class="copiedId === doa.id ? 'fa-solid fa-check' : 'fa-solid fa-clone'"></i>
              <span>{{ copiedId === doa.id ? 'Tersalin!' : 'Salin Doa' }}</span>
            </button>
          </div>

          <!-- Prayer Title -->
          <h2 class="font-bold text-base md:text-lg mb-4 text-quran-deep leading-snug">
            {{ doa.nama }}
          </h2>

          <!-- Arabic Text -->
          <div 
            class="font-arabic text-right mb-5 leading-loose font-medium"
            :class="activeTheme === 'dark' ? 'text-slate-100' : (activeTheme === 'sepia' ? 'text-amber-950' : 'text-quran-deep')"
            style="font-size: 2.2rem; line-height: 2.2;"
            dir="rtl"
          >
            {{ doa.ar }}
          </div>

          <!-- Latin Transliteration -->
          <p 
            class="text-sm font-medium italic mb-3 leading-relaxed"
            :class="activeTheme === 'dark' ? 'text-slate-300' : (activeTheme === 'sepia' ? 'text-amber-900/90' : 'text-quran-medium/95')"
          >
            {{ doa.tr }}
          </p>

          <!-- Translation -->
          <p 
            class="text-sm font-normal leading-relaxed border-t pt-3"
            :class="activeTheme === 'dark' ? 'text-slate-400 border-slate-800' : (activeTheme === 'sepia' ? 'text-amber-900/75 border-amber-200/30' : 'text-gray-600 border-gray-50')"
          >
            {{ doa.idn }}
          </p>

          <!-- Reference / Hadith Info -->
          <div 
            v-if="doa.tentang" 
            class="mt-4 text-[10.5px] font-medium opacity-75 border-t border-dashed pt-3"
            :class="activeTheme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-gray-100 text-gray-400'"
          >
            <i class="fa-solid fa-bookmark text-quran-gold mr-1"></i>
            <span>{{ doa.tentang }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DoaView",
  data() {
    return {
      doas: [],
      loading: true,
      error: false,
      errMsg: "",
      
      // Search and Filter
      searchQuery: "",
      selectedGroup: "",
      uniqueGroups: [],
      copiedId: null,

      // Preference theme
      activeTheme: "light",
    };
  },
  computed: {
    filteredDoas() {
      let results = this.doas;
      
      // Category filter
      if (this.selectedGroup) {
        results = results.filter((d) => d.grup === this.selectedGroup);
      }
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        results = results.filter(
          (d) => 
            d.nama.toLowerCase().includes(query) || 
            d.idn.toLowerCase().includes(query) ||
            d.grup.toLowerCase().includes(query)
        );
      }
      
      return results;
    },
  },
  mounted() {
    this.loadThemePreference();
    this.fetchDoas();
  },
  methods: {
    loadThemePreference() {
      const themePref = localStorage.getItem("quran_pref_theme");
      if (themePref) this.activeTheme = themePref;
    },
    fetchDoas() {
      this.loading = true;
      this.error = false;

      // 1. Try to load from LocalStorage cache first (Stale-While-Revalidate pattern)
      const cached = localStorage.getItem("cached_doas");
      if (cached) {
        try {
          this.doas = JSON.parse(cached);
          this.extractGroups();
          this.loading = false; // Stop loader immediately, but fetch update in background
        } catch (e) {
          console.error("Failed to parse cached doas:", e);
        }
      }

      // 2. Fetch live data from EQuran.id
      axios
        .get("https://equran.id/api/doa")
        .then((res) => {
          if (res.data && res.data.data) {
            this.doas = res.data.data;
            this.extractGroups();
            
            // Cache results in LocalStorage
            localStorage.setItem("cached_doas", JSON.stringify(this.doas));
            localStorage.setItem("cached_doas_time", String(Date.now()));
          } else {
            throw new Error("Format data doa tidak valid.");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch doas from live API:", err);
          if (this.doas.length === 0) {
            this.errMsg = err.message || "Gagal mengambil data dari server.";
            this.error = true;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    extractGroups() {
      const groups = new Set(this.doas.map((d) => d.grup));
      this.uniqueGroups = Array.from(groups).sort();
    },
    copyDoa(doa) {
      const textToCopy = `[${doa.nama}]\n\n${doa.ar}\n\n${doa.tr}\n\nArtinya:\n"${doa.idn}"\n\nSumber: ${doa.tentang || "EQuran.id API"}`;
      
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.copiedId = doa.id;
          setTimeout(() => {
            if (this.copiedId === doa.id) {
              this.copiedId = null;
            }
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text:", err);
        });
    },
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
