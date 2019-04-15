<template>
  <div id="wrapper" ref="mainWrapper">
    <div id="app" class="image-overlay" :style="overlayStyle">
      <a download :href="'data:text/plain;charset=utf-8,' + encodeURIComponent(text)">
        <img :src="firstImageSrc" class="image-one-overlay"/>
        <img :src="secondImageSrc" class="image-two-overlay"/>
      </a>
    </div>
    <div>
      <a href="#" @click.prevent="() => {showImages = !showImages}" style="color: black; opacity: .1;">{{showImages ? "hide" : "show"}}</a>
      <div class="image-one" v-if="showImages">
        <a target="_blank" :href="firstImageDownload"><img :src="firstImage.urls.small" /></a>
        <br/>
        Photo by <a target="_blank" :href="firstImageAttr + '?utm_source=' + appName + '&utm_medium=referral'">{{firstImageAuthor}}</a> on <a href="https://unsplash.com/?utm_source=DoubleExposure&utm_medium=referral">Unsplash</a>
      </div>
      <div target="_blank" class="image-two" v-if="showImages">
        <a :href="secondImageDownload"><img :src="secondImage.urls.small" /></a>
        <br/>
        Photo by <a target="_blank" :href="secondImageAttr + '?utm_source=' + appName + '&utm_medium=referral'">{{secondImageAuthor}}</a> on <a href="https://unsplash.com/?utm_source=DoubleExposure&utm_medium=referral">Unsplash</a>
      </div>
    </div>
  </div>
</template>

<script>
   /*eslint-disable */

export default {
  name: "App",
  data() {
    return {
      firstImageSrcDefault: "",
      secondImageSrcDefault: "",
      overlayStyle: {
        height: "800px",
        width: "800px"
      },
      firstImage: null,
      secondImage: null,
      appName: "DoubleExposure",
      alertPress: false,
      intervalRunner: null,
      images: [],
      showImages: true
    };
  },
  computed: {
    firstImageSrc () {
      return this.firstImage ? this.firstImage.urls.raw + "&w=1024&h=1024&fit=crop" : this.firstImageSrcDefault;
    },
    secondImageSrc () {
      return this.secondImage ? this.secondImage.urls.raw + "&w=1024&h=1024&fit=crop" : this.secondImageSrcDefault;
    },
    firstImageAttr () {
      return this.firstImage ? this.firstImage.user.links.html : "";
    },
    secondImageAttr () {
      return this.secondImage ? this.secondImage.user.links.html : "";
    },
    firstImageAuthor () {
      return this.firstImage ? this.firstImage.user.name : "";
    },
    secondImageAuthor () {
      return this.secondImage ? this.secondImage.user.name : "";
    },
    firstImageDownload () {
      return this.firstImage ? this.firstImage.links.html : "";
    },
    secondImageDownload () {
      return this.secondImage ? this.secondImage.links.html : "";
    },
    firstImageDirectDownload () {
      return this.firstImage ? this.firstImage.links.download : "";
    },
    secondImageDirectDownload () {
      return this.secondImage ? this.secondImage.links.download : "";
    },
    firstImageDownloadLocation () {
      return this.firstImage ? "https://blend-service.azurewebsites.net/download?url=" + this.firstImage.links.download_location : "";
    },
    secondImageDownloadLocation () {
      return this.secondImage ? "https://blend-service.azurewebsites.net/download?url=" + this.secondImage.links.download_location : "";
    },
    text () {
      return this.firstImageAuthor ? `1 | Author: ${this.firstImageAuthor} | Insta: ${this.firstImage.user.instagram_username} | Download: ${this.firstImageDownload} | Direct Download: ${this.firstImageDirectDownload} \r\n
2 | Author: ${this.secondImageAuthor} | Insta: ${this.secondImage.user.instagram_username} | Download: ${this.secondImageDownload} | Direct Download: ${this.secondImageDirectDownload}` : "";
    }
  },
  mounted () {
    this.renderImages();
    window.addEventListener('keyup', this.renderImages);
  },
  methods: {
    renderImages () {
      if(this.images.length) {
        this.firstImage = this.images.pop();
        this.secondImage = this.images.pop();
        this.runInterval();
      } else {
        this.get();
      }
    },
    get() {
      this.$http.get('/getrandomphoto?count=30&orientation=squarish').then((response) => {
        this.images = response.body;
        this.renderImages();
      }, (err) => {
        window.clearInterval(this.intervalRunner);
        alert(err.bodyText);
      });
    },
    runInterval () {
      window.clearInterval(this.intervalRunner);
      this.intervalRunner = window.setInterval(this.renderImages, 20000);
    },
    getDetails () {
     alert(1);
    } 
  }
};
</script>

<style>
body {
  background: #eee;
}
img {
    height: 100%;
}

.alertPress {
  position: absolute;
  top: 0;
  text-align: center;
  width: 100%;
  font-size: 32px;
  background-color: #eee;
}

.image-overlay {
    overflow: hidden;
    position: relative;
    width: 100%;
    margin: 0 auto;
}
.image-one-overlay {
    opacity: .5;
}
.image-two-overlay {
    mix-blend-mode: overlay;
    position: absolute;
    top: 0;
    left: 0;
}

#wrapper {
  position: relative;
}

.image-one, .image-two {
  position: absolute;
  height: 200px;
  width: 200px;
}

.image-one {
  top: 0;
  left: 0;
} 

.image-two {
  top:250px;
  left: 0;
}
</style>
