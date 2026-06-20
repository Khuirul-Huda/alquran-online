<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left 2 Columns: Settings Controls -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Settings Panel Title Card -->
        <div class="themed-card rounded-2xl p-6 shadow-sm flex items-center gap-3">
          <i class="fa-solid fa-sliders text-2xl text-quran-gold"></i>
          <div>
            <h1 class="font-bold text-xl">{{ t('appSettings') }}</h1>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              {{ t('customizeComfort') }}
            </p>
          </div>
        </div>

        <!-- Section 1: Tampilan & Tema -->
        <div class="themed-card rounded-2xl p-6 shadow-sm space-y-5">
          <h2 class="font-bold text-base border-b border-gray-100/50 pb-2 flex items-center gap-2">
            <i class="fa-solid fa-palette text-quran-gold"></i> {{ t('appearanceAndTheme') }}
          </h2>

          <!-- Theme Choices -->
          <div class="space-y-2.5">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">{{ t('readingTheme') }}</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                @click="preferencesStore.setTheme('light')"
                class="flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer"
                :class="[
                  preferencesStore.theme === 'light'
                    ? 'border-quran-medium bg-quran-accent/5 text-quran-deep'
                    : preferencesStore.theme === 'dark'
                    ? 'border-slate-800 text-slate-400 bg-slate-950/40 hover:bg-slate-900'
                    : preferencesStore.theme === 'sepia'
                    ? 'border-amber-200/60 text-amber-905 bg-[#fffdf0]/50 hover:bg-amber-50/50'
                    : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50',
                ]"
              >
                <div class="w-8 h-8 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center">
                  <i class="fa-solid fa-sun text-amber-500"></i>
                </div>
                <span>{{ t('light') }}</span>
              </button>
              <button
                @click="preferencesStore.setTheme('sepia')"
                class="flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer"
                :class="[
                  preferencesStore.theme === 'sepia'
                    ? 'border-amber-400 bg-amber-50/50 text-amber-955'
                    : preferencesStore.theme === 'dark'
                    ? 'border-slate-800 text-slate-400 bg-slate-950/40 hover:bg-slate-900'
                    : preferencesStore.theme === 'sepia'
                    ? 'border-amber-200/60 text-amber-905 bg-[#fffdf0]/50 hover:bg-amber-50/50'
                    : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50',
                ]"
              >
                <div class="w-8 h-8 rounded-full bg-[#fffdf0] border border-amber-300 shadow-sm flex items-center justify-center">
                  <i class="fa-solid fa-coffee text-amber-700"></i>
                </div>
                <span>{{ t('sepia') }}</span>
              </button>
              <button
                @click="preferencesStore.setTheme('dark')"
                class="flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer"
                :class="[
                  preferencesStore.theme === 'dark'
                    ? 'border-quran-gold bg-slate-800 text-white'
                    : preferencesStore.theme === 'dark'
                    ? 'border-slate-800 text-slate-400 bg-slate-950/40 hover:bg-slate-900'
                    : preferencesStore.theme === 'sepia'
                    ? 'border-amber-200/60 text-amber-905 bg-[#fffdf0]/50 hover:bg-amber-50/50'
                    : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50',
                ]"
              >
                <div class="w-8 h-8 rounded-full bg-slate-900 border border-slate-950 shadow-sm flex items-center justify-center">
                  <i class="fa-solid fa-moon text-quran-gold"></i>
                </div>
                <span>{{ t('dark') }}</span>
              </button>
            </div>
          </div>

          <!-- Font Size Adjuster slider -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">{{ t('arabicFontSize') }}</label>
              <span class="text-xs font-bold">{{ Math.round((preferencesStore.fontSizeFactor - 1.4) * 50) + 50 }}%</span>
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="adjustFontSize(-0.2)"
                class="w-8 h-8 rounded-lg bg-quran-bg border hover:bg-gray-200 flex items-center justify-center font-bold text-sm transition-all cursor-pointer text-quran-deep"
              >
                -
              </button>
              <input
                type="range"
                min="1.6"
                max="3.6"
                step="0.2"
                v-model.number="fontSizeFactorComputed"
                class="flex-grow accent-quran-medium h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
              <button
                @click="adjustFontSize(0.2)"
                class="w-8 h-8 rounded-lg bg-quran-bg border hover:bg-gray-200 flex items-center justify-center font-bold text-sm transition-all cursor-pointer text-quran-deep"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Section 2: Preferensi Konten -->
        <div class="themed-card rounded-2xl p-6 shadow-sm space-y-5">
          <h2 class="font-bold text-base border-b border-gray-100/50 pb-2 flex items-center gap-2">
            <i class="fa-solid fa-book-open text-quran-gold"></i> {{ t('readingAndAudioPref') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Content Visibility Toggles -->
            <div class="space-y-3">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">{{ t('defaultDisplay') }}</label>
              <div class="space-y-3">
                <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    v-model="showTransliterationComputed"
                    class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30"
                  />
                  <span>{{ t('showTransliteration') }}</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    v-model="showTranslationComputed"
                    class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30"
                  />
                  <span>{{ t('showTranslation') }}</span>
                </label>
              </div>
            </div>

            <!-- Language Switcher Option -->
            <div class="space-y-2.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">{{ t('appLanguage') }}</label>
              <div class="flex gap-2">
                <button
                  @click="preferencesStore.setLanguage('id')"
                  class="flex-grow py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer"
                  :class="[
                    preferencesStore.language === 'id'
                      ? 'border-quran-medium bg-quran-accent/5 text-quran-deep'
                      : preferencesStore.theme === 'dark'
                      ? 'border-slate-800 text-slate-400 bg-slate-950/40 hover:bg-slate-900'
                      : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50',
                  ]"
                >
                  Bahasa Indonesia
                </button>
                <button
                  @click="preferencesStore.setLanguage('en')"
                  class="flex-grow py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer"
                  :class="[
                    preferencesStore.language === 'en'
                      ? 'border-quran-medium bg-quran-accent/5 text-quran-deep'
                      : preferencesStore.theme === 'dark'
                      ? 'border-slate-800 text-slate-400 bg-slate-950/40 hover:bg-slate-900'
                      : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50',
                  ]"
                >
                  English
                </button>
              </div>
              <p class="text-[10px] text-gray-400 italic font-medium leading-tight">
                {{ t('appLanguageDesc') }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <!-- Qari Selector -->
            <div class="space-y-2.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">{{ t('qariSelection') }}</label>
              <select
                v-model="selectedQariComputed"
                class="w-full border rounded-xl text-xs font-bold p-3 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light cursor-pointer transition-colors"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-955 border-slate-800 text-white'
                    : preferencesStore.theme === 'sepia'
                    ? 'bg-[#fffdf0] border-amber-200/60 text-amber-955'
                    : 'bg-quran-bg border-gray-200 text-quran-deep'
                "
              >
                <option value="ar.alafasy">Syaikh Mishary Rashid Alafasy</option>
                <option value="ar.sudais">Syaikh Abdurrahman As-Sudais</option>
                <option value="ar.mahermuaiqly">Syaikh Maher Al-Muaiqly</option>
                <option value="ar.abdullahbasfar">Syaikh Abdullah Basfar</option>
              </select>
            </div>

            <!-- City Shalat Selector -->
            <div class="space-y-2.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block">{{ t('selectCity') }}</label>
              <select
                v-model="selectedCityComputed"
                class="w-full border rounded-xl text-xs font-bold p-3 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light cursor-pointer transition-colors"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-955 border-slate-800 text-white'
                    : preferencesStore.theme === 'sepia'
                    ? 'bg-[#fffdf0] border-amber-200/60 text-amber-955'
                    : 'bg-quran-bg border-gray-200 text-quran-deep'
                "
              >
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 3: Reset Data -->
        <div class="themed-card rounded-2xl p-6 shadow-sm space-y-4">
          <h2 class="font-bold text-base border-b border-gray-100/50 pb-2 flex items-center gap-2">
            <i class="fa-solid fa-trash-can text-red-500"></i> {{ t('resetData') }}
          </h2>
          <p class="text-xs text-gray-400 leading-relaxed">
            {{ preferencesStore.language === 'en' ? 'This action will wipe all layout preferences, chosen prayer time city, default Qari, reading history, and your saved bookmarks. This cannot be undone.' : 'Tindakan ini akan menghapus semua preferensi tampilan, pilihan kota shalat, Qari default, riwayat bacaan terakhir, dan seluruh daftar bookmark ayat Anda. Data tidak dapat dipulihkan kembali.' }}
          </p>
          <button
            @click="resetApplication"
            class="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer border-none"
          >
            <i class="fa-solid fa-trash-arrow-up"></i>
            {{ preferencesStore.language === 'en' ? 'Reset App Data & Cache' : 'Hapus Seluruh Data & Cache' }}
          </button>
        </div>
      </div>

      <!-- Right 1 Column: Bookmarks List -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Bookmark card header -->
        <div class="themed-card rounded-2xl p-5 shadow-sm">
          <h4 class="text-xs uppercase tracking-wider font-bold text-quran-medium mb-4 flex items-center gap-1.5 border-b border-gray-100/50 pb-2">
            <i class="fa-solid fa-bookmark text-quran-gold"></i>
            {{ preferencesStore.language === 'en' ? 'Favorite Verses / Bookmarks' : 'Ayat Favorit / Bookmark' }}
          </h4>

          <div v-if="bookmarksStore.bookmarks.length === 0" class="text-center py-10">
            <i class="fa-solid fa-box-open text-gray-300 text-4xl mb-3"></i>
            <p class="text-xs text-gray-400 font-semibold italic">
              {{ preferencesStore.language === 'en' ? 'No bookmarks saved yet' : 'Belum ada ayat yang disimpan' }}
            </p>
          </div>

          <div v-else class="flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto pr-1">
            <div
              v-for="b in bookmarksStore.bookmarks"
              :key="b.id"
              class="border p-3 rounded-xl flex items-center justify-between gap-3 group transition-all"
              :class="
                preferencesStore.theme === 'dark'
                  ? 'bg-slate-950/40 border-slate-800/80 hover:border-quran-gold/40'
                  : preferencesStore.theme === 'sepia'
                  ? 'bg-amber-50/40 border-amber-200/40 hover:border-amber-400'
                  : 'bg-quran-bg/50 border-gray-100/60 hover:border-quran-medium/30'
              "
            >
              <router-link :to="'/read/' + b.surahNumber + '?ayah=' + b.verseNumber" class="flex-grow min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <h5
                    class="font-bold text-xs leading-none transition-colors"
                    :class="
                      preferencesStore.theme === 'dark'
                        ? 'text-slate-100 group-hover:text-quran-gold'
                        : preferencesStore.theme === 'sepia'
                        ? 'text-amber-955 group-hover:text-amber-700'
                        : 'text-quran-deep group-hover:text-quran-medium'
                    "
                  >
                    {{ b.surahName }}
                  </h5>
                  <span class="font-arabic text-sm text-quran-medium">{{ b.surahArabic }}</span>
                </div>
                <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {{ preferencesStore.language === 'en' ? 'Ayah' : 'Ayat' }} {{ b.verseNumber }}
                </span>
              </router-link>
              <button
                @click="bookmarksStore.removeBookmark(b.id)"
                class="text-gray-400 hover:text-red-500 text-xs p-1 transition-colors cursor-pointer border-none bg-transparent"
                :title="t('removeBookmark')"
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

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePreferencesStore } from "../stores/preferences";
import { useBookmarksStore } from "../stores/bookmarks";
import { useI18n } from "../composables/useI18n";

