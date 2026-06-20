<template>
  <div class="pb-16">
    <div class="max-w-2xl mx-auto px-4 pt-8 animate-fade-in">
      <div class="rounded-3xl overflow-hidden transition-all duration-300 themed-card">
        
        <!-- About Header -->
        <div class="bg-quran-deep text-white p-6 md:p-8 flex items-center gap-4 border-b-2 border-quran-gold">
          <i class="fa-solid fa-circle-info text-4xl text-quran-gold"></i>
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-white">Tentang Aplikasi</h1>
            <p class="text-[10px] text-quran-gold-light font-bold uppercase tracking-wider mt-0.5">Informasi, Kebijakan & Ketentuan</p>
          </div>
        </div>
        
        <!-- About Body -->
        <div class="p-6 md:p-8 space-y-6 text-sm text-left">
          <p class="text-base leading-relaxed" :class="activeTheme === 'dark' ? 'text-slate-200' : 'text-quran-deep'">
            <strong>Al-Quran Online</strong> adalah aplikasi web modern, ringan, dan responsif yang dirancang untuk memudahkan Anda membaca dan menghayati ayat-ayat suci Al-Quran beserta terjemahan, audio, dan tafsirnya secara praktis dan nyaman.
          </p>

          <div class="h-px" :class="activeTheme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'"></div>

          <!-- Data Source -->
          <div class="space-y-3.5">
            <h3 class="font-bold text-base flex items-center gap-2" :class="activeTheme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'">
              <i class="fa-solid fa-database text-quran-gold"></i> Sumber Data & API
            </h3>
            <p class="leading-relaxed text-gray-500 text-xs mb-3">
              Aplikasi ini mengintegrasikan data dari beberapa sumber terpercaya melalui API publik open-source
              <a href="https://github.com/gadingnst/quran-api" target="_blank" rel="noopener noreferrer" class="font-bold text-quran-medium underline hover:text-quran-deep">gadingnst/quran-api</a>:
            </p>
            <ul class="list-disc list-inside text-xs text-gray-500 space-y-2 pl-2">
              <li>
                <strong class="text-gray-400">api.alquran.cloud</strong>: Teks Al-Quran, Meta Informasi Surah, dan Audio.
              </li>
              <li>
                <strong class="text-gray-400">quran.kemenag.go.id</strong>: Terjemahan resmi Bahasa Indonesia dan Tafsir Ayat (Kementerian Agama Republik Indonesia). Data tafsir disajikan lengkap dalam dua opsi: **Tafsir Wajiz** (Tafsir Ringkas edisi tahun 2016) dan **Tafsir Tahlili** (Tafsir Lengkap edisi tahun 2012) yang dapat dialihkan langsung saat membaca.
              </li>
              <li>
                <strong class="text-gray-400">Al-Quran-ID-API</strong>: Tafsir ringkasan Surah (dengan penyesuaian tipe wahyu Surah 13 dan 55 ke Medinan sesuai standar data internasional).
              </li>
              <li>
                <strong class="text-gray-400">equran.id</strong>: Kumpulan data Doa Harian pilihan.
              </li>
              <li>
                <strong class="text-gray-400">api.aladhan.com</strong>: Perhitungan waktu shalat harian tanpa pelacakan lokasi.
              </li>
            </ul>
            <p class="leading-relaxed text-gray-500 text-xs mt-3 border-t pt-3" :class="activeTheme === 'dark' ? 'border-slate-800' : 'border-gray-100'">
              Kode sumber aplikasi ini bersifat terbuka dan dapat diakses melalui 
              <a href="https://github.com/Khuirul-Huda/alquran-online" target="_blank" rel="noopener noreferrer" class="font-bold text-quran-medium underline hover:text-quran-deep">Khuirul-Huda/alquran-online</a>.
            </p>
          </div>

          <!-- Bug Reports / Issues -->
          <div class="space-y-2">
            <h3 class="font-bold text-base flex items-center gap-2" :class="activeTheme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'">
              <i class="fa-solid fa-circle-question text-quran-gold"></i> Laporan Masalah & Hubungi Pengembang
            </h3>
            <p class="leading-relaxed text-gray-500 text-xs">
              Apabila Anda menemukan kesalahan pengetikan ayat, kekeliruan terjemahan, memiliki saran kontribusi, atau menemukan masalah teknis aplikasi, silakan laporkan dengan membuat tiket laporan baru di
              <a href="https://github.com/Khuirul-Huda/alquran-online/issues" target="_blank" rel="noopener noreferrer" class="font-bold text-quran-medium underline hover:text-quran-deep">halaman issues GitHub kami</a>.
            </p>
          </div>

          <div class="h-px" :class="activeTheme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'"></div>

          <!-- Legal & Privacy Section -->
          <div class="space-y-3.5">
            <h3 class="font-bold text-base flex items-center gap-2" :class="activeTheme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'">
              <i class="fa-solid fa-shield-halved text-quran-gold"></i> Kebijakan Privasi & Ketentuan Hukum
            </h3>
            
            <div class="text-[11px] leading-relaxed text-gray-400 space-y-3">
              <p>
                <strong>1. Penafian Tanggung Jawab (Disclaimer):</strong> Aplikasi "Al-Quran Online" disediakan "sebagaimana adanya" (as-is) tanpa jaminan ketepatan mutlak dari pihak pengembang. Seluruh konten teks suci, terjemahan, tafsir, doa harian, dan jadwal shalat dimuat secara otomatis dari API pihak ketiga. Pengembang tidak bertanggung jawab atas segala kerugian, kesalahan penulisan, atau perbedaan penafsiran yang timbul. Pengguna sangat dianjurkan untuk selalu melakukan konfirmasi silang (cross-check) dengan Al-Quran cetak resmi yang ditashih oleh Kementerian Agama Republik Indonesia (Kemenag RI) atau lembaga keislaman resmi lainnya.
              </p>
              <p>
                <strong>2. Kebijakan Privasi & Tanpa Pengumpulan Data:</strong> Aplikasi ini dirancang dengan prinsip privasi penuh. <strong>Kami tidak mengumpulkan, menyimpan, atau membagikan data pribadi pengguna</strong>. Seluruh data preferensi Anda—termasuk ukuran teks, riwayat bacaan terakhir (fitur Lanjutkan Membaca), tema tampilan (Terang/Sepia/Gelap), serta kota pilihan jadwal shalat—disimpan secara lokal dan aman hanya di dalam peranti Anda (menggunakan LocalStorage browser) dan tidak dikirimkan ke server kami.
              </p>
              <p>
                <strong>3. Penggunaan API Pihak Ketiga:</strong> Untuk menyajikan data ayat, doa, dan waktu shalat secara aktual, aplikasi ini mengirimkan permintaan data HTTP secara anonim ke server api.aladhan.com, equran.id, dan aqa.khuirulhuda.me.eu.org. Permintaan ini tidak memuat data identitas diri pribadi Anda.
              </p>
            </div>
          </div>

        </div>
        
        <!-- About Footer -->
        <div class="px-6 py-4 text-xs font-semibold text-right border-t" :class="activeTheme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-quran-bg border-gray-100 text-gray-400'">
          <span>Pembaruan Hukum & Privasi: Juni 2026</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      activeTheme: "light",
    };
  },
  mounted() {
    this.loadThemePreference();
    window.addEventListener("theme-changed", this.loadThemePreference);
  },
  beforeUnmount() {
    window.removeEventListener("theme-changed", this.loadThemePreference);
  },
  methods: {
    loadThemePreference() {
      this.activeTheme = localStorage.getItem("quran_pref_theme") || "light";
    },
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
