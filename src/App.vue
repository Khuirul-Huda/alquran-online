<template>
  <div id="nav">
    <router-link to="/">Al-Quran Online</router-link>
    <!--<router-link to="/about">About</router-link>-->
    <p>
      اَفَلَا يَتَدَبَّرُوْنَ الْقُرْاٰنَ ۗ وَلَوْ كَانَ مِنْ عِنْدِ غَيْرِ
      اللّٰهِ لَوَجَدُوْا فِيْهِ اخْتِلَافًا كَثِيْرًا
    </p>
    <p>
      “Maka tidakkah mereka menghayati (mendalami) Al-Qur'an? Sekiranya
      (Al-Qur'an) itu bukan dari Allah, pastilah mereka menemukan banyak hal
      yang bertentangan di dalamnya. (Q.S An-Nisa':82)"
    </p>
  </div>
  <router-view />
  <footer>
    <p>
      Designed by
      <a class="footer-khrl" href="https://instagram.com/khuirul_huda"
        >Khuirul Huda</a
      >
    </p>
  </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.footer-khrl {
  color: green;
}
</style>