const router = useRouter();
const preferencesStore = usePreferencesStore();
const bookmarksStore = useBookmarksStore();
const { t } = useI18n();

const cities = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Makassar",
  "Semarang",
  "Yogyakarta",
  "Palembang",
  "Samarinda",
  "Pekanbaru",
  "Denpasar",
  "Banjarmasin",
  "Malang",
  "Depok",
];

// Computed bindings to sync with preferencesStore actions
const fontSizeFactorComputed = computed({
  get: () => preferencesStore.fontSizeFactor,
  set: (val) => preferencesStore.setFontSizeFactor(val),
});

const showTransliterationComputed = computed({
  get: () => preferencesStore.showTransliteration,
  set: (val) => preferencesStore.setShowTransliteration(val),
});

const showTranslationComputed = computed({
  get: () => preferencesStore.showTranslation,
  set: (val) => preferencesStore.setShowTranslation(val),
});

const selectedQariComputed = computed({
  get: () => preferencesStore.selectedQari,
  set: (val) => preferencesStore.setSelectedQari(val),
});

const selectedCityComputed = computed({
  get: () => preferencesStore.selectedCity,
  set: (val) => preferencesStore.setSelectedCity(val),
});

const adjustFontSize = (step) => {
  preferencesStore.setFontSizeFactor(preferencesStore.fontSizeFactor + step);
};

const resetApplication = () => {
  if (confirm(t("resetWarning"))) {
    preferencesStore.clearAllData();
    bookmarksStore.clearBookmarks();
    router.push("/");
  }
};
</script>

<style scoped>
/* Styled natively using Tailwind CSS utility classes. */
</style>
