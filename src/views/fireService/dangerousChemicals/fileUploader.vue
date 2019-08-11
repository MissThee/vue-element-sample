<template>
    <el-upload :action="'/dangerousChemicals/uploadFile'"
               drag
               :file-list="fileList"
               :limit="1"
               :on-exceed="handleExceed"
               :multiple="false"
               :auto-upload="true"
               :on-change="changeFile"
               :on-remove="removeFile"
               :before-upload="checkFile"
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
    import {userAuth} from "src/utils/auth";

    export default {
        name: "file-uploader",
        components: {},
        data() {
            return {
                fileList: [],
                fileIsUploading: false,
            }
        },
        computed: {
            token() {
                userAuth.getToken()
            },
            headers() {
                return {'Authorization': this.token}
            }
        },
        methods: {
            handleExceed(files, fileList) {
                this.$message.warning('限制上传 1 个文件');
                // this.$message.warning(`当前限制上传 1 个文件，选择了 ${files.length + fileList.length}个文件`);//，共选择了 ${files.length + fileList.length} 个文件
            },
            changeFile(file, fileList) {
            },
            removeFile(file, fileList) {
                this.fileList = [];
            },
            checkFile(file) {
                // const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/jpg');
                // const isPNG = file.type === 'image/png';
                // const isGIF = file.type === 'image/gif';
                // const isBMP = file.type === 'image/bmp';
                // const isLt2M = file.size / 1024 / 1024 < 2;
                //
                // if (!(isJPG || isPNG || isGIF || isBMP)) {
                //   this.$message.error('上传头像图片只能是 JPG/PNG/GIF/BMP 格式!');
                // }
                // if (!isLt2M) {
                //   this.$message.error('上传头像图片大小不能超过 2MB!');
                // }
                // return (isJPG || isPNG || isGIF || isBMP) && isLt2M;
                const canUpload = file.size / 1024 / 1024 < 50;
                if (!canUpload) {
                    this.$message.error('上传附件大小不能超过 50MB!');
                }
                return canUpload
            },
            uploadSuccess(res, data, dataList) {
                this.fileIsUploading = false;
                if (res.result) {
                    this.fileList.push({name: res.fileName, url: res.filePath, status: 'success'});
                } else {
                    this.$message.error('上传附件出错，上传失败');
                    this.$refs.uploader.clearFiles();
                }
            },
            clearFiles() {//供外部调用，清除文件内容
                this.$refs.uploader.clearFiles();
                this.fileList = [];
            },
            setFiles(fileName, path) {//供外部调用，初始化文件内容
                this.fileList = [{name: fileName, url: path, status: 'success'}];
            },
            getUploadingState() {//供外部调用，获取控件上传文件的状态
                return this.fileIsUploading;
            },
            onProgress(event, file, fileList) {
                this.fileIsUploading = true;
            },
            onError() {
                this.fileIsUploading = false;
            },
        }
    }
</script>

<style scoped>

</style>
