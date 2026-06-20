<template>
  <div class="pb-16">
    <div class="max-w-6xl mx-auto px-4 py-6 flex gap-8">
      <!-- Left Sidebar: List of 114 Surahs (hidden on mobile, visible on desktop) -->
      <aside
        class="hidden lg:block w-80 rounded-2xl h-[calc(100vh-130px)] sticky top-[95px] flex-shrink-0 flex flex-col transition-all duration-300 themed-card overflow-hidden self-start"
      >
        <!-- Search Input in Sidebar -->
        <div class="p-4 border-b flex-shrink-0 sidebar-search-container">
          <div class="relative shadow-sm">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              v-model="sidebarSearch"
              type="text"
              :placeholder="t('searchSurah')"
              class="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light transition-all sidebar-search-input"
            />
          </div>
        </div>

        <!-- Scrollable List of Surahs -->
        <div class="h-[calc(100vh-210px)] overflow-y-auto p-2 space-y-1">
          <router-link
            v-for="s in filteredSidebarSurahs"
            :key="s.number"
            :to="'/read/' + s.number"
            class="flex items-center justify-between p-3 rounded-xl transition-all duration-150 text-xs font-semibold group sidebar-link"
            :class="{ 'active-link': s.number == surahnumber }"
          >
            <div class="flex items-center gap-2.5">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors border sidebar-link-badge"
                :class="{ 'active-badge': s.number == surahnumber }"
              >
                {{ s.number }}
              </span>
              <span class="group-hover:translate-x-0.5 transition-transform duration-200">{{
                preferencesStore.language === 'en' ? s.name.transliteration.en : s.name.transliteration.id
              }}</span>
            </div>
            <span class="font-arabic text-base text-quran-medium group-hover:text-quran-deep transition-colors">{{
              s.name.short
            }}</span>
          </router-link>
        </div>
      </aside>

      <!-- Right Content Panel: Reading View -->
      <div class="flex-grow min-w-0">
        <!-- Back Navigation Button (only on mobile) -->
        <div class="lg:hidden mb-4">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 text-sm font-semibold text-quran-medium hover:text-quran-deep"
          >
            <i class="fa-solid fa-arrow-left"></i> {{ t('backToHome') }}
          </router-link>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="!loaded" class="flex flex-col gap-6">
          <div class="animate-shimmer h-40 rounded-2xl"></div>
          <div class="animate-shimmer h-14 rounded-2xl"></div>
          <div
            v-for="h in 5"
            :key="h"
            class="themed-card rounded-2xl p-6 h-48 flex flex-col justify-between"
          >
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
          <div
            class="rounded-2xl p-8 text-center max-w-sm shadow-sm border animate-fade-in"
            :class="
              preferencesStore.theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-red-100 text-gray-900'
            "
          >
            <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
            <h3
              class="font-bold text-lg mb-2"
              :class="preferencesStore.theme === 'dark' ? 'text-white' : 'text-gray-900'"
            >
              {{ t('errorTitle') }}
            </h3>
            <p
              class="text-sm mb-6"
              :class="preferencesStore.theme === 'dark' ? 'text-slate-400' : 'text-gray-500'"
            >
              {{ errMsg }}
            </p>
            <router-link
              to="/"
              class="inline-block bg-quran-medium hover:bg-quran-deep text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              {{ t('backToHome') }}
            </router-link>
          </div>
        </div>

        <!-- Main Reading Content -->
        <div v-else class="space-y-6">
          <!-- Surah Header Banner Card -->
          <div
            class="relative overflow-hidden bg-quran-deep text-white rounded-2xl p-6 md:p-8 shadow-md border border-quran-gold/20"
          >
            <div class="flex justify-between items-center relative z-10">
              <div>
                <h1 class="text-3xl font-bold tracking-tight text-white">
                  {{ preferencesStore.language === 'en' ? surahdata.name.transliteration.en : surahdata.name.transliteration.id }}
                </h1>
                <p class="text-sm font-medium text-quran-gold-light mt-1 italic">
                  "{{ preferencesStore.language === 'en' ? surahdata.name.translation.en : surahdata.name.translation.id }}"
                </p>
              </div>
              <div class="font-arabic text-4xl text-quran-gold">{{ surahdata.name.short }}</div>
            </div>

            <div class="h-px bg-white/10 my-4 md:my-5 relative z-10"></div>

            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div class="flex gap-2">
                <span
                  class="bg-white/10 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-location-dot text-quran-gold"></i>
                  <span>{{ formatRevelation(preferencesStore.language === 'en' ? surahdata.revelation.en : surahdata.revelation.id) }}</span>
                </span>
                <span
                  class="bg-white/10 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-book-open text-quran-gold"></i>
                  <span>{{ surahdata.numberOfVerses }} {{ t('verses') }}</span>
                </span>
              </div>
              <button
                @click="openSurahTafsir"
                class="bg-quran-gold hover:bg-white text-quran-deep font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm border-none cursor-pointer"
              >
                <i class="fa-solid fa-circle-info"></i> {{ preferencesStore.language === 'en' ? 'Surah Info & Tafsir' : 'Info & Tafsir Surah' }}
              </button>
            </div>
          </div>

          <!-- Reusable Reading Toolbar component -->
          <ReadingToolbar :verses="verses" :is-juz-view="false" @jump="scrollToVerse" />

          <!-- Bismillah Banner -->
          <div
            v-if="surahdata.preBismillah"
            class="font-arabic text-3xl md:text-4xl text-center py-8 px-4 leading-relaxed transition-colors themed-card rounded-2xl"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <!-- Verses Cards Container -->
          <div class="flex flex-col gap-5">
            <VerseCard
              v-for="verse in verses"
              :key="verse.number.inSurah"
              :verse="verse"
              :is-juz-view="false"
              :is-bookmarked="bookmarksStore.isBookmarked(surahnumber, verse.number.inSurah)"
              :is-active-audio="audioPlayer.activeVerseNumber.value === verse.number.inQuran"
              :is-highlighted="highlightedVerseNumber === verse.number.inSurah"
              :is-playing="audioPlayer.isAudioPlaying.value"
              @toggle-bookmark="toggleBookmark"
              @toggle-audio="toggleAudio"
              @show-tafsir="openVerseTafsir"
            />
          </div>
        </div>
      </div>

      <!-- Reusable Tafsir Modal -->
      <TafsirModal
        :is-open="showModal"
        :title="modalTitle"
        :text="modalText"
        :is-verse-tafsir="isVerseTafsirModal"
        :tafsir-wajiz="modalTafsirWajiz"
        :tafsir-tahlili="modalTafsirTahlili"
        @close="closeModal"
      />

      <!-- Floating Audio Player Bar with GSAP spring -->
      <Transition :css="false" @enter="onAudioBarEnter" @leave="onAudioBarLeave">
      <div
        v-if="audioPlayer.activeVerse.value !== null"
        ref="audioBarRef"
        class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-md rounded-2xl shadow-xl border flex flex-col overflow-hidden"
        :class="[
          preferencesStore.theme === 'dark'
            ? 'bg-slate-900/90 border-slate-750 text-slate-100 backdrop-blur-md'
            : preferencesStore.theme === 'sepia'
            ? 'bg-[#fbf6e7]/90 border-amber-200 text-amber-950 backdrop-blur-md'
            : 'bg-white/90 border-quran-gold/20 text-quran-deep backdrop-blur-md',
        ]"
      >
        <!-- Click-to-Seek Progress Bar -->
        <div
          class="w-full h-1 bg-gray-200/40 dark:bg-slate-800/40 relative cursor-pointer group flex-shrink-0"
          @click="handleProgressSeek"
          title="Seek playback position"
        >
          <div
            class="h-full bg-quran-gold transition-all duration-150 relative"
            :style="{ width: progressPercent + '%' }"
          >
            <!-- Seek handle dot (shows on hover) -->
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-quran-gold scale-0 group-hover:scale-125 transition-transform shadow-sm"></div>
          </div>
        </div>

        <!-- Contents container -->
        <div class="p-4 flex items-center justify-between gap-4">
          <!-- Info -->
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="preferencesStore.theme === 'dark' ? 'bg-slate-800' : 'bg-quran-medium/10'"
            >
              <i
                class="fa-solid fa-volume-high text-lg"
                :class="[audioPlayer.isAudioPlaying.value ? 'animate-pulse text-quran-gold' : 'text-gray-400']"
              ></i>
            </div>
            <div class="text-left">
              <p class="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">Sedang Diputar</p>
              <h5 class="font-bold text-xs leading-snug">
                {{ surahdata.name?.transliteration?.id || "..." }} Ayat
                {{ audioPlayer.activeVerseInSurah.value }}
              </h5>
              <p
                class="text-xs font-semibold"
                :class="preferencesStore.theme === 'dark' ? 'text-quran-gold-light' : 'text-quran-medium'"
              >
                {{ audioPlayer.activeQariName.value }}
              </p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-2">
            <!-- Focus Button (Only visible if auto scroll is currently disabled) -->
            <button
              v-if="!isAutoScrollEnabled"
              @click="focusPlayingVerse"
              class="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm text-white border-none animate-pulse"
              :class="[
                preferencesStore.theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-quran-gold'
                  : preferencesStore.theme === 'sepia'
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-250/30 shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-quran-medium border border-gray-150 shadow-sm',
              ]"
              :title="t('focusVerse')"
            >
              <i class="fa-solid fa-crosshairs"></i>
            </button>
            <button
              @click="audioPlayer.toggleActiveAudio()"
              class="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm text-white border-none"
              :class="[
                preferencesStore.theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-quran-gold border border-slate-700'
                  : preferencesStore.theme === 'sepia'
                  ? 'bg-amber-800 hover:bg-amber-900'
                  : 'bg-quran-medium hover:bg-quran-deep',
              ]"
              :title="audioPlayer.isAudioPlaying.value ? 'Pause' : 'Putar'"
            >
              <i class="fa-solid" :class="audioPlayer.isAudioPlaying.value ? 'fa-pause' : 'fa-play'"></i>
            </button>
            <button
              @click="audioPlayer.stopAudio()"
              class="w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm text-red-500 hover:bg-red-500/10 border-none"
              :class="preferencesStore.theme === 'dark' ? 'border-slate-850' : 'border-gray-200'"
              title="Hentikan Audio"
            >
              <i class="fa-solid fa-stop"></i>
            </button>
          </div>
        </div>
      </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { quranApi } from "../services/quranApi";
