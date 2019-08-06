<template>
  <div id="masker">
    <el-cascader
      size="mini"
      :props="cascaderProps"
      placeholder="未选择"
      :show-all-levels="false"
      :options="treeData"
      filterable
      :clearable="false"
      change-on-select
      v-model="currentNodePath"
      @change="setCurrentId"
      expand-trigger="click"
    ></el-cascader>
  </div>
</template>

<script>

  export default {
    name: "treeSelector",
    data() {
      return {
        treeData: [],
        cascaderProps: {
          value: 'id'
        },
        currentNodePath: [],
      }
    },
    methods: {
      initData(data) {
        this.treeData = data
      },
      initCurrentPath(id) {
        this.currentNodePath = this.getNodePath(id, this.treeData);
      },
      getNodePath(id, data) {
        //定义变量保存当前结果路径
        var temppath = [];
        try {
          function getPath(node) {
            temppath.push(node.id);
            //找到符合条件的节点，通过throw终止掉递归
            // console.log(node.id+" "+id+"|||"+(node.id ===parseInt(id)))
            if (node.id === parseInt(id)) {
              throw ("GOT IT!");
            }
            if (node.children && node.children.length > 0) {
              for (var i = 0; i < node.children.length; i++) {
                getPath(node.children[i]);
              }
              //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
              temppath.pop();
            }
            else {
              //找到叶子节点时，删除路径当中的该叶子节点
              temppath.pop();
            }
          }

          getPath({
            id: 0,
            children: data
          });
        }
        catch (e) {
        }
        return temppath;
      },
      setCurrentId(path) {
        // console.log(path)
        if (path.length > 0) {
          this.currentNodePath = this.getNodePath(path[path.length-1], this.treeData);
          this.$emit('setCurrentId', path[path.length-1]);
        } else {
          this.$emit('setCurrentId', null);
        }
      }
    },
  }
</script>

<style scoped>

</style>
