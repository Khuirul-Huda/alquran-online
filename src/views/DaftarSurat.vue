<template>
  <div class="pb-12">
    <!-- Hero Header -->
    <div
      class="relative overflow-hidden bg-quran-deep text-white px-6 py-16 md:py-20 rounded-b-[2.5rem] shadow-md border-b border-quran-gold/20"
    >
      <!-- Decorative gold circle background elements -->
      <div
        class="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full border border-quran-gold/10 pointer-events-none"
      ></div>
      <div
        class="absolute bottom-[-15%] left-[-5%] w-[250px] h-[250px] rounded-full border border-quran-gold/5 pointer-events-none"
      ></div>

      <div class="max-w-6xl mx-auto text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in">
          Al-Quran <span class="text-quran-gold">Online</span>
        </h1>

        <!-- Randomly selected quote verse -->
        <div v-if="randomVerse" class="my-6 max-w-3xl mx-auto animate-fade-in">
          <p
            class="font-arabic text-2xl md:text-3xl text-quran-gold leading-relaxed mb-4 direction-rtl"
            dir="rtl"
          >
            {{ randomVerse.arabic }}
          </p>
          <p class="text-sm md:text-base font-light italic opacity-95 max-w-2xl mx-auto leading-relaxed">
            "{{ randomVerse.translation[preferencesStore.language] }}"
          </p>
          <div class="flex flex-col items-center gap-3 mt-4">
            <span
              class="inline-block text-xs font-semibold text-quran-gold-light bg-white/10 px-3 py-1 rounded-full border border-white/5"
            >
              {{ randomVerse.reference[preferencesStore.language] }}
            </span>
            <router-link
              :to="'/read/' + randomVerse.surahNumber + '?ayah=' + randomVerse.ayahNumber"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-quran-gold hover:text-white bg-white/10 hover:bg-white/20 border border-quran-gold/40 hover:border-white px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
            >
              {{ preferencesStore.language === 'en' ? 'Read This Ayah' : 'Baca Ayat Ini' }} <i class="fa-solid fa-arrow-right text-xs"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="max-w-6xl mx-auto px-4 mt-8">
      <!-- View Toggle Tabs (Surah vs Juz) -->
      <div class="flex border-b border-gray-200/60 mb-8 max-w-sm">
        <button
          @click="activeTab = 'surah'"
          class="flex-1 text-center py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer border-none bg-transparent"
          :class="
            activeTab === 'surah'
              ? preferencesStore.theme === 'dark'
                ? 'border-quran-gold text-quran-gold'
                : 'border-quran-medium text-quran-deep'
              : 'border-transparent text-gray-400 hover:text-quran-medium'
          "
        >
          <i class="fa-solid fa-list-ol mr-1.5"></i> {{ t('surahList') }}
        </button>
        <button
          @click="activeTab = 'juz'"
          class="flex-1 text-center py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer border-none bg-transparent"
          :class="
            activeTab === 'juz'
              ? preferencesStore.theme === 'dark'
                ? 'border-quran-gold text-quran-gold'
                : 'border-quran-medium text-quran-deep'
              : 'border-transparent text-gray-400 hover:text-quran-medium'
          "
        >
          <i class="fa-solid fa-box-archive mr-1.5"></i> {{ t('juzList') }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Left 3 Columns: Grid Lists -->
        <div class="lg:col-span-3 order-1">
          <!-- Tab 1: Surah View -->
          <div v-if="activeTab === 'surah'">
            <!-- Search Bar -->
            <div class="relative max-w-xl mb-8 shadow-sm">
              <i
                class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-quran-light text-base"
              ></i>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('searchSurah')"
                class="w-full pl-11 pr-4 py-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-quran-light/20 focus:border-quran-light focus:shadow-md transition-all duration-200"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-quran-gold focus:ring-quran-gold/10'
                    : 'bg-white border-quran-medium/10 text-quran-deep placeholder-gray-400'
                "
              />
            </div>

            <!-- Loading Skeleton -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div
                v-for="h in 12"
                :key="h"
                class="border rounded-2xl p-5 h-40 flex flex-col justify-between relative overflow-hidden"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-quran-medium/5'
                "
              >
                <div class="flex justify-between items-start">
                  <div class="animate-shimmer w-9 h-9 rounded-full"></div>
                  <div class="animate-shimmer w-20 h-7 rounded-md"></div>
                </div>
                <div>
                  <div class="animate-shimmer w-3/4 h-5 rounded-md mb-2"></div>
                  <div class="animate-shimmer w-1/2 h-3.5 rounded-md mb-3"></div>
                  <div class="animate-shimmer w-1/3 h-3 rounded-md"></div>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="flex justify-center items-center py-16">
              <div
                class="rounded-2xl p-8 text-center max-w-sm shadow-sm border animate-fade-in"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-100'
                    : 'bg-white border-red-100 text-gray-900'
                "
              >
                <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
                <h3
                  class="font-bold text-lg mb-2"
                  :class="preferencesStore.theme === 'dark' ? 'text-white' : 'text-gray-900'"
                >
                  {{ t('errorTitle') }}
                </h3>
                <p
                  class="text-sm mb-6"
                  :class="preferencesStore.theme === 'dark' ? 'text-slate-400' : 'text-gray-500'"
                >
                  {{ errMsg }}
                </p>
                <button
                  @click="fetchSurah"
                  class="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm cursor-pointer border-none"
                >
                  {{ t('tryAgain') }}
                </button>
              </div>
            </div>

            <!-- Content -->
            <div v-else>
              <!-- No Results -->
              <div v-if="filteredSurah.length === 0" class="text-center py-16">
                <i class="fa-solid fa-box-open text-gray-300 text-5xl mb-4"></i>
                <p class="text-gray-500 font-medium">
                  {{ preferencesStore.language === 'en' ? 'No surah matching "' + searchQuery + '"' : 'Tidak ada surah yang cocok dengan "' + searchQuery + '"' }}
                </p>
              </div>

              <!-- Grid -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
                <div v-for="suratt in filteredSurah" :key="suratt.number">
                  <Surat
                    :surat="preferencesStore.language === 'en' ? suratt.name.transliteration.en : suratt.name.transliteration.id"
                    :arabic="suratt.name.short"
                    :arti="preferencesStore.language === 'en' ? suratt.name.translation.en : suratt.name.translation.id"
                    :ke="suratt.number"
                    :revelation="preferencesStore.language === 'en' ? suratt.revelation.en : suratt.revelation.id"
                    :verses="suratt.number_of_verses || suratt.numberOfVerses"
                    :theme="preferencesStore.theme"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Juz View -->
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
              <router-link
                v-for="j in juzList"
                :key="j.number"
                :to="'/juz/' + j.number"
                class="themed-card border rounded-2xl p-5 hover:shadow-md hover:border-quran-gold/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-full relative overflow-hidden"
              >
                <div class="flex justify-between items-center mb-3">
                  <span
                    class="w-8 h-8 rounded-full bg-quran-bg text-quran-deep font-bold flex items-center justify-center text-sm border border-quran-gold-light group-hover:bg-quran-gold-light group-hover:border-quran-gold transition-colors duration-300"
                  >
                    {{ j.number }}
                  </span>
                  <span class="text-xs font-bold text-quran-medium uppercase tracking-wider"
                    >Juz {{ j.number }}</span
                  >
                </div>
                <div>
                  <h3
                    class="font-bold text-sm transition-colors mb-1"
                    :class="
                      preferencesStore.theme === 'dark'
                        ? 'text-slate-100 group-hover:text-quran-gold'
                        : 'text-quran-deep group-hover:text-quran-medium'
                    "
                  >
                    {{ j.start.split(":")[0] }} - {{ j.end.split(":")[0] }}
                  </h3>
                  <p class="text-xs text-gray-400 font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-location-arrow text-quran-gold"></i>
                    <span>Mulai: {{ j.start }} s/d {{ j.end }}</span>
                  </p>
                </div>
                <!-- Solid highlight bar -->
                <div
                  class="absolute bottom-0 left-0 w-0 h-1 bg-quran-gold transition-all duration-300 group-hover:w-full"
                ></div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right 1 Column: Stats, Shalat Times, Shortcuts Sidebar -->
        <div class="lg:col-span-1 flex flex-col gap-6 order-2 lg:mt-0">
          <!-- Last Read / Continue Reading Card -->
          <div
            v-if="preferencesStore.lastRead"
            class="border rounded-2xl p-5 shadow-sm transition-all duration-300 animate-fade-in"
            :class="[
              preferencesStore.theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : preferencesStore.theme === 'sepia'
                ? 'bg-[#fffcf3] border-amber-200/50'
                : 'bg-quran-cream border-quran-gold/30',
            ]"
          >
            <h4
              class="text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5"
              :class="
                preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-medium'
              "
            >
              <i class="fa-solid fa-bookmark"></i> {{ t('lastRead') }}
            </h4>
            <div class="flex justify-between items-center">
              <div>
                <h3
                  class="font-bold text-base"
                  :class="preferencesStore.theme === 'dark' ? 'text-white' : 'text-quran-deep'"
                >
                  {{ preferencesStore.lastRead.name }}
                </h3>
                <p
                  class="text-xs font-medium mt-0.5"
                  :class="preferencesStore.theme === 'dark' ? 'text-slate-400' : 'text-gray-500'"
                >
                  {{ preferencesStore.language === 'en' ? 'Ayah ' + (preferencesStore.lastRead.lastAyah || 1) + ' of ' + (preferencesStore.lastRead.verseCount || '...') : 'Ayat ' + (preferencesStore.lastRead.lastAyah || 1) + ' dari ' + (preferencesStore.lastRead.verseCount || '...') }}
                </p>
              </div>
              <span
                class="font-arabic text-xl"
                :class="
                  preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-medium'
                "
                >{{ preferencesStore.lastRead.arabic }}</span
              >
            </div>

            <!-- Reading progress percentage bar -->
            <div v-if="preferencesStore.lastRead.verseCount" class="mt-3.5 mb-4">
              <div
                class="flex justify-between items-center text-[11px] font-bold uppercase mb-1"
                :class="preferencesStore.theme === 'dark' ? 'text-slate-500' : 'text-gray-400'"
              >
                <span>{{ preferencesStore.language === 'en' ? 'Progress' : 'Progres' }}</span>
                <span>{{
                  Math.round(
                    (preferencesStore.lastRead.lastAyah /
                      preferencesStore.lastRead.verseCount) *
                      100
                  )
                }}%</span>
              </div>
              <div
                class="w-full h-1.5 rounded-full overflow-hidden"
                :class="preferencesStore.theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200/50'"
              >
                <div
                  class="h-full bg-quran-medium transition-all"
                  :style="{
                    width:
                      Math.round(
                        (preferencesStore.lastRead.lastAyah /
                          preferencesStore.lastRead.verseCount) *
                          100
                      ) + '%',
                  }"
                ></div>
              </div>
            </div>

            <router-link
              :to="
                '/read/' +
                preferencesStore.lastRead.number +
                '?ayah=' +
                (preferencesStore.lastRead.lastAyah || 1)
              "
              class="w-full text-center block bg-quran-medium hover:bg-quran-deep text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors duration-200 shadow-sm"
            >
              {{ preferencesStore.language === 'en' ? 'Resume Reading' : 'Lanjut Membaca' }}
            </router-link>
          </div>

          <!-- Bookmarked Verses Sidebar Card -->
          <div v-if="bookmarksStore.bookmarks.length > 0" class="themed-card rounded-2xl p-5 shadow-sm">
            <h4
              class="text-xs uppercase tracking-wider font-bold text-quran-medium mb-4 flex items-center gap-1.5 border-b border-gray-100/50 pb-2"
            >
              <i class="fa-solid fa-bookmark text-quran-gold"></i> {{ preferencesStore.language === 'en' ? 'Favorite Verses' : 'Ayat Favorit' }}
            </h4>
            <div class="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
              <router-link
                v-for="b in bookmarksStore.bookmarks"
                :key="b.id"
                :to="'/read/' + b.surahNumber + '?ayah=' + b.verseNumber"
                class="flex items-center justify-between p-2.5 rounded-xl border border-transparent transition-all duration-200 group text-xs font-semibold"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'hover:bg-slate-800 hover:border-slate-800'
                    : preferencesStore.theme === 'sepia'
                    ? 'hover:bg-amber-100/40 hover:border-amber-250/20'
                    : 'hover:bg-quran-bg hover:border-quran-medium/10'
                "
              >
                <div class="flex items-center gap-2">
                  <span
                    class="font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border transition-all"
                    :class="
                      preferencesStore.theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-slate-300'
                        : 'bg-quran-bg text-quran-deep border-gray-100 group-hover:bg-quran-gold-light group-hover:border-quran-gold/30'
                    "
                  >
                    {{ b.verseNumber }}
                  </span>
                  <span
                    class="transition-colors"
                    :class="
                      preferencesStore.theme === 'dark'
                        ? 'text-slate-300 group-hover:text-quran-gold'
                        : 'text-gray-600 group-hover:text-quran-medium'
                    "
                    >{{ b.surahName }}</span
                  >
                </div>
                <span class="font-arabic text-sm text-quran-medium">{{ b.surahArabic }}</span>
              </router-link>
            </div>
          </div>

          <!-- Privacy-Safe Shalat Times Widget (Dropdown Selection) -->
          <div class="themed-card rounded-2xl p-5 shadow-sm">
            <div class="flex justify-between items-center mb-3 border-b border-gray-100/50 pb-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-quran-medium flex items-center gap-1.5">
                <i class="fa-solid fa-clock"></i> {{ t('prayerTimes') }}
              </h4>
              <!-- City Dropdown Selector -->
              <select
                v-model="selectedCityComputed"
                class="border rounded-lg text-xs font-bold p-1 cursor-pointer outline-none focus:ring-1 focus:ring-quran-light max-w-[100px] transition-colors"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-white'
                    : preferencesStore.theme === 'sepia'
                    ? 'bg-[#fffdf0] border-amber-200/60 text-amber-950'
                    : 'bg-quran-bg border-gray-200 text-quran-deep'
                "
              >
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <!-- Loading Shalat state -->
            <div v-if="shalatLoading" class="flex flex-col gap-2 py-4 text-center">
              <div class="animate-spin text-quran-medium text-lg">
                <i class="fa-solid fa-circle-notch"></i>
              </div>
              <span class="text-xs text-gray-400">{{ t('loading') }}</span>
            </div>

            <!-- Shalat Timings List -->
            <div v-else-if="shalatTimes" class="flex flex-col gap-2.5 text-xs font-semibold">
              <div
                v-for="(time, name) in formattedShalatTimes"
                :key="name"
                class="flex justify-between p-2 rounded-xl border border-transparent transition-all"
                :class="[
                  nextPrayerName === name
                    ? preferencesStore.theme === 'dark'
                      ? 'bg-quran-gold/10 border-quran-gold/25 text-quran-gold ring-1 ring-quran-gold/5'
                      : preferencesStore.theme === 'sepia'
                      ? 'bg-amber-100/50 border-amber-300/40 text-amber-950 ring-1 ring-amber-300/20'
                      : 'bg-quran-accent/10 border-quran-accent/25 text-quran-deep ring-1 ring-quran-accent/5'
                    : preferencesStore.theme === 'dark'
                    ? 'text-slate-400'
                    : preferencesStore.theme === 'sepia'
                    ? 'text-amber-900/70'
                    : 'text-gray-600',
                ]"
              >
                <span class="flex items-center gap-1.5">
                  <i :class="getShalatIcon(name)" class="text-quran-gold text-xs"></i>
                  <span>{{ translateShalatName(name) }}</span>
                </span>
                <span class="flex items-center gap-1.5">
                  <span>{{ time }}</span>
                  <span
                    v-if="nextPrayerName === name"
                    class="text-[10.5px] bg-quran-medium text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse"
                    >{{ preferencesStore.language === 'en' ? 'Next' : 'Berikutnya' }}</span
                  >
                </span>
              </div>
            </div>

            <div v-else class="text-center py-4 text-xs text-gray-400 italic">
              {{ preferencesStore.language === 'en' ? 'Failed to load prayer times.' : 'Gagal memuat jadwal shalat.' }}
            </div>
          </div>

          <!-- Quick Shortcuts for Popular Surahs -->
          <div class="themed-card rounded-2xl p-5 shadow-sm">
            <h4
              class="text-xs uppercase tracking-wider font-bold text-quran-medium mb-4 flex items-center gap-1.5 border-b border-gray-100/50 pb-2"
            >
              <i class="fa-solid fa-star"></i> {{ preferencesStore.language === 'en' ? 'Popular Surahs' : 'Surah Pintasan' }}
            </h4>
            <div class="flex flex-col gap-2">
              <router-link
                v-for="shortcut in popularSurahs"
                :key="shortcut.number"
                :to="'/read/' + shortcut.number"
                class="flex items-center justify-between p-2.5 rounded-xl border border-transparent transition-all duration-200 group text-xs font-semibold"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'hover:bg-slate-800 hover:border-slate-800'
                    : preferencesStore.theme === 'sepia'
                    ? 'hover:bg-amber-100/40 hover:border-amber-250/20'
                    : 'hover:bg-quran-bg hover:border-quran-medium/10'
                "
              >
                <div class="flex items-center gap-3">
                  <span
                    class="font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border transition-all"
                    :class="
                      preferencesStore.theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-slate-300'
                        : 'bg-quran-bg text-quran-deep border-gray-100 group-hover:bg-quran-gold-light group-hover:border-quran-gold/30'
                    "
                  >
                    {{ shortcut.number }}
                  </span>
                  <span
                    class="transition-colors"
                    :class="
                      preferencesStore.theme === 'dark'
                        ? 'text-slate-300 group-hover:text-quran-gold'
                        : 'text-gray-600 group-hover:text-quran-medium'
                    "
                    >{{ shortcut.name }}</span
                  >
                </div>
                <span class="font-arabic text-sm text-quran-medium">{{ shortcut.arabic }}</span>
              </router-link>
            </div>
          </div>

          <!-- Quran Statistics Widget -->
          <div class="themed-card rounded-2xl p-5 shadow-sm">
            <h4
              class="text-xs uppercase tracking-wider font-bold text-quran-medium mb-4 flex items-center gap-1.5 border-b border-gray-100/50 pb-2"
            >
              <i class="fa-solid fa-chart-simple"></i> Informasi Al-Quran
            </h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div
                class="p-3 rounded-xl border text-center transition-colors"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-800 text-slate-100'
                    : preferencesStore.theme === 'sepia'
                    ? 'bg-[#fffdf0] border-amber-200/20 text-amber-950'
                    : 'bg-quran-bg/60 border-gray-100/50 text-quran-deep'
                "
              >
                <span
                  class="block text-xl font-bold leading-none mb-1"
                  :class="
                    preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'
                  "
                  >114</span
                >
                <span
                  class="text-xs font-semibold uppercase tracking-wider"
                  :class="preferencesStore.theme === 'dark' ? 'text-slate-500' : 'text-gray-500'"
                  >Surah</span
                >
              </div>
              <div
                class="p-3 rounded-xl border text-center transition-colors"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-800 text-slate-100'
                    : preferencesStore.theme === 'sepia'
                    ? 'bg-[#fffdf0] border-amber-200/20 text-amber-950'
                    : 'bg-quran-bg/60 border-gray-100/50 text-quran-deep'
                "
              >
                <span
                  class="block text-xl font-bold leading-none mb-1"
                  :class="
                    preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'
                  "
                  >30</span
                >
                <span
                  class="text-xs font-semibold uppercase tracking-wider"
                  :class="preferencesStore.theme === 'dark' ? 'text-slate-500' : 'text-gray-500'"
                  >Juz</span
                >
              </div>
              <div
                class="p-3 rounded-xl border text-center transition-colors"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-800 text-slate-100'
                    : preferencesStore.theme === 'sepia'
                    ? 'bg-[#fffdf0] border-amber-200/20 text-amber-950'
                    : 'bg-quran-bg/60 border-gray-100/50 text-quran-deep'
                "
              >
                <span
                  class="block text-xl font-bold leading-none mb-1"
                  :class="
                    preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'
                  "
                  >6236</span
                >
                <span
                  class="text-xs font-semibold uppercase tracking-wider"
                  :class="preferencesStore.theme === 'dark' ? 'text-slate-500' : 'text-gray-500'"
                  >Ayat</span
                >
              </div>
              <div
                class="p-3 rounded-xl border text-center transition-colors"
                :class="
                  preferencesStore.theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-800 text-slate-100'
                    : preferencesStore.theme === 'sepia'
                    ? 'bg-[#fffdf0] border-amber-200/20 text-amber-950'
                    : 'bg-quran-bg/60 border-gray-100/50 text-quran-deep'
                "
              >
                <span
                  class="block text-xl font-bold leading-none mb-1"
                  :class="
                    preferencesStore.theme === 'dark' ? 'text-quran-gold' : 'text-quran-deep'
                  "
                  >77.430</span
                >
                <span
                  class="text-xs font-semibold uppercase tracking-wider"
                  :class="preferencesStore.theme === 'dark' ? 'text-slate-500' : 'text-gray-500'"
                  >Kata</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Surat from "../components/Surat.vue";
