module.exports = {
  devServer: {
    port: 7000,
  },
  pwa: {
    name: "Al-Quran Online",
    workboxOptions: {
      exclude: ["_redirects"],
    },
  },
};