import { usePreferencesStore } from "../stores/preferences";
import { useBookmarksStore } from "../stores/bookmarks";
import { useAudioPlayer } from "../composables/useAudioPlayer";
import { useI18n } from "../composables/useI18n";
import { staggerReveal, audioBarEnter, audioBarLeave } from "../composables/useGsap";
import TafsirModal from "../components/TafsirModal.vue";
import ReadingToolbar from "../components/ReadingToolbar.vue";
import VerseCard from "../components/VerseCard.vue";

gsap.registerPlugin(ScrollTrigger);

const route = useRoute();
const router = useRouter();
const preferencesStore = usePreferencesStore();
const bookmarksStore = useBookmarksStore();
const audioPlayer = useAudioPlayer();
const { t } = useI18n();

const surahnumber = ref(0);
const loaded = ref(false);
const error = ref(false);
const errMsg = ref("");
const surahdata = ref({});
const verses = ref([]);

// Sidebar
const surahList = ref([]);
const sidebarSearch = ref("");
// Debounced sidebar search — avoids recomputing the 114-item filter on every keystroke
const debouncedSidebarSearch = ref("");
let sidebarSearchTimer = null;
watch(sidebarSearch, (val) => {
  clearTimeout(sidebarSearchTimer);
  sidebarSearchTimer = setTimeout(() => {
    debouncedSidebarSearch.value = val;
  }, 180);
});

