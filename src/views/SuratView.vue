<template>
  <div class="pb-16">
    <div class="max-w-6xl mx-auto px-4 py-6 flex gap-8">
      
      <!-- Left Sidebar: List of 114 Surahs (hidden on mobile, visible on desktop) -->
      <aside class="hidden lg:block w-80 rounded-2xl h-[calc(100vh-130px)] sticky top-[90px] flex-shrink-0 flex flex-col transition-all duration-300 themed-card">
        <!-- Search Input in Sidebar -->
        <div class="p-4 border-b flex-shrink-0" :class="activeTheme === 'dark' ? 'border-slate-800' : 'border-gray-100'">
          <div class="relative shadow-sm">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input 
              v-model="sidebarSearch" 
              type="text" 
              placeholder="Cari surah di sini..." 
              class="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light transition-all"
              :class="activeTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-gray-50 border-gray-200 text-quran-deep'"
            />
          </div>
        </div>
        
        <!-- Scrollable List of Surahs -->
        <div class="flex-grow overflow-y-auto p-2 space-y-1">
          <router-link 
            v-for="s in filteredSidebarSurahs" 
            :key="s.number" 
            :to="'/read/' + s.number"
            class="flex items-center justify-between p-3 rounded-xl transition-all duration-150 text-xs font-semibold group"
            :class="s.number == surahnumber 
              ? (activeTheme === 'dark' ? 'bg-slate-800 text-quran-gold shadow-sm border-l-4 border-quran-gold' : 'bg-quran-accent/15 text-quran-deep border-l-4 border-quran-medium shadow-sm') 
              : (activeTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-quran-bg hover:text-quran-medium')"
          >
            <div class="flex items-center gap-2.5">
              <span 
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors border"
                :class="s.number == surahnumber 
                  ? 'bg-quran-gold-light text-quran-deep font-bold border-quran-gold/40' 
                  : (activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200 group-hover:bg-quran-gold-light')"
              >
                {{ s.number }}
              </span>
              <span class="group-hover:translate-x-0.5 transition-transform duration-200">{{ s.name.transliteration.id }}</span>
            </div>
            <span class="font-arabic text-base text-quran-medium group-hover:text-quran-deep transition-colors">{{ s.name.short }}</span>
          </router-link>
        </div>
      </aside>

      <!-- Right Content Panel: Reading View -->
      <div class="flex-grow min-w-0">
        <!-- Back Navigation Button (only on mobile) -->
        <div class="lg:hidden mb-4">
          <router-link to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-quran-medium hover:text-quran-deep">
            <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda
          </router-link>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="!loaded" class="flex flex-col gap-6">
          <div class="animate-shimmer h-40 rounded-2xl"></div>
          <div class="animate-shimmer h-14 rounded-2xl"></div>
          <div v-for="h in 5" :key="h" class="border rounded-2xl p-6 h-48 flex flex-col justify-between" :class="activeTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'">
            <div class="flex justify-between items-center">
              <div class="animate-shimmer w-8 h-8 rounded-full"></div>
              <div class="animate-shimmer w-16 h-8 rounded-md"></div>
            </div>
            <div class="animate-shimmer w-11/12 h-8 rounded-md self-end my-4"></div>
            <div class="animate-shimmer w-2/3 h-4 rounded-md"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex justify-center items-center py-16">
          <div class="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-sm shadow-sm">
            <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
            <h3 class="font-bold text-lg text-gray-900 mb-2">Gagal Memuat Surah</h3>
            <p class="text-sm text-gray-500 mb-6">{{ errMsg }}</p>
            <router-link to="/" class="bg-quran-medium hover:bg-quran-deep text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm">
              Kembali ke Beranda
            </router-link>
          </div>
        </div>

        <!-- Main Reading Content -->
        <div v-else class="space-y-6">
          
          <!-- Surah Header Banner Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-quran-deep to-quran-medium text-white rounded-2xl p-6 md:p-8 shadow-md border border-quran-gold/20">
            <div class="flex justify-between items-center relative z-10">
              <div>
                <h1 class="text-3xl font-bold tracking-tight text-white">{{ surahdata.name.transliteration.id }}</h1>
                <p class="text-sm font-medium text-quran-gold-light mt-1 italic">"{{ surahdata.name.translation.id }}"</p>
              </div>
              <div class="font-arabic text-4xl text-quran-gold">{{ surahdata.name.short }}</div>
            </div>
            
            <div class="h-px bg-white/10 my-4 md:my-5 relative z-10"></div>
            
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div class="flex gap-2">
                <span class="bg-white/10 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5">
                  <i class="fa-solid fa-location-dot text-quran-gold"></i>
                  <span>{{ formatRevelation(surahdata.revelation.id) }}</span>
                </span>
                <span class="bg-white/10 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5">
                  <i class="fa-solid fa-book-open text-quran-gold"></i>
                  <span>{{ surahdata.numberOfVerses }} Ayat</span>
                </span>
              </div>
              <button @click="openSurahTafsir" class="bg-quran-gold hover:bg-white text-quran-deep font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
                <i class="fa-solid fa-circle-info"></i> Info & Tafsir Surah
              </button>
            </div>
          </div>

          <!-- Sticky Reading Customizations Panel -->
          <div class="sticky top-[80px] lg:top-[90px] z-30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 themed-card">
            <!-- Arabic Size Adjusters -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ukuran Teks:</span>
              <div class="flex items-center gap-1">
                <button @click="decreaseFontSize" class="w-7 h-7 bg-quran-bg hover:bg-quran-accent/20 border border-gray-200 text-quran-deep rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer">-</button>
                <span class="text-xs font-bold w-10 text-center" :class="activeTheme === 'dark' ? 'text-white' : 'text-quran-deep'">{{ Math.round((arabicFontSizeFactor - 1.4) * 50) + 50 }}%</span>
                <button @click="increaseFontSize" class="w-7 h-7 bg-quran-bg hover:bg-quran-accent/20 border border-gray-200 text-quran-deep rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer">+</button>
              </div>
            </div>

            <!-- View Mode Toggles -->
            <div class="flex items-center gap-4 text-xs font-semibold" :class="activeTheme === 'dark' ? 'text-slate-300' : 'text-gray-600'">
              <label class="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" v-model="showTransliteration" class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30">
                <span>Transliterasi</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" v-model="showTranslation" class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30">
                <span>Terjemahan</span>
              </label>
            </div>

            <!-- Theme Toggles -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tema:</span>
              <div class="flex gap-1.5">
                <button 
                  @click="changeTheme('light')" 
                  class="w-6 h-6 rounded-full bg-white border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                  :class="{'ring-2 ring-quran-medium ring-offset-1': activeTheme === 'light'}"
                  title="Mode Terang"
                ></button>
                <button 
                  @click="changeTheme('sepia')" 
                  class="w-6 h-6 rounded-full bg-[#fffdf0] border border-amber-300 hover:scale-110 transition-transform cursor-pointer"
                  :class="{'ring-2 ring-quran-medium ring-offset-1': activeTheme === 'sepia'}"
                  title="Mode Sepia"
                ></button>
                <button 
                  @click="changeTheme('dark')" 
                  class="w-6 h-6 rounded-full bg-slate-900 border border-slate-950 hover:scale-110 transition-transform cursor-pointer"
                  :class="{'ring-2 ring-quran-medium ring-offset-1': activeTheme === 'dark'}"
                  title="Mode Malam"
                ></button>
              </div>
            </div>

            <!-- Jump To Ayat Dropdown -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Lompat Ke:</span>
              <select 
                @change="onJumpChange($event.target.value)" 
                class="bg-quran-bg border border-gray-200 rounded-lg text-xs font-bold p-1.5 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light cursor-pointer text-quran-deep"
              >
                <option value="" disabled selected>Ayat...</option>
                <option v-for="v in verses" :key="v.number.inSurah" :value="v.number.inSurah">
                  Ayat {{ v.number.inSurah }}
                </option>
              </select>
            </div>
          </div>

          <!-- Bismillah Banner -->
          <div 
            v-if="surahdata.preBismillah" 
            class="font-arabic text-3xl md:text-4xl text-center py-8 px-4 leading-relaxed transition-colors themed-card rounded-2xl"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <!-- Verses Cards Container -->
          <div class="flex flex-col gap-5">
            <div 
              v-for="verse in verses" 
              :key="verse.number.inSurah"
              :id="'verse-' + verse.number.inSurah"
              class="themed-card rounded-2xl p-6 md:p-8 transition-all duration-300 relative group flex flex-col"
              :class="{ 
                'active-verse': activeVerseNumber === verse.number.inSurah,
                'pulse-highlight-verse': highlightedVerseNumber === verse.number.inSurah
              }"
            >
              <!-- Highlight bar left (only for active playing verse) -->
              <div 
                class="absolute left-0 top-0 h-full w-1 bg-quran-light opacity-30 rounded-l-2xl transition-all"
                :class="{ '!bg-quran-gold !opacity-100 !w-1.5': activeVerseNumber === verse.number.inSurah }"
              ></div>

              <!-- Verse Top Controls -->
              <div class="flex justify-between items-center mb-6">
                <span 
                  class="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border transition-all"
                  :class="activeVerseNumber === verse.number.inSurah 
                    ? 'bg-quran-gold-light border-quran-gold text-quran-deep' 
                    : (activeTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-quran-bg border-quran-gold-light text-quran-deep')"
                >
                  {{ verse.number.inSurah }}
                </span>

                <div class="flex gap-2">
                  <!-- Bookmark Button -->
                  <button 
                    @click="toggleBookmark(verse)" 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
                    :class="[
                      isBookmarked(verse.number.inSurah)
                        ? 'bg-quran-gold text-quran-deep border-quran-gold shadow-sm'
                        : (activeTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100')
                    ]"
                    :title="isBookmarked(verse.number.inSurah) ? 'Hapus Bookmark' : 'Tambah Bookmark'"
                  >
                    <i :class="isBookmarked(verse.number.inSurah) ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'"></i>
                  </button>
                  <!-- Play Audio Button -->
                  <button 
                    @click="toggleAudio(verse)" 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
                    :class="[
                      activeVerseNumber === verse.number.inSurah 
                        ? 'bg-quran-gold text-quran-deep border-quran-gold shadow-sm' 
                        : (activeTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100')
                    ]"
                    :title="activeVerseNumber === verse.number.inSurah ? 'Pause' : 'Putar Audio'"
                  >
                    <i :class="activeVerseNumber === verse.number.inSurah ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
                  </button>
                  <!-- Tafsir Ayat Button -->
                  <button 
                    @click="openVerseTafsir(verse)" 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
                    :class="activeTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100'"
                    title="Tafsir Ayat"
                  >
                    <i class="fa-solid fa-book"></i>
                  </button>
                </div>
              </div>

              <!-- Arabic script of the verse -->
              <div 
                class="font-arabic text-right mb-5 leading-loose font-medium selection:bg-quran-accent/30"
                :class="activeTheme === 'dark' ? 'text-slate-100' : (activeTheme === 'sepia' ? 'text-amber-950' : 'text-quran-deep')"
                :style="{ fontSize: arabicFontSizeFactor + 'rem', lineHeight: (arabicFontSizeFactor * 0.9 + 1) }"
                dir="rtl"
              >
                {{ verse.text.arab }}
              </div>

              <!-- Latin Transliteration of the verse -->
              <p 
                v-if="showTransliteration" 
                class="text-sm font-medium italic mb-3 leading-relaxed"
                :class="activeTheme === 'dark' ? 'text-slate-300' : (activeTheme === 'sepia' ? 'text-amber-900/90' : 'text-quran-medium/95')"
              >
                {{ verse.text.transliteration.en }}
              </p>

              <!-- Translation of the verse -->
              <p 
                v-if="showTranslation" 
                class="text-sm font-normal leading-relaxed border-t pt-3"
                :class="activeTheme === 'dark' ? 'text-slate-400 border-slate-800' : (activeTheme === 'sepia' ? 'text-amber-900/75 border-amber-200/30' : 'text-gray-600 border-gray-50')"
              >
                {{ verse.translation.id }}
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Custom Modal (Green & Gold) -->
      <div v-if="showModal" class="fixed inset-0 bg-quran-deep/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 transition-all animate-fade-in" @click.self="closeModal">
        <div class="bg-white rounded-2xl w-full max-w-lg border-2 border-quran-gold shadow-2xl flex flex-col max-h-[85vh] transform transition-transform duration-300 animate-slide-up">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-quran-deep to-quran-medium text-white px-6 py-4 flex justify-between items-center border-b-2 border-quran-gold">
            <h3 class="font-bold text-base flex items-center gap-2">
              <i class="fa-solid fa-book-open text-quran-gold"></i>
              {{ modalTitle }}
            </h3>
            <button @click="closeModal" class="text-white hover:text-quran-gold text-2xl font-light focus:outline-none transition-colors">&times;</button>
          </div>
          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto text-sm text-quran-deep leading-relaxed">
            <p class="whitespace-pre-line">{{ modalText }}</p>
          </div>
          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-quran-bg border-t border-gray-100 flex justify-end">
            <button @click="closeModal" class="bg-quran-medium hover:bg-quran-deep text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm">
              Tutup
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SuratView",
  data() {
    return {
      surahnumber: 0,
      loaded: false,
      error: false,
      errMsg: "",
      surahdata: {},
      verses: [],
      
      // Full list of surahs for the left sidebar
      surahList: [],
      sidebarSearch: "",

      // Preferences (persisted)
      arabicFontSizeFactor: 2.2,
      showTranslation: true,
      showTransliteration: true,
      activeTheme: "light",

      // Bookmarks & Jump Highlights
      bookmarks: [],
      highlightedVerseNumber: null,

      // Audio state
      activeVerseNumber: null,
      audioPlayer: null,

      // Modal state
      showModal: false,
      modalTitle: "",
      modalText: "",
    };
  },
  computed: {
    filteredSidebarSurahs() {
      if (!this.sidebarSearch) return this.surahList;
      const query = this.sidebarSearch.toLowerCase().trim();
      return this.surahList.filter((s) => {
        const nameId = s.name.transliteration.id.toLowerCase();
        const num = String(s.number);
        return nameId.includes(query) || num.includes(query);
      });
    },
  },
  mounted() {
    const params = this.$route.params.surat;
    if (isNaN(params) || params < 1 || params > 114) {
      this.$router.push({ name: "Main" });
      return;
    }
    
    this.surahnumber = parseInt(params);
    this.loadPreferences();
    window.addEventListener("theme-changed", this.loadPreferences);
    this.loadBookmarks();
    this.fetchSurahDetails();
    this.fetchSurahList();
  },
  unmounted() {
    window.removeEventListener("theme-changed", this.loadPreferences);
    this.stopAudio();
  },
  methods: {
    loadPreferences() {
      const fontPref = localStorage.getItem("quran_pref_font_factor");
      if (fontPref) this.arabicFontSizeFactor = parseFloat(fontPref);

      const transPref = localStorage.getItem("quran_pref_show_translation");
      if (transPref) this.showTranslation = transPref === "true";

      const translitPref = localStorage.getItem("quran_pref_show_transliteration");
      if (translitPref) this.showTransliteration = translitPref === "true";

      const themePref = localStorage.getItem("quran_pref_theme");
      if (themePref) this.activeTheme = themePref;
    },
    savePreference(key, val) {
      localStorage.setItem(key, String(val));
    },
    changeTheme(theme) {
      this.activeTheme = theme;
      this.savePreference("quran_pref_theme", theme);
    },
    increaseFontSize() {
      if (this.arabicFontSizeFactor < 3.8) {
        this.arabicFontSizeFactor = +(this.arabicFontSizeFactor + 0.2).toFixed(1);
        this.savePreference("quran_pref_font_factor", this.arabicFontSizeFactor);
      }
    },
    decreaseFontSize() {
      if (this.arabicFontSizeFactor > 1.6) {
        this.arabicFontSizeFactor = +(this.arabicFontSizeFactor - 0.2).toFixed(1);
        this.savePreference("quran_pref_font_factor", this.arabicFontSizeFactor);
      }
    },
    saveProgress(ayahNum) {
      localStorage.setItem(
        "lastReadSurah",
        JSON.stringify({
          number: this.surahnumber,
          name: this.surahdata.name.transliteration.id,
          arabic: this.surahdata.name.short,
          verseCount: this.surahdata.numberOfVerses,
          lastAyah: ayahNum,
          timestamp: Date.now(),
        })
      );
    },
    fetchSurahDetails() {
      this.loaded = false;
      this.error = false;
      
      const baseApiUrl =
        import.meta.env.VITE_API_URL ||
        import.meta.env.VUE_APP_MAIN_API_URL ||
        "https://aqa.khuirulhuda.me.eu.org";
        
      const url = `${baseApiUrl}/surah/${this.surahnumber}`;

      axios
        .get(url)
        .then((res) => {
          if (res.data && res.data.data) {
            this.surahdata = res.data.data;
            this.verses = this.surahdata.verses;
            this.saveProgress(1); // Save reading progress for landing page
            
            // Check for deep-linked ayah query
            this.$nextTick(() => {
              const queryAyah = this.$route.query.ayah;
              if (queryAyah) {
                const ayahNum = parseInt(queryAyah);
                this.scrollToVerse(ayahNum);
                this.highlightedVerseNumber = ayahNum;
                setTimeout(() => {
                  if (this.highlightedVerseNumber === ayahNum) {
                    this.highlightedVerseNumber = null;
                  }
                }, 5000);
              }
            });
          } else {
            throw new Error("Respon data tidak sesuai.");
          }
        })
        .catch((err) => {
          console.error(err);
          this.errMsg = err.message || "Gagal mengambil data dari server.";
          this.error = true;
        })
        .finally(() => {
          this.loaded = true;
        });
    },
    fetchSurahList() {
      const baseApiUrl =
        import.meta.env.VITE_API_URL ||
        import.meta.env.VUE_APP_MAIN_API_URL ||
        "https://aqa.khuirulhuda.me.eu.org";
        
      const url = `${baseApiUrl}/surah`;

      axios
        .get(url)
        .then((res) => {
          if (res.data && res.data.data) {
            this.surahList = res.data.data;
          }
        })
        .catch((err) => {
          console.error("Failed to load sidebar surah list:", err);
        });
    },
    formatRevelation(val) {
      if (!val) return "";
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    },
    scrollToVerse(ayahNumber) {
      if (!ayahNumber) return;
      const el = document.getElementById(`verse-${ayahNumber}`);
      if (el) {
        const offset = 160;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        this.saveProgress(parseInt(ayahNumber));
      }
    },
    
    // Custom Modal Methods
    openSurahTafsir() {
      this.modalTitle = `Detail & Tafsir Surah ${this.surahdata.name.transliteration.id}`;
      this.modalText = this.surahdata.tafsir ? this.surahdata.tafsir.id : "Tidak ada detail tafsir untuk surah ini.";
      this.showModal = true;
    },
    openVerseTafsir(verse) {
      this.modalTitle = `Tafsir Ayat ${verse.number.inSurah}`;
      this.modalText = verse.tafsir && verse.tafsir.id && verse.tafsir.id.short 
        ? verse.tafsir.id.short 
        : "Tidak ada detail tafsir untuk ayat ini.";
      this.showModal = true;
      this.saveProgress(verse.number.inSurah);
    },
    closeModal() {
      this.showModal = false;
    },

    // Bookmarking Methods
    loadBookmarks() {
      const list = localStorage.getItem("quran_bookmarks");
      if (list) {
        try {
          this.bookmarks = JSON.parse(list);
        } catch (e) {
          console.error("Failed to load bookmarks:", e);
          this.bookmarks = [];
        }
      } else {
        this.bookmarks = [];
      }
    },
    isBookmarked(verseNum) {
      return this.bookmarks.some(
        (b) => b.surahNumber === this.surahnumber && b.verseNumber === verseNum
      );
    },
    toggleBookmark(verse) {
      const idx = this.bookmarks.findIndex(
        (b) => b.surahNumber === this.surahnumber && b.verseNumber === verse.number.inSurah
      );
      if (idx > -1) {
        this.bookmarks.splice(idx, 1);
      } else {
        this.bookmarks.push({
          id: `${this.surahnumber}_${verse.number.inSurah}`,
          surahNumber: this.surahnumber,
          surahName: this.surahdata.name.transliteration.id,
          surahArabic: this.surahdata.name.short,
          verseNumber: verse.number.inSurah
        });
      }
      localStorage.setItem("quran_bookmarks", JSON.stringify(this.bookmarks));
      window.dispatchEvent(new Event("theme-changed")); // Sync with home / settings listing
    },

    // Audio Methods
    getAudioUrl(verse) {
      const qari = localStorage.getItem("quran_pref_qari") || "ar.alafasy";
      let url = verse.audio.primary;
      if (!url && verse.audio.secondary && verse.audio.secondary.length > 0) {
        url = verse.audio.secondary[0];
      }
      if (url) {
        return url.replace(/ar\.alafasy/g, qari);
      }
      return "";
    },
    toggleAudio(verse) {
      if (this.activeVerseNumber === verse.number.inSurah) {
        this.stopAudio();
        return;
      }

      this.stopAudio();

      const audioUrl = this.getAudioUrl(verse);
      if (audioUrl) {
        this.activeVerseNumber = verse.number.inSurah;
        this.audioPlayer = new Audio(audioUrl);
        
        this.audioPlayer.play().catch((err) => {
          console.error("Audio playback failed:", err);
          this.stopAudio();
        });

        this.audioPlayer.addEventListener("ended", () => {
          this.playNextVerse();
        });

        this.saveProgress(verse.number.inSurah);
      }
    },
    playNextVerse() {
      const currentIndex = this.verses.findIndex((v) => v.number.inSurah === this.activeVerseNumber);
      if (currentIndex > -1 && currentIndex < this.verses.length - 1) {
        const nextVerse = this.verses[currentIndex + 1];
        this.toggleAudio(nextVerse);
        this.scrollToVerse(nextVerse.number.inSurah);
      } else {
        this.stopAudio();
      }
    },
    stopAudio() {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
        this.audioPlayer = null;
      }
      this.activeVerseNumber = null;
    },
    onJumpChange(ayahNumber) {
      if (!ayahNumber) return;
      const num = parseInt(ayahNumber);
      this.$router.push({ query: { ayah: num } }).catch(() => {});
    },
  },
  watch: {
    showTranslation(newVal) {
      this.savePreference("quran_pref_show_translation", newVal);
    },
    showTransliteration(newVal) {
      this.savePreference("quran_pref_show_transliteration", newVal);
    },
    "$route.params.surat"(newVal) {
      if (newVal) {
        this.surahnumber = parseInt(newVal);
        this.stopAudio();
        this.fetchSurahDetails();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    "$route.query.ayah"(newVal) {
      if (newVal) {
        const ayahNum = parseInt(newVal);
        this.scrollToVerse(ayahNum);
        this.highlightedVerseNumber = ayahNum;
        setTimeout(() => {
          if (this.highlightedVerseNumber === ayahNum) {
            this.highlightedVerseNumber = null;
          }
        }, 5000);
      }
    }
  }
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
