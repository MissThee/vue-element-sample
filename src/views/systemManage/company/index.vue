<template>
  <div class="animate" style="overflow: hidden;height: 100%;">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree :data="treeData" :style="{height:clientHeight-40 +'px',overflow:'auto',padding:'0px'}"   node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent" :filter-node-method="filterNode" ref="treeCompany"></el-tree>
      <el-dialog :title="dialogTitle[formDialogStatus]" :visible.sync="formDialogVisible" :close-on-click-modal="false" append-to-body>
      <el-form :rules="rules" ref="formData" size="mini" :model="form" label-width="80px">
        <el-form-item label="上级部门" prop="loginId">
           <el-cascader
             :props="cascaderProps"
             placeholder="上级部门"
             :show-all-levels="false"
             :options="companyList"
             filterable
             :clearable="false"
             change-on-select
             v-model="currentNodePath"
             @change="setCurrentParentId"
           ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="loginId">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button type="primary"  @click="postData()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {createCompany, deleteCompany, fetchCompanyList, updateCompany} from 'src/api/company'
  import {getNodePath} from 'src/utils/tools'
  import {showNotify} from 'src/utils/tools'
  export default {
    name: "companyOption",
    data() {
      return {
        clientHeight: 0,
        treeData: [],

        dialogTitle: {
          update: '编辑',
          create: '创建'
        },
        formDialogStatus: '',
        rules: {
          name: [{required: true, message: '部门名不能为空', trigger: 'blur'}]
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
        companyList: [],
        filterText: '',
      }
    },
    mounted() {
      this.fetchData()
      // this.$nextTick(function () {
      this.clientHeight = `${document.documentElement.clientHeight}` - 90;
      const that = this;
      window.onresize = function temp() {
        that.clientHeight = `${document.documentElement.clientHeight}` - 90;
      };
      // })
    },
    watch: {
      filterText(val) {
        this.$refs.treeCompany.filter(val);
      }
    },
    methods: {

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
      //     getPath(data);
      //   }
      //   catch (e) {
      //   }
      //   return temppath;
      // },
      fetchData() {
        fetchCompanyList().then(response => {
          this.treeData = [{
            id: 0,
            label: '【所有部门】',
            children: response.data.companyList
          }];
          // let companyList = [];
          // this.transKey(this.treeData, companyList);
          // console.log('结果集:', companyList);
        })
      },
      renderContent: function (createElement, {node, data, store}) {
        let self = this;
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
                click() {
                  // console.info("点击了节点" + data.id + "的添加按钮");
                  // let temp = self.deepCopy(self.treeData)
                  self.formDialogVisible = true;
                  self.formDialogStatus = "create";
                  delete self.form.id;
                  self.form.name = "";
                  self.form.parentId = data.id;
                  let path = getNodePath(self.form.parentId, self.treeData);
                  // console.log('got path',path)
                  self.companyList =self.treeData;
                  // self.setDisabledNode(temp, null);
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
                    // console.log(self.form.id);
                    let path = getNodePath(self.form.id, temp);
                    // console.log('path)',path);
                    let id = path.pop();
                    // console.log('path)',id);
                    self.companyList = self.setDisabledNode(temp, id);
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
                    self.$confirm('将删除部门 <span style="color:blue">' + data.label + '</span>，是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      dangerouslyUseHTMLString: true
                    }).then(() => {
                      self.listLoading = true;
                      deleteCompany(data.id).then(response => {
                        self.listLoading = false;
                        self.fetchData();
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
              updateCompany(this.form).then(response => {
                this.listLoading = false;
                this.formDialogVisible = false;
                this.fetchData();
                showNotify(response, '更新');
              }).error()
            } else if (this.formDialogStatus === 'create') {
              this.listLoading = true;
              createCompany(this.form).then(response => {
                this.listLoading = false;
                this.formDialogVisible = false;
                this.fetchData();
                showNotify(response, '添加');
              })
            }
          }
        })
        let self=this;

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
      //id转value；label转title；children转children，
      // transKey(input, output) {
      //   for (let i = 0; i < input.length; i++) {
      //     let temp = {};
      //     let inputTemp = input[i];
      //
      //     temp.value = inputTemp.id;
      //     temp.title = inputTemp.label;
      //     if (inputTemp.children !== undefined && inputTemp.children !== []) {
      //       let childrenArr = [];
      //       this.transKey(inputTemp.children, childrenArr);
      //       temp.children = childrenArr;
      //     }
      //     output.push(temp);
      //   }
      // },

    }
  }
</script>

<style scoped>

</style>
