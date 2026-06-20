<template>
  <div class="container read-container">
    <!-- Back Navigation -->
    <div class="back-nav">
      <router-link to="/" class="btn-back">
        <i class="fa-solid fa-arrow-left"></i> Kembali ke Daftar Surah
      </router-link>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="!loaded" class="loading-wrapper">
      <div class="skeleton-header skeleton-shimmer"></div>
      <div v-for="h in 5" :key="h" class="skeleton-verse-card">
        <div class="sk-top">
          <div class="skeleton-shimmer sk-badge"></div>
          <div class="skeleton-shimmer sk-actions"></div>
        </div>
        <div class="skeleton-shimmer sk-arabic-line"></div>
        <div class="skeleton-shimmer sk-translate-line"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <i class="fa-solid fa-triangle-exclamation error-icon"></i>
        <h3>Gagal Memuat Surah</h3>
        <p>{{ errMsg }}</p>
        <router-link to="/" class="btn-primary">Kembali ke Beranda</router-link>
      </div>
    </div>

    <div v-else>
      <!-- Surah Header Card -->
      <div class="surah-header-card">
        <div class="header-main">
          <div>
            <h1 class="surah-title-lg">{{ surahdata.name.transliteration.id }}</h1>
            <p class="surah-subtitle-lg">"{{ surahdata.name.translation.id }}"</p>
          </div>
          <div class="surah-arabic-lg">{{ surahdata.name.short }}</div>
        </div>
        
        <div class="header-divider"></div>
        
        <div class="header-meta">
          <div class="meta-pills">
            <span class="meta-pill">
              <i class="fa-solid fa-location-dot"></i> {{ formatRevelation(surahdata.revelation.id) }}
            </span>
            <span class="meta-pill">
              <i class="fa-solid fa-book-open"></i> {{ surahdata.numberOfVerses }} Ayat
            </span>
          </div>
          <button @click="openSurahTafsir" class="btn-tafsir">
            <i class="fa-solid fa-circle-info"></i> Info & Tafsir Surah
          </button>
        </div>
      </div>

      <!-- Bismillah Section -->
      <div v-if="surahdata.preBismillah" class="bismillah-card">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>

      <!-- Verses List -->
      <div class="verses-list">
        <div 
          v-for="verse in verses" 
          :key="verse.number.inSurah"
          :id="'verse-' + verse.number.inSurah"
          class="verse-card"
          :class="{ 'playing-verse': activeVerseNumber === verse.number.inSurah }"
        >
          <!-- Verse Actions & Badge -->
          <div class="verse-top">
            <span class="verse-badge">{{ verse.number.inSurah }}</span>
            <div class="verse-actions">
              <!-- Play Audio Button -->
              <button 
                @click="toggleAudio(verse)" 
                class="action-btn btn-play" 
                title="Putar Audio Ayat"
                :class="{ 'playing': activeVerseNumber === verse.number.inSurah }"
              >
                <i :class="activeVerseNumber === verse.number.inSurah ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
              </button>
              <!-- Tafsir Ayat Button -->
              <button 
                @click="openVerseTafsir(verse)" 
                class="action-btn btn-info" 
                title="Tafsir Ayat"
              >
                <i class="fa-solid fa-book"></i>
              </button>
            </div>
          </div>

          <!-- Arabic Text -->
          <div class="verse-arabic-text">
            {{ verse.text.arab }}
          </div>

          <!-- Translation Text -->
          <div class="verse-translation-text">
            {{ verse.translation.id }}
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Modal Dialog (Replacing SweetAlert2) -->
    <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
      <div class="custom-modal">
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fa-solid fa-book-open"></i> {{ modalTitle }}
          </h3>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-tafsir-text">{{ modalText }}</p>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-primary">Tutup</button>
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
      
      // Audio playback states
      activeVerseNumber: null,
      audioPlayer: null,

      // Modal states
      showModal: false,
      modalTitle: "",
      modalText: "",
    };
  },
  mounted() {
    const params = this.$route.params.surat;
    if (isNaN(params) || params < 1 || params > 114) {
      this.$router.push({ name: "Main" });
      return;
    }
    
    this.surahnumber = params;
    this.fetchSurahDetails();
  },
  unmounted() {
    // Crucial cleanup: stop audio when user leaves page
    this.stopAudio();
  },
  methods: {
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
    formatRevelation(val) {
      if (!val) return "";
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    },
    
    // Custom Modal methods
    openSurahTafsir() {
      this.modalTitle = `Tafsir Surah ${this.surahdata.name.transliteration.id}`;
      this.modalText = this.surahdata.tafsir ? this.surahdata.tafsir.id : "Tidak ada detail tafsir untuk surah ini.";
      this.showModal = true;
    },
    openVerseTafsir(verse) {
      this.modalTitle = `Tafsir Ayat ${verse.number.inSurah}`;
      this.modalText = verse.tafsir && verse.tafsir.id && verse.tafsir.id.short 
        ? verse.tafsir.id.short 
        : "Tidak ada detail tafsir untuk ayat ini.";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },

    // Audio methods
    toggleAudio(verse) {
      // If clicking already playing verse, pause/stop it
      if (this.activeVerseNumber === verse.number.inSurah) {
        this.stopAudio();
        return;
      }

      // Stop current audio if playing another verse
      this.stopAudio();

      // Start new audio
      const audioUrl = verse.audio.primary;
      if (audioUrl) {
        this.activeVerseNumber = verse.number.inSurah;
        this.audioPlayer = new Audio(audioUrl);
        
        this.audioPlayer.play().catch((err) => {
          console.error("Audio playback failed:", err);
          this.stopAudio();
        });

        this.audioPlayer.addEventListener("ended", () => {
          this.stopAudio();
        });
      }
    },
    stopAudio() {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
        this.audioPlayer = null;
      }
      this.activeVerseNumber = null;
    },
  },
};
</script>

