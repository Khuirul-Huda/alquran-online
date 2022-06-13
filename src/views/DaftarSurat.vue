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
    <div v-if="loading || error" class="containerlist">
      <!--cl-->
      <div v-if="error">
        {{ errMsg }}
      </div>
      <div v-for="h in 8" v-bind:key="h">
        <div class="itemlist fplaceholder">
          <content-loader
            viewBox="0 0 230 170"
            :speed="1.5"
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <rect x="0" y="2" rx="25" ry="25" width="230" height="170" />
          </content-loader>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Surat from "../components/Surat.vue";
import { ContentLoader } from "vue-content-loader";

const axios = require("axios").default;

export default {
  components: { Surat, ContentLoader },
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
        this.errMsg = err;
        this.loading = false;
        this.error = true;
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
.fplaceholder {
  padding: 25px;
  margin: 10px;
  width: 230px;
  height: 170px;
}
</style>
