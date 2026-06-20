<template>
  <div class="pb-16">
    <div class="max-w-2xl mx-auto px-4 pt-8 animate-fade-in">
      <div class="rounded-3xl overflow-hidden transition-all duration-300 themed-card">
        <!-- About Header -->
        <div
          class="bg-quran-deep text-white p-6 md:p-8 flex items-center gap-4 border-b-2 border-quran-gold"
        >
          <i class="fa-solid fa-circle-info text-4xl text-quran-gold"></i>
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-white">
              {{ preferencesStore.language === 'en' ? 'About App' : 'Tentang Aplikasi' }}
            </h1>
            <p class="text-[10px] text-quran-gold-light font-bold uppercase tracking-wider mt-0.5">
              {{ preferencesStore.language === 'en' ? 'Information, Policies & Terms' : 'Informasi, Kebijakan & Ketentuan' }}
            </p>
          </div>
        </div>

        <!-- About Body -->
        <div class="p-6 md:p-8 space-y-6 text-sm text-left">
          <!-- Main Intro -->
          <p
            v-if="preferencesStore.language === 'en'"
            class="text-base leading-relaxed"
            :class="preferencesStore.theme === 'dark' ? 'text-slate-200' : 'text-quran-deep'"
          >
            <strong>Al-Quran Online</strong> is a modern, lightweight, and responsive web application designed to help you read and reflect on the holy verses of the Al-Quran, along with translation, audio recitations, and tafsir comments in a highly accessible and clean user interface.
          </p>
          <p
            v-else
            class="text-base leading-relaxed"
            :class="preferencesStore.theme === 'dark' ? 'text-slate-200' : 'text-quran-deep'"
          >
            <strong>Al-Quran Online</strong> adalah aplikasi web modern, ringan, dan responsif yang dirancang untuk memudahkan Anda membaca dan menghayati ayat-ayat suci Al-Quran beserta terjemahan, audio, dan tafsirnya secara praktis dan nyaman.
          </p>

          <div
            class="h-px"
            :class="preferencesStore.theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'"
          ></div>

          <!-- Data Source -->
          <div class="space-y-3.5">
            <h3
              class="font-bold text-base flex items-center gap-2"
              :class="preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'"
            >
              <i class="fa-solid fa-database text-quran-gold"></i>
              {{ preferencesStore.language === 'en' ? 'Data Sources & APIs' : 'Sumber Data & API' }}
            </h3>
            
            <p
              v-if="preferencesStore.language === 'en'"
              class="leading-relaxed text-gray-500 text-sm mb-3"
            >
              This app integrates data from trusted resources via public open-source APIs, based on the backend wrapper
              <a
                href="https://github.com/gadingnst/quran-api"
                target="_blank"
                rel="noopener noreferrer"
                class="font-bold text-quran-medium underline hover:text-quran-deep"
              >gadingnst/quran-api</a>:
            </p>
            <p
              v-else
              class="leading-relaxed text-gray-500 text-sm mb-3"
            >
              Aplikasi ini mengintegrasikan data dari beberapa sumber terpercaya melalui API publik open-source
              <a
                href="https://github.com/gadingnst/quran-api"
                target="_blank"
                rel="noopener noreferrer"
                class="font-bold text-quran-medium underline hover:text-quran-deep"
              >gadingnst/quran-api</a>:
            </p>

            <ul
              v-if="preferencesStore.language === 'en'"
              class="list-disc list-inside text-sm text-gray-500 space-y-2 pl-2"
            >
              <li>
                <strong class="text-gray-400">api.alquran.cloud</strong>: Quranic texts, Surah metadata, and Qari audio recitations.
              </li>
              <li>
                <strong class="text-gray-400">quran.kemenag.go.id</strong>: Official Indonesian translations and verse tafsir (Ministry of Religious Affairs of the Republic of Indonesia). Tafsir is available in two detail choices: **Tafsir Wajiz** (brief) and **Tafsir Tahlili** (detailed).
              </li>
              <li>
                <strong class="text-gray-400">Al-Quran-ID-API</strong>: Surah summary details (with standard international adjustments for Surah 13 and 55 revelation types).
              </li>
              <li>
                <strong class="text-gray-400">api.mymemory.translated.net</strong>: Free keyless translation service used to provide on-the-fly English translations for Kemenag Tafsir exegesis.
              </li>
              <li>
                <strong class="text-gray-400">api.aladhan.com</strong>: Dynamic daily prayer times calculations based on your selected city (no coordinates tracking).
              </li>
            </ul>
            <ul
              v-else
              class="list-disc list-inside text-sm text-gray-500 space-y-2 pl-2"
            >
              <li>
                <strong class="text-gray-400">api.alquran.cloud</strong>: Teks Al-Quran, Meta Informasi Surah, dan Audio Qari.
              </li>
              <li>
                <strong class="text-gray-400">quran.kemenag.go.id</strong>: Terjemahan resmi Bahasa Indonesia dan Tafsir Ayat (Kementerian Agama Republik Indonesia). Data tafsir disajikan lengkap dalam dua opsi: **Tafsir Wajiz** (Tafsir Ringkas edisi tahun 2016) dan **Tafsir Tahlili** (Tafsir Lengkap edisi tahun 2012).
              </li>
              <li>
                <strong class="text-gray-400">Al-Quran-ID-API</strong>: Tafsir ringkasan Surah (dengan penyesuaian tipe wahyu Surah 13 dan 55 ke Medinan sesuai standar data internasional).
              </li>
              <li>
                <strong class="text-gray-400">api.mymemory.translated.net</strong>: Layanan penerjemahan gratis yang digunakan untuk menerjemahkan teks Tafsir Kemenag ke Bahasa Inggris secara instan.
              </li>
              <li>
                <strong class="text-gray-400">api.aladhan.com</strong>: Perhitungan waktu shalat harian berdasarkan kota yang dipilih tanpa pelacakan lokasi.
              </li>
            </ul>

            <p
              class="leading-relaxed text-gray-500 text-sm mt-3 border-t pt-3"
              :class="preferencesStore.theme === 'dark' ? 'border-slate-800' : 'border-gray-100'"
            >
              {{ preferencesStore.language === 'en' ? 'The source code of this app is open source and accessible at' : 'Kode sumber aplikasi ini bersifat terbuka dan dapat diakses melalui' }}
              <a
                href="https://github.com/Khuirul-Huda/alquran-online"
                target="_blank"
                rel="noopener noreferrer"
                class="font-bold text-quran-medium underline hover:text-quran-deep"
              >Khuirul-Huda/alquran-online</a>.
            </p>
          </div>

          <!-- Bug Reports / Issues -->
          <div class="space-y-2">
            <h3
              class="font-bold text-base flex items-center gap-2"
              :class="preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'"
            >
              <i class="fa-solid fa-circle-question text-quran-gold"></i>
              {{ preferencesStore.language === 'en' ? 'Bug Reports & Contribution' : 'Laporan Masalah & Hubungi Pengembang' }}
            </h3>
            
            <p
              v-if="preferencesStore.language === 'en'"
              class="leading-relaxed text-gray-500 text-sm"
            >
              If you find any typos in the verses, mistakes in the translations, have recommendations, or run into technical issues with the app, please report it by opening a new ticket on
              <a
                href="https://github.com/Khuirul-Huda/alquran-online/issues"
                target="_blank"
                rel="noopener noreferrer"
                class="font-bold text-quran-medium underline hover:text-quran-deep"
              >our GitHub issues page</a>.
            </p>
            <p
              v-else
              class="leading-relaxed text-gray-500 text-sm"
            >
              Apabila Anda menemukan kesalahan pengetikan ayat, kekeliruan terjemahan, memiliki saran kontribusi, atau menemukan masalah teknis aplikasi, silakan laporkan dengan membuat tiket laporan baru di
              <a
                href="https://github.com/Khuirul-Huda/alquran-online/issues"
                target="_blank"
                rel="noopener noreferrer"
                class="font-bold text-quran-medium underline hover:text-quran-deep"
              >halaman issues GitHub kami</a>.
            </p>
          </div>

          <div
            class="h-px"
            :class="preferencesStore.theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'"
          ></div>

          <!-- Legal & Privacy Section -->
          <div class="space-y-3.5">
            <h3
              class="font-bold text-base flex items-center gap-2"
              :class="preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'"
            >
              <i class="fa-solid fa-shield-halved text-quran-gold"></i>
              {{ preferencesStore.language === 'en' ? 'Privacy Policy & Legal Terms' : 'Kebijakan Privasi & Ketentuan Hukum' }}
            </h3>

            <div class="text-[13px] leading-relaxed text-gray-400 space-y-3">
              <!-- Disclaimer -->
              <p v-if="preferencesStore.language === 'en'">
                <strong>1. Disclaimer:</strong> The "Al-Quran Online" application is provided "as-is" without any warranty of absolute accuracy by the developer. All sacred text content, translation, tafsir, and prayer times are loaded automatically from third-party APIs. The developer is not responsible for any losses, typos, or differing interpretations that may arise. Users are highly recommended to always cross-check with the official printed Al-Quran verified by the Ministry of Religious Affairs of the Republic of Indonesia (Kemenag RI) or other official Islamic institutions.
              </p>
              <p v-else>
                <strong>1. Penafian Tanggung Jawab (Disclaimer):</strong> Aplikasi "Al-Quran Online" disediakan "sebagaimana adanya" (as-is) tanpa jaminan ketepatan mutlak dari pihak pengembang. Seluruh konten teks suci, terjemahan, tafsir, dan jadwal shalat dimuat secara otomatis dari API pihak ketiga. Pengembang tidak bertanggung jawab atas segala kerugian, kesalahan penulisan, atau perbedaan penafsiran yang timbul. Pengguna sangat dianjurkan untuk selalu melakukan konfirmasi silang (cross-check) dengan Al-Quran cetak resmi yang ditashih oleh Kementerian Agama Republik Indonesia (Kemenag RI) atau lembaga keislaman resmi lainnya.
              </p>

              <!-- Privacy Policy -->
              <p v-if="preferencesStore.language === 'en'">
                <strong>2. Privacy Policy & Zero Data Collection:</strong> This application is designed with full privacy principles in mind. <strong>We do not collect, store, or share user personal data</strong>. All your preference data—including text sizes, last read progress, active reading themes (Light/Sepia/Dark), and your selected city for prayer times—is stored locally and securely only inside your device (using browser LocalStorage) and is never transmitted to our servers.
              </p>
              <p v-else>
                <strong>2. Kebijakan Privasi & Tanpa Pengumpulan Data:</strong> Aplikasi ini dirancang dengan prinsip privasi penuh. <strong>Kami tidak mengumpulkan, menyimpan, atau membagikan data pribadi pengguna</strong>. Seluruh data preferensi Anda—termasuk ukuran teks, riwayat bacaan terakhir (fitur Lanjutkan Membaca), tema tampilan (Terang/Sepia/Gelap), serta kota pilihan jadwal shalat—disimpan secara lokal dan aman hanya di dalam peranti Anda (menggunakan LocalStorage browser) dan tidak dikirimkan ke server kami.
              </p>

              <!-- Third Party APIs -->
              <p v-if="preferencesStore.language === 'en'">
                <strong>3. Third-Party APIs & Privacy:</strong> To present actual verse and prayer times data, this application sends anonymous HTTP data requests to aqa.khuirulhuda.me.eu.org and api.aladhan.com. In addition, the Tafsir-to-English translation feature sends anonymous HTTP requests to api.mymemory.translated.net. These requests are public, do not include personal identities, and do not track users.
              </p>
              <p v-else>
                <strong>3. Penggunaan API Pihak Ketiga:</strong> Untuk menyajikan data ayat dan waktu shalat secara aktual, aplikasi ini mengirimkan permintaan data HTTP secara anonim ke server aqa.khuirulhuda.me.eu.org dan api.aladhan.com. Selain itu, fitur terjemahan Tafsir ke Bahasa Inggris mengirimkan permintaan HTTP secara anonim ke api.mymemory.translated.net. Permintaan ini bersifat publik, tidak memuat data identitas diri pribadi Anda, dan tidak melacak pengguna.
              </p>
            </div>
          </div>
        </div>

        <!-- About Footer -->
        <div
          class="px-6 py-4 text-xs font-semibold text-right border-t"
          :class="
            preferencesStore.theme === 'dark'
              ? 'bg-slate-900/40 border-slate-800 text-slate-400'
              : 'bg-quran-bg border-gray-100 text-gray-400'
          "
        >
          <span>
            {{ preferencesStore.language === 'en' ? 'Policy & Privacy Update: June 2026' : 'Pembaruan Hukum & Privasi: Juni 2026' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePreferencesStore } from "../stores/preferences";

const preferencesStore = usePreferencesStore();
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
