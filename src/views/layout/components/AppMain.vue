<template>
  <div class="app-main">
<!--    <transition name="fade" mode="out-in">-->
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
<!--    </transition>-->
  </div>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      cachedViews() {
        return this.$store.state.app.cachedViews
      }
    }
  }
</script>
<style scoped>
  .app-main {
    height: 100%;
  }

  .fade-enter-active {
    transition: .2s linear;
  }

  .fade-leave-active {
    transition: .2s linear;
  }

  .fade-enter, .fade-leave-to {
    margin-left: 20px;
    /*-webkit-transform-style:preserve-3d;*/
    /*-webkit-backface-visibility:hidden;*/
    /*margin-left: 20px;*/
  }
</style>
