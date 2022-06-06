<template>
  <div v-if="!loaded">Loading...</div>
  <div v-if="loaded">
    <div @click="shortDetails()">{{ surahdata.name.transliteration.id }}</div>
    <div id="name-translation-id">({{ surahdata.name.translation.id }})</div>
    <div v-if="!(surahdata.preBismillah == null)" class="margintopnormal">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </div>
    <div>
      <!--kotak all-->
      <div v-for="verse in verses" v-bind:key="verse.number.inSurah">
        <div>
          <!--kotak setiap v-->
          <div :id="verse.number.inSurah" class="teksutama">
            <!--teks utama-->
            {{ verse.text.arab }}
          </div>
          <div class="terjemah">
            <!--terjemahannya-->
            {{ verse.number.inSurah }}. {{ verse.translation.id }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "SuratView",
  data() {
    return {
      surahnumber: 0,
      loaded: false,
      surahdata: {},
      verses: {},
    };
  },
  methods: {
    shortDetails() {
      Swal.fire(
        this.surahdata.name.transliteration.id,
        this.surahdata.tafsir.id,
        "info"
      );
    },
  },
  mounted() {
    const axios = require("axios").default;
    const params = this.$route.params.surat;
    const apiURL = "https://alquran-online-api.vercel.app/surah/";

    if (isNaN(params)) {
      this.$router.push({ name: "Main" });
    } else {
      if (params < 1 || params > 114) {
        this.$router.push({ name: "Main" });
      } else {
        this.surahnumber = this.$route.params.surat;
        //get data
        const completeApiUrl = apiURL + this.surahnumber;
        axios
          .get(completeApiUrl)
          .then((res) => {
            this.surahdata = res.data.data;
            this.verses = this.surahdata.verses;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loaded = true;
          });
      }
    }
  },
};
</script>
<style scoped>
.margintopnormal {
  margin-top: 25px;
}
</style>