import { quranApi } from "../services/quranApi";
import { usePreferencesStore } from "../stores/preferences";
import { useBookmarksStore } from "../stores/bookmarks";
import { useI18n } from "../composables/useI18n";

const preferencesStore = usePreferencesStore();
const bookmarksStore = useBookmarksStore();
const { t } = useI18n();

const surat = ref([]);
const loading = ref(true);
const error = ref(false);
const errMsg = ref("Terjadi kesalahan saat mengambil data.");
const searchQuery = ref("");
const activeTab = ref("surah");

const randomVerse = ref(null);
const shalatTimes = ref(null);
const shalatLoading = ref(false);
const nextPrayerName = ref("");

// Inspirational verse list for dynamic selection
const INSPIRATIONAL_VERSES = [
  {
    arabic:
      "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ۚ وَلَوْ كَانَ مِنْ عِنْدِ غَيْرِ اللَّهِ لَوَجَدُوا فِيهِ اخْتِلَافًا كَثِيرًا",
    translation: {
      id: "Maka tidakkah mereka menghayati (mendalami) Al-Qur'an? Sekiranya (Al-Qur'an) itu bukan dari Allah, pastilah mereka menemukan banyak hal yang bertentangan di dalamnya.",
      en: "Then do they not reflect upon the Qur'an? If it had been from [any] other than Allah, they would have found within it much contradiction."
    },
    reference: {
      id: "QS. An-Nisa': 82",
      en: "Quran An-Nisa': 82"
    },
    surahNumber: 4,
    ayahNumber: 82,
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: {
      id: "Sesungguhnya beserta kesulitan itu ada kemudahan.",
      en: "For indeed, with hardship [will be] ease."
    },
    reference: {
      id: "QS. Al-Insyirah: 6",
      en: "Quran Al-Sharh: 6"
    },
    surahNumber: 94,
    ayahNumber: 6,
  },
  {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: {
      id: "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka (jawablah), bahwasanya Aku adalah dekat. Aku mengabulkan permohonan orang yang berdoa apabila ia memohon kepada-Ku.",
      en: "And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me."
    },
    reference: {
      id: "QS. Al-Baqarah: 186",
      en: "Quran Al-Baqarah: 186"
    },
    surahNumber: 2,
    ayahNumber: 186,
  },
  {
    arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ",
    translation: {
      id: "Dan Kami turunkan dari Al-Qur'an suatu yang menjadi penawar (obat) dan rahmat bagi orang-orang yang beriman.",
      en: "And We send down of the Qur'an that which is healing and mercy for the believers."
    },
    reference: {
      id: "QS. Al-Isra': 82",
      en: "Quran Al-Isra': 82"
    },
    surahNumber: 17,
    ayahNumber: 82,
  },
  {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    translation: {
      id: "Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur.",
      en: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep."
    },
    reference: {
      id: "QS. Al-Baqarah: 255 (Ayat Kursi)",
      en: "Quran Al-Baqarah: 255 (Ayat al-Kursi)"
    },
    surahNumber: 2,
    ayahNumber: 255,
  },
  {
    arabic: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ",
    translation: "Serulah (manusia) kepada jalan Tuhan-mu dengan hikmah dan pelajaran yang baik.",
    reference: "QS. An-Nahl: 125",
    surahNumber: 16,
    ayahNumber: 125,
  },
];

