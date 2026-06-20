<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div
      v-if="isOpen"
      ref="backdropRef"
      class="fixed inset-0 bg-quran-deep/40 backdrop-blur-xs flex items-center justify-center z-[1000] p-4"
      @click.self="$emit('close')"
    >
      <div
        ref="panelRef"
        class="rounded-2xl w-full max-w-lg border-2 shadow-2xl flex flex-col max-h-[85vh]"
        :class="[
          preferencesStore.theme === 'dark'
            ? 'bg-slate-900 border-quran-gold text-slate-100'
            : (preferencesStore.theme === 'sepia'
                ? 'bg-[#fffcf3] border-amber-400 text-amber-950'
                : 'bg-white border-quran-gold text-quran-deep'),
        ]"
      >
        <!-- Modal Header -->
        <div
          class="px-6 py-4 flex justify-between items-center border-b-2 rounded-t-2xl"
          :class="[
            preferencesStore.theme === 'dark'
              ? 'bg-slate-900 text-white border-quran-gold'
              : (preferencesStore.theme === 'sepia'
                  ? 'bg-amber-900 text-amber-50 border-amber-450'
                  : 'bg-quran-deep text-white border-quran-gold'),
          ]"
        >
          <h3 class="font-bold text-base flex items-center gap-2">
            <i class="fa-solid fa-book-open text-quran-gold"></i>
            {{ title }}
          </h3>
          <button
            @click="$emit('close')"
            class="hover:text-quran-gold text-2xl font-light focus:outline-none transition-colors cursor-pointer"
            :class="
              preferencesStore.theme === 'sepia'
                ? 'text-amber-100 hover:text-amber-300'
                : 'text-white hover:text-quran-gold'
            "
          >
            &times;
          </button>
        </div>

        <!-- Modal Body -->
        <div
          class="p-6 overflow-y-auto text-sm leading-relaxed"
          :class="[
            preferencesStore.theme === 'dark'
              ? 'text-slate-300'
              : (preferencesStore.theme === 'sepia'
                  ? 'text-amber-900'
                  : 'text-quran-deep'),
          ]"
        >
          <!-- Tab Switcher for Verse Tafsir -->
          <div
            v-if="isVerseTafsir"
            class="flex border-b mb-5"
            :class="
              preferencesStore.theme === 'dark'
                ? 'border-slate-800'
                : (preferencesStore.theme === 'sepia'
                    ? 'border-amber-200/40'
                    : 'border-gray-100')
            "
          >
            <button
              @click="switchTab('wajiz')"
              class="flex-1 py-2 px-4 text-center font-semibold text-xs border-b-2 transition-all cursor-pointer focus:outline-none"
              :class="[
                tafsirTab === 'wajiz'
                  ? (preferencesStore.theme === 'dark'
                      ? 'text-quran-gold border-quran-gold font-bold'
                      : (preferencesStore.theme === 'sepia'
                          ? 'text-amber-800 border-amber-800 font-bold'
                          : 'text-quran-medium border-quran-medium font-bold'))
                  : (preferencesStore.theme === 'dark'
                      ? 'text-slate-500 border-transparent hover:text-slate-300'
                      : (preferencesStore.theme === 'sepia'
                          ? 'text-amber-900/40 border-transparent hover:text-amber-900/70'
                          : 'text-gray-400 border-transparent hover:text-quran-medium')),
              ]"
            >
              {{ t('tafsirWajiz') }}
            </button>
            <button
              @click="switchTab('tahlili')"
              class="flex-1 py-2 px-4 text-center font-semibold text-xs border-b-2 transition-all cursor-pointer focus:outline-none"
              :class="[
                tafsirTab === 'tahlili'
                  ? (preferencesStore.theme === 'dark'
                      ? 'text-quran-gold border-quran-gold font-bold'
                      : (preferencesStore.theme === 'sepia'
                          ? 'text-amber-800 border-amber-800 font-bold'
                          : 'text-quran-medium border-quran-medium font-bold'))
                  : (preferencesStore.theme === 'dark'
                      ? 'text-slate-500 border-transparent hover:text-slate-300'
                      : (preferencesStore.theme === 'sepia'
                          ? 'text-amber-900/40 border-transparent hover:text-amber-900/70'
                          : 'text-gray-400 border-transparent hover:text-quran-medium')),
              ]"
            >
              {{ t('tafsirTahlili') }}
            </button>
          </div>

          <!-- Translate Action Panel (Only shows when app is in English) -->
          <div
            v-if="preferencesStore.language === 'en' && hasOriginalText"
            class="mb-5 flex flex-col gap-2 p-3.5 rounded-xl border border-dashed transition-all"
            :class="
              preferencesStore.theme === 'dark'
                ? 'bg-slate-950/40 border-slate-800'
                : (preferencesStore.theme === 'sepia'
                    ? 'bg-amber-50/55 border-amber-250/30'
                    : 'bg-gray-50 border-gray-150')
            "
          >
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <span class="text-xs text-gray-400 font-semibold">
                {{ currentTranslatedText ? 'Exegesis translated to English.' : 'Exegesis is available in Indonesian.' }}
              </span>
              <button
                v-if="!currentTranslatedText && !translating"
                @click="translateText"
                class="bg-quran-medium hover:bg-quran-deep text-white font-bold px-3 py-1.5 rounded-lg text-[10.5px] transition-all flex items-center gap-1 cursor-pointer border-none"
              >
                <i class="fa-solid fa-globe text-xs"></i> {{ t('translateToEn') }}
              </button>
              <span v-else-if="translating" class="text-xs text-quran-medium flex items-center gap-1.5 font-bold">
                <i class="fa-solid fa-circle-notch animate-spin"></i> {{ t('translating') }}
              </span>
              <button
                v-else-if="translateError"
                @click="translateText"
                class="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10.5px] transition-all flex items-center gap-1 cursor-pointer border-none"
              >
                <i class="fa-solid fa-rotate text-xs"></i> Retry Translation
              </button>
              <span v-else class="text-[10px] text-gray-400 italic">
                Powered by MyMemory API
              </span>
            </div>
            <p v-if="translateError" class="text-[10.5px] text-red-500 font-bold mt-1">
              {{ t('translationFailed') }}
            </p>
          </div>

          <!-- Tafsir Content with crossfade -->
          <Transition :css="false" @enter="onContentEnter" @leave="onContentLeave" mode="out-in">
            <div :key="tafsirTab + (currentTranslatedText ? '-tr' : '-org')">
              <div class="whitespace-pre-line text-justify leading-relaxed">
                {{ currentTextToDisplay }}
              </div>
            </div>
          </Transition>

          <div
            class="mt-6 pt-3 border-t text-[10.5px] font-bold uppercase tracking-wider"
            :class="
              preferencesStore.theme === 'dark'
                ? 'border-slate-800 text-slate-500'
                : (preferencesStore.theme === 'sepia'
                    ? 'border-amber-200/40 text-amber-900/40'
                    : 'border-gray-100 text-gray-400')
            "
          >
            {{ t('tafsirSource') }}
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="px-6 py-4 border-t flex justify-end rounded-b-2xl"
          :class="[
            preferencesStore.theme === 'dark'
              ? 'bg-slate-900/40 border-slate-800'
              : (preferencesStore.theme === 'sepia'
                  ? 'bg-amber-100/20 border-amber-200/40'
                  : 'bg-quran-bg border-gray-100'),
          ]"
        >
          <button
            @click="$emit('close')"
            class="font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer text-white border-none"
            :class="[
              preferencesStore.theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700'
                : (preferencesStore.theme === 'sepia'
                    ? 'bg-amber-800 hover:bg-amber-900'
                    : 'bg-quran-medium hover:bg-quran-deep'),
            ]"
          >
            {{ preferencesStore.language === 'en' ? 'Close' : 'Tutup' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
// Global cache shared across all instances of TafsirModal
const translationCache = new Map();
</script>

<script setup>
import { ref, computed, nextTick, watch } from "vue";
import axios from "axios";
import { gsap } from "gsap";
import { usePreferencesStore } from "../stores/preferences";
import { useI18n } from "../composables/useI18n";
import { popIn, popOut } from "../composables/useGsap";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "",
  },
  isVerseTafsir: {
    type: Boolean,
    default: false,
  },
  tafsirWajiz: {
    type: String,
    default: "",
  },
  tafsirTahlili: {
    type: String,
    default: "",
  },
});

