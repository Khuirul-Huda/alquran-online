<div align="center">

[![wakatime](https://wakatime.com/badge/user/fdca2cf4-f557-42d2-b067-d750228c6013/project/699fdca6-fdba-4b87-876e-f678180feed1.svg?style=for-the-badge)](https://wakatime.com/badge/user/fdca2cf4-f557-42d2-b067-d750228c6013/project/699fdca6-fdba-4b87-876e-f678180feed1)

# 📖 Al-Quran Online

**A modern, open-source Progressive Web App for reading the Holy Quran**  
Built with Vue 3 · Pinia · GSAP · Vite · PWA
</div>

---

## ✨ Features

- **Complete Quran** — All 114 Surahs and 30 Juz with full Arabic text
- **Indonesian Translation & Transliteration** — Side-by-side for every verse
- **Verse Tafsir** — Wajiz (concise) & Tahlili (detailed) commentary from Kemenag RI
- **Audio Playback** — Listen to each verse with multiple reciter (Qari) options, auto-advance to next verse
- **Bookmarks** — Save and revisit your favourite verses, persisted locally
- **Prayer Times** — Shalat schedule by city via Aladhan API
- **Reading Modes** — Light, Sepia, and Dark theme
- **Adjustable Font Size** — Arabic text size slider for comfortable reading
- **Sidebar Navigation** — Instant jump between any Surah or Juz
- **Progressive Web App (PWA)** — Installable, offline-capable with Workbox service worker caching
- **GSAP Animations** — Smooth page transitions, scroll-reveal stagger, spring modal pop, button micro-animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) — Composition API (`<script setup>`) |
| State Management | [Pinia](https://pinia.vuejs.org/) |
| Animations | [GSAP 3](https://gsap.com/) + ScrollTrigger |
| Routing | [Vue Router 4](https://router.vuejs.org/) |
| HTTP | [Axios](https://axios-http.com/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) + Vanilla CSS |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| PWA | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + Workbox |
| Package Manager | [Bun](https://bun.sh/) |

---

## 🌐 APIs Used

| API | Purpose |
|---|---|
| [gadingnst/quran-api](https://github.com/gadingnst/quran-api) | Quran text, translation, audio, tafsir (self-hostable) |
| [MyMemory](https://mymemory.translated.net/) | Exegesis English translations |
| [Aladhan](https://aladhan.com/prayer-times-api) | Prayer times by city |

> The Quran API is **self-hostable**. Deploy your own instance and point `VITE_API_URL` to it.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) ≥ 1.0 (recommended) — or Node.js ≥ 18 with npm/yarn

### 1. Clone the repository

```bash
git clone https://github.com/Khuirul-Huda/alquran-online.git
cd alquran-online
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your Quran API base URL (**no trailing slash**):

```env
VITE_API_URL=https://your-quran-api.example.com
```

> If left empty, the app falls back to the default hosted API at `https://aqa.khuirulhuda.me.eu.org`.

### 3. Install dependencies

```bash
bun install
```

### 4. Run development server

```bash
bun run dev
```

Open [http://localhost:7000](http://localhost:7000) in your browser.

---

## 📦 Build for Production

```bash
bun run build
```

Output is in `dist/`. The build includes:
- Code-split route chunks
- PWA Service Worker (`sw.js`) with Workbox caching
- Web App Manifest for installability

### Preview the production build locally

```bash
bun run preview
```

---

## 🗂️ Project Structure

```
alquran-online/
├── public/               # Static assets (icons, robots.txt)
├── src/
│   ├── composables/      # Reusable logic (useAudioPlayer, useGsap)
│   ├── components/       # Shared UI components (VerseCard, TafsirModal, ReadingToolbar)
│   ├── router/           # Vue Router configuration
│   ├── services/         # API service layer (quranApi.js) with in-memory cache
│   ├── stores/           # Pinia stores (preferences, bookmarks)
│   ├── views/            # Page-level components
│   ├── App.vue           # Root component with navbar & page transitions
│   ├── index.css         # Global styles & Tailwind base
│   └── main.js           # App entry point
├── .env.example          # Environment variable template
├── vite.config.js        # Vite + PWA + Workbox configuration
└── tailwind.config.js    # Tailwind CSS theme (custom Quran color palette)
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of your Quran API instance | `https://aqa.khuirulhuda.me.eu.org` |

---

## 🔒 Caching Strategy

| Resource | Strategy | TTL |
|---|---|---|
| Quran text & Juz (API) | StaleWhileRevalidate (SW) + In-memory session cache | 7 days |
| Audio files | CacheFirst (SW) | 7 days |
| Prayer times | No cache — always fresh | — |

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes
4. Open a Pull Request

**Found a bug or want to suggest something? [Open an issue](https://github.com/Khuirul-Huda/alquran-online/issues)** ☺️

---

## 📜 License

This project is open source. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>This is a continuation of a legacy project started in 2022. Made with ❤️ · Barakallahu fiikum</sub>
</div>
