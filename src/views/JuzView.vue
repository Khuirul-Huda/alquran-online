<template>
  <div class="pb-16">
    <div class="max-w-6xl mx-auto px-4 py-6 flex gap-8">
      <!-- Left Sidebar: List of 30 Juz (hidden on mobile, visible on desktop) -->
      <aside
        class="hidden lg:block w-80 rounded-2xl h-[calc(100vh-130px)] sticky top-[95px] flex-shrink-0 flex flex-col transition-all duration-300 themed-card"
      >
        <div
          class="p-4 border-b flex-shrink-0"
          :class="preferencesStore.theme === 'dark' ? 'border-slate-800' : 'border-gray-100'"
        >
          <h3 class="font-bold text-xs uppercase tracking-wider text-gray-400">Pilih Juz</h3>
        </div>

        <!-- Juz 1-30 List -->
        <div class="flex-grow overflow-y-auto p-2 space-y-1">
          <router-link
            v-for="j in 30"
            :key="j"
            :to="'/juz/' + j"
            class="flex items-center justify-between p-3 rounded-xl transition-all duration-150 text-xs font-semibold group"
            :class="
              j == juzNumber
                ? preferencesStore.theme === 'dark'
                  ? 'bg-slate-800 text-quran-gold shadow-sm border-l-4 border-quran-gold'
                  : 'bg-quran-accent/15 text-quran-deep border-l-4 border-quran-medium shadow-sm'
                : preferencesStore.theme === 'dark'
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-gray-600 hover:bg-quran-bg hover:text-quran-medium'
            "
          >
            <div class="flex items-center gap-2.5">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-colors"
                :class="
                  j == juzNumber
                    ? 'bg-quran-gold-light text-quran-deep font-bold border-quran-gold/40'
                    : preferencesStore.theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-gray-100 border-gray-200 group-hover:bg-quran-gold-light'
                "
              >
                {{ j }}
              </span>
              <span>Juz {{ j }}</span>
            </div>
            <span class="text-[11px] text-gray-400 group-hover:text-quran-medium transition-colors">
              {{ getJuzLabel(j) }}
            </span>
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
            <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda
          </router-link>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="!loaded" class="flex flex-col gap-6">
          <div class="animate-shimmer h-24 rounded-2xl"></div>
          <div class="animate-shimmer h-14 rounded-2xl"></div>
          <div
            v-for="h in 5"
            :key="h"
            class="border rounded-2xl p-6 h-48 flex flex-col justify-between"
            :class="
              preferencesStore.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
            "
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
              Gagal Memuat Juz
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
              Kembali ke Beranda
            </router-link>
          </div>
        </div>

        <!-- Main Reading Content -->
        <div v-else class="space-y-6">
          <!-- Juz Header Card -->
          <div
            class="relative overflow-hidden bg-quran-deep text-white rounded-2xl p-6 md:p-8 shadow-md border border-quran-gold/20"
          >
            <div class="flex justify-between items-center relative z-10">
              <div>
                <h1 class="text-3xl font-bold tracking-tight text-white">Juz {{ juzNumber }}</h1>
                <p class="text-xs font-semibold text-quran-gold-light mt-1.5 flex items-center gap-1.5">
                  <i class="fa-solid fa-location-arrow"></i>
                  <span>Rentang: {{ juzData.start }} s/d {{ juzData.end }}</span>
                </p>
              </div>
              <div class="font-arabic text-3xl text-quran-gold">
                الجزء {{ convertToArabicNumber(juzNumber) }}
              </div>
            </div>
          </div>

          <!-- Reusable Reading Toolbar component -->
          <ReadingToolbar
            :verses="verses"
            :is-juz-view="true"
            :get-verse-label="getVerseLabel"
            @jump="onJumpChange"
          />

          <!-- Verses Cards with dynamic Surah dividers -->
          <div class="flex flex-col gap-6">
            <template v-for="(verse, idx) in verses" :key="verse.number.inQuran">
              <!-- Surah Boundary Banner -->
              <div
                v-if="idx === 0 || isNewSurah(verse, verses[idx - 1])"
                class="border rounded-2xl p-5 text-center transition-all duration-300"
                :class="[
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900 border-slate-800'
                    : preferencesStore.theme === 'sepia'
                    ? 'bg-[#fdf8e6] border-amber-200/50 text-amber-955'
                    : 'bg-quran-deep border-quran-gold/20 text-white',
                ]"
              >
                <div class="flex justify-between items-center px-4">
                  <div class="text-left">
                    <h2
                      class="font-bold text-lg"
                      :class="
                        preferencesStore.theme === 'dark' || preferencesStore.theme === 'sepia'
                          ? ''
                          : 'text-white'
                      "
                    >
                      Surah {{ getSurahInfo(verse.number.inQuran).name }}
                    </h2>
                    <p class="text-xs opacity-80 font-medium italic mt-0.5">
                      "{{ getSurahInfo(verse.number.inQuran).translation }}"
                    </p>
                  </div>
                  <span
                    class="font-arabic text-3xl"
                    :class="
                      preferencesStore.theme === 'dark' || preferencesStore.theme === 'sepia'
                        ? 'text-quran-medium'
                        : 'text-quran-gold'
                    "
                  >
                    {{ getSurahInfo(verse.number.inQuran).arabic }}
                  </span>
                </div>
              </div>

              <!-- Reusable VerseCard component -->
              <VerseCard
                :verse="verse"
                :is-juz-view="true"
                :surah-name="getSurahInfo(verse.number.inQuran).name"
                :is-bookmarked="
                  bookmarksStore.isBookmarked(
                    getSurahInfo(verse.number.inQuran).number,
                    verse.number.inSurah
                  )
                "
                :is-active-audio="audioPlayer.activeVerseNumber.value === verse.number.inQuran"
                :is-highlighted="highlightedVerseNumber === verse.number.inQuran"
                @toggle-bookmark="toggleBookmark"
                @toggle-audio="toggleAudio"
                @show-tafsir="openVerseTafsir"
              />
            </template>
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
        v-if="audioPlayer.activeVerse.value !== null && getSurahInfo(audioPlayer.activeVerseNumber.value)"
        class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-md rounded-2xl shadow-xl border p-4 flex items-center justify-between gap-4"
        :class="[
          preferencesStore.theme === 'dark'
            ? 'bg-slate-900/90 border-slate-750 text-slate-100 backdrop-blur-md'
            : preferencesStore.theme === 'sepia'
            ? 'bg-[#fbf6e7]/90 border-amber-250 text-amber-955 backdrop-blur-md'
            : 'bg-white/90 border-quran-gold/20 text-quran-deep backdrop-blur-md',
        ]"
      >
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
              Surah {{ getSurahInfo(audioPlayer.activeVerseNumber.value).name }} Ayat
              {{ getSurahInfo(audioPlayer.activeVerseNumber.value).verseInSurah }}
            </h5>
            <p
              class="text-xs text-quran-medium font-semibold"
              :class="preferencesStore.theme === 'dark' ? 'text-quran-gold-light' : 'text-quran-medium'"
            >
              {{ audioPlayer.activeQariName.value }}
            </p>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-2">
          <!-- Pause/Play button -->
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

          <!-- Stop Button -->
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
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { quranApi } from "../services/quranApi";
import { usePreferencesStore } from "../stores/preferences";
import { useBookmarksStore } from "../stores/bookmarks";
import { useAudioPlayer } from "../composables/useAudioPlayer";
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

