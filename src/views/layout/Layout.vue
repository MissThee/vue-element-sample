<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="top-bar">
      <navbar></navbar>
    </div>
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

<style rel="stylesheet/scss" lang="scss" scoped>

  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .app-wrapper:after {
    content: "";
    display: table;
    clear: both;
  }
</style>
