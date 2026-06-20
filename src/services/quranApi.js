import axios from "axios";

const baseApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VUE_APP_MAIN_API_URL ||
  "https://aqa.khuirulhuda.me.eu.org";

// Create instances for different API base endpoints
const quranClient = axios.create({
  baseURL: baseApiUrl,
  timeout: 10000,
});

const doaClient = axios.create({
  baseURL: "https://equran.id/api",
  timeout: 10000,
});

const aladhanClient = axios.create({
  baseURL: "https://api.aladhan.com/v1",
  timeout: 10000,
});

// Best practice: Centrally intercept errors
const handleApiError = (error, sourceName) => {
  console.error(`API Error in ${sourceName}:`, error);
  const errMsg =
    error.response?.data?.message ||
    error.message ||
    "Gagal menghubungkan ke server API.";
  throw new Error(errMsg);
};

export const quranApi = {
  /**
   * Fetch all 114 Surahs list
   */
  async fetchSurahList() {
    try {
      const response = await quranClient.get("/surah");
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error("Format respons API tidak valid.");
    } catch (error) {
      return handleApiError(error, "fetchSurahList");
    }
  },

  /**
   * Fetch detailed verses and translation of a Surah
   * @param {number} surahNumber
   */
  async fetchSurahDetails(surahNumber) {
    try {
      const response = await quranClient.get(`/surah/${surahNumber}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error("Format respons API tidak valid.");
    } catch (error) {
      return handleApiError(error, `fetchSurahDetails (${surahNumber})`);
    }
  },

  /**
   * Fetch detailed verses and translation of a Juz
   * @param {number} juzNumber
   */
  async fetchJuzDetails(juzNumber) {
    try {
      const response = await quranClient.get(`/juz/${juzNumber}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error("Format respons API tidak valid.");
    } catch (error) {
      return handleApiError(error, `fetchJuzDetails (${juzNumber})`);
    }
  },

  /**
   * Fetch Daily Prayers (Doa)
   */
  async fetchDoas() {
    try {
      const response = await doaClient.get("/doa");
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error("Format respons API tidak valid.");
    } catch (error) {
      return handleApiError(error, "fetchDoas");
    }
  },

  /**
   * Fetch Shalat (Prayer) Times by City
   * @param {string} city
   */
  async fetchPrayerTimes(city) {
    try {
      const response = await aladhanClient.get(
        `/timingsByCity?city=${encodeURIComponent(city)}&country=Indonesia`
      );
      if (response.data && response.data.data && response.data.data.timings) {
        return response.data.data.timings;
      }
      throw new Error("Format respons API tidak valid.");
    } catch (error) {
      return handleApiError(error, `fetchPrayerTimes (${city})`);
    }
  },
};
