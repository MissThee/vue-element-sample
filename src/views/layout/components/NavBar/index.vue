<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

        <breadcrumb class="breadcrumb-container"></breadcrumb>

        <div class="right-menu">
            <el-tooltip effect="dark" content="□" placement="bottom">
                <screenfull class="screenfull right-menu-item"></screenfull>
            </el-tooltip>

            <el-dropdown trigger="click" class='international generateTitle' @command="handleSetLanguage">
                <div class="language-text">{{language}}</div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
                    <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown class="avatar-container right-menu-item" trigger="click">
                <div class="avatar-wrapper">
                    <img class="user-avatar" :src="avatar" alt="">
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="changePasswordHandler" style="display:block;">修改密码</span></el-dropdown-item>
                    <el-dropdown-item divided>
                        <span @click="logout" style="display:block;">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <password-change ref="passwordChange"></password-change>
        </div>

    </el-menu>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Breadcrumb from './Breadcrumb/index'
    import Hamburger from './Hamburger/index'
    import Screenfull from './Screenfull/index'
    import PasswordChange from './PasswordChange.vue'

    export default {
        components: {
            Breadcrumb,
            Hamburger,
            Screenfull,
            PasswordChange,
        },
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'name',
                'avatar',
                'language',
                'id',
            ])
        },
        methods: {
            changePasswordHandler() {
                this.$refs.passwordChange.form = {
                    userId: null,
                    passwordOld: '',
                    passwordNew: '',
                    passwordCheck: ''
                };
                this.$refs.passwordChange.passwdDialogVisible = true;
            },

            toggleSideBar() {
                this.$store.dispatch('toggleSideBar')
            },
            handleSetLanguage(lang) {
                this.$i18n.locale = lang
                this.$store.dispatch('setLanguage', lang)
                this.$message({
                    message: 'switch language success',
                    type: 'success'
                })
            },
            logout() {
                this.$store.dispatch('Logout').then(() => {
                    location.reload()// 为了重新实例化vue-router对象 避免bug
                })
            },

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0 !important;
        box-sizing: border-box;

        .hamburger-container {
            line-height: 50px;
            height: 50px;
            float: left;
            padding: 5px 10px;
        }

        .breadcrumb-container {
            float: left;
        }

        .errLog-container {
            display: inline-block;
            vertical-align: top;
        }

        .right-menu {
            float: right;
            height: 100%;

            &:focus {
                outline: none;
            }

            .right-menu-item {
                display: inline-block;
                margin: 0 8px;
            }

            .screenfull {
                height: 20px;
            }

            .international {
                vertical-align: top;

                .international-icon {
                    font-size: 20px;
                    cursor: pointer;
                    //  vertical-align: -5px;
                }
            }

            .language-text {
                font-weight: bold;
                color: white;
                background-color: gray;
                height: 20px;
                width: 20px;
                font-size: 15px;
                text-align: center;
                line-height: 20px;
                cursor: pointer;
                margin-top: 15px;
                position: relative;
            }

            .theme-switch {
                vertical-align: 15px;
            }

            .avatar-container {
                height: 50px;
                margin-right: 30px;

                .avatar-wrapper {
                    cursor: pointer;
                    margin-top: 5px;
                    position: relative;

                    .user-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                    }

                    .el-icon-caret-bottom {
                        position: absolute;
                        right: -20px;
                        top: 25px;
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>



