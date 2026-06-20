import { ref, computed } from "vue";
import { usePreferencesStore } from "../stores/preferences";

// Global singleton state so audio doesn't double-play when navigating views
const activeVerse = ref(null);
const isPlaying = ref(false);
const audioInstance = ref(null);
const currentQari = ref("");
const versesList = ref([]);
const onNextCallback = ref(null);

export function useAudioPlayer() {
  const preferencesStore = usePreferencesStore();

  const activeVerseNumber = computed(
    () => activeVerse.value?.number.inQuran || null
  );
  const activeVerseInSurah = computed(
    () => activeVerse.value?.number.inSurah || null
  );

  const getQariName = (slug) => {
    const qariList = {
      "ar.alafasy": "Syaikh Mishary Rashid Alafasy",
      "ar.sudais": "Syaikh Abdurrahman As-Sudais",
      "ar.mahermuaiqly": "Syaikh Maher Al-Muaiqly",
      "ar.abdullahbasfar": "Syaikh Abdullah Basfar",
    };
    return qariList[slug] || "Syaikh Mishary Rashid Alafasy";
  };

  const getAudioUrl = (verse) => {
    const qari = preferencesStore.selectedQari;
    let url = verse.audio.primary;
    if (!url && verse.audio.secondary && verse.audio.secondary.length > 0) {
      url = verse.audio.secondary[0];
    }
    if (url) {
      return url.replace(/ar\.alafasy/g, qari);
    }
    return "";
  };

  const stopAudio = () => {
    if (audioInstance.value) {
      audioInstance.value.pause();
      audioInstance.value = null;
    }
    activeVerse.value = null;
    isPlaying.value = false;
  };

  const playNextVerse = () => {
    if (versesList.value.length === 0 || !activeVerse.value) {
      stopAudio();
      return;
    }
    const currentIndex = versesList.value.findIndex(
      (v) => v.number.inQuran === activeVerse.value.number.inQuran
    );
    if (currentIndex > -1 && currentIndex < versesList.value.length - 1) {
      const nextVerse = versesList.value[currentIndex + 1];
      playAudio(nextVerse);
      if (onNextCallback.value) {
        onNextCallback.value(nextVerse);
      }
    } else {
      stopAudio();
    }
  };

  const playAudio = (verse) => {
    stopAudio();

    const audioUrl = getAudioUrl(verse);
    if (audioUrl) {
      currentQari.value = getQariName(preferencesStore.selectedQari);
      activeVerse.value = verse;

      const audio = new Audio(audioUrl);
      audioInstance.value = audio;
      isPlaying.value = true;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Audio playback failed:", err);
            stopAudio();
          }
        });
      }

      audio.addEventListener("ended", () => {
        playNextVerse();
      });
    }
  };

  const toggleAudio = (verse, currentVerses = [], scrollCallback = null) => {
    if (currentVerses.length > 0) {
      versesList.value = currentVerses;
    }
    if (scrollCallback) {
      onNextCallback.value = scrollCallback;
    }

    if (activeVerse.value?.number.inQuran === verse.number.inQuran) {
      if (isPlaying.value) {
        audioInstance.value?.pause();
        isPlaying.value = false;
      } else {
        const playPromise = audioInstance.value?.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Audio playback failed:", err);
            }
          });
        }
        isPlaying.value = true;
      }
      return;
    }

    playAudio(verse);
  };

  const toggleActiveAudio = () => {
    if (activeVerse.value) {
      toggleAudio(activeVerse.value);
    }
  };

  return {
    activeVerse,
    activeVerseNumber,
    activeVerseInSurah,
    isAudioPlaying: isPlaying,
    activeQariName: currentQari,
    toggleAudio,
    toggleActiveAudio,
    stopAudio,
  };
}
