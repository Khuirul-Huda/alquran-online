<template>
  <div>
    <!-- Hero Header -->
    <div class="hero-header">
      <h1 class="hero-title">Al-Quran <span>Online</span></h1>
      <p class="hero-arabic">أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ۚ وَلَوْ كَانَ مِنْ عِنْدِ غَيْرِ اللَّهِ لَوَجَدُوا فِيهِ اخْتِلَافًا كَثِيرًا</p>
      <p class="hero-desc">
        "Maka tidakkah mereka menghayati (mendalami) Al-Qur'an? Sekiranya (Al-Qur'an) itu bukan dari Allah, pastilah mereka menemukan banyak hal yang bertentangan di dalamnya." (QS. An-Nisa': 82)
      </p>
    </div>

    <!-- Search Input -->
    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari surah berdasarkan nama, arti, atau nomor..."
        class="search-input"
      />
    </div>

    <!-- Main Container -->
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="surah-grid">
        <div v-for="h in 12" :key="h" class="skeleton-card">
          <div class="card-top">
            <div class="skeleton-shimmer sk-circle"></div>
            <div class="skeleton-shimmer sk-line-long" style="width: 80px; height: 28px;"></div>
          </div>
          <div class="card-bottom">
            <div class="skeleton-shimmer sk-line-long" style="width: 70%; margin-bottom: 8px;"></div>
            <div class="skeleton-shimmer sk-line-med" style="width: 50%; margin-bottom: 12px;"></div>
            <div class="skeleton-shimmer sk-line-short" style="width: 40%;"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-card">
          <i class="fa-solid fa-triangle-exclamation error-icon"></i>
          <h3>Gagal Memuat Data</h3>
          <p>{{ errMsg }}</p>
          <button @click="fetchSurah" class="btn-primary retry-btn">Coba Lagi</button>
        </div>
      </div>

      <!-- Content List -->
      <div v-else>
        <!-- No Results -->
        <div v-if="filteredSurah.length === 0" class="no-results">
          <i class="fa-solid fa-box-open empty-icon"></i>
          <p>Tidak ada surah yang cocok dengan "{{ searchQuery }}"</p>
        </div>

        <!-- Surah Cards Grid -->
        <div v-else class="surah-grid">
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
  </div>
</template>

<script>
import Surat from "../components/Surat.vue";
import axios from "axios";

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
  },
  mounted() {
    this.fetchSurah();
  },
  methods: {
    fetchSurah() {
      this.loading = true;
      this.error = false;
      
      // Determine the API URL dynamically
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
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.error-card {
  background: var(--bg-card);
  border: 1px solid rgba(214, 40, 40, 0.15);
  border-radius: var(--radius-md);
  padding: 40px;
  text-align: center;
  max-width: 400px;
  box-shadow: var(--shadow-sm);
}

.error-icon {
  font-size: 3rem;
  color: #d62828;
  margin-bottom: 20px;
}

.error-card h3 {
  margin-bottom: 10px;
  color: var(--text-dark);
  font-size: 1.3rem;
}

.error-card p {
  color: var(--text-medium);
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.retry-btn {
  background-color: #d62828;
}
.retry-btn:hover {
  background-color: #b32020;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-medium);
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}
</style>
