<template>
  <div id="wrapper" ref="mainWrapper">
    <loading :active.sync="isLoading" 
            :is-full-page="false"></loading>


    <div id="app" class="image-overlay">
        <img :src="firstImageSrc" class="image-one-overlay"/>
        <img :src="secondImageSrc" class="image-two-overlay"/>
    </div>
    <div>
      <!-- <a class="show-link" href="#" @click.prevent="() => {showImages = !showImages}" style="">{{showImages ? ">" : '-'}}</a> -->
      <div class="image-one" v-if="showImages">
        <a target="_blank" :href="firstImageDownload"><img :src="firstImageSmall" /></a>
        <br/>
        Photo by <a target="_blank" :href="firstImageAttr + '?utm_source=' + appName + '&utm_medium=referral'">{{firstImageAuthor}}</a> on <a href="https://unsplash.com/?utm_source=DoubleExposure&utm_medium=referral">Unsplash</a>
      </div>
      <div target="_blank" class="image-two" v-if="showImages">
        <a :href="secondImageDownload"><img :src="secondImageSmall" /></a>
        <br/>
        Photo by <a target="_blank" :href="secondImageAttr + '?utm_source=' + appName + '&utm_medium=referral'">{{secondImageAuthor}}</a> on <a href="https://unsplash.com/?utm_source=DoubleExposure&utm_medium=referral">Unsplash</a>
      </div>
    </div>
  </div>
</template>

<script>
   /*eslint-disable */

import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import { setTimeout } from 'timers';
import Loading from 'vue-loading-overlay';

export default {
  name: "App",
  components: {
      Loading
  },
  data() {
    return {
      firstImageSrcDefault: "",
      secondImageSrcDefault: "",
      overlayStyle: {
      },
      firstImage: null,
      secondImage: null,
      appName: "DoubleExposure",
      alertPress: false,
      intervalRunner: null,
      images: [],
      showImages: false,
      isLoading: false
    };
  },
  computed: {
    firstImageSrc () {
      return this.firstImage ? this.firstImage.urls.raw + "&w=1024&h=1024&fit=crop" : this.firstImageSrcDefault;
    },
    secondImageSrc () {
      return this.secondImage ? this.secondImage.urls.raw + "&w=1024&h=1024&fit=crop" : this.secondImageSrcDefault;
    },
    firstImageSmall () {
      return this.firstImage ? this.firstImage.urls.small : this.firstImageSrcDefault;
    },
    secondImageSmall () {
      return this.secondImage ? this.secondImage.urls.small : this.secondImageSrcDefault;
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
      return this.firstImage ? "/download?url=" + this.firstImage.links.download_location : "";
    },
    secondImageDownloadLocation () {
      return this.secondImage ? "/download?url=" + this.secondImage.links.download_location : "";
    },
    text () {
      return this.firstImageAuthor ? `1 | Author: ${this.firstImageAuthor} | Insta: ${this.firstImage.user.instagram_username} | Download: ${this.firstImageDownload} | Direct Download: ${this.firstImageDirectDownload} \r\n
2 | Author: ${this.secondImageAuthor} | Insta: ${this.secondImage.user.instagram_username} | Download: ${this.secondImageDownload} | Direct Download: ${this.secondImageDirectDownload}` : "";
    }
  },
  mounted () {
    this.renderImages();
    window.addEventListener('keyup', (ev) => {
      if(ev.altKey) {
        if(ev.key === "Backspace") {
          this.showImages = !this.showImages;
        }

        if(ev.key === "Enter") {
          this.getImages();
        }

        if(ev.key === "r") {
          this.renderImages();
        }
      }


    });
 
    },
  methods: {
    getImages () {
      this.isLoading = true;
      var zip = new JSZip();
      zip.file("details.txt", this.text);

      var imgFolder = zip.folder("images");

      var firstImageUrl, secondImageUrl, firstImageData, secondImageData;

      var tryLoad = () => {
        if(firstImageData && secondImageData) {
          firstImageData = null;
          secondImageData = null;
          this.isLoading = false;
          zip.generateAsync({type:"blob"})
            .then(function(content) {
                // Force down of the Zip file
                saveAs(content, "image.zip");
            });
        } else {
          setTimeout(tryLoad, 100);
        }
      }

      this.$http.get(this.firstImageDownloadLocation).then((response) => {
        firstImageUrl = response.body.url;
        fetch(firstImageUrl)
          .then(response => response.blob())
          .then((image) => {
            firstImageData = true;
            imgFolder.file("1.jpg", image, {base64: true});
            tryLoad();
          });
      });


      this.$http.get(this.secondImageDownloadLocation).then((response) => {
        secondImageUrl = response.body.url;
        fetch(secondImageUrl)
          .then(response => response.blob())
          .then((image) => {
            secondImageData = true;
            imgFolder.file("2.jpg", image, {base64: true});
            tryLoad();
          });
      });



    },
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
      this.$http.get('/getrandomphoto?count=10&orientation=squarish').then((response) => {
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
html, body, #wrapper {
  height: 100%;
  overflow: hidden;
}

.image-overlay {
  height: 95%;
  width: 50%
}

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
    margin: 1% auto 1% auto;
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

.download-link {
  cursor: pointer;
}

.show-link {
color: black; 
opacity: .1;
position: absolute;
top:550px;

}
</style>