// Highlighted verse
const highlightedVerseNumber = ref(null);
const isAutoScrollEnabled = ref(true);

const handleManualScroll = () => {
  if (audioPlayer.activeVerse.value !== null && isAutoScrollEnabled.value) {
    isAutoScrollEnabled.value = false;
  }
};

const focusPlayingVerse = () => {
  isAutoScrollEnabled.value = true;
  if (audioPlayer.activeVerse.value) {
    scrollToVerse(audioPlayer.activeVerseInSurah.value);
  }
};

const progressPercent = computed(() => {
  if (!audioPlayer.duration.value) return 0;
  return (audioPlayer.currentTime.value / audioPlayer.duration.value) * 100;
});

const handleProgressSeek = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percentage = clickX / rect.width;
  const seekTime = percentage * audioPlayer.duration.value;
  if (!isNaN(seekTime)) {
    audioPlayer.seek(seekTime);
  }
};

// Modal states
const showModal = ref(false);
const modalTitle = ref("");
const modalText = ref("");
const isVerseTafsirModal = ref(false);
const modalTafsirWajiz = ref("");
const modalTafsirTahlili = ref("");

const filteredSidebarSurahs = computed(() => {
  if (!debouncedSidebarSearch.value) return surahList.value;
  const query = debouncedSidebarSearch.value.toLowerCase().trim();
  const lang = preferencesStore.language || "id";
  return surahList.value.filter((s) => {
    const nameId = s.name.transliteration[lang]?.toLowerCase() || "";
    const nameFallback = s.name.transliteration.id.toLowerCase();
    const num = String(s.number);
    return nameId.includes(query) || nameFallback.includes(query) || num.includes(query);
  });
});

