<template>
  <div class="container about-container">
    <div class="about-card">
      <div class="about-header">
        <i class="fa-solid fa-circle-info about-icon"></i>
        <h1 class="about-title">Tentang Aplikasi</h1>
      </div>
      
      <div class="about-body">
        <p class="about-lead">
          <strong>Al-Quran Online</strong> adalah aplikasi web modern, ringan, dan responsif yang dirancang untuk memudahkan Anda membaca dan menghayati ayat-ayat suci Al-Quran beserta terjemahan dan tafsirnya kapan saja, di mana saja.
        </p>

        <div class="section-divider"></div>

        <div class="about-section">
          <h3><i class="fa-solid fa-database section-icon"></i> Sumber Data</h3>
          <p>
            Seluruh data di dalam aplikasi ini (tafsir, ayat, transliterasi, dan terjemahan) bersumber dari API publik open-source 
            <a href="https://github.com/gadingnst/quran-api" target="_blank" rel="noopener noreferrer">gadingnst/quran-api</a>. 
            Aplikasi ini bersifat open-source sepenuhnya, kode sumber dapat dilihat dan dipelajari melalui repositori GitHub resmi 
            <a href="https://github.com/Khuirul-Huda/alquran-online" target="_blank" rel="noopener noreferrer">Khuirul-Huda/alquran-online</a>.
          </p>
        </div>

        <div class="about-section">
          <h3><i class="fa-solid fa-circle-question section-icon"></i> Menemukan Masalah?</h3>
          <p>
            Apabila Anda menemukan kesalahan teknis pada sistem web, kesalahan terjemahan, penulisan ayat, maupun tafsir, silakan laporkan masalah tersebut dengan membuat <i>Issue</i> baru di repositori GitHub kami di 
            <a href="https://github.com/Khuirul-Huda/alquran-online/issues" target="_blank" rel="noopener noreferrer">halaman issues</a>.
          </p>
        </div>

        <div class="about-section">
          <h3><i class="fa-solid fa-envelope-open-text section-icon"></i> Hubungi Pengembang</h3>
          <p>
            Jika Anda memiliki saran, pertanyaan, atau ingin berkontribusi, silakan hubungi pengembang melalui Direct Message Instagram di:
            <br>
            <a href="https://instagram.com/khuirul_huda" target="_blank" rel="noopener noreferrer" class="social-link">
              <i class="fa-brands fa-instagram"></i> @khuirul_huda
            </a>
          </p>
        </div>
      </div>
      
      <div class="about-footer">
        <span>Pembaruan Terakhir: Juni 2026</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped>
.about-container {
  max-width: 700px !important;
  padding-top: 30px;
  padding-bottom: 60px;
}

.about-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(45, 106, 79, 0.08);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.about-header {
  background: linear-gradient(135deg, var(--primary-deep) 0%, var(--primary-medium) 100%);
  color: var(--text-white);
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 2px solid var(--accent-gold);
}

.about-icon {
  font-size: 2.2rem;
  color: var(--accent-gold);
}

.about-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.about-body {
  padding: 35px;
  text-align: left;
}

.about-lead {
  font-size: 1.1rem;
  color: var(--text-dark);
  line-height: 1.7;
}

.section-divider {
  height: 1px;
  background-color: rgba(45, 106, 79, 0.1);
  margin: 25px 0;
}

.about-section {
  margin-bottom: 28px;
}

.about-section h3 {
  font-size: 1.15rem;
  color: var(--primary-deep);
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  color: var(--accent-gold);
  font-size: 1.1rem;
}

.about-section p {
  font-size: 0.95rem;
  color: var(--text-medium);
  line-height: 1.6;
}

.about-section a {
  font-weight: 600;
  border-bottom: 1px dashed var(--primary-medium);
  transition: all var(--transition-fast);
}

.about-section a:hover {
  color: var(--primary-deep);
  border-bottom-style: solid;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  background-color: var(--bg-light);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  border-bottom: none !important;
  border: 1px solid rgba(45, 106, 79, 0.08);
}

.social-link:hover {
  background-color: var(--bg-active);
  transform: translateY(-1px);
}

.about-footer {
  background-color: var(--bg-light);
  padding: 16px 35px;
  border-top: 1px solid rgba(45, 106, 79, 0.05);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: right;
  font-weight: 500;
}

@media (max-width: 600px) {
  .about-header {
    padding: 20px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  .about-body {
    padding: 20px;
  }
  .about-title {
    font-size: 1.5rem;
  }
}
</style>
