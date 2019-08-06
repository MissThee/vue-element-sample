<template>
  <span>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree :data="treeData"
               :style="{ overflow:'auto',padding:'0px',top:'0px'}"
               :props="defaultProps"
               node-key="id"
               default-expand-all
               :expand-on-click-node="false"
               :render-content="edtingMode?renderContent:null"
               :filter-node-method="filterNode"
               ref="treeType"
               @node-click="handleNodeClick"
      ></el-tree>
      <el-dialog :title="dialogTitle[formDialogStatus]" :visible.sync="formDialogVisible" :close-on-click-modal="false" append-to-body>
        <el-form :rules="rules" ref="formData" size="mini" :model="form" label-width="80px">
          <el-form-item label="所属类别" prop="loginId">
            <el-cascader
             :props="cascaderProps"
             placeholder="所属类别"
             :show-all-levels="false"
             :options="typeList"
             filterable
             :clearable="false"
             change-on-select
             v-model="currentNodePath"
             @change="setCurrentParentId"
            ></el-cascader>
          </el-form-item>
        <el-form-item label="类别名称" prop="loginId">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="postData()">确定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
  import {createType, deleteType, updateType} from 'src/api/dangerous-chemicals'
  import {showNotify} from 'src/utils/tools'

  export default {
    name: "tree-list",
    data() {
      return {
        clientHeight: 0,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogTitle: {
          update: '编辑',
          create: '创建'
        },
        formDialogStatus: '',
        rules: {
          name: [{required: true, message: '类别名称不能为空', trigger: 'blur'}]
        },
        formDialogVisible: false,
        form: {
          id: null,
          parentId: null,
          name: null
        },
        cascaderProps: {
          value: 'id'
        },
        currentNodePath: [],
        typeList: [],
        filterText: '',
        edtingMode: false,
      }
    },
    mounted() {
      // this.$nextTick(function () {
      this.clientHeight = `${document.documentElement.clientHeight}` - 80;
      const that = this;
      window.onresize = function temp() {
        that.clientHeight = `${document.documentElement.clientHeight}` - 80;
      };
      // })
    },
    watch: {
      filterText(val) {
        this.$refs.treeType.filter(val);
      }
    },
    methods: {
      getNodePath(id, dataArr) {
        var temppath = [];
        for(let i=0 ;i<dataArr.length;i++) {
          //定义变量保存当前结果路径
          let data=dataArr[i];
          try {
            function getPath(node) {
              temppath.push(node.id);
              //找到符合条件的节点，通过throw终止掉递归
              if (node.id === parseInt(id)) {
                // self.currentNodePath = temppath;
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
            getPath(data);
          }
          catch (e) {
          }

        }
        return temppath;
      },
      // getNodePath(id, data) {
      //   var self = this;
      //   //定义变量保存当前结果路径
      //   var temppath = [];
      //   try {
      //     function getPath(node) {
      //       temppath.push(node.id);
      //       //找到符合条件的节点，通过throw终止掉递归
      //       // console.log(node.id+" "+id+"|||"+(node.id ===parseInt(id)))
      //       if (node.id === parseInt(id)) {
      //         // self.currentNodePath = temppath;
      //         throw ("GOT IT!");
      //       }
      //       if (node.children && node.children.length > 0) {
      //         for (var i = 0; i < node.children.length; i++) {
      //           getPath(node.children[i]);
      //         }
      //         //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
      //         temppath.pop();
      //       }
      //       else {
      //         //找到叶子节点时，删除路径当中的该叶子节点
      //         temppath.pop();
      //       }
      //     }
      //
      //     getPath(data);
      //   }
      //   catch (e) {
      //   }
      //   return temppath;
      // },
      fetchData(data) {
          this.treeData = [{
            id: 0,
            label: '【所有类别】',
            children: data
          }];
      },
      renderContent: function (createElement, {node, data, store}) {
        var self = this;
        return createElement('span', {
          attrs: {
            style: "flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;"
          }
        }, [
          createElement('span', [
            createElement('span', {
              attrs: {
                style: "float: left;"
              }
            }, node.label)
          ]),
          createElement('span', [
            createElement('el-button', {
              attrs: {
                size: "mini",
                style: "font-size: 12px;padding: 3px",
                type: "text",
                plain: ''
              }, on: {
                click: function () {
                  // console.info("点击了节点" + data.id + "的添加按钮");
                  let temp = self.deepCopy(self.treeData)
                  self.formDialogVisible = true;
                  self.formDialogStatus = "create";
                  delete self.form.id;
                  self.form.name = "";
                  self.form.parentId = data.id;
                  let path = self.getNodePath(self.form.parentId, temp);
                  // console.log('got path',path)
                  self.typeList = self.setDisabledNode(temp, null);
                  self.currentNodePath = path;
                }
              }
            }, "添加"),
            createElement('el-button', {
              attrs: {
                size: "mini",
                style: "font-size: 12px;padding: 3px;" + (data.id === 0 ? "display:none;" : ""),
                type: "text",
                plain: ''
              },
              on: {
                click: function () {
                  if (data.id === 0) {
                    return;
                  } else {
                    // console.info("点击了节点" + data.id + "的编辑按钮");
                    let temp = self.deepCopy(self.treeData)
                    self.formDialogVisible = true;
                    self.formDialogStatus = "update";
                    self.form.id = data.id;
                    self.form.name = data.label;
                    self.form.parentId = data.parentId;
                    let path = self.getNodePath(self.form.id, temp);
                    // console.log('got path',path)
                    let id = path.pop();
                    self.typeList = self.setDisabledNode(temp, id);
                    self.currentNodePath = path;
                  }
                }
              }
            }, "编辑"),
            createElement('el-button', {
              attrs: {
                size: "mini",
                style: "font-size: 12px;color:red;padding: 3px;" + (data.id === 0 ? "display:none;" : ""),
                type: "text",
                plain: ''
              }, on: {
                click: function () {
                  if (data.id === 0) {
                    return;
                  } else {
                    // console.info("点击了节点" + data.id + "的删除按钮");
                    self.$confirm('将删除类别 <span style="color:blue">' + data.label + '</span>，若此类别下有知识条目，删除此类别后，只能在【所有类别】中查看这些知识条目，是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      dangerouslyUseHTMLString: true
                    }).then(() => {
                      self.listLoading = true;
                      deleteType(data.id).then(response => {
                        self.listLoading = false;
                        self.refreshNode();
                        showNotify(response, '删除');
                      })
                    }).catch(() => {
                    });
                  }
                }
              }
            }, "删除")
          ]),
        ]);
      },
      postData() {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            if (this.formDialogStatus === 'update') {
              this.listLoading = true;
              updateType(this.form).then(response => {
                this.listLoading = false;
                this.formDialogVisible = false;
                this.refreshNode();
                showNotify(response, '更新');
              })
            } else if (this.formDialogStatus === 'create') {
              this.listLoading = true;
              createType(this.form).then(response => {
                this.listLoading = false;
                this.formDialogVisible = false;
                this.refreshNode();
                showNotify(response, '添加');
              })
            }
          }
        })
      },
      setCurrentParentId() {
        if (this.currentNodePath.length > 0) {
          this.form.parentId = this.currentNodePath[this.currentNodePath.length - 1]
        }
      },
      setDisabledNode(data, id) {
        var filter = function (data, id) {
          var newData = data.filter(x => x.id !== id)
          newData.forEach(x => x.children && (x.children = filter(x.children, id)))
          return newData
        }
        var a = filter(data, id);
        return a;
      },
      deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj))
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      setEdtingMode(status) {
        this.edtingMode = status;
      },
      handleNodeClick(data){
        this.$emit('setCurrentSelectedId', data.id);
      },
      refreshNode(){
        this.$emit('refreshNode');
      }
    }
  }
</script>

<style scoped>

</style>
