<template>
  <div
    class="sticky top-[70px] md:top-[85px] z-30 rounded-2xl p-3 flex flex-col gap-3 transition-all duration-300 themed-card shadow-sm border border-gray-100/10"
  >
    <!-- Compact Toolbar (Always visible) -->
    <div class="flex items-center justify-between w-full">
      <!-- Jump To Ayat Dropdown -->
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400"
          >Lompat Ke:</span
        >
        <select
          @change="onJumpSelect($event.target.value)"
          class="bg-quran-bg border border-gray-200 rounded-lg text-xs font-bold p-1.5 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light cursor-pointer text-quran-deep"
        >
          <option value="" disabled selected>Ayat...</option>
          <option
            v-for="(v, index) in verses"
            :key="isJuzView ? v.number.inQuran : v.number.inSurah"
            :value="isJuzView ? v.number.inQuran : v.number.inSurah"
          >
            <template v-if="isJuzView">
              Ayat {{ index + 1 }} ({{ getVerseLabel ? getVerseLabel(v.number.inQuran) : '' }})
            </template>
            <template v-else>
              Ayat {{ v.number.inSurah }}
            </template>
          </option>
        </select>
      </div>

      <!-- Settings Toggle Button (Gear Icon) -->
      <button
        @click="showCustomSettings = !showCustomSettings"
        class="w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer shadow-sm hover:scale-105"
        :class="
          showCustomSettings
            ? 'bg-quran-medium text-white border-quran-medium'
            : preferencesStore.theme === 'dark'
            ? 'bg-slate-800 border-slate-700 text-slate-300'
            : 'bg-quran-bg border-gray-200 text-quran-deep'
        "
        title="Pengaturan Tampilan"
      >
        <i
          class="fa-solid fa-gear text-sm transition-transform duration-300"
          :class="{ 'rotate-45': showCustomSettings }"
        ></i>
      </button>
    </div>

    <!-- Customization Settings Container (Expandable, hidden by default) -->
    <div
      v-if="showCustomSettings"
      class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-dashed transition-all duration-300 animate-slide-down"
      :class="
        preferencesStore.theme === 'dark'
          ? 'border-slate-800'
          : 'border-gray-155'
      "
    >
      <!-- Arabic Size Adjusters -->
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400"
          >Ukuran Teks:</span
        >
        <div class="flex items-center gap-1">
          <button
            @click="decreaseFontSize"
            class="w-7 h-7 bg-quran-bg hover:bg-quran-accent/20 border border-gray-200 text-quran-deep rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
          >
            -
          </button>
          <span
            class="text-xs font-bold w-10 text-center"
            :class="
              preferencesStore.theme === 'dark'
                ? 'text-white'
                : 'text-quran-deep'
            "
          >
            {{ Math.round((preferencesStore.fontSizeFactor - 1.4) * 50) + 50 }}%
          </span>
          <button
            @click="increaseFontSize"
            class="w-7 h-7 bg-quran-bg hover:bg-quran-accent/20 border border-gray-200 text-quran-deep rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <!-- View Mode Toggles -->
      <div
        class="flex items-center gap-4 text-xs font-semibold"
        :class="
          preferencesStore.theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
        "
      >
        <label class="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            v-model="showTransliteration"
            class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30"
          />
          <span>Transliterasi</span>
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            v-model="showTranslation"
            class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30"
          />
          <span>Terjemahan</span>
        </label>
      </div>

      <!-- Theme Toggles -->
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400"
          >Tema:</span
        >
        <div class="flex gap-1.5">
          <button
            @click="preferencesStore.setTheme('light')"
            class="w-6 h-6 rounded-full bg-white border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
            :class="{
              'ring-2 ring-quran-medium ring-offset-1':
                preferencesStore.theme === 'light',
            }"
            title="Mode Terang"
          ></button>
          <button
            @click="preferencesStore.setTheme('sepia')"
            class="w-6 h-6 rounded-full bg-[#fffdf0] border border-amber-300 hover:scale-110 transition-transform cursor-pointer"
            :class="{
              'ring-2 ring-quran-medium ring-offset-1':
                preferencesStore.theme === 'sepia',
            }"
            title="Mode Sepia"
          ></button>
          <button
            @click="preferencesStore.setTheme('dark')"
            class="w-6 h-6 rounded-full bg-slate-900 border border-slate-950 hover:scale-110 transition-transform cursor-pointer"
            :class="{
              'ring-2 ring-quran-medium ring-offset-1':
                preferencesStore.theme === 'dark',
            }"
            title="Mode Malam"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePreferencesStore } from "../stores/preferences";

defineProps({
  verses: {
    type: Array,
    required: true,
  },
  isJuzView: {
    type: Boolean,
    default: false,
  },
  getVerseLabel: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(["jump"]);

const preferencesStore = usePreferencesStore();
const showCustomSettings = ref(false);

const showTranslation = computed({
  get: () => preferencesStore.showTranslation,
  set: (val) => preferencesStore.setShowTranslation(val),
});

const showTransliteration = computed({
  get: () => preferencesStore.showTransliteration,
  set: (val) => preferencesStore.setShowTransliteration(val),
});

const decreaseFontSize = () => {
  preferencesStore.setFontSizeFactor(preferencesStore.fontSizeFactor - 0.2);
};

const increaseFontSize = () => {
  preferencesStore.setFontSizeFactor(preferencesStore.fontSizeFactor + 0.2);
};

const onJumpSelect = (val) => {
  emit("jump", val);
};
</script>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-down {
  animation: slideDown 0.2s ease-out forwards;
}
</style>
