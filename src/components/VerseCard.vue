<template>
  <div
    :id="isJuzView ? 'verse-' + verse.number.inQuran : 'verse-' + verse.number.inSurah"
    class="themed-card rounded-2xl p-6 md:p-8 transition-all duration-300 relative group flex flex-col"
    :class="{
      'active-verse': isActiveAudio,
      'pulse-highlight-verse': isHighlighted,
    }"
  >
    <!-- Highlight bar left (only for active playing verse) -->
    <div
      class="absolute left-0 top-0 h-full w-1 bg-quran-light opacity-30 rounded-l-2xl transition-all"
      :class="{ '!bg-quran-gold !opacity-100 !w-1.5': isActiveAudio }"
    ></div>

    <!-- Verse Top Controls -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-2">
        <span
          class="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border transition-all"
          :class="
            isActiveAudio
              ? 'bg-quran-gold-light border-quran-gold text-quran-deep'
              : preferencesStore.theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-slate-300'
              : 'bg-quran-bg border-quran-gold-light text-quran-deep'
          "
        >
          {{ verse.number.inSurah }}
        </span>
        <span
          v-if="surahName"
          class="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest"
        >
          {{ surahName }}
        </span>
      </div>

      <div class="flex gap-2">
        <!-- Bookmark Button -->
        <button
          @click="$emit('toggle-bookmark', verse)"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
          :class="[
            isBookmarked
              ? 'bg-quran-gold text-quran-deep border-quran-gold shadow-sm'
              : preferencesStore.theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100',
          ]"
          :title="isBookmarked ? 'Hapus Bookmark' : 'Tambah Bookmark'"
        >
          <i :class="isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'"></i>
        </button>

        <!-- Play Audio Button -->
        <button
          @click="$emit('toggle-audio', verse)"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
          :class="[
            isActiveAudio
              ? 'bg-quran-gold text-quran-deep border-quran-gold shadow-sm'
              : preferencesStore.theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100',
          ]"
          :title="isActiveAudio ? 'Pause' : 'Putar Audio'"
        >
          <i :class="isActiveAudio ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
        </button>

        <!-- Tafsir Ayat Button -->
        <button
          @click="$emit('show-tafsir', verse)"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
          :class="
            preferencesStore.theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100'
          "
          title="Tafsir Ayat"
        >
          <i class="fa-solid fa-book"></i>
        </button>
      </div>
    </div>

    <!-- Arabic script of the verse -->
    <div
      class="font-arabic text-right mb-5 leading-loose font-medium selection:bg-quran-accent/30"
      :class="
        preferencesStore.theme === 'dark'
          ? 'text-slate-100'
          : preferencesStore.theme === 'sepia'
          ? 'text-amber-955'
          : 'text-quran-deep'
      "
      :style="{
        fontSize: preferencesStore.fontSizeFactor + 'rem',
        lineHeight: preferencesStore.fontSizeFactor * 0.9 + 1,
      }"
      dir="rtl"
    >
      {{ verse.text.arab }}
    </div>

    <!-- Latin Transliteration of the verse -->
    <p
      v-if="preferencesStore.showTransliteration"
      class="text-sm font-medium italic mb-3 leading-relaxed"
      :class="
        preferencesStore.theme === 'dark'
          ? 'text-slate-300'
          : preferencesStore.theme === 'sepia'
          ? 'text-amber-900/90'
          : 'text-quran-medium/95'
      "
    >
      {{ verse.text.transliteration.en }}
    </p>

    <!-- Translation of the verse -->
    <p
      v-if="preferencesStore.showTranslation"
      class="text-sm font-normal leading-relaxed border-t pt-3"
      :class="
        preferencesStore.theme === 'dark'
          ? 'text-slate-400 border-slate-800'
          : preferencesStore.theme === 'sepia'
          ? 'text-amber-900/75 border-amber-200/30'
          : 'text-gray-600 border-gray-50'
      "
    >
      {{ verse.translation.id }}
    </p>
  </div>
</template>

<script setup>
import { usePreferencesStore } from "../stores/preferences";

defineProps({
  verse: {
    type: Object,
    required: true,
  },
  isJuzView: {
    type: Boolean,
    default: false,
  },
  surahName: {
    type: String,
    default: "",
  },
  isBookmarked: {
    type: Boolean,
    default: false,
  },
  isActiveAudio: {
    type: Boolean,
    default: false,
  },
  isHighlighted: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle-bookmark", "toggle-audio", "show-tafsir"]);

const preferencesStore = usePreferencesStore();
</script>

<style scoped>
/* Cascaded themed rules are mapped globally in index.css */
</style>
