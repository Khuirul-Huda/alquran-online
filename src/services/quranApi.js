import axios from "axios";

const baseApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VUE_APP_MAIN_API_URL ||
  "https://aqa.khuirulhuda.me.eu.org";

// ---------------------------------------------------------------------------
// Axios client instances
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// In-memory session cache
// Stores responses in a Map so that repeated navigations within the same
// browser session never hit the network twice for static Quran content.
// Prayer times are intentionally NOT cached here (always fetched fresh).
// ---------------------------------------------------------------------------
const _cache = new Map();

/**
 * Wraps an async fetch function with a cache check.
 * If the key already exists in the cache, the stored value is returned
 * immediately. Otherwise the fetcher is called, its result stored, then
 * returned.
 *
 * @template T
 * @param {string} key       - Unique cache key.
 * @param {() => Promise<T>} fetcher - Async function that performs the actual API call.
 * @returns {Promise<T>}
 */
async function withCache(key, fetcher) {
  if (_cache.has(key)) {
    return _cache.get(key);
  }
  const data = await fetcher();
  _cache.set(key, data);
  return data;
}

// ---------------------------------------------------------------------------
// Centralised error handler
// ---------------------------------------------------------------------------
const handleApiError = (error, sourceName) => {
  console.error(`API Error in ${sourceName}:`, error);
  const errMsg =
    error.response?.data?.message ||
    error.message ||
    "Gagal menghubungkan ke server API.";
  throw new Error(errMsg);
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export const quranApi = {
  /**
   * Fetch all 114 Surahs list.
   * Cached for the lifetime of the browser session.
   */
  async fetchSurahList() {
    return withCache("surahList", async () => {
      try {
        const response = await quranClient.get("/surah");
        if (response.data && response.data.data) {
          return response.data.data;
        }
        throw new Error("Format respons API tidak valid.");
      } catch (error) {
        return handleApiError(error, "fetchSurahList");
      }
    });
  },

  /**
   * Fetch detailed verses and translation of a Surah.
   * Cached per surah number for the lifetime of the browser session.
   *
   * @param {number} surahNumber
   */
  async fetchSurahDetails(surahNumber) {
    return withCache(`surahDetails:${surahNumber}`, async () => {
      try {
        const response = await quranClient.get(`/surah/${surahNumber}`);
        if (response.data && response.data.data) {
          return response.data.data;
        }
        throw new Error("Format respons API tidak valid.");
      } catch (error) {
        return handleApiError(error, `fetchSurahDetails (${surahNumber})`);
      }
    });
  },

  /**
   * Fetch detailed verses and translation of a Juz.
   * Cached per juz number for the lifetime of the browser session.
   *
   * @param {number} juzNumber
   */
  async fetchJuzDetails(juzNumber) {
    return withCache(`juzDetails:${juzNumber}`, async () => {
      try {
        const response = await quranClient.get(`/juz/${juzNumber}`);
        if (response.data && response.data.data) {
          return response.data.data;
        }
        throw new Error("Format respons API tidak valid.");
      } catch (error) {
        return handleApiError(error, `fetchJuzDetails (${juzNumber})`);
      }
    });
  },

  /**
   * Fetch Daily Prayers (Doa).
   * Cached for the lifetime of the browser session.
   */
  async fetchDoas() {
    return withCache("doas", async () => {
      try {
        const response = await doaClient.get("/doa");
        if (response.data && response.data.data) {
          return response.data.data;
        }
        throw new Error("Format respons API tidak valid.");
      } catch (error) {
        return handleApiError(error, "fetchDoas");
      }
    });
  },

  /**
   * Fetch Shalat (Prayer) Times by City.
   * Intentionally NOT cached — always fetches fresh data from Aladhan.
   *
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

  /**
   * Manually clear the in-memory cache.
   * Useful for testing or forcing a fresh fetch.
   */
  clearCache() {
    _cache.clear();
  },
};
