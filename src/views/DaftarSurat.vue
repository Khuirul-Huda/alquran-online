<template>
  <div class="pb-12">
    <!-- Hero Header -->
    <div class="relative overflow-hidden bg-gradient-to-br from-quran-deep to-quran-medium text-white px-6 py-16 md:py-20 rounded-b-[2.5rem] shadow-md border-b border-quran-gold/20">
      <!-- Decorative gold circle background elements -->
      <div class="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-radial-gradient from-quran-gold/15 to-transparent pointer-events-none"></div>
      <div class="absolute bottom-[-15%] left-[-5%] w-[250px] h-[250px] rounded-full bg-radial-gradient from-quran-gold/10 to-transparent pointer-events-none"></div>

      <div class="max-w-6xl mx-auto text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in">
          Al-Quran <span class="text-quran-gold">Online</span>
        </h1>
        
        <!-- Randomly selected quote verse -->
        <div v-if="randomVerse" class="my-6 max-w-3xl mx-auto animate-fade-in">
          <p class="font-arabic text-2xl md:text-3xl text-quran-gold leading-relaxed mb-4 direction-rtl" dir="rtl">
            {{ randomVerse.arabic }}
          </p>
          <p class="text-sm md:text-base font-light italic opacity-95 max-w-2xl mx-auto leading-relaxed">
            "{{ randomVerse.translation }}"
          </p>
          <span class="inline-block mt-2.5 text-xs font-semibold text-quran-gold-light bg-white/10 px-3 py-1 rounded-full border border-white/5">
            {{ randomVerse.reference }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="max-w-6xl mx-auto px-4 mt-8">
      <!-- View Toggle Tabs (Surah vs Juz) -->
      <div class="flex border-b border-gray-200 mb-8 max-w-sm">
        <button 
          @click="activeTab = 'surah'" 
          class="flex-1 text-center py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'surah' ? 'border-quran-medium text-quran-deep' : 'border-transparent text-gray-400 hover:text-quran-medium'"
        >
          <i class="fa-solid fa-list-ol mr-1.5"></i> Daftar Surah
        </button>
        <button 
          @click="activeTab = 'juz'" 
          class="flex-1 text-center py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'juz' ? 'border-quran-medium text-quran-deep' : 'border-transparent text-gray-400 hover:text-quran-medium'"
        >
          <i class="fa-solid fa-box-archive mr-1.5"></i> Daftar Juz
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Left 3 Columns: Grid Lists -->
        <div class="lg:col-span-3 order-1">
          
          <!-- Tab 1: Surah View -->
          <div v-if="activeTab === 'surah'">
            <!-- Search Bar -->
            <div class="relative max-w-xl mb-8 shadow-sm">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-quran-light text-base"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari surah berdasarkan nama, arti, atau nomor..."
                class="w-full pl-11 pr-4 py-4 bg-white border border-quran-medium/10 rounded-2xl text-sm text-quran-deep placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light focus:shadow-md transition-all duration-200"
              />
            </div>

            <!-- Loading Skeleton -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div v-for="h in 12" :key="h" class="bg-white border border-quran-medium/5 rounded-2xl p-5 h-40 flex flex-col justify-between relative overflow-hidden">
                <div class="flex justify-between items-start">
                  <div class="animate-shimmer w-9 h-9 rounded-full"></div>
                  <div class="animate-shimmer w-20 h-7 rounded-md"></div>
                </div>
                <div>
                  <div class="animate-shimmer w-3/4 h-5 rounded-md mb-2"></div>
                  <div class="animate-shimmer w-1/2 h-3.5 rounded-md mb-3"></div>
                  <div class="animate-shimmer w-1/3 h-3 rounded-md"></div>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="flex justify-center items-center py-16">
              <div class="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-sm shadow-sm">
                <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
                <h3 class="font-bold text-lg text-gray-900 mb-2">Gagal Memuat Data</h3>
                <p class="text-sm text-gray-500 mb-6">{{ errMsg }}</p>
                <button @click="fetchSurah" class="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm">
                  Coba Lagi
                </button>
              </div>
            </div>

            <!-- Content -->
            <div v-else>
              <!-- No Results -->
              <div v-if="filteredSurah.length === 0" class="text-center py-16">
                <i class="fa-solid fa-box-open text-gray-300 text-5xl mb-4"></i>
                <p class="text-gray-500 font-medium">Tidak ada surah yang cocok dengan "{{ searchQuery }}"</p>
              </div>

              <!-- Grid -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
                <div v-for="suratt in filteredSurah" :key="suratt.number">
                  <Surat
                    :surat="suratt.name.transliteration.id"
                    :arabic="suratt.name.short"
                    :arti="suratt.name.translation.id"
                    :ke="suratt.number"
                    :revelation="suratt.revelation.id"
                    :verses="suratt.numberOfVerses"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Juz View -->
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
              <router-link 
                v-for="j in juzList" 
                :key="j.number" 
                :to="'/juz/' + j.number" 
                class="bg-white border border-quran-medium/10 rounded-2xl p-5 hover:shadow-md hover:border-quran-gold/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-full relative overflow-hidden"
              >
                <div class="flex justify-between items-center mb-3">
                  <span class="w-8 h-8 rounded-full bg-quran-bg text-quran-deep font-bold flex items-center justify-center text-sm border border-quran-gold-light group-hover:bg-quran-gold-light group-hover:border-quran-gold transition-colors duration-300">
                    {{ j.number }}
                  </span>
                  <span class="text-xs font-bold text-quran-medium uppercase tracking-wider">Juz {{ j.number }}</span>
                </div>
                <div>
                  <h3 class="font-bold text-quran-deep text-sm group-hover:text-quran-medium transition-colors mb-1">
                    {{ j.start.split(':')[0] }} - {{ j.end.split(':')[0] }}
                  </h3>
                  <p class="text-[10.5px] text-gray-400 font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-location-arrow text-quran-gold"></i>
                    <span>Mulai: {{ j.start }} s/d {{ j.end }}</span>
                  </p>
                </div>
                <!-- Gradient highlight bar -->
                <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-quran-medium to-quran-gold transition-all duration-300 group-hover:w-full"></div>
              </router-link>
            </div>
          </div>

        </div>

        <!-- Right 1 Column: Stats, Shalat Times, Shortcuts Sidebar -->
        <div class="lg:col-span-1 flex flex-col gap-6 order-2 lg:mt-0">
          
          <!-- Last Read / Continue Reading Card -->
          <div v-if="lastRead" class="bg-gradient-to-br from-quran-cream to-white border border-quran-gold/30 rounded-2xl p-5 shadow-sm">
            <h4 class="text-xs uppercase tracking-wider font-bold text-quran-gold mb-3 flex items-center gap-1.5">
              <i class="fa-solid fa-bookmark"></i> Lanjutkan Membaca
            </h4>
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold text-quran-deep text-base">{{ lastRead.name }}</h3>
                <p class="text-xs text-gray-500 font-medium mt-0.5">
                  Terakhir dibaca: Ayat {{ lastRead.lastAyah || 1 }}
                </p>
              </div>
              <span class="font-arabic text-xl text-quran-medium">{{ lastRead.arabic }}</span>
            </div>
            <router-link 
              :to="'/read/' + lastRead.number" 
              class="w-full text-center block bg-quran-medium hover:bg-quran-deep text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors duration-200 shadow-sm"
            >
              Lanjut Membaca
            </router-link>
          </div>

          <!-- Privacy-Safe Shalat Times Widget (Dropdown Selection) -->
          <div class="bg-white border border-quran-medium/10 rounded-2xl p-5 shadow-sm">
            <div class="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-quran-medium flex items-center gap-1.5">
                <i class="fa-solid fa-clock"></i> Jadwal Shalat
              </h4>
              <!-- City Dropdown Selector -->
              <select 
                v-model="selectedCity" 
                @change="onCityChange"
                class="bg-quran-bg border border-gray-200 rounded-lg text-[10px] font-bold p-1 cursor-pointer outline-none focus:ring-1 focus:ring-quran-light text-quran-deep max-w-[100px]"
              >
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <!-- Loading Shalat state -->
            <div v-if="shalatLoading" class="flex flex-col gap-2 py-4 text-center">
              <div class="animate-spin text-quran-medium text-lg"><i class="fa-solid fa-circle-notch"></i></div>
              <span class="text-xs text-gray-400">Memuat jadwal...</span>
            </div>

            <!-- Shalat Timings List -->
            <div v-else-if="shalatTimes" class="flex flex-col gap-2.5 text-xs font-semibold">
              <div 
                v-for="(time, name) in formattedShalatTimes" 
                :key="name"
                class="flex justify-between p-2 rounded-xl border border-transparent transition-all"
                :class="nextPrayerName === name ? 'bg-quran-accent/10 border-quran-accent/25 text-quran-deep ring-1 ring-quran-accent/5' : 'text-gray-600'"
              >
                <span class="flex items-center gap-1.5">
                  <i :class="getShalatIcon(name)" class="text-quran-gold text-[10px]"></i>
                  <span>{{ translateShalatName(name) }}</span>
                </span>
                <span class="flex items-center gap-1.5">
                  <span>{{ time }}</span>
                  <span v-if="nextPrayerName === name" class="text-[9px] bg-quran-medium text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Berikutnya</span>
                </span>
              </div>
            </div>
            
            <div v-else class="text-center py-4 text-xs text-gray-400 italic">
              Gagal memuat jadwal shalat.
            </div>
          </div>

          <!-- Quick Shortcuts for Popular Surahs -->
          <div class="bg-white border border-quran-medium/10 rounded-2xl p-5 shadow-sm">
            <h4 class="text-xs uppercase tracking-wider font-bold text-quran-medium mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <i class="fa-solid fa-star"></i> Surah Pintasan
            </h4>
            <div class="flex flex-col gap-2">
              <router-link 
                v-for="shortcut in popularSurahs" 
                :key="shortcut.number" 
                :to="'/read/' + shortcut.number"
                class="flex items-center justify-between p-2.5 rounded-xl hover:bg-quran-bg border border-transparent hover:border-quran-medium/10 transition-all duration-200 group"
              >
                <div class="flex items-center gap-3">
                  <span class="bg-quran-bg text-quran-deep font-bold text-[10px] w-6 h-6 rounded-full flex items-center justify-center border border-gray-100 group-hover:bg-quran-gold-light group-hover:border-quran-gold/30">
                    {{ shortcut.number }}
                  </span>
                  <span class="text-xs font-semibold text-gray-700 group-hover:text-quran-medium">{{ shortcut.name }}</span>
                </div>
                <span class="font-arabic text-sm text-quran-medium">{{ shortcut.arabic }}</span>
              </router-link>
            </div>
          </div>

          <!-- Quran Statistics Widget -->
          <div class="bg-white border border-quran-medium/10 rounded-2xl p-5 shadow-sm">
            <h4 class="text-xs uppercase tracking-wider font-bold text-quran-medium mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <i class="fa-solid fa-chart-simple"></i> Informasi Al-Quran
            </h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div class="bg-quran-bg/60 p-3 rounded-xl border border-gray-100/50 text-center">
                <span class="block text-xl font-bold text-quran-deep leading-none mb-1">114</span>
                <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Surah</span>
              </div>
              <div class="bg-quran-bg/60 p-3 rounded-xl border border-gray-100/50 text-center">
                <span class="block text-xl font-bold text-quran-deep leading-none mb-1">30</span>
                <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Juz</span>
              </div>
              <div class="bg-quran-bg/60 p-3 rounded-xl border border-gray-100/50 text-center">
                <span class="block text-xl font-bold text-quran-deep leading-none mb-1">6236</span>
                <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Ayat</span>
              </div>
              <div class="bg-quran-bg/60 p-3 rounded-xl border border-gray-100/50 text-center">
                <span class="block text-xl font-bold text-quran-deep leading-none mb-1">77.430</span>
                <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Kata</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Surat from "../components/Surat.vue";
import axios from "axios";

// Inspirational verse list for dynamic selection
const INSPIRATIONAL_VERSES = [
  {
    arabic: "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ۚ وَلَوْ كَانَ مِنْ عِنْدِ غَيْرِ اللَّهِ لَوَجَدُوا فِيهِ اخْتِلَافًا كَثِيرًا",
    translation: "Maka tidakkah mereka menghayati (mendalami) Al-Qur'an? Sekiranya (Al-Qur'an) itu bukan dari Allah, pastilah mereka menemukan banyak hal yang bertentangan di dalamnya.",
    reference: "QS. An-Nisa': 82"
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Sesungguhnya beserta kesulitan itu ada kemudahan.",
    reference: "QS. Al-Insyirah: 6"
  },
  {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ Dَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka (jawablah), bahwasanya Aku adalah dekat. Aku mengabulkan permohonan orang yang berdoa apabila ia memohon kepada-Ku.",
    reference: "QS. Al-Baqarah: 186"
  },
  {
    arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ",
    translation: "Dan Kami turunkan dari Al-Qur'an suatu yang menjadi penawar (obat) dan rahmat bagi orang-orang yang beriman.",
    reference: "QS. Al-Isra': 82"
  },
  {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    translation: "Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur.",
    reference: "QS. Al-Baqarah: 255 (Ayat Kursi)"
  },
  {
    arabic: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ",
    translation: "Serulah (manusia) kepada jalan Tuhan-mu dengan hikmah dan pelajaran yang baik.",
    reference: "QS. An-Nahl: 125"
  }
];

// Juz metadata (30 Juz structures)
const JUZ_METADATA = [
  { number: 1, start: "Al-Fatihah: 1", end: "Al-Baqarah: 141" },
  { number: 2, start: "Al-Baqarah: 142", end: "Al-Baqarah: 252" },
  { number: 3, start: "Al-Baqarah: 253", end: "Ali 'Imran: 92" },
  { number: 4, start: "Ali 'Imran: 93", end: "An-Nisa': 23" },
  { number: 5, start: "An-Nisa': 24", end: "An-Nisa': 147" },
  { number: 6, start: "An-Nisa': 148", end: "Al-Ma'idah: 81" },
  { number: 7, start: "Al-Ma'idah: 82", end: "Al-An'am: 110" },
  { number: 8, start: "Al-An'am: 111", end: "Al-A'raf: 87" },
  { number: 9, start: "Al-A'raf: 88", end: "Al-Anfal: 40" },
  { number: 10, start: "Al-Anfal: 41", end: "At-Taubah: 92" },
  { number: 11, start: "At-Taubah: 93", end: "Hud: 5" },
  { number: 12, start: "Hud: 6", end: "Yusuf: 52" },
  { number: 13, start: "Yusuf: 53", end: "Ibrahim: 52" },
  { number: 14, start: "Al-Hijr: 1", end: "An-Nahl: 128" },
  { number: 15, start: "Al-Isra': 1", end: "Al-Kahf: 74" },
  { number: 16, start: "Al-Kahf: 75", end: "Ta Ha: 135" },
  { number: 17, start: "Al-Anbiya': 1", end: "Al-Hajj: 78" },
  { number: 18, start: "Al-Mu'minun: 1", end: "Al-Furqan: 20" },
  { number: 19, start: "Al-Furqan: 21", end: "An-Naml: 55" },
  { number: 20, start: "An-Naml: 56", end: "Al-'Ankabut: 45" },
  { number: 21, start: "Al-'Ankabut: 46", end: "Al-Ahzab: 30" },
  { number: 22, start: "Al-Ahzab: 31", end: "Yasin: 27" },
  { number: 23, start: "Yasin: 28", end: "Az-Zumar: 31" },
  { number: 24, start: "Az-Zumar: 32", end: "Fussilat: 46" },
  { number: 25, start: "Fussilat: 47", end: "Al-Jathiyah: 37" },
  { number: 26, start: "Al-Ahqaf: 1", end: "Adz-Dzariyat: 30" },
  { number: 27, start: "Adz-Dzariyat: 31", end: "Al-Hadid: 29" },
  { number: 28, start: "Al-Mujadilah: 1", end: "At-Tahrim: 12" },
  { number: 29, start: "Al-Mulk: 1", end: "Al-Mursalat: 50" },
  { number: 30, start: "An-Naba': 1", end: "An-Nas: 6" }
];

export default {
  name: "DaftarSurat",
  components: {
    Surat,
  },
  data() {
    return {
      surat: [],
      loading: true,
      error: false,
      errMsg: "Terjadi kesalahan saat mengambil data.",
      searchQuery: "",
      
      // Tabs
      activeTab: "surah",
      juzList: JUZ_METADATA,
      
      // Inspirational Verse
      randomVerse: null,
      
      // Local progress tracker
      lastRead: null,
      
      // Shalat Times
      cities: [
        "Jakarta", "Surabaya", "Bandung", "Medan", "Makassar", 
        "Semarang", "Yogyakarta", "Palembang", "Samarinda", "Pekanbaru",
        "Denpasar", "Banjarmasin", "Malang", "Depok"
      ],
      selectedCity: "Jakarta",
      shalatTimes: null,
      shalatLoading: false,
      nextPrayerName: "",

      // Shortcuts
      popularSurahs: [
        { number: 18, name: "Al-Kahfi", arabic: "الكهf" },
        { number: 36, name: "Yasin", arabic: "يس" },
        { number: 55, name: "Ar-Rahman", arabic: "الرحمن" },
        { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة" },
        { number: 67, name: "Al-Mulk", arabic: "الملك" }
      ]
    };
  },
  computed: {
    filteredSurah() {
      if (!this.searchQuery) return this.surat;
      const query = this.searchQuery.toLowerCase().trim();
      return this.surat.filter((s) => {
        const nameId = s.name.transliteration.id.toLowerCase();
        const translation = s.name.translation.id.toLowerCase();
        const num = String(s.number);
        return (
          nameId.includes(query) ||
          translation.includes(query) ||
          num.includes(query)
        );
      });
    },
    formattedShalatTimes() {
      if (!this.shalatTimes) return {};
      // Filter only the main 5 shalat times + Imsak
      const { Imsak, Fajr, Dhuhr, Asr, Maghrib, Isha } = this.shalatTimes;
      return { Imsak, Fajr, Dhuhr, Asr, Maghrib, Isha };
    }
  },
  mounted() {
    this.selectRandomVerse();
    this.checkLastRead();
    this.fetchSurah();
    
    // Load city from cache
    this.selectedCity = localStorage.getItem("sholat_city") || "Jakarta";
    this.fetchShalatTimes();
  },
  methods: {
    selectRandomVerse() {
      const idx = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length);
      this.randomVerse = INSPIRATIONAL_VERSES[idx];
    },
    checkLastRead() {
      const saved = localStorage.getItem("lastReadSurah");
      if (saved) {
        try {
          this.lastRead = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse last read progress:", e);
        }
      }
    },
    onCityChange() {
      localStorage.setItem("sholat_city", this.selectedCity);
      this.fetchShalatTimes();
    },
    fetchShalatTimes() {
      this.shalatLoading = true;
      this.shalatTimes = null;
      this.nextPrayerName = "";
      
      // Use Aladhan API (with redirect following enabled in standard client)
      // Note: timingsByCity will trigger redirection to include date on Aladhan server.
      // Axios handles 302 redirects automatically in browsers.
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(this.selectedCity)}&country=Indonesia`;

      axios
        .get(url)
        .then((res) => {
          if (res.data && res.data.data && res.data.data.timings) {
            this.shalatTimes = res.data.data.timings;
            this.calculateNextPrayer();
          }
        })
        .catch((err) => {
          console.error("Failed to load prayer times:", err);
        })
        .finally(() => {
          this.shalatLoading = false;
        });
    },
    calculateNextPrayer() {
      if (!this.shalatTimes) return;
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      const prayerNames = ["Imsak", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      let nextName = "Fajr"; // Default fallback to next day Fajr

      for (const name of prayerNames) {
        const timeStr = this.shalatTimes[name];
        if (timeStr) {
          const [h, m] = timeStr.split(":").map(Number);
          const prayerTotalMinutes = h * 60 + m;
          if (prayerTotalMinutes > currentTotalMinutes) {
            nextName = name;
            break;
          }
        }
      }
      this.nextPrayerName = nextName;
    },
    getShalatIcon(name) {
      switch(name) {
        case "Imsak": return "fa-solid fa-moon";
        case "Fajr": return "fa-solid fa-sun-plant-wilt";
        case "Dhuhr": return "fa-solid fa-sun";
        case "Asr": return "fa-solid fa-cloud-sun";
        case "Maghrib": return "fa-solid fa-mountain-sun";
        case "Isha": return "fa-solid fa-star-and-crescent";
        default: return "fa-solid fa-clock";
      }
    },
    translateShalatName(name) {
      switch(name) {
        case "Fajr": return "Subuh";
        case "Dhuhr": return "Dzuhur";
        case "Asr": return "Ashar";
        case "Maghrib": return "Maghrib";
        case "Isha": return "Isya";
        default: return name;
      }
    },
    fetchSurah() {
      this.loading = true;
      this.error = false;
      
      const baseApiUrl =
        import.meta.env.VITE_API_URL ||
        import.meta.env.VUE_APP_MAIN_API_URL ||
        "https://aqa.khuirulhuda.me.eu.org";
        
      const url = `${baseApiUrl}/surah`;

      axios
        .get(url)
        .then((res) => {
          if (res.data && res.data.data) {
            this.surat = res.data.data;
          } else {
            throw new Error("Format respon API tidak valid.");
          }
        })
        .catch((err) => {
          console.error(err);
          this.errMsg = err.message || "Gagal menghubungi server API.";
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