<style scoped>
.read-container {
  max-width: 800px !important;
  padding-bottom: 60px;
}

.back-nav {
  margin-top: 10px;
  margin-bottom: 25px;
  text-align: left;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--primary-medium);
  font-size: 0.95rem;
  transition: all var(--transition-fast);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
}

.btn-back:hover {
  background-color: var(--bg-active);
  color: var(--primary-deep);
}

/* Surah Header Card */
.surah-header-card {
  background: linear-gradient(135deg, var(--primary-deep) 0%, var(--primary-medium) 100%);
  color: var(--text-white);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 30px;
  box-shadow: var(--shadow-md);
  margin-bottom: 30px;
  text-align: left;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.surah-title-lg {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-white);
}

.surah-subtitle-lg {
  font-size: 1.1rem;
  color: var(--accent-gold-light);
  opacity: 0.9;
  font-style: italic;
  margin-top: 2px;
}

.surah-arabic-lg {
  font-family: var(--font-arabic);
  font-size: 2.5rem;
  color: var(--accent-gold);
}

.header-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.15);
  margin-bottom: 20px;
}

.header-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.meta-pills {
  display: flex;
  gap: 10px;
}

.meta-pill {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-pill i {
  color: var(--accent-gold);
}

.btn-tafsir {
  background-color: var(--accent-gold);
  color: var(--primary-deep);
  border: none;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all var(--transition-fast);
}

.btn-tafsir:hover {
  background-color: var(--text-white);
  color: var(--primary-deep);
  transform: translateY(-2px);
}

/* Bismillah */
.bismillah-card {
  font-family: var(--font-arabic);
  font-size: 2rem;
  text-align: center;
  color: var(--primary-deep);
  padding: 30px 15px;
  margin-bottom: 30px;
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid rgba(45, 106, 79, 0.08);
  box-shadow: var(--shadow-sm);
  line-height: 1.8;
}

/* Verses List */
.verses-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.verse-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 30px;
  border: 1px solid rgba(45, 106, 79, 0.08);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
}

.verse-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: var(--primary-light);
  opacity: 0.3;
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
  transition: opacity var(--transition-fast), background-color var(--transition-fast);
}

.verse-card:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(45, 106, 79, 0.15);
}

.verse-card:hover::before {
  opacity: 1;
  background-color: var(--primary-medium);
}

/* Playing Verse Style */
.playing-verse {
  background: linear-gradient(to right, var(--bg-active), var(--bg-card) 60%);
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: var(--shadow-md);
}

.playing-verse::before {
  opacity: 1;
  background-color: var(--accent-gold);
}

.verse-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.verse-badge {
  background-color: var(--bg-light);
  color: var(--primary-deep);
  font-weight: 700;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  border: 1.5px solid var(--accent-gold-light);
}

.playing-verse .verse-badge {
  background-color: var(--accent-gold-light);
  border-color: var(--accent-gold);
}

.verse-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background-color: var(--bg-light);
  color: var(--text-medium);
  border: 1px solid rgba(45, 106, 79, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.9rem;
}

.action-btn:hover {
  background-color: var(--bg-active);
  color: var(--primary-deep);
  border-color: var(--primary-light);
  transform: scale(1.05);
}

.btn-play.playing {
  background-color: var(--accent-gold);
  color: var(--primary-deep);
  border-color: var(--accent-gold);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
}

/* Arabic Typography */
.verse-arabic-text {
  font-family: var(--font-arabic);
  font-size: 2.2rem;
  color: var(--text-dark);
  text-align: right;
  direction: rtl;
  line-height: 2.2;
  margin-bottom: 20px;
  padding: 10px 0;
}

.verse-translation-text {
  font-size: 1rem;
  color: var(--text-medium);
  line-height: 1.6;
}

/* Skeleton Loading for Reading Page */
.loading-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-header {
  height: 180px;
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
}

.skeleton-verse-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 30px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sk-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sk-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.sk-actions {
  width: 80px;
  height: 32px;
  border-radius: var(--radius-sm);
}

.sk-arabic-line {
  height: 30px;
  width: 85%;
  align-self: flex-end;
  border-radius: var(--radius-sm);
  margin: 15px 0;
}

.sk-translate-line {
  height: 18px;
  width: 60%;
  border-radius: var(--radius-sm);
}

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

@media (max-width: 600px) {
  .surah-header-card {
    padding: 20px;
  }
  .surah-title-lg {
    font-size: 1.8rem;
  }
  .surah-arabic-lg {
    font-size: 2rem;
  }
  .header-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-tafsir {
    width: 100%;
    justify-content: center;
  }
  .verse-card {
    padding: 20px;
  }
  .verse-arabic-text {
    font-size: 1.8rem;
    line-height: 2;
  }
}
</style>
