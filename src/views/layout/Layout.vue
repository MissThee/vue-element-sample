<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <navbar></navbar>
        <div class="main-container">
            <div class="sidebar-container">
                <sidebar></sidebar>
            </div>
            <div class="tag-container">
                <tags-view></tags-view>
            </div>
            <div class="page-container main-page">
                <app-main></app-main>
            </div>
        </div>
    </div>
</template>

<script>
    import TagsView from './components/TagsBar/'
    import Navbar from './components/NavBar/'
    import Sidebar from './components/Sidebar/'
    import AppMain from './components/AppMain'

    export default {
        name: 'layout',
        components: {
            Navbar,
            Sidebar,
            AppMain,
            TagsView,
        },
        computed: {
            sidebar() {
                return this.$store.state.app.sidebar
            }
        },

        data() {
            return {}
        },

    }
</script>

<style scoped>
    .app-wrapper {
        height: 100%;
    }

    /*//除去顶栏剩余部分*/
    .main-container {
        position: absolute;
        right: 0;
        bottom: 0;
        top: 50px;
        left: 0;
    }

    /*//页面*/
    .page-container {
        transition: 0.5s;
        position: absolute;
        top: 30px;
        right: 0;
        bottom: 0;
        left: 180px;
        background-color: #fff;
        /*overflow-y: auto;*/
        /*overflow-x: hidden;*/
    }

    /*//页签栏*/
    .tag-container {
        transition: 0.5s;
        position: absolute;
        top: 0;
        left: 180px;
        right: 0;
        /*//width: 100%;//使用left和right控制宽度，不能使用width:100%，会使绝对定位的宽度无效*/
        z-index: 1000;
    }

    /*// 侧边栏*/
    .sidebar-container {
        transition: 0.5s;
        position: absolute;
        width: 180px !important;
        display: inline-block;
        top: 0;
        bottom: 0;
        overflow: hidden;
    }
    /*侧边栏隐藏时样式*/
    .hideSidebar .sidebar-container {
        width: 40px !important;
    }

    .hideSidebar .page-container, .hideSidebar .tag-container {
        left: 40px;
    }

    /*自定义菜单栏中图标文字间距*/
    /deep/ .el-submenu__title img {
        padding: 0 10px 0 5px !important;
    }

    /deep/ .el-menu-item img {
        padding: 0 10px 0 5px !important;
    }

    /deep/ .el-submenu__title {
        padding: 0 5px !important;
    }

    /deep/ .el-menu-item {
        padding: 0 25px !important;
    }

    /deep/ .el-menu--vertical{
        left:40px !important;
    }
</style>
