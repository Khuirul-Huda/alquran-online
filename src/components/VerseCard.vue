<template>
  <div
    :id="isJuzView ? 'verse-' + verse.number.inQuran : 'verse-' + verse.number.inSurah"
    ref="cardRef"
    class="themed-card rounded-2xl p-6 md:p-8 transition-colors duration-300 relative group flex flex-col"
    :class="{
      'active-verse': isActiveAudio,
      'pulse-highlight-verse': isHighlighted,
    }"
  >
    <!-- Highlight bar left (visible when active audio) -->
    <div
      v-if="isActiveAudio"
      class="absolute left-0 top-0 h-full w-1.5 bg-quran-gold rounded-l-2xl shadow-sm"
    ></div>

    <!-- Verse Top Controls -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-2">
        <span
          class="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border transition-all verse-number-badge"
          :class="{ 'active-badge': isActiveAudio }"
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
          ref="bookmarkBtnRef"
          @click="handleBookmark"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-colors duration-200 cursor-pointer verse-action-btn"
          :class="{ 'active-btn': isBookmarked }"
          :title="isBookmarked ? t('removeBookmark') : t('addBookmark')"
        >
          <i
            ref="bookmarkIconRef"
            :class="isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'"
          ></i>
        </button>

        <!-- Play Audio Button -->
        <button
          ref="audioBtnRef"
          @click="handleAudio"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-colors duration-200 cursor-pointer verse-action-btn"
          :class="{ 'active-btn': isActiveAudio }"
          :title="isActiveAudio && isPlaying ? t('pause') : t('playAudio')"
        >
          <i
            ref="audioIconRef"
            :class="isActiveAudio && isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
          ></i>
        </button>

        <!-- Tafsir Ayat Button -->
        <button
          ref="tafsirBtnRef"
          @click="handleTafsir"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-colors duration-200 cursor-pointer verse-action-btn"
          :title="t('verseTafsir')"
        >
          <i ref="tafsirIconRef" class="fa-solid fa-book"></i>
        </button>
      </div>
    </div>

    <!-- Arabic script of the verse -->
    <div
      class="font-arabic text-right mb-5 leading-loose font-medium selection:bg-quran-accent/30 verse-arabic-text"
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
      class="text-sm font-medium italic mb-3 leading-relaxed verse-transliteration"
    >
      {{ verse.text.transliteration.en }}
    </p>

    <!-- Translation of the verse -->
    <p
      v-if="preferencesStore.showTranslation"
      class="text-sm font-normal leading-relaxed border-t pt-3 verse-translation"
    >
      {{ preferencesStore.language === 'en' ? verse.translation.en : verse.translation.id }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { gsap } from "gsap";
import { usePreferencesStore } from "../stores/preferences";
import { useI18n } from "../composables/useI18n";
import { buttonPop, wiggle, spinPop } from "../composables/useGsap";

const { t } = useI18n();

const props = defineProps({
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
  isPlaying: {
    type: Boolean,
    default: false,
  },
  isHighlighted: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-bookmark", "toggle-audio", "show-tafsir"]);

const preferencesStore = usePreferencesStore();

// Template refs
const cardRef = ref(null);
const bookmarkBtnRef = ref(null);
const bookmarkIconRef = ref(null);
const audioBtnRef = ref(null);
const audioIconRef = ref(null);
const tafsirBtnRef = ref(null);
const tafsirIconRef = ref(null);

// ── Button handlers with GSAP micro-animations ─────────────────────────────
const handleBookmark = () => {
  emit("toggle-bookmark", props.verse);
  if (bookmarkIconRef.value) {
    if (!props.isBookmarked) {
      // Adding — elastic pop
      buttonPop(bookmarkIconRef.value);
    } else {
      // Removing — wiggle
      wiggle(bookmarkIconRef.value);
    }
  }
};

const handleAudio = () => {
  emit("toggle-audio", props.verse);
  if (audioIconRef.value) {
    buttonPop(audioIconRef.value);
  }
};

const handleTafsir = () => {
  emit("show-tafsir", props.verse);
  if (tafsirIconRef.value) {
    spinPop(tafsirIconRef.value);
  }
};

// ── Watch isHighlighted — flash the card background ───────────────────────
watch(
  () => props.isHighlighted,
  (highlighted) => {
    if (highlighted && cardRef.value) {
      gsap
        .timeline()
        .to(cardRef.value, {
          backgroundColor: "rgba(212, 175, 55, 0.18)",
          duration: 0.3,
          ease: "power2.out",
        })
        .to(cardRef.value, {
          backgroundColor: "rgba(212, 175, 55, 0.06)",
          duration: 0.4,
          repeat: 2,
          yoyo: true,
          ease: "power1.inOut",
        })
        .to(cardRef.value, {
          backgroundColor: "",
          duration: 0.5,
          clearProps: "backgroundColor",
        });
    }
  }
);
</script>

<style scoped>
/* Cascaded themed rules are mapped globally in index.css */
</style>
