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
                ? 'bg-[#fffcf3] border-amber-455 text-amber-950'
                : 'bg-white border-quran-gold text-quran-deep'),
        ]"
      >
        <!-- Modal Header -->
        <div
          class="px-6 py-4 flex justify-between items-center border-b-2 rounded-t-2xl"
          :class="[
            preferencesStore.theme === 'dark'
              ? 'bg-slate-950 text-white border-quran-gold'
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
              Tafsir Wajiz (Ringkas)
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
              Tafsir Tahlili (Lengkap)
            </button>
          </div>

          <!-- Tafsir Content with crossfade -->
          <Transition :css="false" @enter="onContentEnter" @leave="onContentLeave" mode="out-in">
            <div :key="tafsirTab">
              <p v-if="!isVerseTafsir" class="whitespace-pre-line text-justify">
                {{ text }}
              </p>
              <div v-else>
                <div
                  v-if="tafsirTab === 'wajiz'"
                  class="whitespace-pre-line text-justify leading-relaxed"
                >
                  {{ tafsirWajiz }}
                </div>
                <div v-else class="whitespace-pre-line text-justify leading-relaxed">
                  {{ tafsirTahlili }}
                </div>
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
            Sumber Tafsir: Kemenag RI (Kementerian Agama Republik Indonesia)
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="px-6 py-4 border-t flex justify-end rounded-b-2xl"
          :class="[
            preferencesStore.theme === 'dark'
              ? 'bg-slate-950/40 border-slate-800'
              : (preferencesStore.theme === 'sepia'
                  ? 'bg-amber-100/20 border-amber-200/40'
                  : 'bg-quran-bg border-gray-100'),
          ]"
        >
          <button
            @click="$emit('close')"
            class="font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer text-white"
            :class="[
              preferencesStore.theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700'
                : (preferencesStore.theme === 'sepia'
                    ? 'bg-amber-800 hover:bg-amber-900'
                    : 'bg-quran-medium hover:bg-quran-deep'),
            ]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { gsap } from "gsap";
import { usePreferencesStore } from "../stores/preferences";
import { popIn, popOut, fadeIn, fadeOut } from "../composables/useGsap";

defineProps({
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
const tafsirTab = ref("wajiz");

const backdropRef = ref(null);
const panelRef = ref(null);

// ── Modal enter / leave ────────────────────────────────────────────────────
const onEnter = (el, done) => {
  nextTick(() => {
    const backdrop = el;
    const panel = el.querySelector("[data-panel]") || panelRef.value;

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });

    if (panel) {
      popIn(panel);
      // popIn's own onComplete isn't exposed, so signal done after its duration
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
  gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out", onComplete: done });
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
/* Styles handled via Tailwind utilities */
</style>