defineEmits(["close"]);

const preferencesStore = usePreferencesStore();
const { t } = useI18n();

const tafsirTab = ref("wajiz");
const backdropRef = ref(null);
const panelRef = ref(null);

// Translation local states
const translatedWajiz = ref("");
const translatedTahlili = ref("");
const translatedSurahText = ref("");
const translating = ref(false);
const translateError = ref(false);

// Shared translationCache is imported at module scope above

// Helper to decode HTML entities returned by MyMemory
const decodeHtmlEntities = (html) => {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Reset translation states when modal opens/closes
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    translatedWajiz.value = "";
    translatedTahlili.value = "";
    translatedSurahText.value = "";
    translating.value = false;
    translateError.value = false;
    tafsirTab.value = "wajiz";
  }
});

const hasOriginalText = computed(() => {
  if (props.isVerseTafsir) {
    return tafsirTab.value === "wajiz" ? !!props.tafsirWajiz : !!props.tafsirTahlili;
  }
  return !!props.text;
});

const currentTranslatedText = computed(() => {
  if (props.isVerseTafsir) {
    return tafsirTab.value === "wajiz" ? translatedWajiz.value : translatedTahlili.value;
  }
  return translatedSurahText.value;
});

const currentTextToDisplay = computed(() => {
  if (preferencesStore.language === "en" && currentTranslatedText.value) {
    return currentTranslatedText.value;
  }
  if (props.isVerseTafsir) {
    return tafsirTab.value === "wajiz" ? props.tafsirWajiz : props.tafsirTahlili;
  }
  return props.text;
});

