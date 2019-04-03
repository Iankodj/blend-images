<template>
  <div id="app">
    <input v-model="firstQuery">
    <input v-model="secondQuery">
    <button @click="get">Get</button>
    <br/>
    <img :src="firstImageSrc" style="width:50%;" />
    <img :src="secondImageSrc" style="width:50%;" />
  </div>
</template>

<script>
   /*eslint-disable */

export default {
  name: "App",
  data() {
    return {
      firstQuery: "",
      secondQuery: "",
      firstImageSrc: "",
      secondImageSrc: ""
    };
  },
  methods: {
    get() {
      this.$http.get('https://blend-service.azurewebsites.net/getrandomphoto?query=' + this.firstQuery).then((response) => {
        var image = response.body;
        this.firstImageSrc = image.urls.regular;
      });

      this.$http.get('https://blend-service.azurewebsites.net/getrandomphoto?query=' + this.secondQuery).then((response) => {
        var image = response.body;
        this.secondImageSrc = image.urls.regular;
      });
    }
  }
};
</script>

<style>
</style>
