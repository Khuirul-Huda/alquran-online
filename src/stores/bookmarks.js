import { defineStore } from "pinia";

export const useBookmarksStore = defineStore("bookmarks", {
  state: () => ({
    bookmarks: (() => {
      const saved = localStorage.getItem("quran_bookmarks");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse bookmarks:", e);
        }
      }
      return [];
    })(),
  }),
  actions: {
    /** Add a bookmark if it doesn't exist, or remove it if it does (toggle). */
    toggleBookmark({ surahNumber, surahName, surahArabic, verseNumber }) {
      const id = `${surahNumber}_${verseNumber}`;
      const idx = this.bookmarks.findIndex((b) => b.id === id);
      if (idx > -1) {
        this.bookmarks.splice(idx, 1);
      } else {
        this.bookmarks.push({
          id,
          surahNumber,
          surahName,
          surahArabic,
          verseNumber,
        });
      }
      localStorage.setItem("quran_bookmarks", JSON.stringify(this.bookmarks));
    },

    /** Remove a specific bookmark by its composite id (surahNumber_verseNumber). */
    removeBookmark(id) {
      this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
      localStorage.setItem("quran_bookmarks", JSON.stringify(this.bookmarks));
    },

    /** Returns true if the given surah/verse combination is bookmarked. */
    isBookmarked(surahNumber, verseNumber) {
      return this.bookmarks.some(
        (b) => b.surahNumber === surahNumber && b.verseNumber === verseNumber
      );
    },

    /** Remove all bookmarks. */
    clearBookmarks() {
      this.bookmarks = [];
      localStorage.setItem("quran_bookmarks", JSON.stringify([]));
    },
  },
});
