<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
                <span ref="" v-if='item.redirect==="noredirect"||index===levelList.length-1' class="no-redirect">{{generateTitle(item.meta.title)}}</span>
                <router-link v-else :to="item.redirect||item.path">{{generateTitle(item.meta.title)}}</router-link>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
    import {generateTitle} from 'src/utils/i18n'

    export default {
        created() {
            this.getBreadcrumb()
        },
        data() {
            return {
                levelList: null
            }
        },
        watch: {
            $route() {
                this.getBreadcrumb()
            }
        },
        methods: {
            generateTitle,
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name);
                const first = matched[0];
                if (first && first.name !== 'dashboard') {
                    matched = [{path: '/main/dashboard', meta: {title: 'dashboard'}}].concat(matched)
                }
                this.levelList = matched
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-breadcrumb.el-breadcrumb {
        transition:all 0.5s;
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 10px;

        .no-redirect {
            font-weight: bold;
            color: #727a8e;
            cursor: text;
        }
    }

    .app-breadcrumb {
        color: white !important;
    }
    /*面包屑文字切换效果breadcrumb-xxx*/
    .breadcrumb-enter{
        opacity: 0;
        transform: translateX(-20px);
    }

    .breadcrumb-enter-active{
        transition: all .5s;
    }

    .breadcrumb-leave-active {
        position: absolute;
        transition: all .5s;
    }
    .breadcrumb-leave-active {
        opacity: 0;
        transform: translateX(20px);
    }

    .breadcrumb-move {
        transition: all .5s;
    }


</style>