// Juz metadata (30 Juz structures)
const juzList = [
  { number: 1, start: "Al-Fatihah: 1", end: "Al-Baqarah: 141" },
  { number: 2, start: "Al-Baqarah: 142", end: "Al-Baqarah: 252" },
  { number: 3, start: "Al-Baqarah: 253", end: "Ali 'Imran: 92" },
  { number: 4, start: "Ali 'Imran: 93", end: "An-Nisa': 23" },
  { number: 5, start: "An-Nisa': 24", end: "An-Nisa': 147" },
  { number: 6, start: "An-Nisa': 148", end: "Al-Ma'idah: 81" },
  { number: 7, start: "Al-Ma'idah: 82", end: "Al-An'am: 110" },
  { number: 8, start: "Al-An'am: 111", end: "Al-A'raf: 87" },
  { number: 9, start: "Al-A'raf: 88", end: "Al-Anfal: 40" },
  { number: 10, start: "Al-Anfal: 41", end: "At-Taubah: 92" },
  { number: 11, start: "At-Taubah: 93", end: "Hud: 5" },
  { number: 12, start: "Hud: 6", end: "Yusuf: 52" },
  { number: 13, start: "Yusuf: 53", end: "Ibrahim: 52" },
  { number: 14, start: "Al-Hijr: 1", end: "An-Nahl: 128" },
  { number: 15, start: "Al-Isra': 1", end: "Al-Kahf: 74" },
  { number: 16, start: "Al-Kahf: 75", end: "Ta Ha: 135" },
  { number: 17, start: "Al-Anbiya': 1", end: "Al-Hajj: 78" },
  { number: 18, start: "Al-Mu'minun: 1", end: "Al-Furqan: 20" },
  { number: 19, start: "Al-Furqan: 21", end: "An-Naml: 55" },
  { number: 20, start: "An-Naml: 56", end: "Al-'Ankabut: 45" },
  { number: 21, start: "Al-'Ankabut: 46", end: "Al-Ahzab: 30" },
  { number: 22, start: "Al-Ahzab: 31", end: "Yasin: 27" },
  { number: 23, start: "Yasin: 28", end: "Az-Zumar: 31" },
  { number: 24, start: "Az-Zumar: 32", end: "Fussilat: 46" },
  { number: 25, start: "Fussilat: 47", end: "Al-Jathiyah: 37" },
  { number: 26, start: "Al-Ahqaf: 1", end: "Adz-Dzariyat: 30" },
  { number: 27, start: "Adz-Dzariyat: 31", end: "Al-Hadid: 29" },
  { number: 28, start: "Al-Mujadilah: 1", end: "At-Tahrim: 12" },
  { number: 29, start: "Al-Mulk: 1", end: "Al-Mursalat: 50" },
  { number: 30, start: "An-Naba': 1", end: "An-Nas: 6" },
];

