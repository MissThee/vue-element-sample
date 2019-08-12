<template>
  <span>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree :data="treeData"
               :style="{ overflow:'auto',padding:'0px',top:'0px'}"
               :props="defaultProps"
               node-key="id"
               default-expand-all
               :expand-on-click-node="false"
               :render-content="editingMode?renderContent:null"
               :filter-node-method="filterNode"
               ref="treeType"
               @node-click="handleNodeClick"
      ></el-tree>
      <el-dialog :title="dialogTitle[formDialogStatus]" :visible.sync="formDialogVisible" :close-on-click-modal="false" append-to-body>
        <el-form :rules="rules" ref="formData" size="mini" :model="form" label-width="80px">
            <el-form-item label="所属类别" prop="parentId">
                <el-cascader
                        size="mini"
                        :props="cascaderProps"
                        placeholder="所属类别"
                        :show-all-levels="false"
                        :options="treeData"
                        filterable
                        :clearable="false"
                        v-model="form.parentId"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="类别名称" prop="name">
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
    import {createType, deleteType, updateType, fetchTypeOne} from 'src/api/dangerous-chemicals'
    import {showNotify} from 'src/utils/tools'

    export default {
        name: "tree-list",
        props: {
            'leftTreeData': {},
            'editingMode': {default: false}
        },
        data() {
            return {
                clientHeight: 0,
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
                    value: 'id',
                    expandTrigger: 'hover',
                    checkStrictly: true
                },
                filterText: '',
            }
        },
        computed: {
            treeData() {
                return [{
                    id: -1,
                    label: '【所有类别】',
                    children: this.leftTreeData
                }];
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
                                    self.formDialogVisible = true;
                                    self.formDialogStatus = "create";
                                    delete self.form.id;
                                    self.form.name = "";
                                    self.form.parentId = data.id;
                                }
                            }
                        }, "添加"),
                        createElement('el-button', {
                            attrs: {
                                size: "mini",
                                style: "font-size: 12px;padding: 3px;" + (data.id <= 0 ? "display:none;" : ""),
                                type: "text",
                                plain: ''
                            },
                            on: {
                                click: function () {
                                    self.fetchTypeDataOne(data.id);
                                    self.formDialogVisible = true;
                                    self.formDialogStatus = "update";
                                }
                            }
                        }, "编辑"),
                        createElement('el-button', {
                            attrs: {
                                size: "mini",
                                style: "font-size: 12px;color:red;padding: 3px;" + (data.id <= 0 ? "display:none;" : ""),
                                type: "text",
                                plain: ''
                            }, on: {
                                click: function () {
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
                        }, "删除")
                    ]),
                ]);
            },
            postData() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        if (this.formDialogStatus === 'update') {
                            updateType(this.form).then(response => {
                                this.formDialogVisible = false;
                                this.refreshNode();
                                showNotify(response, '更新');
                            })
                        } else if (this.formDialogStatus === 'create') {
                            createType(this.form).then(response => {
                                this.formDialogVisible = false;
                                this.refreshNode();
                                showNotify(response, '添加');
                            })
                        }
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleNodeClick(data) {
                this.$emit('setCurrentSelectedId', data.id);
            },
            refreshNode() {
                this.$emit('refreshNode');
            },
            fetchTypeDataOne(id) {
                fetchTypeOne(id).then(response => {
                    this.form.id = response.data.id;
                    this.form.name = response.data.label;
                    if (response.data.parentId === undefined) {
                        this.form.parentId = -1;//级联选择器id值不能为0，否则绑定不上数据，原因不明，仅在此模块中出现此问题
                    } else {
                        this.form.parentId = response.data.parentId;
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
