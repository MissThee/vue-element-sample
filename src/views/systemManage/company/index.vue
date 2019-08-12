<template>
    <div class="animate" style="overflow: hidden;height: 100%;">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree :data="treeData" :style="{height:clientHeight-40 +'px',overflow:'auto',padding:'0px'}" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent" :filter-node-method="filterNode" ref="treeCompany"></el-tree>
        <el-dialog :title="dialogTitle[formDialogStatus]" :visible.sync="formDialogVisible" :close-on-click-modal="false" append-to-body>
            <el-form :rules="rules" ref="formData" size="mini" :model="form" label-width="80px">
                <el-form-item label="上级部门" prop="parentId">
                    <el-cascader
                            :props="cascaderProps"
                            placeholder="上级部门"
                            :show-all-levels="false"
                            :options="treeData"
                            filterable
                            :clearable="false"
                            v-model="form.parentId"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="postData()">确定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import {createCompany, deleteCompany, fetchCompanyList, updateCompany, fetchCompanyOne} from 'src/api/company'
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
                    value: 'id',
                    expandTrigger: 'hover',
                    checkStrictly: true
                },
                currentNodePath: [],
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


            fetchData() {
                fetchCompanyList().then(response => {
                    this.treeData = [{
                        id: -1,
                        label: '【所有部门】',
                        children: response.data.companyList
                    }];
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
                                    if (data.id > 0) {
                                        self.fetchCompanyDataOne(data.id);
                                        self.formDialogVisible = true;
                                        self.formDialogStatus = "update";
                                    }
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
                                    if (data.id > 0) {
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
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            fetchCompanyDataOne(id) {
                fetchCompanyOne(id).then(response => {
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