const formatRevelation = (val) => {
  if (!val) return "";
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
};

const scrollToVerse = (ayahNumber) => {
  if (!ayahNumber) return;
  const el = document.getElementById(`verse-${ayahNumber}`);
  if (el) {
    const offset = 160;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    preferencesStore.saveProgress({
      number: surahnumber.value,
      name: surahdata.value.name.transliteration.id,
      arabic: surahdata.value.name.short,
      lastAyah: parseInt(ayahNumber),
      verseCount: surahdata.value.numberOfVerses,
    });
  }
};

// ── GSAP: stagger verse cards after data loads ─────────────────────────────
const animateVerseCards = () => {
  nextTick(() => {
    const cards = document.querySelectorAll("[id^='verse-']");
    if (cards.length) {
      staggerReveal(cards, { stagger: 0.04, y: 24, duration: 0.5, useScrollTrigger: true });
    }
  });
};

// ── GSAP: stagger sidebar links after list loads ───────────────────────────
const animateSidebarLinks = () => {
  nextTick(() => {
    // Note: template uses class "sidebar-link" on router-link elements
    const links = document.querySelectorAll("aside .sidebar-link");
    if (links.length) {
      gsap.fromTo(
        links,
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.018, ease: "power2.out" }
      );
    }
  });
};

