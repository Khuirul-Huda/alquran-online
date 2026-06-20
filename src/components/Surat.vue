<template>
  <router-link :to="'/read/' + ke" class="themed-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-quran-gold/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full group">
    <!-- Top Row: Surah Number and Arabic Name -->
    <div class="flex justify-between items-start mb-4">
      <span 
        class="font-bold w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-all duration-300"
        :class="[
          theme === 'dark' 
            ? 'bg-slate-800 border-slate-700 text-quran-gold group-hover:bg-quran-gold group-hover:text-slate-900 group-hover:border-quran-gold' 
            : (theme === 'sepia' 
                ? 'bg-amber-100/50 border-amber-200/60 text-amber-950 group-hover:bg-amber-850 group-hover:text-amber-50 group-hover:border-amber-850' 
                : 'bg-quran-bg border-quran-gold-light text-quran-deep group-hover:bg-quran-gold-light group-hover:border-quran-gold')
        ]"
      >
        {{ ke }}
      </span>
      <span 
        class="font-arabic text-2xl font-bold transition-colors duration-300"
        :class="[
          theme === 'dark' 
            ? 'text-quran-gold-light group-hover:text-white' 
            : (theme === 'sepia' 
                ? 'text-amber-900 group-hover:text-amber-950' 
                : 'text-quran-medium group-hover:text-quran-deep')
        ]"
      >
        {{ arabic }}
      </span>
    </div>

    <!-- Bottom Row: Indonesian Name, Translation, and Metadata -->
    <div>
      <h3 
        class="font-bold text-base transition-colors duration-200 leading-tight"
        :class="[
          theme === 'dark' 
            ? 'text-white group-hover:text-quran-gold' 
            : (theme === 'sepia' 
                ? 'text-amber-950 group-hover:text-amber-800' 
                : 'text-quran-deep group-hover:text-quran-medium')
        ]"
      >
        {{ surat }}
      </h3>
      <p 
        class="text-xs font-medium italic mt-0.5 mb-3 line-clamp-1"
        :class="theme === 'dark' ? 'text-slate-400' : (theme === 'sepia' ? 'text-amber-900/60' : 'text-gray-500')"
      >
        ({{ arti }})
      </p>
      
      <!-- Meta Information Row -->
      <div 
        class="flex gap-4 text-xs font-medium border-t pt-3"
        :class="theme === 'dark' ? 'border-slate-800 text-slate-400' : (theme === 'sepia' ? 'border-amber-200/40 text-amber-900/50' : 'border-gray-100/80 text-gray-400')"
      >
        <span class="flex items-center gap-1.5">
          <i class="fa-solid fa-book-open text-quran-gold/80 text-[10px]"></i>
          <span>{{ verses }} {{ preferencesStore.language === 'en' ? 'Verses' : 'Ayat' }}</span>
        </span>
        <span class="flex items-center gap-1.5">
          <i class="fa-solid fa-location-dot text-quran-gold/80 text-[10px]"></i>
          <span>{{ formatRevelation(revelation) }}</span>
        </span>
      </div>
    </div>

    <!-- Hover Solid Bottom Accent Bar -->
    <div class="absolute bottom-0 left-0 w-0 h-1 bg-quran-gold transition-all duration-300 group-hover:w-full"></div>
  </router-link>
</template>

<script>
import { usePreferencesStore } from "../stores/preferences";

export default {
  name: "Surat",
  props: {
    surat: {
      type: String,
      required: true,
    },
    arabic: {
      type: String,
      required: true,
    },
    arti: {
      type: String,
      required: true,
    },
    revelation: {
      type: String,
      required: true,
    },
    verses: {
      type: Number,
      required: true,
    },
    ke: {
      type: Number,
      required: true,
    },
    theme: {
      type: String,
      default: "light"
    }
  },
  computed: {
    preferencesStore() {
      return usePreferencesStore();
    }
  },
  methods: {
    formatRevelation(val) {
      if (!val) return "";
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    },
  },
};
</script>

<style scoped>
/* Scoped styles are not needed here since card details are completely handled via Tailwind CSS classes. */
</style>
