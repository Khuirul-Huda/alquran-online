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
      window.dispatchEvent(new Event("theme-changed"));
    },
    removeBookmark(id) {
      this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
      localStorage.setItem("quran_bookmarks", JSON.stringify(this.bookmarks));
      window.dispatchEvent(new Event("theme-changed"));
    },
    isBookmarked(surahNumber, verseNumber) {
      return this.bookmarks.some(
        (b) => b.surahNumber === surahNumber && b.verseNumber === verseNumber
      );
    },
    clearBookmarks() {
      this.bookmarks = [];
      localStorage.setItem("quran_bookmarks", JSON.stringify([]));
      window.dispatchEvent(new Event("theme-changed"));
    },
  },
});
