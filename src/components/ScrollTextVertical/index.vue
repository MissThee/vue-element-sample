<template>
    <div id="box">
        <ul id="con1" ref="con1" :class="{anim:animate===true}">
            <li v-for='item in items'>
                <a @click="handleClick(item.title,item.content)">
                    <div>{{item[text]}}</div>
                </a>
            </li>
        </ul>
        <el-dialog :visible.sync="dialogVisible" width="60%">
            <div class="title" v-if="titleNow!==undefined||titleNow.length>0"> {{titleNow}}</div>
            <div class="content">{{contentNow}}</div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'ScrollTextVertical',
        props: ['items', 'text'],
        data() {
            return {
                dialogVisible: false,
                animate: false,
                contentNow: '',
                titleNow: ''
            }
        },
        created() {
            this.interval = setInterval(this.scroll, 4000);
            // 在钩子函数中调用我在method 里面写的scroll()方法，注意此处不要忘记加this,我在这个位置掉了好几次坑，都是因为忘记写this。
        },
        methods: {
            scroll() {
                let con1 = this.$refs.con1;
                con1.style.marginTop = '-30px';
                this.animate = !this.animate;
                let that = this; // 在异步函数中会出现this的偏移问题，此处一定要先保存好this的指向
                setTimeout(function () {
                    that.items.push(that.items[0]);
                    that.items.shift();
                    con1.style.marginTop = '0px';
                    that.animate = !that.animate;  // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
                }, 500)
            },
            handleClick(title, content) {
                this.dialogVisible = true;
                this.titleNow = title;
                this.contentNow = content;
            }
        },
        beforeDestroy() {
            if (this.interval != null) {
                clearInterval(this.interval);
            }
        }
    }
</script>

<style scoped>
    .anim {
        transition: all 0.5s;
    }

    * {
        margin: 0;
        padding: 0;
    }

    #box {
        background-color: lightskyblue;
        color: white;
        overflow: hidden;
        height: 40px;
        padding-left: 30px;
        transition: all 0.5s;
    }

    #con1 li {
        width: 850px;
        text-overflow: ellipsis;
        word-break: keep-all;
        overflow: hidden;
        list-style: none;
        line-height: 40px;
        height: 30px;
    }

    .title {
        font-weight: bold;
        text-align: center;
        font-size: 20px;
        padding-bottom: 10px;
    }

    .content {
        font-size: 15px;
        padding: 10px;
    }
</style>


