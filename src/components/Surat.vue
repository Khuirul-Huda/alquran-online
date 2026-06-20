<template>
  <router-link :to="'/read/' + ke" class="themed-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-quran-gold/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full group">
    <!-- Top Row: Surah Number and Arabic Name -->
    <div class="flex justify-between items-start mb-4">
      <span class="bg-quran-bg text-quran-deep font-bold w-9 h-9 rounded-full flex items-center justify-center text-sm border border-quran-gold-light group-hover:bg-quran-gold-light group-hover:border-quran-gold transition-all duration-300">
        {{ ke }}
      </span>
      <span class="font-arabic text-2xl text-quran-medium font-bold group-hover:text-quran-deep transition-colors duration-300">
        {{ arabic }}
      </span>
    </div>

    <!-- Bottom Row: Indonesian Name, Translation, and Metadata -->
    <div>
      <h3 class="font-bold text-base text-quran-deep group-hover:text-quran-medium transition-colors duration-200 leading-tight">
        {{ surat }}
      </h3>
      <p class="text-xs text-gray-500 font-medium italic mt-0.5 mb-3 line-clamp-1">
        ({{ arti }})
      </p>
      
      <!-- Meta Information Row -->
      <div class="flex gap-4 text-xs text-gray-400 font-medium border-t border-gray-100/80 pt-3">
        <span class="flex items-center gap-1.5">
          <i class="fa-solid fa-book-open text-quran-gold/80 text-[10px]"></i>
          <span>{{ verses }} Ayat</span>
        </span>
        <span class="flex items-center gap-1.5">
          <i class="fa-solid fa-location-dot text-quran-gold/80 text-[10px]"></i>
          <span>{{ formatRevelation(revelation) }}</span>
        </span>
      </div>
    </div>

    <!-- Hover Gradient Bottom Accent Bar -->
    <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-quran-medium to-quran-gold transition-all duration-300 group-hover:w-full"></div>
  </router-link>
</template>

<script>
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