const splitIntoChunks = (text, maxLength = 430) => {
  if (!text) return [];
  const paragraphs = text.split("\n");
  const chunks = [];

  const splitLongTextByWords = (str, maxLen) => {
    const words = str.split(" ");
    const subChunks = [];
    let current = "";
    for (const word of words) {
      if (!word) continue;
      if ((current + " " + word).trim().length <= maxLen) {
        current = current ? current + " " + word : word;
      } else {
        if (current) {
          subChunks.push(current);
        }
        if (word.length > maxLen) {
          let remainingWord = word;
          while (remainingWord.length > maxLen) {
            subChunks.push(remainingWord.slice(0, maxLen));
            remainingWord = remainingWord.slice(maxLen);
          }
          current = remainingWord;
        } else {
          current = word;
        }
      }
    }
    if (current) {
      subChunks.push(current);
    }
    return subChunks;
  };

  for (const para of paragraphs) {
    if (!para.trim()) {
      chunks.push({ text: "\n", isNewline: true });
      continue;
    }

    if (para.length <= maxLength) {
      chunks.push({ text: para, isNewline: false });
    } else {
      // Split paragraph into sentences by punctuation (.?! followed by space) without discarding any characters
      const sentences = para.split(/(?<=[.!?])\s+/);
      let currentChunk = "";

      for (const sentence of sentences) {
        if (sentence.length > maxLength) {
          if (currentChunk) {
            chunks.push({ text: currentChunk, isNewline: false });
            currentChunk = "";
          }
          const subChunks = splitLongTextByWords(sentence, maxLength);
          for (const sub of subChunks) {
            chunks.push({ text: sub, isNewline: false });
          }
        } else if ((currentChunk + (currentChunk ? " " : "") + sentence).length <= maxLength) {
          currentChunk = currentChunk ? currentChunk + " " + sentence : sentence;
        } else {
          if (currentChunk) {
            chunks.push({ text: currentChunk, isNewline: false });
          }
          currentChunk = sentence;
        }
      }
      if (currentChunk) {
        chunks.push({ text: currentChunk, isNewline: false });
      }
    }
  }
  return chunks;
};

const translateText = async () => {
  let textToTranslate = "";
  let targetRef = null;

  if (props.isVerseTafsir) {
    if (tafsirTab.value === "wajiz") {
      textToTranslate = props.tafsirWajiz;
      targetRef = translatedWajiz;
    } else {
      textToTranslate = props.tafsirTahlili;
      targetRef = translatedTahlili;
    }
  } else {
    textToTranslate = props.text;
    targetRef = translatedSurahText;
  }

  if (!textToTranslate) return;

  // Check cache
  if (translationCache.has(textToTranslate)) {
    targetRef.value = translationCache.get(textToTranslate);
    return;
  }

  translating.value = true;
  translateError.value = false;

  try {
    const chunks = splitIntoChunks(textToTranslate, 430);

    // Call translation API for each chunk sequentially to prevent hitting public rate limits (429)
    const translatedChunks = [];
    for (const chunk of chunks) {
      if (chunk.isNewline) {
        translatedChunks.push("\n");
        continue;
      }
      const response = await axios.get("https://api.mymemory.translated.net/get", {
        params: {
          q: chunk.text,
          langpair: "id|en",
        },
        timeout: 20000,
      });

      if (
        response.data &&
        response.data.responseData &&
        response.data.responseData.translatedText
      ) {
        translatedChunks.push(decodeHtmlEntities(response.data.responseData.translatedText));
      } else {
        throw new Error("Translation payload error");
      }
    }

    // Reconstruct the translated paragraphs
    let result = "";
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i].isNewline) {
        result += "\n";
      } else {
        if (result && !result.endsWith("\n") && !result.endsWith(" ")) {
          result += " ";
        }
        result += translatedChunks[i];
      }
    }

    const finalResult = result.trim();
    targetRef.value = finalResult;
    translationCache.set(textToTranslate, finalResult);
  } catch (err) {
    console.error("Translation API failure:", err);
    translateError.value = true;
  } finally {
    translating.value = false;
  }
};

// ── Modal enter / leave ────────────────────────────────────────────────────
const onEnter = (el, done) => {
  nextTick(() => {
    const backdrop = el;
    const panel = el.querySelector("[data-panel]") || panelRef.value;

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });

    if (panel) {
      popIn(panel);
      gsap.delayedCall(0.45, done);
    } else {
      done();
    }
  });
};

const onLeave = (el, done) => {
  const panel = panelRef.value;
  gsap.to(el, { opacity: 0, duration: 0.2, ease: "power2.in" });
  if (panel) {
    popOut(panel, done);
  } else {
    done();
  }
};

// ── Tab content crossfade ──────────────────────────────────────────────────
const onContentEnter = (el, done) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.2, ease: "power2.out", onComplete: done }
  );
};

const onContentLeave = (el, done) => {
  gsap.to(el, { opacity: 0, y: -6, duration: 0.14, ease: "power2.in", onComplete: done });
};

// ── Tab switch ────────────────────────────────────────────────────────────
const switchTab = (tab) => {
  tafsirTab.value = tab;
};
</script>

<style scoped>
/* Styled natively via Tailwind utilities */
</style>
