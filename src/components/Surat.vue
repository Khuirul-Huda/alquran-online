<template>
  <router-link :to="'/read/' + ke" custom v-slot="{ navigate }">
    <div @click="navigate" role="link" class="card-like itemlist">
      <div class="surah-wrapper flex-sb">
        <h3 class="surah-name nfont">{{ surat }}</h3>
        <p class="name-short-arabic">{{ arabic }}</p>
      </div>
      <div class="more-info">
        <p class="arti nfont">({{ arti }})</p>
        <div>
          <div class="flex-start">
            <p class="revelation-arabic">{{ revelation }}</p>
            <p class="verses nfont">{{ verses }} ayat</p>
            <!-- <p class="number-sr nfont">
          {{ke}}
        </p>-->
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "Surat",
  props: {
    surat: String, //surat
    arabic: String, //$surat => arabic
    arti: String, //arti $surat
    revelation: String, //diturunkan di
    verses: Number, //berapa ayat
    ke: Number, //surat ke...
    // route: String,
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand&display=swap");

.card-like {
  background: linear-gradient(
    110.5deg,
    rgba(248, 196, 249, 0.66) 22.8%,
    rgba(253, 122, 4, 0.15) 64.6%
  );
  padding: 25px;
  border-radius: 25px;
  margin: 10px;
  width: 230px;
  height: 170px;
  cursor: pointer;
  
}

.nfont {
  font-family: "Quicksand", sans-serif;
}

.flex-sb {
  display: flex;
  justify-content: space-between;
}

.name-short-arabic {
  font-size: 140%;
}

.flex-start {
  display: flex;
  justify-content: center;
}

.revelation-arabic {
  font-size: 120%;
  margin-right: 10%;
}

.number-sr {
  margin-left: 10%;
  font-size: 100%;
}

.flex-end {
  display: flex;
  justify-content: flex-end;
}

.arti {
  display: flex;
  justify-content: center;
}


</style>