const juzNumber = ref(1);
const loaded = ref(false);
const error = ref(false);
const errMsg = ref("");
const juzData = ref({});
const verses = ref([]);

const surahList = ref([]);
const highlightedVerseNumber = ref(null);

// Modal states
const showModal = ref(false);
const modalTitle = ref("");
const modalText = ref("");
const isVerseTafsirModal = ref(false);
const modalTafsirWajiz = ref("");
const modalTafsirTahlili = ref("");

const getJuzLabel = (j) => {
  const labels = [
    "Al-Fatihah 1 - Al-Baqarah 141",
    "Al-Baqarah 142 - Al-Baqarah 252",
    "Al-Baqarah 253 - Ali 'Imran 92",
    "Ali 'Imran 93 - An-Nisa' 23",
    "An-Nisa' 24 - An-Nisa' 147",
    "An-Nisa' 148 - Al-Ma'idah 81",
    "Al-Ma'idah 82 - Al-An'am 110",
    "Al-An'am 111 - Al-A'raf 87",
    "Al-A'raf 88 - Al-Anfal 40",
    "Al-Anfal 41 - At-Taubah 92",
    "At-Taubah 93 - Hud 5",
    "Hud 6 - Yusuf 52",
    "Yusuf 53 - Ibrahim 52",
    "Al-Hijr 1 - An-Nahl 128",
    "Al-Isra' 1 - Al-Kahf 74",
    "Al-Kahf 75 - Ta Ha 135",
    "Al-Anbiya' 1 - Al-Hajj 78",
    "Al-Mu'minun 1 - Al-Furqan 20",
    "Al-Furqan 21 - An-Naml 55",
    "An-Naml 56 - Al-'Ankabut 45",
    "Al-'Ankabut 46 - Al-Ahzab 30",
    "Al-Ahzab 31 - Yasin 27",
    "Yasin 28 - Az-Zumar 31",
    "Az-Zumar 32 - Fussilat 46",
    "Fussilat 47 - Al-Jathiyah 37",
    "Al-Ahqaf 1 - Adz-Dzariyat 30",
    "Adz-Dzariyat 31 - Al-Hadid 29",
    "Al-Mujadilah 1 - At-Tahrim 12",
    "Al-Mulk 1 - Al-Mursalat 50",
    "An-Naba' 1 - An-Nas 6",
  ];
  return labels[j - 1] || "";
};

