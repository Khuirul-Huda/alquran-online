<template>
  <div>
    <div v-if="!loading && !error" class="containerlist">
      <div v-for="suratt in surat" :key="suratt.name">
        <Surat
          :surat="suratt.name.transliteration.id"
          :arabic="suratt.name.short"
          :arti="suratt.name.translation.id"
          :ke="suratt.number"
          :revelation="suratt.revelation.arab"
          :verses="suratt.numberOfVerses"
        />
      </div>

      <!-- <li v-for="suratt in surat" :key="suratt.name">
         <ul>{{suratt.name.long}}</ul>
     </li>-->
    </div>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Error!</div>
  </div>
</template>

<script>
import Surat from "../components/Surat.vue";
const axios = require("axios").default;

export default {
  components: { Surat },
  name: "DaftarSurat",
  data() {
    return {
      surat: {},
      loading: true,
      error: false,
      errMsg: "Something went wrong :(",
      //route: "",
    };
  },
  mounted() {
    const url = process.env.VUE_APP_MAIN_API_URL + "/surah";
    axios
      .get(url)
      .then((res) => {
        this.surat = res.data.data;
        //this.route = "/read/"+res.data.number
      })
      .catch((err) => {
        console.log(err);
        this.loading = false;
      })
      .finally(() => (this.loading = false));
  },
};
</script>

<style>
.containerlist {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
}
.itemlist {
  flex: 0 0 auto;
  margin: 9px;
}
</style>