const scrollActiveSidebarItemIntoView = () => {
  nextTick(() => {
    const activeEl = document.querySelector("aside .router-link-exact-active");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
};

const fetchSurahDetails = async () => {
  const isCached = quranApi.isSurahDetailsCached(surahnumber.value);
  if (!isCached) {
    loaded.value = false;
  }
  error.value = false;
  highlightedVerseNumber.value = null;
  isAutoScrollEnabled.value = true;
  sidebarSearch.value = "";
  try {
    const data = await quranApi.fetchSurahDetails(surahnumber.value);
    surahdata.value = data;
    verses.value = data.verses;

    // Update Title and Meta Description for SEO
    const isEn = preferencesStore.language === "en";
    const surahName = isEn ? data.name.transliteration.en : data.name.transliteration.id;
    const translateName = isEn ? data.name.translation.en : data.name.translation.id;
    const titleText = isEn 
      ? `Surah ${surahName} (${translateName}) - Read & Tafsir - Al-Quran Online` 
      : `Surat ${surahName} (${translateName}) - Baca & Tafsir Lengkap - Al-Quran Online`;
    document.title = titleText;

    const descText = isEn
      ? `Read Surah ${surahName} (${data.numberOfVerses} verses) with English translation, tafsir (exegesis), and word-by-word audio playback.`
      : `Baca Surat ${surahName} (${data.numberOfVerses} ayat) lengkap dengan terjemahan bahasa Indonesia, tafsir Kemenag, dan audio per ayat.`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', descText);
    }

    preferencesStore.saveProgress({
      number: surahnumber.value,
      name: data.name.transliteration.id,
      arabic: data.name.short,
      lastAyah: 1,
      verseCount: data.numberOfVerses,
    });

    nextTick(() => {
      animateVerseCards();
      const queryAyah = route.query.ayah;
      if (queryAyah) {
        const ayahNum = parseInt(queryAyah);
        scrollToVerse(ayahNum);
        highlightedVerseNumber.value = ayahNum;
        setTimeout(() => {
          if (highlightedVerseNumber.value === ayahNum) {
            highlightedVerseNumber.value = null;
          }
        }, 5000);
      } else {
        window.scrollTo({ top: 0 });
      }
    });
  } catch (err) {
    console.error(err);
    errMsg.value = err.message || "Gagal mengambil data dari server.";
    error.value = true;
  } finally {
    loaded.value = true;
  }
};

const fetchSurahList = async () => {
  try {
    const data = await quranApi.fetchSurahList();
    surahList.value = data;
    animateSidebarLinks();
    scrollActiveSidebarItemIntoView();
  } catch (err) {
    console.error("Failed to load sidebar surah list:", err);
  }
};

const openSurahTafsir = () => {
  isVerseTafsirModal.value = false;
  const isEn = preferencesStore.language === "en";
  const name = isEn ? surahdata.value.name.transliteration.en : surahdata.value.name.transliteration.id;
  modalTitle.value = isEn ? `Surah ${name} Info & Tafsir` : `Detail & Tafsir Surah ${name}`;
  modalText.value = surahdata.value.tafsir ? surahdata.value.tafsir.id : (isEn ? "No detail exegesis available." : "Tidak ada detail tafsir.");
  showModal.value = true;
};

const openVerseTafsir = (verse) => {
  isVerseTafsirModal.value = true;
  const isEn = preferencesStore.language === "en";
  const name = isEn ? surahdata.value.name.transliteration.en : surahdata.value.name.transliteration.id;
  modalTitle.value = isEn ? `Verse ${verse.number.inSurah} Tafsir` : `Tafsir Ayat ${verse.number.inSurah}`;
  modalTafsirWajiz.value = verse.tafsir?.id?.short || (isEn ? "No brief exegesis available." : "Tidak ada detail tafsir wajiz.");
  modalTafsirTahlili.value = verse.tafsir?.id?.long || (isEn ? "No detailed exegesis available." : "Tidak ada detail tafsir tahlili.");
  showModal.value = true;
  preferencesStore.saveProgress({
    number: surahnumber.value,
    name: name,
    arabic: surahdata.value.name.short,
    lastAyah: verse.number.inSurah,
    verseCount: surahdata.value.numberOfVerses,
  });
};

const closeModal = () => { showModal.value = false; };

const toggleBookmark = (verse) => {
  bookmarksStore.toggleBookmark({
    surahNumber: surahnumber.value,
    surahName: surahdata.value.name.transliteration.id,
    surahArabic: surahdata.value.name.short,
    verseNumber: verse.number.inSurah,
  });
};

const toggleAudio = (verse) => {
  isAutoScrollEnabled.value = true;
  audioPlayer.toggleAudio(verse, verses.value, (nextVerse) => {
    if (isAutoScrollEnabled.value) {
      scrollToVerse(nextVerse.number.inSurah);
    }
  });
};

// ── Audio bar GSAP spring hooks ────────────────────────────────────────────
const onAudioBarEnter = (el, done) => {
  audioBarEnter(el);
  gsap.delayedCall(0.52, done);
};
const onAudioBarLeave = (el, done) => {
  audioBarLeave(el, done);
};

// Route watcher
watch(
  () => route.params.surat,
  (newSurat) => {
    if (newSurat) {
      const parsed = parseInt(newSurat);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 114) {
        surahnumber.value = parsed;
        audioPlayer.stopAudio();
        fetchSurahDetails();
        scrollActiveSidebarItemIntoView();
      }
    }
  }
);

onMounted(() => {
  const params = route.params.surat;
  if (isNaN(params) || params < 1 || params > 114) {
    router.push({ name: "Main" });
    return;
  }
  surahnumber.value = parseInt(params);
  fetchSurahDetails();
  fetchSurahList();

  window.addEventListener("wheel", handleManualScroll, { passive: true });
  window.addEventListener("touchmove", handleManualScroll, { passive: true });
});

onUnmounted(() => {
  audioPlayer.stopAudio();
  ScrollTrigger.getAll().forEach((t) => t.kill());
  window.removeEventListener("wheel", handleManualScroll);
  window.removeEventListener("touchmove", handleManualScroll);
  clearTimeout(sidebarSearchTimer);
});
</script>

<style scoped>
/* Animations handled by GSAP */
</style>
