<template>
  <div>Under Development... Come back soon...</div>
</template>

<script>
export default {
  name: "SuratView",
  data() {
    return {
      surahnumber: 0,
    };
  },
  mounted() {
    const params = this.$route.params.surat;
    if (isNaN(params)) {
      this.$router.push({ name: "Main" });
    } else {
      if (params < 1 || params > 114) {
        this.$router.push({ name: "Main" });
      } else {
        this.surahnumber = this.$route.params.surat;
      }
    }
  },
};
</script>
