<template>
    <div class="animate" style="overflow: hidden;height: 100%;">
        <el-row>
            <el-col :span="12">
                <el-table :data="roleTableData" @row-click="handleRowClick" :height="clientHeight" stripe
                          :default-sort="{prop: 'name', order: 'ascending'}" border >
                    <el-table-column key="index" type="index" label="序号" width="50"></el-table-column>
                    <el-table-column key="name" prop="name" label="角色名" sortable></el-table-column>
                    <el-table-column key="note" prop="note" label="备注" sortable></el-table-column>
                    <el-table-column key="status" prop="status" label="状态" width="80px" align="center" sortable>
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag :type="scope.row.status ==='正常'?'success':'danger'" size="mini">{{ scope.row.status }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column key="operation" fixed="right" label="操作" align="center" width="53">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" style="color:red;" @click="handelDelete(scope.row.id,scope.row.name)" plain>
                                <i class="el-icon-remove"></i>删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card el-card__body">
                    <el-form :rules="formRules" ref="formData" size="mini" :model="form" label-width="80px">
                        <el-form-item label="角色名">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="权限分配"></el-form-item>
                        <el-form-item label-width="30px">
                            <el-checkbox-group v-model="form.checkedPages">
                                <div class="page-border" v-for="page in pages">
                                    <el-checkbox v-for="select in page " :key="select.value" :label="select.value">{{select.text}}
                                    </el-checkbox>
                                </div>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="备注" prop="note">
                            <el-input v-model="form.note"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-switch
                                    v-model="form.status"
                                    active-color="#33cc66"
                                    inactive-color="#ff6666"
                                    active-text="正常"
                                    inactive-text="停用"
                                    active-value="正常"
                                    inactive-value="停用">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label-width="50px">
                            <el-button size="mini" type="primary" @click="handleCreate()">新建角色</el-button>
                            <el-button type="primary" @click="handleSave()">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {createRole, deleteRole, fetchRole, fetchRoleTable, updateRole} from 'src/api/role'
    import {showNotify} from 'src/utils/tools'
    import route from 'src/lang/zh'
    import {asyncRouterMap} from 'src/router/index'

    export default {
        components: {},
        name: 'roleOption',
        data() {
            return {
                roleTableData: [],
                clientHeight: 0,
                formDialogVisible: false,
                dialogTitle: {
                    update: '编辑',
                    create: '创建'
                },
                form: {
                    name: '',
                    note: '',
                    status: '正常',
                    checkedPages: [],
                },
                pages: [
                    //page数据示例，自动取router中的路由生成
                    // [
                    //   {'value': 101, 'text': this.$t("route.userOption")},
                    //   {'value': 102, 'text': this.$t("route.roleOption")},
                    //   {'value': 103, 'text': this.$t("route.companyOption")},
                    //   {'value': 104, 'text': this.$t("route.postOption")},
                    //   {'value': 105, 'text': this.$t("route.loginPageImage")},
                    //   {'value': 106, 'text': this.$t("route.loginPageNews")}
                    // ],
                    //
                    // [
                    //
                    //   {'value': 201, 'text': this.$t("route.importantCompany")},
                    //   {'value': 202, 'text': this.$t("route.dangerousChemicals")},
                    //   {'value': 203, 'text': this.$t("route.showMap")},
                    //   {'value': 204, 'text': this.$t("route.combatQuery")},
                    //   {'value': 205, 'text': this.$t("route.material")},
                    // ],
                    //
                    // [
                    //   {'value': 301, 'text': this.$t("route.knowledgeBase")},
                    //   {'value': 401, 'text': this.$t("route.addressBook")},
                    // ],
                ],
                role: {},
                formRules: {
                    name: [
                        {required: true, message: '请输入角色名', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    note: [
                        {min: 1, max: 200, message: '长度在 1 到 300 个字符', trigger: 'blur'}
                    ]
                },
                formStatus: '',
            }
        },
        mounted() {
            this.fetchData()
            this.$nextTick(function () {
                this.clientHeight = `${document.documentElement.clientHeight}` - 80;
                const that = this;
                window.onresize = function temp() {
                    that.clientHeight = `${document.documentElement.clientHeight}` - 80;
                };
                this.getRouterInfo();
            })
        },
        methods: {
            fetchData() {
                this.listLoading = true;
                fetchRoleTable().then(response => {
                    this.roleTableData = response.data.roleTable;
                    this.listLoading = false;
                })
            },
            handleRowClick(row) {
                this.listLoading = true;
                fetchRole(row.id).then(response => {
                    this.form = response.data.role;
                    this.listLoading = false
                });
                this.formStatus = 'update';
            },
            handleCreate() {
                this.form = {
                    name: '',
                    note: '',
                    status: '正常',
                    checkedPages: [],
                };
                this.formStatus = 'create';
            },
            handelDelete(id, loginId) {
                this.$confirm('将删除角色 <span style="color:blue">' + loginId + '</span>，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.listLoading = true;
                    deleteRole(id).then(response => {
                        this.listLoading = false;
                        this.fetchData();
                        showNotify(response, '删除');
                    })
                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
            },
            handleSave() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        if (this.formStatus === 'update') {
                            this.listLoading = true;
                            updateRole(this.form).then(response => {
                                this.fetchData();
                                showNotify(response, '修改');
                                this.listLoading = false;
                            })
                        } else if (this.formStatus === 'create') {
                            this.listLoading = true;
                            createRole(this.form).then(response => {
                                this.fetchData();
                                showNotify(response, '添加');
                                this.listLoading = false;
                            })
                        }
                    }
                })
            },
            getRouterInfo() {
                for (let i in asyncRouterMap) {
                    let child = asyncRouterMap[i].children;
                    let pages = [];
                    for (let j in child) {
                        pages.push({'value': child[j].meta.page[0], 'text': this.$t("route." + child[j].name)})
                    }
                    this.pages.push(pages);
                }
            }
        }
    }
</script>
<style scoped>
    .box-card {
        padding: 10px;
        margin: auto;
        width: 95%;
        border: 1px solid #e6ebf5;
    }

    .el-card__body {
        padding-left: 0;
    }

    .page-border {
        border-top: 1px solid #ccc;
        border-collapse: collapse;
    }

    .page-border:first-child {
        border-top: none;
    }
</style>
