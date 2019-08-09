<template>
    <div ref="AppMain" :class="{'app-main':true,'no-scroll':isNoScroll}">
        <transition v-on:leave="leave" v-on: name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'AppMain',
        data() {
            return {
                isNoScroll: false
            }
        },
        computed: {
            cachedViews() {
                return this.$store.state.app.cachedViews
            }
        }, methods: {
            leave() {
                this.isNoScroll = true;
            }
        }
    }
</script>
<style scoped>
    .app-main {
        height: 100%;
    }

    .no-scroll {
        overflow: hidden;
    }

    /*切换效果fade-xxx*/
    .fade-enter {
        opacity: 0;
        transform: translateX(10px);
    }

    .fade-enter-active {
        transition: all .2s;
    }

    .fade-leave-active {
        transition: all .2s;
    }

    .fade-leave-active {
        opacity: 0;
        transform: translateX(10px);
    }

</style>
