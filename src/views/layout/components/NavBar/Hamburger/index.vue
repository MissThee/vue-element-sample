<template>
  <div>
    <svg t="1492500959545" @click="toggleClick" class="wscn-icon hamburger" :class="{'is-active':isActive}" style="" viewBox="0 0 1024 1024"
         version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1691" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64">
      <path
        d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"
        p-id="1692"></path>
      <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"
            p-id="1693"></path>
      <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"
            p-id="1694"></path>
    </svg>
    <span class="font-text color-text">消防业务移动应用系统</span>
    <span class="font-text text-shadow">消防业务移动应用系统</span>
  </div>
</template>

<script>
  export default {
    name: 'hamburger',
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
      toggleClick: {
        type: Function,
        default: null
      }
    }
  }
</script>

<style scoped>
  .hamburger {
    display: inline-block;
    cursor: pointer;
    width: 20px;
    height: 20px;
    transform: rotate(90deg);
    transition: .38s;
    transform-origin: 50% 50%;
  }

  .hamburger.is-active {
    transform: rotate(0deg);
  }

  .font-text {
    line-height: 60px;
    font-size: 35px;
    letter-spacing: 3px;
    float: left;
    word-break: keep-all;

  }

  .color-text {
    position: fixed;
    z-index: -2;
    left: 20px;
    /*background: linear-gradient(to bottom, #020202, #e30016, #e30016);*/
    background: red;
    -webkit-background-clip: text;
    color: transparent;
  }

  .text-shadow {
    position: fixed;
    left: 20px;
    z-index: -3;
    -webkit-text-stroke: 3px white;
    text-shadow: #FFF 1px 0 0, #FFF 0 1px 0, #FFF -1px 0 0, #FFF 0 -1px 0;
    -webkit-text-shadow: #FFF 1px 0 0, #FFF 0 1px 0, #FFF -1px 0 0, #FFF 0 -1px 0;
    -moz-text-shadow: #FFF 1px 0 0, #FFF 0 1px 0, #FFF -1px 0 0, #FFF 0 -1px 0;
    /**filter: Glow(color=#FFF, strength=1);*/
  }
</style>
