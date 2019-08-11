<template>
  <div>
    <div>
      <img :src="imgFullPath" height="120" alt=""/>
    </div>
    <el-button class="btn" @click="toggleShow">设置头像</el-button>
    <VueImageCropUpload field="file"
               @crop-success="cropSuccess"
               @crop-upload-success="cropUploadSuccess"
               @crop-upload-fail="cropUploadFail"
               v-model="show"
               :width="300"
               :height="300"
               :url="'/user/uploadFile'"
               :headers="headers"
               img-format="png">
    </VueImageCropUpload>
  </div>
</template>

<script>
  import {Message} from 'element-ui'
  import {userAuth} from 'src/utils/auth'
  import 'babel-polyfill'; // es6 shim
  import VueImageCropUpload from 'vue-image-crop-upload';

  export default ({

    data() {
      return {
        show: false,
        headers: {
          Authorization: userAuth.getToken(),
        },
        imgPath: '',
        imgFullPath: '',
      }
    },
    components: {
      VueImageCropUpload
    },
    methods: {

      clearFile() {
        this.imgPath = '';
        this.imgFullPath = '';
      },

      toggleShow() {
        this.show = !this.show;
      },

      cropSuccess(imgDataUrl, field) {
        console.log('-------- crop success --------');
        // this.imgDataUrl = imgDataUrl;//获取裁剪后base64地址
      },

      cropUploadSuccess(jsonData, field) {
        // console.log('-------- upload success --------');
        // console.log(jsonData);
        // console.log('field' , field);
        // console.log('imgDataUrl' ,this.imgDataUrl);
        Message.success("上传成功");
        this.imgFullPath = jsonData.data.fileFullPath;
        this.imgPath = jsonData.data.filePath;
        this.show = false;
      },

      cropUploadFail(status, field) {
        console.log('-------- upload fail --------');
        console.log(status);
        console.log('field: ' + field);
      }
    }
  });

</script>

<style scoped>

</style>