const popularSurahs = [
  { number: 18, name: "Al-Kahfi", arabic: "الكهف" },
  { number: 36, name: "Yasin", arabic: "يس" },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن" },
  { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة" },
  { number: 67, name: "Al-Mulk", arabic: "الملك" },
];

const cities = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Makassar",
  "Semarang",
  "Yogyakarta",
  "Palembang",
  "Samarinda",
  "Pekanbaru",
  "Denpasar",
  "Banjarmasin",
  "Malang",
  "Depok",
];

const selectedCityComputed = computed({
  get: () => preferencesStore.selectedCity,
  set: (val) => {
    preferencesStore.setSelectedCity(val);
    fetchShalatTimes();
  },
});

const filteredSurah = computed(() => {
  if (!searchQuery.value) return surat.value;
  const query = searchQuery.value.toLowerCase().trim();
  return surat.value.filter((s) => {
    const nameId = s.name.transliteration.id.toLowerCase();
    const translation = s.name.translation.id.toLowerCase();
    const num = String(s.number);
    return nameId.includes(query) || translation.includes(query) || num.includes(query);
  });
});

const formattedShalatTimes = computed(() => {
  if (!shalatTimes.value) return {};
  const { Imsak, Fajr, Dhuhr, Asr, Maghrib, Isha } = shalatTimes.value;
  return { Imsak, Fajr, Dhuhr, Asr, Maghrib, Isha };
});

