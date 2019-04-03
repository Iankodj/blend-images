<template>
  <div id="app">
    <input v-model="accessKey">
    <input v-model="secretKey">
    <button @click="get">Get</button>
  </div>
</template>

<script>
import Unsplash, { toJson } from "unsplash-js";

export default {
  name: "App",
  data() {
    return {
      accessKey: "",
      secretKey: "",
      unsplashApp: null
    };
  },
  methods: {
    get() {
      if (!this.unsplashApp) {
        this.unsplashApp = new Unsplash({
          applicationId: this.accessKey,
          secret: this.secretKey
        });
      }

      this.unsplashApp.photos
        .getRandomPhoto()
        .then(toJson)
        .then(json => {
          debugger;
        });
    }
  },
  components: {}
};
</script>

<style>
</style>
