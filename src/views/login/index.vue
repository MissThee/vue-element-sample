<template>
  <div class="login-container" style=" min-width: 1000px;">
    <el-row type="flex" justify="center">
      <el-col :span="24" style="background-color:#c80503 ">
        <!-- #c91019-->
        <div class="content-top">
          <span style="margin-left: 50px">信息管理系统</span>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 10px">
      <el-col style="width:970px" :span="19">
        <el-carousel trigger="click" height="350px" style="width:630px;float:left">
          <el-carousel-item v-for="item in imageData" :key="item.id">
            <img :src="item.path" height="350"/>
          </el-carousel-item>
        </el-carousel>
        <el-card class="box-card" style="margin:10px 0;width:330px ;float:right">
          <div slot="header">
            <span style="font-weight: bold;color:#766">登录</span>
          </div>
          <el-form class="card-box  login-formXX " autoComplete="on" :model="loginForm" :rules="loginRules"
                   ref="loginForm" label-position="left">
            <el-form-item prop="loginId">
              <el-input name="loginId" type="text" v-model="loginForm.loginId" autoComplete="on" placeholder="账号"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                        autoComplete="on" placeholder="密码"/>
              <span class="show-pwd" @click="showPwd">
                {{pwdType==="password"?"显示":"隐藏"}}
              </span>
            </el-form-item>
            <el-button type="danger"
                       style="width:100%;margin-bottom:10px;font-weight: bold;font-size: 15px;letter-spacing: 10px"
                       :loading="loading" @click.native.prevent="handleLogin">登录
            </el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 30px">
      <el-col :span="19" style="width:970px">
        <span style="line-height: 42px;float:left" class="scroll-content">通知</span>
        <scroll-text-vertical :items="newsData" text="content"></scroll-text-vertical>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import {fetchInfo} from 'src/api/login'
    import ScrollTextVertical from "../../components/ScrollTextVertical/index";

    export default {
        components: {
            ScrollTextVertical,
        },
        name: 'login',
        data() {
            const validateLoginId = (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error('请输入账号'))
                } else {
                    callback()
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (value.length <= 0) {
                    callback(new Error('请输入密码'))
                } else {
                    callback()
                }
            };
            return {
                loginForm: {
                    loginId: '',
                    password: ''
                },
                loginRules: {
                    loginId: [{required: true, trigger: 'blur', validator: validateLoginId}],
                    password: [{required: true, trigger: 'blur', validator: validatePassword}]
                },
                pwdType: 'password',
                loading: false,
                showDialog: false,
                imageData: [],
                newsData: [],
            }
        },
        mounted() {
            this.fetchInfo();
            this.loginForm.loginId = this.getCookie('loginId');
        },
        methods: {
            showPwd() {
                this.pwdType = this.pwdType === 'password' ? '' : 'password'
            },
            handleLogin() {
                let that = this;
                document.cookie = "loginId=" + this.loginForm.loginId;
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        that.$store.dispatch('LoginByLoginId', this.loginForm).then(() => {
                            that.$router.push({path: '/main'})
                        }).catch((e) => {
                            console.log('登录错误', e);
                        })
                    } else {
                        return false
                    }
                })
            },
            fetchInfo() {
                fetchInfo().then(response => {
                    this.imageData = response.data.imageTable;
                    this.newsData = response.data.newsTable;
                })
            },
            getCookie(name) {
                let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                arr = document.cookie.match(reg);
                if (arr)
                    return unescape(arr[2]);
                else
                    return null;
            }
        },

    }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";

  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    @include relative;
    width: 100%;
    /* background-color: $bg;*/
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
      -webkit-text-fill-color: #555 !important;
    }

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      /* color: $light_gray;*/
      height: 47px;
      font-weight: bold;
      font-size: 16px;
    }

    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;

      &_login {
        font-size: 20px;
      }
    }

    .content-top {
      letter-spacing: 10px;
      line-height: 100px;
      height: 100px;
      font-size: 45px;
      font-weight: normal;
      color: white;
      text-align: center;
    }

    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }

    .el-form-item {
      border: 1px solid rgba(0, 0, 0, 0.3);
      /*background: rgba(0, 0, 0, 0.1);*/
      border-radius: 5px;
      color: #454545;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .scroll-content {
    height: 40px;
    width: 120px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    background: #e90911;
  }
</style>
