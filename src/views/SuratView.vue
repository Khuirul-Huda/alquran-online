<template>
  <div v-if="!loaded">
    <div>
      <content-loader
        viewBox="0 0 400 150"
        :speed="1.5"
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
      >
        <rect x="25" y="20" rx="5" ry="5" width="220" height="20" />
        <rect x="25" y="62" rx="5" ry="5" width="220" height="20" />
        <rect x="25" y="105" rx="5" ry="5" width="220" height="20" />
      </content-loader>
    </div>
  </div>
  <div v-if="loaded">
    <div @click="shortDetails()" ><span class="pointer">
      {{ surahdata.name.transliteration.id }}
    </span></div>
    <div id="name-translation-id">({{ surahdata.name.translation.id }})</div>
    <div v-if="!(surahdata.preBismillah == null)" class="margintopnormal title">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </div>
    <div>
      <!--kotak all-->
      <div v-for="verse in verses" v-bind:key="verse.number.inSurah">
        <div class="containerverses">
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
import { ContentLoader } from "vue-content-loader";

export default {
  name: "SuratView",
  components: { ContentLoader },
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
    const apiURL = process.env.VUE_APP_MAIN_API_URL + "/surah/";

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

.teksutama {
  text-align: right;
  font-size: 24px;
}

.title {
  font-size: 24px;
}

.terjemah {
  text-align: left;
}

.containerverses {
  margin-top: 20px;
  margin-bottom: 5px;
  background-color: white;
  border-radius: 25px;
  padding: 25px;
  border-width: 2px;
  border-color: grey;
  border-style: solid;
}
 .pointer {
  cursor: pointer;
 }

</style>
