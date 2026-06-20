import { defineStore } from "pinia";

export const usePreferencesStore = defineStore("preferences", {
  state: () => ({
    theme: localStorage.getItem("quran_pref_theme") || "light",
    fontSizeFactor: parseFloat(
      localStorage.getItem("quran_pref_font_factor") || "2.2"
    ),
    showTranslation:
      (localStorage.getItem("quran_pref_show_translation") || "true") === "true",
    showTransliteration:
      (localStorage.getItem("quran_pref_show_transliteration") || "true") ===
      "true",
    selectedQari: localStorage.getItem("quran_pref_qari") || "ar.alafasy",
    selectedCity: localStorage.getItem("sholat_city") || "Jakarta",
    lastRead: (() => {
      const saved = localStorage.getItem("lastReadSurah");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse last read progress:", e);
        }
      }
      return null;
    })(),
  }),
  actions: {
    /**
     * Change the active reading theme and apply it to the document body.
     * Dispatches "theme-changed" so any non-Pinia listeners can react.
     */
    setTheme(newTheme) {
      this.theme = newTheme;
      localStorage.setItem("quran_pref_theme", newTheme);
      document.body.className = "theme-" + newTheme;
      window.dispatchEvent(new Event("theme-changed"));
    },

    /**
     * Adjust the Arabic font size factor (clamps between 1.6–3.8).
     * Dispatches "theme-changed" so any non-Pinia listeners can react.
     */
    setFontSizeFactor(factor) {
      const parsed = parseFloat(factor);
      if (parsed >= 1.6 && parsed <= 3.8) {
        this.fontSizeFactor = parsed;
        localStorage.setItem("quran_pref_font_factor", String(parsed));
        window.dispatchEvent(new Event("theme-changed"));
      }
    },

    /**
     * Toggle showing the Indonesian translation under each verse.
     * Dispatches "theme-changed" so any non-Pinia listeners can react.
     */
    setShowTranslation(value) {
      this.showTranslation = !!value;
      localStorage.setItem(
        "quran_pref_show_translation",
        String(this.showTranslation)
      );
      window.dispatchEvent(new Event("theme-changed"));
    },

    /**
     * Toggle showing the Latin transliteration under each verse.
     * Dispatches "theme-changed" so any non-Pinia listeners can react.
     */
    setShowTransliteration(value) {
      this.showTransliteration = !!value;
      localStorage.setItem(
        "quran_pref_show_transliteration",
        String(this.showTransliteration)
      );
      window.dispatchEvent(new Event("theme-changed"));
    },

    /** Persist the selected Qari (reciter) slug. */
    setSelectedQari(qari) {
      this.selectedQari = qari;
      localStorage.setItem("quran_pref_qari", qari);
    },

    /** Persist the selected city for prayer-time lookups. */
    setSelectedCity(city) {
      this.selectedCity = city;
      localStorage.setItem("sholat_city", city);
    },

    /** Persist the last-read verse position so the user can resume. */
    saveProgress({ number, name, arabic, lastAyah, verseCount }) {
      const progress = {
        number,
        name,
        arabic,
        lastAyah,
        verseCount,
        timestamp: Date.now(),
      };
      this.lastRead = progress;
      localStorage.setItem("lastReadSurah", JSON.stringify(progress));
    },

    /** Wipe all user preferences and restore defaults. */
    clearAllData() {
      localStorage.clear();
      this.theme = "light";
      this.fontSizeFactor = 2.2;
      this.showTranslation = true;
      this.showTransliteration = true;
      this.selectedQari = "ar.alafasy";
      this.selectedCity = "Jakarta";
      this.lastRead = null;
      document.body.className = "theme-light";
      window.dispatchEvent(new Event("theme-changed"));
    },
  },
});
