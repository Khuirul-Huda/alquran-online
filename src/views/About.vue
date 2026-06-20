<template>
  <div class="min-h-screen transition-colors duration-300 pb-16" :class="activeTheme === 'dark' ? 'bg-slate-950 text-slate-100' : (activeTheme === 'sepia' ? 'bg-amber-50/20 text-amber-950' : 'bg-quran-bg text-quran-deep')">
    <div class="max-w-2xl mx-auto px-4 pt-8">
      <div class="border rounded-3xl shadow-md overflow-hidden transition-colors duration-300" :class="activeTheme === 'dark' ? 'bg-slate-900 border-slate-800' : (activeTheme === 'sepia' ? 'bg-[#fffdf0] border-amber-200/50' : 'bg-white border-quran-medium/10')">
        
        <!-- About Header -->
        <div class="bg-gradient-to-br from-quran-deep to-quran-medium text-white p-6 md:p-8 flex items-center gap-4 border-b-2 border-quran-gold">
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
          <div class="space-y-2">
            <h3 class="font-bold text-base flex items-center gap-2" :class="activeTheme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'">
              <i class="fa-solid fa-database text-quran-gold"></i> Sumber Data & API
            </h3>
            <p class="leading-relaxed text-gray-500 text-xs">
              Seluruh data di dalam aplikasi ini (tafsir, ayat, transliterasi, dan terjemahan) bersumber dari API publik open-source
              <a href="https://github.com/gadingnst/quran-api" target="_blank" rel="noopener noreferrer" class="font-bold text-quran-medium underline hover:text-quran-deep">gadingnst/quran-api</a> 
              dan data doa harian dimuat dari 
              <a href="https://equran.id" target="_blank" rel="noopener noreferrer" class="font-bold text-quran-medium underline hover:text-quran-deep">EQuran.id</a>. 
              Kode sumber aplikasi ini bersifat terbuka dan dapat diakses melalui 
              <a href="https://github.com/Khuirul-Huda/alquran-online" target="_blank" rel="noopener noreferrer" class="font-bold text-quran-medium underline hover:text-quran-deep">Khuirul-Huda/alquran-online</a>.
            </p>
          </div>

          <!-- Bug Reports / Issues -->
          <div class="space-y-2">
            <h3 class="font-bold text-base flex items-center gap-2" :class="activeTheme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'">
              <i class="fa-solid fa-circle-question text-quran-gold"></i> Laporan Masalah
            </h3>
            <p class="leading-relaxed text-gray-500 text-xs">
              Apabila Anda menemukan kesalahan pengetikan ayat, kekeliruan terjemahan, atau masalah teknis aplikasi, silakan laporkan dengan membuat tiket laporan baru di
              <a href="https://github.com/Khuirul-Huda/alquran-online/issues" target="_blank" rel="noopener noreferrer" class="font-bold text-quran-medium underline hover:text-quran-deep">halaman issues GitHub kami</a>.
            </p>
          </div>

          <!-- Contact Developer -->
          <div class="space-y-2">
            <h3 class="font-bold text-base flex items-center gap-2" :class="activeTheme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'">
              <i class="fa-solid fa-envelope-open-text text-quran-gold"></i> Hubungi Pengembang
            </h3>
            <p class="leading-relaxed text-gray-500 text-xs mb-3">
              Jika Anda memiliki saran kerja sama, pertanyaan, atau ingin berkontribusi dalam pengembangan aplikasi ini, silakan hubungi kami melalui Direct Message Instagram:
            </p>
            <a href="https://instagram.com/khuirul_huda" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-quran-bg border border-quran-medium/10 px-4 py-2.5 rounded-xl text-xs font-bold text-quran-deep hover:bg-quran-accent/15 transition-colors">
              <i class="fa-brands fa-instagram text-sm text-quran-gold"></i>
              <span>@khuirul_huda</span>
            </a>
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
  },
  methods: {
    loadThemePreference() {
      const themePref = localStorage.getItem("quran_pref_theme");
      if (themePref) this.activeTheme = themePref;
    },
  },
};
</script>

<style scoped>
/* Scoped styles are omitted as all components are styled using Tailwind CSS classes. */
</style>