const convertToArabicNumber = (num) => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((char) => arabicNumerals[parseInt(char)] || char)
    .join("");
};

const getSurahInfo = (inQuranValue) => {
  if (surahList.value.length === 0) {
    return { number: 1, name: "Loading...", arabic: "", translation: "", verseInSurah: 1 };
  }
  let count = 0;
  for (const s of surahList.value) {
    if (inQuranValue > count && inQuranValue <= count + s.numberOfVerses) {
      return {
        number: s.number,
        name: s.name.transliteration.id,
        arabic: s.name.short,
        translation: s.name.translation.id,
        verseInSurah: inQuranValue - count,
      };
    }
    count += s.numberOfVerses;
  }
  return { number: 1, name: "", arabic: "", translation: "", verseInSurah: 1 };
};

const getVerseLabel = (inQuranValue) => {
  const info = getSurahInfo(inQuranValue);
  return info ? `${info.name} - ${info.verseInSurah}` : "";
};

const isNewSurah = (curr, prev) => {
  if (!prev) return true;
  const currInfo = getSurahInfo(curr.number.inQuran);
  const prevInfo = getSurahInfo(prev.number.inQuran);
  return currInfo && prevInfo && currInfo.number !== prevInfo.number;
};

const scrollToVerse = (inQuranValue) => {
  if (!inQuranValue) return;
  const el = document.getElementById(`verse-${inQuranValue}`);
  if (el) {
    const offset = 160;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    const info = getSurahInfo(inQuranValue);
    if (info) {
      preferencesStore.saveProgress({
        number: info.number,
        name: info.name,
        arabic: info.arabic,
        lastAyah: info.verseInSurah,
        verseCount: 0, // Not strictly required for landing resume if simple
      });
    }
  }
};

