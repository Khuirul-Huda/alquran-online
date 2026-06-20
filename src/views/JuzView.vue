<template>
  <div class="pb-16">
    <div class="max-w-6xl mx-auto px-4 py-6 flex gap-8">
      
      <!-- Left Sidebar: List of 30 Juz (hidden on mobile, visible on desktop) -->
      <aside class="hidden lg:block w-80 rounded-2xl h-[calc(100vh-130px)] sticky top-[95px] flex-shrink-0 flex flex-col transition-all duration-300 themed-card">
        <div class="p-4 border-b flex-shrink-0" :class="activeTheme === 'dark' ? 'border-slate-800' : 'border-gray-100'">
          <h3 class="font-bold text-xs uppercase tracking-wider text-gray-400">Pilih Juz</h3>
        </div>
        
        <!-- Juz 1-30 List -->
        <div class="flex-grow overflow-y-auto p-2 space-y-1">
          <router-link 
            v-for="j in 30" 
            :key="j" 
            :to="'/juz/' + j"
            class="flex items-center justify-between p-3 rounded-xl transition-all duration-150 text-xs font-semibold group"
            :class="j == juzNumber 
              ? (activeTheme === 'dark' ? 'bg-slate-800 text-quran-gold shadow-sm border-l-4 border-quran-gold' : 'bg-quran-accent/15 text-quran-deep border-l-4 border-quran-medium shadow-sm') 
              : (activeTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-quran-bg hover:text-quran-medium')"
          >
            <div class="flex items-center gap-2.5">
              <span 
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-colors"
                :class="j == juzNumber 
                  ? 'bg-quran-gold-light text-quran-deep font-bold border-quran-gold/40' 
                  : (activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200 group-hover:bg-quran-gold-light')"
              >
                {{ j }}
              </span>
              <span>Juz {{ j }}</span>
            </div>
            <span class="text-[9.5px] text-gray-400 group-hover:text-quran-medium transition-colors">
              {{ getJuzLabel(j) }}
            </span>
          </router-link>
        </div>
      </aside>

      <!-- Right Content Panel: Reading View -->
      <div class="flex-grow min-w-0">
        <!-- Back Navigation Button (only on mobile) -->
        <div class="lg:hidden mb-4">
          <router-link to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-quran-medium hover:text-quran-deep">
            <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda
          </router-link>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="!loaded" class="flex flex-col gap-6">
          <div class="animate-shimmer h-24 rounded-2xl"></div>
          <div class="animate-shimmer h-14 rounded-2xl"></div>
          <div v-for="h in 5" :key="h" class="border rounded-2xl p-6 h-48 flex flex-col justify-between" :class="activeTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'">
            <div class="flex justify-between items-center">
              <div class="animate-shimmer w-8 h-8 rounded-full"></div>
              <div class="animate-shimmer w-16 h-8 rounded-md"></div>
            </div>
            <div class="animate-shimmer w-11/12 h-8 rounded-md self-end my-4"></div>
            <div class="animate-shimmer w-2/3 h-4 rounded-md"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex justify-center items-center py-16">
          <div 
            class="rounded-2xl p-8 text-center max-w-sm shadow-sm border animate-fade-in"
            :class="activeTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-red-100 text-gray-900'"
          >
            <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
            <h3 class="font-bold text-lg mb-2" :class="activeTheme === 'dark' ? 'text-white' : 'text-gray-900'">Gagal Memuat Juz</h3>
            <p class="text-sm mb-6" :class="activeTheme === 'dark' ? 'text-slate-400' : 'text-gray-500'">{{ errMsg }}</p>
            <router-link to="/" class="inline-block bg-quran-medium hover:bg-quran-deep text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm">
              Kembali ke Beranda
            </router-link>
          </div>
        </div>

        <!-- Main Reading Content -->
        <div v-else class="space-y-6">
          
          <!-- Juz Header Card -->
          <div class="relative overflow-hidden bg-quran-deep text-white rounded-2xl p-6 md:p-8 shadow-md border border-quran-gold/20">
            <div class="flex justify-between items-center relative z-10">
              <div>
                <h1 class="text-3xl font-bold tracking-tight text-white">Juz {{ juzNumber }}</h1>
                <p class="text-xs font-semibold text-quran-gold-light mt-1.5 flex items-center gap-1.5">
                  <i class="fa-solid fa-location-arrow"></i>
                  <span>Rentang: {{ juzData.start }} s/d {{ juzData.end }}</span>
                </p>
              </div>
              <div class="font-arabic text-3xl text-quran-gold">الجزء {{ convertToArabicNumber(juzNumber) }}</div>
            </div>
          </div>

          <!-- Sticky Reading Customizations Panel -->
          <div class="sticky top-[70px] md:top-[85px] z-30 rounded-2xl p-3 flex flex-col gap-3 transition-all duration-300 themed-card shadow-sm border border-gray-100/10">
            <!-- Compact Toolbar (Always visible) -->
            <div class="flex items-center justify-between w-full">
              <!-- Jump To Verse Dropdown -->
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Lompat Ke:</span>
                <select 
                  @change="onJumpChange($event.target.value)" 
                  class="bg-quran-bg border border-gray-200 rounded-lg text-xs font-bold p-1.5 focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light cursor-pointer text-quran-deep"
                >
                  <option value="" disabled selected>Ayat...</option>
                  <option v-for="(v, index) in verses" :key="v.number.inQuran" :value="v.number.inQuran">
                    Ayat {{ index + 1 }} ({{ getVerseLabel(v.number.inQuran) }})
                  </option>
                </select>
              </div>

              <!-- Settings Toggle Button (Gear Icon) -->
              <button 
                @click="showCustomSettings = !showCustomSettings"
                class="w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer shadow-sm hover:scale-105"
                :class="showCustomSettings 
                  ? 'bg-quran-medium text-white border-quran-medium' 
                  : (activeTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-quran-bg border-gray-200 text-quran-deep')"
                title="Pengaturan Tampilan"
              >
                <i class="fa-solid fa-gear text-sm transition-transform duration-300" :class="{'rotate-45': showCustomSettings}"></i>
              </button>
            </div>

            <!-- Customization Settings Container (Expandable, hidden by default) -->
            <div 
              v-if="showCustomSettings" 
              class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-dashed transition-all duration-300 animate-slide-down"
              :class="activeTheme === 'dark' ? 'border-slate-800' : 'border-gray-150'"
            >
              <!-- Arabic Size Adjusters -->
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ukuran Teks:</span>
                <div class="flex items-center gap-1">
                  <button @click="decreaseFontSize" class="w-7 h-7 bg-quran-bg hover:bg-quran-accent/20 border border-gray-200 text-quran-deep rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer">-</button>
                  <span class="text-xs font-bold w-10 text-center" :class="activeTheme === 'dark' ? 'text-white' : 'text-quran-deep'">{{ Math.round((arabicFontSizeFactor - 1.4) * 50) + 50 }}%</span>
                  <button @click="increaseFontSize" class="w-7 h-7 bg-quran-bg hover:bg-quran-accent/20 border border-gray-200 text-quran-deep rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer">+</button>
                </div>
              </div>

              <!-- View Mode Toggles -->
              <div class="flex items-center gap-4 text-xs font-semibold" :class="activeTheme === 'dark' ? 'text-slate-300' : 'text-gray-600'">
                <label class="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" v-model="showTransliteration" class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30">
                  <span>Transliterasi</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" v-model="showTranslation" class="w-4 h-4 rounded border-gray-300 text-quran-medium focus:ring-quran-medium/30">
                  <span>Terjemahan</span>
                </label>
              </div>

              <!-- Theme Toggles -->
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tema:</span>
                <div class="flex gap-1.5">
                  <button 
                    @click="changeTheme('light')" 
                    class="w-6 h-6 rounded-full bg-white border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
                    :class="{'ring-2 ring-quran-medium ring-offset-1': activeTheme === 'light'}"
                    title="Mode Terang"
                  ></button>
                  <button 
                    @click="changeTheme('sepia')" 
                    class="w-6 h-6 rounded-full bg-[#fffdf0] border border-amber-300 hover:scale-110 transition-transform cursor-pointer"
                    :class="{'ring-2 ring-quran-medium ring-offset-1': activeTheme === 'sepia'}"
                    title="Mode Sepia"
                  ></button>
                  <button 
                    @click="changeTheme('dark')" 
                    class="w-6 h-6 rounded-full bg-slate-900 border border-slate-950 hover:scale-110 transition-transform cursor-pointer"
                    :class="{'ring-2 ring-quran-medium ring-offset-1': activeTheme === 'dark'}"
                    title="Mode Malam"
                  ></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Verses Cards with dynamic Surah dividers -->
          <div class="flex flex-col gap-6">
            <template v-for="(verse, idx) in verses" :key="verse.number.inQuran">
              <!-- Surah Boundary Banner -->
              <div 
                v-if="idx === 0 || isNewSurah(verse, verses[idx-1])" 
                class="border rounded-2xl p-5 text-center transition-all duration-300"
                :class="[
                  activeTheme === 'dark' 
                    ? 'bg-slate-900 border-slate-800' 
                    : (activeTheme === 'sepia' ? 'bg-[#fdf8e6] border-amber-200/50 text-amber-950' : 'bg-quran-deep border-quran-gold/20 text-white')
                ]"
              >
                <div class="flex justify-between items-center px-4">
                  <div class="text-left">
                    <h2 class="font-bold text-lg" :class="activeTheme === 'dark' || activeTheme === 'sepia' ? '' : 'text-white'">
                      Surah {{ getSurahInfo(verse.number.inQuran).name }}
                    </h2>
                    <p class="text-[10.5px] opacity-80 font-medium italic mt-0.5">
                      "{{ getSurahInfo(verse.number.inQuran).translation }}"
                    </p>
                  </div>
                  <span class="font-arabic text-3xl" :class="activeTheme === 'dark' || activeTheme === 'sepia' ? 'text-quran-medium' : 'text-quran-gold'">
                    {{ getSurahInfo(verse.number.inQuran).arabic }}
                  </span>
                </div>
              </div>

              <!-- Verse Card -->
              <div 
                :id="'verse-' + verse.number.inQuran"
                class="themed-card rounded-2xl p-6 md:p-8 transition-all duration-300 relative group flex flex-col"
                :class="{ 
                  'active-verse': activeVerseNumber === verse.number.inQuran,
                  'pulse-highlight-verse': highlightedVerseNumber === verse.number.inQuran
                }"
              >
                <!-- Highlight bar left -->
                <div 
                  class="absolute left-0 top-0 h-full w-1 bg-quran-light opacity-30 rounded-l-2xl transition-all"
                  :class="{ '!bg-quran-gold !opacity-100 !w-1.5': activeVerseNumber === verse.number.inQuran }"
                ></div>

                <!-- Verse Top Row -->
                <div class="flex justify-between items-center mb-6">
                  <div class="flex items-center gap-2">
                    <span 
                      class="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border transition-all"
                      :class="activeVerseNumber === verse.number.inQuran 
                        ? 'bg-quran-gold-light border-quran-gold text-quran-deep' 
                        : (activeTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-quran-bg border-quran-gold-light text-quran-deep')"
                    >
                      {{ verse.number.inSurah }}
                    </span>
                    <span class="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest">
                      {{ getSurahInfo(verse.number.inQuran).name }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <!-- Bookmark Button -->
                    <button 
                      @click="toggleBookmark(verse)" 
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
                      :class="[
                        isBookmarked(verse)
                          ? 'bg-quran-gold text-quran-deep border-quran-gold shadow-sm'
                          : (activeTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100')
                      ]"
                      :title="isBookmarked(verse) ? 'Hapus Bookmark' : 'Tambah Bookmark'"
                    >
                      <i :class="isBookmarked(verse) ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'"></i>
                    </button>
                    <!-- Play Audio Button -->
                    <button 
                      @click="toggleAudio(verse)" 
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
                      :class="[
                        activeVerseNumber === verse.number.inQuran 
                          ? 'bg-quran-gold text-quran-deep border-quran-gold shadow-sm' 
                          : (activeTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100')
                      ]"
                      :title="activeVerseNumber === verse.number.inQuran && isAudioPlaying ? 'Pause' : 'Putar Audio'"
                    >
                      <i :class="(activeVerseNumber === verse.number.inQuran && isAudioPlaying) ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
                    </button>
                    <!-- Tafsir Ayat Button -->
                    <button 
                      @click="openVerseTafsir(verse)" 
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all cursor-pointer"
                      :class="activeTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-quran-bg hover:bg-quran-accent/10 text-gray-500 hover:text-quran-deep border-gray-100'"
                      title="Tafsir Ayat"
                    >
                      <i class="fa-solid fa-book"></i>
                    </button>
                  </div>
                </div>

                <!-- Arabic text -->
                <div 
                  class="font-arabic text-right mb-5 leading-loose font-medium"
                  :class="activeTheme === 'dark' ? 'text-slate-100' : (activeTheme === 'sepia' ? 'text-amber-950' : 'text-quran-deep')"
                  :style="{ fontSize: arabicFontSizeFactor + 'rem', lineHeight: (arabicFontSizeFactor * 0.9 + 1) }"
                  dir="rtl"
                >
                  {{ verse.text.arab }}
                </div>

                <!-- Latin Transliteration -->
                <p 
                  v-if="showTransliteration" 
                  class="text-sm font-medium italic mb-3 leading-relaxed"
                  :class="activeTheme === 'dark' ? 'text-slate-300' : (activeTheme === 'sepia' ? 'text-amber-900/90' : 'text-quran-medium/95')"
                >
                  {{ verse.text.transliteration.en }}
                </p>

                <!-- Translation -->
                <p 
                  v-if="showTranslation" 
                  class="text-sm font-normal leading-relaxed border-t pt-3"
                  :class="activeTheme === 'dark' ? 'text-slate-400 border-slate-800' : (activeTheme === 'sepia' ? 'text-amber-900/75 border-amber-200/30' : 'text-gray-600 border-gray-50')"
                >
                  {{ verse.translation.id }}
                </p>
              </div>
            </template>
          </div>

        </div>
      </div>

      <!-- Custom Modal (Green & Gold) -->
      <div v-if="showModal" class="fixed inset-0 bg-quran-deep/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 transition-all animate-fade-in" @click.self="closeModal">
        <div 
          class="rounded-2xl w-full max-w-lg border-2 shadow-2xl flex flex-col max-h-[85vh] transform transition-transform duration-300 animate-slide-up"
          :class="[
            activeTheme === 'dark' 
              ? 'bg-slate-900 border-quran-gold text-slate-100' 
              : (activeTheme === 'sepia' 
                  ? 'bg-[#fffcf3] border-amber-400 text-amber-950' 
                  : 'bg-white border-quran-gold text-quran-deep')
          ]"
        >
          <!-- Modal Header -->
          <div 
            class="px-6 py-4 flex justify-between items-center border-b-2"
            :class="[
              activeTheme === 'dark'
                ? 'bg-slate-950 text-white border-quran-gold'
                : (activeTheme === 'sepia'
                    ? 'bg-amber-900 text-amber-55 border-amber-450'
                    : 'bg-quran-deep text-white border-quran-gold')
            ]"
          >
            <h3 class="font-bold text-base flex items-center gap-2">
              <i class="fa-solid fa-book-open text-quran-gold"></i>
              {{ modalTitle }}
            </h3>
            <button 
              @click="closeModal" 
              class="hover:text-quran-gold text-2xl font-light focus:outline-none transition-colors"
              :class="activeTheme === 'sepia' ? 'text-amber-100 hover:text-amber-300' : 'text-white hover:text-quran-gold'"
            >&times;</button>
          </div>
          <!-- Modal Body -->
          <div 
            class="p-6 overflow-y-auto text-sm leading-relaxed"
            :class="[
              activeTheme === 'dark'
                ? 'text-slate-300'
                : (activeTheme === 'sepia'
                    ? 'text-amber-900'
                    : 'text-quran-deep')
            ]"
          >
            <!-- Tab Switcher for Verse Tafsir -->
            <div v-if="isVerseTafsirModal" class="flex border-b mb-5" :class="activeTheme === 'dark' ? 'border-slate-800' : (activeTheme === 'sepia' ? 'border-amber-200/40' : 'border-gray-100')">
              <button 
                @click="tafsirTab = 'wajiz'"
                class="flex-1 py-2 px-4 text-center font-semibold text-xs border-b-2 transition-all cursor-pointer focus:outline-none"
                :class="[
                  tafsirTab === 'wajiz'
                    ? (activeTheme === 'dark' ? 'text-quran-gold border-quran-gold font-bold' : (activeTheme === 'sepia' ? 'text-amber-800 border-amber-800 font-bold' : 'text-quran-medium border-quran-medium font-bold'))
                    : (activeTheme === 'dark' ? 'text-slate-500 border-transparent hover:text-slate-300' : (activeTheme === 'sepia' ? 'text-amber-900/40 border-transparent hover:text-amber-900/70' : 'text-gray-400 border-transparent hover:text-quran-medium'))
                ]"
              >
                Tafsir Wajiz (Ringkas)
              </button>
              <button 
                @click="tafsirTab = 'tahlili'"
                class="flex-1 py-2 px-4 text-center font-semibold text-xs border-b-2 transition-all cursor-pointer focus:outline-none"
                :class="[
                  tafsirTab === 'tahlili'
                    ? (activeTheme === 'dark' ? 'text-quran-gold border-quran-gold font-bold' : (activeTheme === 'sepia' ? 'text-amber-800 border-amber-800 font-bold' : 'text-quran-medium border-quran-medium font-bold'))
                    : (activeTheme === 'dark' ? 'text-slate-500 border-transparent hover:text-slate-300' : (activeTheme === 'sepia' ? 'text-amber-900/40 border-transparent hover:text-amber-900/70' : 'text-gray-400 border-transparent hover:text-quran-medium'))
                ]"
              >
                Tafsir Tahlili (Lengkap)
              </button>
            </div>

            <!-- Tafsir Content -->
            <p v-if="!isVerseTafsirModal" class="whitespace-pre-line text-justify">{{ modalText }}</p>
            <div v-else>
              <div v-if="tafsirTab === 'wajiz'" class="whitespace-pre-line text-justify leading-relaxed">{{ modalTafsirWajiz }}</div>
              <div v-else class="whitespace-pre-line text-justify leading-relaxed">{{ modalTafsirTahlili }}</div>
            </div>

            <div 
              class="mt-6 pt-3 border-t text-[10.5px] font-bold uppercase tracking-wider" 
              :class="activeTheme === 'dark' ? 'border-slate-800 text-slate-500' : (activeTheme === 'sepia' ? 'border-amber-200/40 text-amber-900/40' : 'border-gray-100 text-gray-400')"
            >
              Sumber Tafsir: Kemenag RI (Kementerian Agama Republik Indonesia)
            </div>
          </div>
          <!-- Modal Footer -->
          <div 
            class="px-6 py-4 border-t flex justify-end"
            :class="[
              activeTheme === 'dark'
                ? 'bg-slate-950/40 border-slate-800'
                : (activeTheme === 'sepia'
                    ? 'bg-amber-100/20 border-amber-200/40'
                    : 'bg-quran-bg border-gray-100')
            ]"
          >
            <button 
              @click="closeModal" 
              class="font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer text-white"
              :class="[
                activeTheme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : (activeTheme === 'sepia'
                      ? 'bg-amber-800 hover:bg-amber-900'
                      : 'bg-quran-medium hover:bg-quran-deep')
              ]"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      <!-- Floating Audio Player Bar -->
      <div 
        v-if="activeVerseNumber !== null && getSurahInfo(activeVerseNumber)" 
        class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-md rounded-2xl shadow-xl border p-4 flex items-center justify-between gap-4 transition-all duration-300 animate-slide-up"
        :class="[
          activeTheme === 'dark' 
            ? 'bg-slate-900/90 border-slate-750 text-slate-100 backdrop-blur-md' 
            : (activeTheme === 'sepia' 
                ? 'bg-[#fbf6e7]/90 border-amber-250 text-amber-950 backdrop-blur-md' 
                : 'bg-white/90 border-quran-gold/20 text-quran-deep backdrop-blur-md')
        ]"
      >
        <!-- Info -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="activeTheme === 'dark' ? 'bg-slate-800' : 'bg-quran-medium/10'">
            <i class="fa-solid fa-volume-high text-lg" :class="[isAudioPlaying ? 'animate-pulse text-quran-gold' : 'text-gray-400']"></i>
          </div>
          <div class="text-left">
            <p class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Sedang Diputar</p>
            <h5 class="font-bold text-xs leading-snug">
              Surah {{ getSurahInfo(activeVerseNumber).name }} Ayat {{ getSurahInfo(activeVerseNumber).verseInSurah }}
            </h5>
            <p class="text-[10px] text-quran-medium font-semibold" :class="activeTheme === 'dark' ? 'text-quran-gold-light' : 'text-quran-medium'">
              {{ activeQariName }}
            </p>
          </div>
        </div>
        
        <!-- Controls -->
        <div class="flex items-center gap-2">
          <!-- Pause/Play button -->
          <button 
            @click="toggleActiveAudio()" 
            class="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm text-white"
            :class="[
              activeTheme === 'dark' 
                ? 'bg-slate-800 hover:bg-slate-700 text-quran-gold border border-slate-700' 
                : (activeTheme === 'sepia' ? 'bg-amber-800 hover:bg-amber-900' : 'bg-quran-medium hover:bg-quran-deep')
            ]"
            :title="isAudioPlaying ? 'Pause' : 'Putar'"
          >
            <i class="fa-solid" :class="isAudioPlaying ? 'fa-pause' : 'fa-play'"></i>
          </button>
          
          <!-- Stop Button -->
          <button 
            @click="stopAudio()" 
            class="w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm text-red-500 hover:bg-red-500/10"
            :class="activeTheme === 'dark' ? 'border-slate-850' : 'border-gray-200'"
            title="Hentikan Audio"
          >
            <i class="fa-solid fa-stop"></i>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "JuzView",
  data() {
    return {
      juzNumber: 1,
      loaded: false,
      error: false,
      errMsg: "",
      juzData: {},
      verses: [],
      
      // Full list of surahs from API to help compute verse mapping
      surahList: [],

      // Preferences (persisted)
      arabicFontSizeFactor: 2.2,
      showTranslation: true,
      showTransliteration: true,
      activeTheme: "light",

      // Bookmarks & Jump Highlights
      bookmarks: [],
      highlightedVerseNumber: null,

      // Audio state
      activeVerseNumber: null,
      audioPlayer: null,

      // Modal state
      showModal: false,
      modalTitle: "",
      modalText: "",
      isVerseTafsirModal: false,
      tafsirTab: "wajiz",
      modalTafsirWajiz: "",
      modalTafsirTahlili: "",
      showCustomSettings: false,
      
      // Active Audio metadata
      activeVerseObject: null,
      isAudioPlaying: false,
      activeQariName: "",
      activeQariSlug: "",
    };
  },
  watch: {
    // Watch route params
    "$route.params.juz"(newVal) {
      if (newVal) {
        this.juzNumber = parseInt(newVal);
        this.stopAudio();
        this.fetchJuzDetails();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    showTranslation(newVal) {
      this.savePreference("quran_pref_show_translation", newVal);
    },
    showTransliteration(newVal) {
      this.savePreference("quran_pref_show_transliteration", newVal);
    },
    "$route.query.ayah"(newVal) {
      if (newVal) {
        const num = parseInt(newVal);
        this.scrollToVerse(num);
        this.highlightedVerseNumber = num;
        setTimeout(() => {
          if (this.highlightedVerseNumber === num) {
            this.highlightedVerseNumber = null;
          }
        }, 5000);
      }
    }
  },
  mounted() {
    const params = this.$route.params.juz;
    if (isNaN(params) || params < 1 || params > 30) {
      this.$router.push({ name: "Main" });
      return;
    }
    
    this.juzNumber = parseInt(params);
    this.loadPreferences();
    window.addEventListener("theme-changed", this.loadPreferences);
    this.loadBookmarks();
    this.fetchSurahList(); // Load surah list first to establish mapping, then load details
  },
  unmounted() {
    window.removeEventListener("theme-changed", this.loadPreferences);
    this.stopAudio();
  },
  methods: {
    loadPreferences() {
      const fontPref = localStorage.getItem("quran_pref_font_factor");
      if (fontPref) this.arabicFontSizeFactor = parseFloat(fontPref);

      const transPref = localStorage.getItem("quran_pref_show_translation");
      if (transPref) this.showTranslation = transPref === "true";

      const translitPref = localStorage.getItem("quran_pref_show_transliteration");
      if (translitPref) this.showTransliteration = translitPref === "true";

      const themePref = localStorage.getItem("quran_pref_theme");
      if (themePref) this.activeTheme = themePref;
    },
    savePreference(key, val) {
      localStorage.setItem(key, String(val));
    },
    changeTheme(theme) {
      this.activeTheme = theme;
      this.savePreference("quran_pref_theme", theme);
      window.dispatchEvent(new Event("theme-changed"));
    },
    increaseFontSize() {
      if (this.arabicFontSizeFactor < 3.8) {
        this.arabicFontSizeFactor = +(this.arabicFontSizeFactor + 0.2).toFixed(1);
        this.savePreference("quran_pref_font_factor", this.arabicFontSizeFactor);
      }
    },
    decreaseFontSize() {
      if (this.arabicFontSizeFactor > 1.6) {
        this.arabicFontSizeFactor = +(this.arabicFontSizeFactor - 0.2).toFixed(1);
        this.savePreference("quran_pref_font_factor", this.arabicFontSizeFactor);
      }
    },
    saveProgress(verseInQuran) {
      const info = this.getSurahInfo(verseInQuran);
      if (info) {
        localStorage.setItem(
          "lastReadSurah",
          JSON.stringify({
            number: info.number,
            name: info.name,
            arabic: info.arabic,
            lastAyah: info.verseInSurah,
            timestamp: Date.now(),
          })
        );
      }
    },
    getJuzLabel(j) {
      const labels = [
        "Al-Fatihah 1 - Al-Baqarah 141",
        "Al-Baqarah 142 - Al-Baqarah 252",
        "Al-Baqarah 253 - Ali 'Imran 92",
        "Ali 'Imran 93 - An-Nisa' 23",
        "An-Nisa' 24 - An-Nisa' 147",
        "An-Nisa' 148 - Al-Ma'idah 81",
        "Al-Ma'idah 82 - Al-An'am 110",
        "Al-An'am 111 - Al-A'raf 87",
        "Al-A'raf 88 - Al-Anfal 40",
        "Al-Anfal 41 - At-Taubah 92",
        "At-Taubah 93 - Hud 5",
        "Hud 6 - Yusuf 52",
        "Yusuf 53 - Ibrahim 52",
        "Al-Hijr 1 - An-Nahl 128",
        "Al-Isra' 1 - Al-Kahf 74",
        "Al-Kahf 75 - Ta Ha 135",
        "Al-Anbiya' 1 - Al-Hajj 78",
        "Al-Mu'minun 1 - Al-Furqan 20",
        "Al-Furqan 21 - An-Naml 55",
        "An-Naml 56 - Al-'Ankabut 45",
        "Al-'Ankabut 46 - Al-Ahzab 30",
        "Al-Ahzab 31 - Yasin 27",
        "Yasin 28 - Az-Zumar 31",
        "Az-Zumar 32 - Fussilat 46",
        "Fussilat 47 - Al-Jathiyah 37",
        "Al-Ahqaf 1 - Adz-Dzariyat 30",
        "Adz-Dzariyat 31 - Al-Hadid 29",
        "Al-Mujadilah 1 - At-Tahrim 12",
        "Al-Mulk 1 - Al-Mursalat 50",
        "An-Naba' 1 - An-Nas 6"
      ];
      return labels[j - 1] || "";
    },
    convertToArabicNumber(num) {
      const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
      return String(num)
        .split("")
        .map((char) => arabicNumerals[parseInt(char)] || char)
        .join("");
    },
    // Map absolute verse number in Quran (1-6236) to specific Surah details
    getSurahInfo(inQuranValue) {
      if (this.surahList.length === 0) return { number: 1, name: "Loading...", arabic: "", translation: "", verseInSurah: 1 };
      let count = 0;
      for (const s of this.surahList) {
        if (inQuranValue > count && inQuranValue <= count + s.numberOfVerses) {
          return {
            number: s.number,
            name: s.name.transliteration.id,
            arabic: s.name.short,
            translation: s.name.translation.id,
            verseInSurah: inQuranValue - count
          };
        }
        count += s.numberOfVerses;
      }
      return { number: 1, name: "", arabic: "", translation: "", verseInSurah: 1 };
    },
    getVerseLabel(inQuranValue) {
      const info = this.getSurahInfo(inQuranValue);
      return info ? `${info.name} - ${info.verseInSurah}` : "";
    },
    isNewSurah(curr, prev) {
      if (!prev) return true;
      const currInfo = this.getSurahInfo(curr.number.inQuran);
      const prevInfo = this.getSurahInfo(prev.number.inQuran);
      return currInfo && prevInfo && currInfo.number !== prevInfo.number;
    },
    fetchJuzDetails() {
      this.loaded = false;
      this.error = false;
      
      const baseApiUrl =
        import.meta.env.VITE_API_URL ||
        import.meta.env.VUE_APP_MAIN_API_URL ||
        "https://aqa.khuirulhuda.me.eu.org";
        
      const url = `${baseApiUrl}/juz/${this.juzNumber}`;

      axios
        .get(url)
        .then((res) => {
          if (res.data && res.data.data) {
            this.juzData = res.data.data;
            this.verses = this.juzData.verses;
            if (this.verses.length > 0) {
              this.saveProgress(this.verses[0].number.inQuran);
            }
            
            // Check for deep-linked ayah query
            this.$nextTick(() => {
              const queryAyah = this.$route.query.ayah;
              if (queryAyah) {
                const num = parseInt(queryAyah);
                this.scrollToVerse(num);
                this.highlightedVerseNumber = num;
                setTimeout(() => {
                  if (this.highlightedVerseNumber === num) {
                    this.highlightedVerseNumber = null;
                  }
                }, 5000);
              }
            });
          } else {
            throw new Error("Respon data tidak sesuai.");
          }
        })
        .catch((err) => {
          console.error(err);
          this.errMsg = err.message || "Gagal mengambil data Juz.";
          this.error = true;
        })
        .finally(() => {
          this.loaded = true;
        });
    },
    fetchSurahList() {
      const baseApiUrl =
        import.meta.env.VITE_API_URL ||
        import.meta.env.VUE_APP_MAIN_API_URL ||
        "https://aqa.khuirulhuda.me.eu.org";
        
      const url = `${baseApiUrl}/surah`;

      axios
        .get(url)
        .then((res) => {
          if (res.data && res.data.data) {
            this.surahList = res.data.data;
            this.fetchJuzDetails(); // Fetch details after mapping is ready
          }
        })
        .catch((err) => {
          console.error("Failed to load surah list for Juz mapping:", err);
          this.fetchJuzDetails();
        });
    },
    scrollToVerse(inQuranValue) {
      if (!inQuranValue) return;
      const el = document.getElementById(`verse-${inQuranValue}`);
      if (el) {
        const offset = 160;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        this.saveProgress(parseInt(inQuranValue));
      }
    },
    
    // Custom Modal Methods
    openVerseTafsir(verse) {
      const info = this.getSurahInfo(verse.number.inQuran);
      this.isVerseTafsirModal = true;
      this.tafsirTab = "wajiz";
      this.modalTitle = `Tafsir ${info.name} Ayat ${verse.number.inSurah}`;
      this.modalTafsirWajiz = verse.tafsir && verse.tafsir.id && verse.tafsir.id.short 
        ? verse.tafsir.id.short 
        : "Tidak ada detail tafsir wajiz untuk ayat ini.";
      this.modalTafsirTahlili = verse.tafsir && verse.tafsir.id && verse.tafsir.id.long 
        ? verse.tafsir.id.long 
        : "Tidak ada detail tafsir tahlili untuk ayat ini.";
      this.showModal = true;
      this.saveProgress(verse.number.inQuran);
    },
    closeModal() {
      this.showModal = false;
    },

    // Bookmarking Methods
    loadBookmarks() {
      const list = localStorage.getItem("quran_bookmarks");
      if (list) {
        try {
          this.bookmarks = JSON.parse(list);
        } catch (e) {
          console.error("Failed to load bookmarks:", e);
          this.bookmarks = [];
        }
      } else {
        this.bookmarks = [];
      }
    },
    isBookmarked(verse) {
      const info = this.getSurahInfo(verse.number.inQuran);
      if (!info) return false;
      return this.bookmarks.some(
        (b) => b.surahNumber === info.number && b.verseNumber === info.verseInSurah
      );
    },
    toggleBookmark(verse) {
      const info = this.getSurahInfo(verse.number.inQuran);
      if (!info) return;
      const idx = this.bookmarks.findIndex(
        (b) => b.surahNumber === info.number && b.verseNumber === info.verseInSurah
      );
      if (idx > -1) {
        this.bookmarks.splice(idx, 1);
      } else {
        this.bookmarks.push({
          id: `${info.number}_${info.verseInSurah}`,
          surahNumber: info.number,
          surahName: info.name,
          surahArabic: info.arabic,
          verseNumber: info.verseInSurah
        });
      }
      localStorage.setItem("quran_bookmarks", JSON.stringify(this.bookmarks));
      window.dispatchEvent(new Event("theme-changed")); // Sync with home / settings listing
    },

    // Audio Methods
    getQariName(slug) {
      const qariList = {
        "ar.alafasy": "Syaikh Mishary Rashid Alafasy",
        "ar.sudais": "Syaikh Abdurrahman As-Sudais",
        "ar.mahermuaiqly": "Syaikh Maher Al-Muaiqly",
        "ar.abdullahbasfar": "Syaikh Abdullah Basfar"
      };
      return qariList[slug] || "Syaikh Mishary Rashid Alafasy";
    },
    getAudioUrl(verse) {
      const qari = localStorage.getItem("quran_pref_qari") || "ar.alafasy";
      let url = verse.audio.primary;
      if (!url && verse.audio.secondary && verse.audio.secondary.length > 0) {
        url = verse.audio.secondary[0];
      }
      if (url) {
        return url.replace(/ar\.alafasy/g, qari);
      }
      return "";
    },
    toggleAudio(verse) {
      if (this.activeVerseNumber === verse.number.inQuran) {
        if (this.isAudioPlaying) {
          if (this.audioPlayer) this.audioPlayer.pause();
          this.isAudioPlaying = false;
        } else {
          if (this.audioPlayer) {
            this.audioPlayer.play().catch(err => console.error(err));
            this.isAudioPlaying = true;
          }
        }
        return;
      }

      this.stopAudio();

      const audioUrl = this.getAudioUrl(verse);
      if (audioUrl) {
        const qari = localStorage.getItem("quran_pref_qari") || "ar.alafasy";
        this.activeQariSlug = qari;
        this.activeQariName = this.getQariName(qari);
        
        this.activeVerseNumber = verse.number.inQuran;
        this.activeVerseObject = verse;
        this.audioPlayer = new Audio(audioUrl);
        this.isAudioPlaying = true;
        
        this.audioPlayer.play().catch((err) => {
          console.error("Audio playback failed:", err);
          this.stopAudio();
        });

        this.audioPlayer.addEventListener("ended", () => {
          this.playNextVerse();
        });

        this.saveProgress(verse.number.inQuran);
      }
    },
    toggleActiveAudio() {
      if (this.activeVerseObject) {
        this.toggleAudio(this.activeVerseObject);
      }
    },
    playNextVerse() {
      const currentIndex = this.verses.findIndex((v) => v.number.inQuran === this.activeVerseNumber);
      if (currentIndex > -1 && currentIndex < this.verses.length - 1) {
        const nextVerse = this.verses[currentIndex + 1];
        this.toggleAudio(nextVerse);
        this.scrollToVerse(nextVerse.number.inQuran);
      } else {
        this.stopAudio();
      }
    },
    stopAudio() {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
        this.audioPlayer = null;
      }
      this.activeVerseNumber = null;
      this.activeVerseObject = null;
      this.isAudioPlaying = false;
    },
    onJumpChange(inQuranValue) {
      if (!inQuranValue) return;
      const num = parseInt(inQuranValue);
      this.$router.push({ query: { ayah: num } }).catch(() => {});
    },
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
