<template>
    <div class="login-container">
        <el-row type="flex" justify="center" class="login-el-row">
            <el-col class="el-col-width">
                <div class="content-top">
                    <header>sample</header>
                </div>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="login-el-row">
            <el-col class="el-col-width">
                <section>
                    <el-carousel trigger="click" class="login-section">
                        <el-carousel-item v-for="item in imageData" :key="item.id">
                            <img :src="item.path" height="350" alt=""/>
                        </el-carousel-item>
                    </el-carousel>
                </section>
                <aside>
                    <el-card class="login-aside">
                        <div slot="header">
                            <b>登录</b>
                        </div>
                        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                                 label-position="left">
                            <el-form-item prop="loginId">
                                <el-input name="loginId" type="text" v-model="loginForm.loginId" autoComplete="on"
                                          placeholder="账号"/>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin"
                                          v-model="loginForm.password" autoComplete="on" placeholder="密码"/>
                                <span class="show-pwd" @mousedown="showPwd" @mouseup="hidePwd"><i
                                        class="el-icon-view"></i></span>
                            </el-form-item>
                            <el-button type="primary" class="login-button" :loading="loading"
                                       @click.native.prevent="handleLogin">登录
                            </el-button>
                        </el-form>
                    </el-card>
                </aside>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="login-bottom-scroll login-el-row">
            <el-col class="el-col-width">
                <footer>
                    <div class="scroll-content">通知</div>
                    <scroll-text-vertical :items="newsData" text="content"></scroll-text-vertical>
                </footer>
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
            document.onmouseup = this.hidePwd;//全局监听mouseup事件
            this.fetchInfo();
            this.loginForm.loginId = this.getCookie('loginId');
        },
        methods: {
            showPwd() {
                this.pwdType = '';
            },
            hidePwd() {
                this.pwdType = 'password';
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

<style scoped>
    .el-col-width {
        width: 870px
    }

    .login-section {
        width: 525px;
        float: left
    }

    .login-aside {
        margin: 10px 0;
        width: 330px;
        float: right
    }

    .login-el-row {
        margin-top: 10px;
    }

    .login-bottom-scroll {
        margin: 30px 0 0 0;
    }

    .login-button {
        width: 100%;
        font-weight: bold;
        font-size: 15px;
        letter-spacing: 10px;
    }

    .login-container {
        min-width: 1000px;
    }

    .content-top {
        letter-spacing: 10px;
        line-height: 100px;
        height: 100px;
        font-size: 45px;
        font-weight: normal;
        color: gray;
        text-align: center;
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        color: lightslategray;
        cursor: pointer;
        user-select: none;
    }

    .scroll-content {
        float: left;
        line-height: 40px;
        height: 40px;
        width: 120px;
        text-align: center;
        color: white;
        font-size: 16px;
        font-weight: bold;
        background: deepskyblue;
    }

    /*图片轮播背景色*/
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
</style>
