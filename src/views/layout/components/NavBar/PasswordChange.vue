<template>
  <el-dialog width="400px" :visible.sync="passwdDialogVisible" :close-on-click-modal="false" label-width="80px" append-to-body>
    <el-form :rules="rules" ref="formData" size="mini" :model="form">
      <el-form-item label="旧密码" prop="passwordOld">
        <el-input type="password" v-model="form.passwordOld"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="passwordNew">
        <el-input type="password" v-model="form.passwordNew"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="passwordCheck">
        <el-input type="password" v-model="form.passwordCheck"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button @click="passwdDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="postFormData()">确定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import {showNotify} from 'src/utils/tools'
  import {updatePassword} from "src/api/password";
    export default {
        name: "PasswordChange",
      data(){
        var validatePass2 = (rule, value, callback) => {
          if (value !== this.form.passwordNew) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          passwdDialogVisible: false,
          form: {
            userId: null,
            passwordOld: '',
            passwordNew: '',
            passwordCheck: ''
          },

          rules: {
            passwordOld: [
              {required: true, message: '旧密码不能为空', trigger: 'blur'}
            ],
            passwordNew: [
              {required: true, message: "新密码不能为空", trigger: 'blur'}
            ],
            passwordCheck: [
              {validator: validatePass2, required: true, trigger: 'blur'}
            ],
          }
        }
      },
      methods:{

        postFormData() {
          let self = this;
          this.$refs['formData'].validate((valid) => {
            if (valid) {
              this.form.userId = this.id;
              updatePassword(this.form).then(response => {
                self.passwdDialogVisible = !response.data.result;
                showNotify(response, '修改');
              })
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
