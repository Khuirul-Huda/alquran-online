<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left 2 Columns: Settings Controls -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Settings Panel Title Card -->
        <div class="themed-card rounded-2xl p-6 shadow-sm flex items-center gap-3">
          <i class="fa-solid fa-sliders text-2xl text-quran-gold"></i>
          <div>
            <h1 class="font-bold text-xl">Pengaturan Aplikasi</h1>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Sesuaikan Kenyamanan Membaca Anda</p>
          </div>
        </div>

        <!-- Section 1: Tampilan & Tema -->
        <div class="themed-card rounded-2xl p-6 shadow-sm space-y-5">
          <h2 class="font-bold text-base border-b border-gray-100/50 pb-2 flex items-center gap-2">
            <i class="fa-solid fa-palette text-quran-gold"></i> Tampilan & Tema
          </h2>

          <!-- Theme Choices -->
          <div class="space-y-2.5">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tema Membaca</label>
            <div class="grid grid-cols-3 gap-3">
              <button 
                @click="changeTheme('light')" 
                class="flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer"
                :class="[
                  activeTheme === 'light' 
                    ? 'border-quran-medium bg-quran-accent/5 text-quran-deep' 
                    : (activeTheme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40 hover:bg-slate-900' : (activeTheme === 'sepia' ? 'border-amber-200/60 text-amber-900/60 bg-[#fffdf0]/50 hover:bg-amber-50/50' : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'))
                ]"
              >
                <div class="w-8 h-8 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center">
                  <i class="fa-solid fa-sun text-amber-500"></i>
                </div>
                <span>Terang</span>
              </button>
              <button 
                @click="changeTheme('sepia')" 
                class="flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer"
                :class="[
                  activeTheme === 'sepia' 
                    ? 'border-amber-400 bg-amber-50/50 text-amber-950' 
                    : (activeTheme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40 hover:bg-slate-900' : (activeTheme === 'sepia' ? 'border-amber-200/60 text-amber-900/60 bg-[#fffdf0]/50 hover:bg-amber-50/50' : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'))
                ]"
              >
                <div class="w-8 h-8 rounded-full bg-[#fffdf0] border border-amber-300 shadow-sm flex items-center justify-center">
                  <i class="fa-solid fa-coffee text-amber-700"></i>
                </div>
                <span>Sepia</span>
              </button>
              <button 
                @click="changeTheme('dark')" 
                class="flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer"
                :class="[
                  activeTheme === 'dark' 
                    ? 'border-quran-gold bg-slate-800 text-white' 
                    : (activeTheme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40 hover:bg-slate-900' : (activeTheme === 'sepia' ? 'border-amber-200/60 text-amber-900/60 bg-[#fffdf0]/50 hover:bg-amber-50/50' : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'))
                ]"
              >
                <div class="w-8 h-8 rounded-full bg-slate-900 border border-slate-950 shadow-sm flex items-center justify-center">
                  <i class="fa-solid fa-moon text-quran-gold"></i>
                </div>
                <span>Malam</span>
              </button>
            </div>
          </div>

          <!-- Font Size Adjuster slider -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ukuran Huruf Arab</label>
              <span class="text-xs font-bold">{{ Math.round((arabicFontSizeFactor - 1.4) * 50) + 50 }}%</span>
            </div>
            <div class="flex items-center gap-4">
              <button @click="adjustFontSize(-0.2)" class="w-8 h-8 rounded-lg bg-quran-bg border hover:bg-gray-200 flex items-center justify-center font-bold text-sm transition-all cursor-pointer text-quran-deep">-</button>
              <input 
                type="range" 
                min="1.6" 
                max="3.6" 
                step="0.2" 
                v-model.number="arabicFontSizeFactor" 
                @input="savePreference('quran_pref_font_factor', arabicFontSizeFactor)"
                class="flex-grow accent-quran-medium h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
              <button @click="adjustFontSize(0.2)" class="w-8 h-8 rounded-lg bg-quran-bg border hover:bg-gray-200 flex items-center justify-center font-bold text-sm transition-all cursor-pointer text-quran-deep">+</button>
            </div>
          </div>
        </div>

        <!-- Section 2: Preferensi Konten -->
        <div class="themed-card rounded-2xl p-6 shadow-sm space-y-5">
          <h2 class="font-bold text-base border-b border-gray-100/50 pb-2 flex items-center gap-2">
            <i class="fa-solid fa-book-open text-quran-gold"></i> Preferensi Bacaan & Audio
          </h2>

          <!-- Content Visibility Toggles -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tampilan Default</label>
              <div class="space-y-3">
                <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                  <input type="checkbox" v-model="showTransliteration" @change="savePreference('quran_pref_show_transliteration', showTransliteration)" class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30">
                  <span>Tampilkan Transliterasi (Latin)</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                  <input type="checkbox" v-model="showTranslation" @change="savePreference('quran_pref_show_translation', showTranslation)" class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30">
                  <span>Tampilkan Terjemahan (Indonesia)</span>
                </label>
              </div>
            </div>

            <!-- Qari Selector -->
            <div class="space-y-2.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Qari Pilihan (Murottal)</label>
              <select 
                v-model="selectedQari" 
                @change="savePreference('quran_pref_qari', selectedQari)"
                class="w-full border rounded-xl text-xs font-bold p-3 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light cursor-pointer transition-colors"
                :class="activeTheme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : (activeTheme === 'sepia' ? 'bg-[#fffdf0] border-amber-200/60 text-amber-950' : 'bg-quran-bg border-gray-200 text-quran-deep')"
              >
                <option value="ar.alafasy">Syaikh Mishary Rashid Alafasy</option>
                <option value="ar.sudais">Syaikh Abdurrahman As-Sudais</option>
                <option value="ar.mahermuaiqly">Syaikh Maher Al-Muaiqly</option>
                <option value="ar.abdullahbasfar">Syaikh Abdullah Basfar</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <!-- City Shalat Selector -->
            <div class="space-y-2.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Kota Jadwal Shalat</label>
              <select 
                v-model="selectedCity" 
                @change="saveCity"
                class="w-full border rounded-xl text-xs font-bold p-3 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light cursor-pointer transition-colors"
                :class="activeTheme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : (activeTheme === 'sepia' ? 'bg-[#fffdf0] border-amber-200/60 text-amber-950' : 'bg-quran-bg border-gray-200 text-quran-deep')"
              >
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 3: Reset Data -->
        <div class="themed-card rounded-2xl p-6 shadow-sm space-y-4">
          <h2 class="font-bold text-base border-b border-gray-100/50 pb-2 flex items-center gap-2">
            <i class="fa-solid fa-trash-can text-red-500"></i> Atur Ulang Aplikasi
          </h2>
          <p class="text-xs text-gray-400 leading-relaxed">
            Tindakan ini akan menghapus semua preferensi tampilan, pilihan kota shalat, Qari default, riwayat bacaan terakhir, dan seluruh daftar bookmark ayat Anda. Data tidak dapat dipulihkan kembali.
          </p>
          <button @click="resetApplication" class="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer">
            <i class="fa-solid fa-trash-arrow-up"></i> Hapus Seluruh Data & Cache
          </button>
        </div>

      </div>

      <!-- Right 1 Column: Bookmarks List -->
      <div class="lg:col-span-1 space-y-6">
        
        <!-- Bookmark card header -->
        <div class="themed-card rounded-2xl p-5 shadow-sm">
          <h4 class="text-xs uppercase tracking-wider font-bold text-quran-medium mb-4 flex items-center gap-1.5 border-b border-gray-100/50 pb-2">
            <i class="fa-solid fa-bookmark text-quran-gold"></i> Ayat Favorit / Bookmark
          </h4>

          <div v-if="bookmarks.length === 0" class="text-center py-10">
            <i class="fa-solid fa-box-open text-gray-300 text-4xl mb-3"></i>
            <p class="text-xs text-gray-400 font-semibold italic">Belum ada ayat yang disimpan</p>
          </div>

          <div v-else class="flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto pr-1">
            <div 
              v-for="b in bookmarks" 
              :key="b.id"
              class="border p-3 rounded-xl flex items-center justify-between gap-3 group transition-all"
              :class="activeTheme === 'dark' ? 'bg-slate-950/40 border-slate-800/80 hover:border-quran-gold/40' : (activeTheme === 'sepia' ? 'bg-amber-50/40 border-amber-200/40 hover:border-amber-400' : 'bg-quran-bg/50 border-gray-100/60 hover:border-quran-medium/30')"
            >
              <router-link 
                :to="'/read/' + b.surahNumber + '?ayah=' + b.verseNumber"
                class="flex-grow min-w-0"
              >
                <div class="flex justify-between items-center mb-1">
                  <h5 class="font-bold text-xs leading-none transition-colors" :class="activeTheme === 'dark' ? 'text-slate-100 group-hover:text-quran-gold' : (activeTheme === 'sepia' ? 'text-amber-950 group-hover:text-amber-700' : 'text-quran-deep group-hover:text-quran-medium')">
                    {{ b.surahName }}
                  </h5>
                  <span class="font-arabic text-sm text-quran-medium">{{ b.surahArabic }}</span>
                </div>
                <span class="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider">
                  Ayat {{ b.verseNumber }}
                </span>
              </router-link>
              <button 
                @click="removeBookmark(b.id)" 
                class="text-gray-400 hover:text-red-500 text-xs p-1 transition-colors cursor-pointer"
                title="Hapus Bookmark"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      activeTheme: "light",
      arabicFontSizeFactor: 2.2,
      showTranslation: true,
      showTransliteration: true,
      selectedQari: "ar.alafasy",
      selectedCity: "Jakarta",
      bookmarks: [],
      cities: [
        "Jakarta", "Surabaya", "Bandung", "Medan", "Makassar", 
        "Semarang", "Yogyakarta", "Palembang", "Samarinda", "Pekanbaru",
        "Denpasar", "Banjarmasin", "Malang", "Depok"
      ]
    };
  },
  mounted() {
    this.loadPreferences();
    this.loadBookmarks();
  },
  methods: {
    loadPreferences() {
      this.activeTheme = localStorage.getItem("quran_pref_theme") || "light";
      this.arabicFontSizeFactor = parseFloat(localStorage.getItem("quran_pref_font_factor") || "2.2");
      this.showTranslation = (localStorage.getItem("quran_pref_show_translation") || "true") === "true";
      this.showTransliteration = (localStorage.getItem("quran_pref_show_transliteration") || "true") === "true";
      this.selectedQari = localStorage.getItem("quran_pref_qari") || "ar.alafasy";
      this.selectedCity = localStorage.getItem("sholat_city") || "Jakarta";
    },
    savePreference(key, val) {
      localStorage.setItem(key, String(val));
      if (key === "quran_pref_theme") {
        document.body.className = "theme-" + val;
        window.dispatchEvent(new Event("theme-changed"));
      }
    },
    saveCity() {
      localStorage.setItem("sholat_city", this.selectedCity);
    },
    changeTheme(theme) {
      this.activeTheme = theme;
      this.savePreference("quran_pref_theme", theme);
    },
    adjustFontSize(step) {
      const newFactor = +(this.arabicFontSizeFactor + step).toFixed(1);
      if (newFactor >= 1.6 && newFactor <= 3.6) {
        this.arabicFontSizeFactor = newFactor;
        this.savePreference("quran_pref_font_factor", this.arabicFontSizeFactor);
      }
    },
    loadBookmarks() {
      const list = localStorage.getItem("quran_bookmarks");
      if (list) {
        try {
          this.bookmarks = JSON.parse(list);
        } catch (e) {
          console.error("Failed to load bookmarks:", e);
        }
      }
    },
    removeBookmark(id) {
      this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
      localStorage.setItem("quran_bookmarks", JSON.stringify(this.bookmarks));
    },
    resetApplication() {
      if (confirm("Apakah Anda yakin ingin menghapus seluruh preferensi dan data riwayat bacaan Anda?")) {
        localStorage.clear();
        this.activeTheme = "light";
        document.body.className = "theme-light";
        window.dispatchEvent(new Event("theme-changed"));
        alert("Seluruh data cache dan preferensi berhasil dihapus.");
        this.$router.push("/");
      }
    }
  }
};
</script>

<style scoped>
/* Styled natively using Tailwind CSS utility classes. */
</style>
