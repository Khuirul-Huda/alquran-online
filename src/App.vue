<template>
  <div class="app-layout">
    <header class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <i class="fa-solid fa-book-quran brand-icon"></i>
          <span>Al-Quran<span>Online</span></span>
        </router-link>
        <nav class="nav-links">
          <router-link to="/" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-house"></i> Beranda
          </router-link>
          <router-link to="/about" class="nav-link" active-class="active-link">
            <i class="fa-solid fa-circle-info"></i> Tentang
          </router-link>
        </nav>
      </div>
    </header>

    <main class="app-body">
      <router-view />
    </main>

    <footer>
      <div class="footer-content">
        <p class="footer-text">
          &copy; {{ new Date().getFullYear() }} Al-Quran Online.
        </p>
        <p class="footer-credit">
          Designed by
          <a class="footer-link" href="https://instagram.com/khuirul_huda" target="_blank" rel="noopener noreferrer">
            Khuirul Huda
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--bg-card);
  border-bottom: 1.5px solid rgba(45, 106, 79, 0.08);
  box-shadow: var(--shadow-sm);
  padding: 15px 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-deep);
  font-family: var(--font-ui);
}

.brand-icon {
  color: var(--accent-gold);
  font-size: 1.4rem;
}

.nav-brand span span {
  color: var(--accent-gold);
  margin-left: 2px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-medium);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--primary-medium);
  background-color: var(--bg-light);
}

.active-link {
  color: var(--primary-deep);
  background-color: var(--bg-active);
  border: 1px solid rgba(45, 106, 79, 0.1);
}

.app-body {
  flex: 1 0 auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.footer-text {
  font-weight: 400;
}

.footer-credit {
  font-size: 0.85rem;
  opacity: 0.8;
}

.footer-link {
  color: var(--accent-gold);
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--text-white);
  text-decoration: underline;
}

@media (max-width: 600px) {
  .nav-container {
    flex-direction: column;
    gap: 12px;
  }
  .nav-links {
    width: 100%;
    justify-content: center;
  }
}
</style>
