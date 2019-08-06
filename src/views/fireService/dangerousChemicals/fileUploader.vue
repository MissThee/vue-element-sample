<template>
  <el-upload :action="process.env.BASE_API+'dangerousChemicals/uploadFile'"
             drag
             :file-list="fileList"
             :limit="1"
             :on-exceed="handleExceed"
             :multiple="false"
             :auto-upload="true"
             :on-change="getFileList"
             :on-remove="removeFile"
             :before-upload="checkFileSize"
             :headers="headers"
             :on-success="uploadSuccess"
             ref="uploader"
             :on-progress="onProgress"
             :on-error="onError"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip"> 文件不超过50M</div>
  </el-upload>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "file-uploader",
    components: {},
    data() {
      return {
        fileList: [],
        fileUploading:false,
      }
    },
    mounted() {

    },
    computed: {
      ...mapGetters([
        'token'
      ]),
      headers() {
        return {'Authorization': this.token}
      }
    },
    methods: {
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制上传 1 个文件，选择了 ${files.length + fileList.length}个文件`);//，共选择了 ${files.length + fileList.length} 个文件
      },
      getFileList(file, fileList) {

      },
      removeFile(file, fileList){
        this.$emit('removeFile')
      },
      checkFileSize(file) {
        const canUpload = file.size / 1024 / 1024 < 50;
        if (!canUpload) {
          this.$message.error('上传附件大小不能超过 50MB!');
        }
        return canUpload
      },
      uploadSuccess(res, data, dataList) {
        this.fileUploading=false;
        console.log(res, data, dataList)
        if (res.data.result) {
          this.$emit('getFileInfo', res.data.fileName, res.data.filePath)
        } else {
          this.$message.error('上传附件出错，上传失败');
          this.$refs.uploader.clearFiles();
        }
      },
      clearFiles(){
        this.$refs.uploader.clearFiles()
      },
      setFiles(fileName,path){
       this.fileList= [{name: fileName, url: path}];
      },
      onProgress(){
        this.fileUploading=true;
      },
      onError(){
        this.fileUploading=false;
      },
      getUploadingState(){
        return this.fileUploading;
      }
    }
  }
</script>

<style scoped>

</style>
