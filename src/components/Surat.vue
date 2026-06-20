<template>
  <router-link :to="'/read/' + ke" class="surah-card">
    <!-- Top Row: Surah Number and Arabic Name -->
    <div class="card-top">
      <span class="surah-badge">{{ ke }}</span>
      <span class="arabic-title">{{ arabic }}</span>
    </div>

    <!-- Bottom Row: Indonesian Name, Translation, and Metadata -->
    <div class="card-bottom">
      <h3 class="surah-name-id">{{ surat }}</h3>
      <p class="surah-translation">{{ arti }}</p>
      <div class="surah-meta-row">
        <span class="meta-item">
          <i class="fa-solid fa-book-open"></i> {{ verses }} Ayat
        </span>
        <span class="meta-item">
          <i class="fa-solid fa-location-dot"></i> {{ formatRevelation(revelation) }}
        </span>
      </div>
    </div>
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
      // Capitalize first letter
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    },
  },
};
</script>

<style scoped>
/* All card styling is now managed by the central design system in index.css,
   which ensures global consistency and clean, performant CSS delivery. */
</style>