const selectRandomVerse = () => {
  const idx = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length);
  randomVerse.value = INSPIRATIONAL_VERSES[idx];
};

const fetchSurah = async () => {
  loading.value = true;
  error.value = false;
  try {
    const data = await quranApi.fetchSurahList();
    surat.value = data;
  } catch (err) {
    console.error(err);
    errMsg.value = err.message || "Gagal menghubungi server API.";
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const calculateNextPrayer = () => {
  if (!shalatTimes.value) return;
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  const prayerNames = ["Imsak", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  let nextName = "Fajr";

  for (const name of prayerNames) {
    const timeStr = shalatTimes.value[name];
    if (timeStr) {
      const [h, m] = timeStr.split(":").map(Number);
      const prayerTotalMinutes = h * 60 + m;
      if (prayerTotalMinutes > currentTotalMinutes) {
        nextName = name;
        break;
      }
    }
  }
  nextPrayerName.value = nextName;
};

const fetchShalatTimes = async () => {
  shalatLoading.value = true;
  shalatTimes.value = null;
  nextPrayerName.value = "";
  try {
    const timings = await quranApi.fetchPrayerTimes(preferencesStore.selectedCity);
    shalatTimes.value = timings;
    calculateNextPrayer();
  } catch (err) {
    console.error("Failed to load prayer times:", err);
  } finally {
    shalatLoading.value = false;
  }
};

const getShalatIcon = (name) => {
  switch (name) {
    case "Imsak":
      return "fa-solid fa-moon";
    case "Fajr":
      return "fa-solid fa-sun-plant-wilt";
    case "Dhuhr":
      return "fa-solid fa-sun";
    case "Asr":
      return "fa-solid fa-cloud-sun";
    case "Maghrib":
      return "fa-solid fa-mountain-sun";
    case "Isha":
      return "fa-solid fa-star-and-crescent";
    default:
      return "fa-solid fa-clock";
  }
};

const translateShalatName = (name) => {
  const translations = {
    Imsak: { id: "Imsak", en: "Imsak" },
    Fajr: { id: "Subuh", en: "Fajr" },
    Dhuhr: { id: "Dzuhur", en: "Dhuhr" },
    Asr: { id: "Ashar", en: "Asr" },
    Maghrib: { id: "Maghrib", en: "Maghrib" },
    Isha: { id: "Isya", en: "Isha" },
  };
  return translations[name]?.[preferencesStore.language || "id"] || name;
};

onMounted(() => {
  selectRandomVerse();
  fetchSurah();
  fetchShalatTimes();
});
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
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