const fetchJuzDetails = async () => {
  loaded.value = false;
  error.value = false;
  try {
    const data = await quranApi.fetchJuzDetails(juzNumber.value);
    juzData.value = data;
    verses.value = data.verses;

    if (verses.value.length > 0) {
      const info = getSurahInfo(verses.value[0].number.inQuran);
      if (info) {
        preferencesStore.saveProgress({
          number: info.number,
          name: info.name,
          arabic: info.arabic,
          lastAyah: info.verseInSurah,
          verseCount: 0,
        });
      }
    }

    nextTick(() => {
      // Stagger verse cards
      const cards = document.querySelectorAll("[id^='verse-']");
      if (cards.length) {
        staggerReveal(cards, { stagger: 0.04, y: 24, duration: 0.5, useScrollTrigger: true });
      }
      const queryAyah = route.query.ayah;
      if (queryAyah) {
        const num = parseInt(queryAyah);
        scrollToVerse(num);
        highlightedVerseNumber.value = num;
        setTimeout(() => {
          if (highlightedVerseNumber.value === num) {
            highlightedVerseNumber.value = null;
          }
        }, 5000);
      }
    });
  } catch (err) {
    console.error(err);
    errMsg.value = err.message || "Gagal mengambil data Juz.";
    error.value = true;
  } finally {
    loaded.value = true;
  }
};

const fetchSurahList = async () => {
  try {
    const data = await quranApi.fetchSurahList();
    surahList.value = data;
    fetchJuzDetails(); // Fetch details after mapping is ready
  } catch (err) {
    console.error("Failed to load surah list for Juz mapping:", err);
    fetchJuzDetails();
  }
};

const openVerseTafsir = (verse) => {
  const info = getSurahInfo(verse.number.inQuran);
  isVerseTafsirModal.value = true;
  modalTitle.value = `Tafsir ${info.name} Ayat ${verse.number.inSurah}`;
  modalTafsirWajiz.value =
    verse.tafsir?.id?.short || "Tidak ada detail tafsir wajiz.";
  modalTafsirTahlili.value =
    verse.tafsir?.id?.long || "Tidak ada detail tafsir tahlili.";
  showModal.value = true;

  preferencesStore.saveProgress({
    number: info.number,
    name: info.name,
    arabic: info.arabic,
    lastAyah: info.verseInSurah,
    verseCount: 0,
  });
};

const closeModal = () => {
  showModal.value = false;
};

const toggleBookmark = (verse) => {
  const info = getSurahInfo(verse.number.inQuran);
  bookmarksStore.toggleBookmark({
    surahNumber: info.number,
    surahName: info.name,
    surahArabic: info.arabic,
    verseNumber: verse.number.inSurah,
  });
};

const toggleAudio = (verse) => {
  audioPlayer.toggleAudio(verse, verses.value, (nextVerse) => {
    scrollToVerse(nextVerse.number.inQuran);
  });
};

const onJumpChange = (inQuranValue) => {
  if (!inQuranValue) return;
  const num = parseInt(inQuranValue);
  router.push({ query: { ayah: num } }).catch(() => {});
};

watch(
  () => route.params.juz,
  (newVal) => {
    if (newVal) {
      juzNumber.value = parseInt(newVal);
      audioPlayer.stopAudio();
      fetchJuzDetails();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
);

watch(
  () => route.query.ayah,
  (newVal) => {
    if (newVal) {
      const num = parseInt(newVal);
      scrollToVerse(num);
      highlightedVerseNumber.value = num;
      setTimeout(() => {
        if (highlightedVerseNumber.value === num) {
          highlightedVerseNumber.value = null;
        }
      }, 5000);
    }
  }
);

// ── Audio bar GSAP spring hooks ────────────────────────────────────────────
const onAudioBarEnter = (el, done) => {
  audioBarEnter(el);
  gsap.delayedCall(0.52, done);
};
const onAudioBarLeave = (el, done) => {
  audioBarLeave(el, done);
};

onMounted(() => {
  const params = route.params.juz;
  if (isNaN(params) || params < 1 || params > 30) {
    router.push({ name: "Main" });
    return;
  }
  juzNumber.value = parseInt(params);
  fetchSurahList();
});

onUnmounted(() => {
  audioPlayer.stopAudio();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
</script>

<style scoped>
/* Animations handled by GSAP */
</style>
