<template>
    <div class="animate" ref="mainDiv" style="overflow: hidden;height: 100%;">
        <el-button v-show="!editingType" :icon="showLeftBar?'el-icon-arrow-left':'el-icon-arrow-right'"
                   :style="{float:'right',marginRight:'-5px',fontWeight: 'bold',width: '15px' ,paddingLeft: '5px',position:'absolute',zIndex:'1000',left:showLeftBar?(initLeftWidth-10+'px'):'-7px',top :clientHeight/2+'px' }"
                   size="mini" type="primary" @click="handleSwitchType()" plain></el-button>
        <div>
            <div v-show="showLeftBar" ref="LeftBar" :class="{'left-bar-width':!editingType,'left-bar-full-width':editingType}" :style="{position:'absolute',left: 0}">
                <div slot="header" style="padding:10px">
                    <span>类别</span>
                    <el-tooltip class="item" effect="dark" content="编辑类型" placement="top-start">
                        <el-button style="float: right; padding: 3px" @click="handleEditingType()" icon="el-icon-edit" type="warning" plain>
                            {{editingType?'结束编辑':'编辑类别'}}
                        </el-button>
                    </el-tooltip>
                </div>
                <tree-list
                        v-bind:left-tree-data="typeTree"
                        v-bind:editing-mode="editingType"
                        ref="TypeTree"
                        @setCurrentSelectedId="handleSelectType"
                        @refreshNode="fetchTypeDataList"></tree-list>
            </div>
            <div v-show="!editingType" :style="{position:'absolute',left: leftWidth+'px',right:0,borderLeft: '1px solid skyblue'}">
                <div ref="searchBar" style="overflow: hidden">
                    <div class="grid-tool-bar">
                        <el-button :icon="showSearch?'el-icon-arrow-down':'el-icon-arrow-up'" size="mini" type="primary"
                                   @click="handleSwitchSearch()" plain>{{showSearch?'取消查找':'查找'}}
                        </el-button>
                        <el-button size="mini" type="primary" @click="handleCreate()">添加</el-button>
                    </div>
                    <div v-if="showSearch" class="grid-tool-bar">
                        <el-input style=" width: 300px;margin:0px" placeholder="名称/编号" size="mini"
                                  v-model="keyWords.nameOrId"></el-input>
                        <el-button size="mini" type="primary" @click="loadTable()">查找</el-button>
                    </div>
                </div>
                <el-table :v-loading="listLoading" :data="dangerousChemicalsData"
                          :height="clientHeight-searchBarHeight-pageBarHeight" stripe
                          :default-sort="{prop: 'loginId', order: 'ascending'}" border style="width: 100%;height:100%">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="typeName" align="center" label="类型" min-width="120" sortable></el-table-column>
                    <el-table-column prop="id" align="center" label="编号" min-width="80" sortable></el-table-column>
                    <el-table-column prop="name" align="center" label="名称" min-width="120" sortable></el-table-column>
                    <el-table-column prop="specialWarning" label="特别警示" min-width="400" sortable>
                        <template slot-scope="scope">
                            <pre>{{scope.row.specialWarning}}</pre>
                        </template>
                    </el-table-column>
                    <el-table-column prop="chemicalFormula" label="化学式" min-width="200" sortable></el-table-column>
                    <el-table-column label="危险性">
                        <el-table-column prop="dangerCombustionExplosion" label="燃烧爆炸危险性" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.dangerCombustionExplosion}}</pre>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dangerBody" label="人体危害" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.dangerBody}}</pre>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dangerEnvironmental" label="环境影响" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.dangerEnvironmental}}</pre>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="理化特性及用途">
                        <el-table-column prop="characteristic" label="理化特性" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.characteristic}}</pre>
                            </template>
                        </el-table-column>
                        <el-table-column prop="purpose" label="用途" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.purpose}}</pre>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="individualProtection" label="个体防护" min-width="400" sortable>
                        <template slot-scope="scope">
                            <pre>{{scope.row.individualProtection}}</pre>
                        </template>
                    </el-table-column>
                    <el-table-column label="物理属性">
                        <el-table-column prop="emergencyQuarantine" label="隔离与公共安全" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.emergencyQuarantine}}</pre>
                            </template>
                        </el-table-column>
                        <el-table-column prop="emergencyLeakage" label="泄漏处理" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.emergencyLeakage}}</pre>
                            </template>
                        </el-table-column>
                        <el-table-column prop="emergencyFire" label="火灾扑救" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.emergencyFire}}</pre>
                            </template>
                        </el-table-column>
                        <el-table-column prop="emergencyFirstAid" label="急救" min-width="400" sortable>
                            <template slot-scope="scope">
                                <pre>{{scope.row.emergencyFirstAid}}</pre>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="filePath" label="附件" min-width="200" sortable>
                        <template slot-scope="scope">
           <span v-show="scope.row.fileName!==''">
            <el-tooltip :content="scope.row.filePath" effect="dark" placement="top">
                <a :href="scope.row.filePath" download>
                   <el-tag size="mini" color="white">{{scope.row.fileName}}</el-tag>
                </a>
            </el-tooltip>
           </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="lastEditUserName" label="编辑人" width="100" sortable></el-table-column>
                    <el-table-column fixed="right" label="操作" width="106">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="handleUpdate(scope.row)" plain><i
                                    class="el-icon-edit "></i>编辑
                            </el-button>
                            <el-button size="mini" type="text" style="color:red;"
                                       @click="handelDelete(scope.row.id,scope.row.name )" plain><i
                                    class="el-icon-remove "></i>删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div ref="pageBar" style="overflow: hidden">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page="pageNumber"
                            :page-size="pageSize"
                            layout=" prev, pager, next, jumper"
                            :total="totalRow">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog :title="dialogTitle[formDialogStatus]" :visible.sync="formDialogVisible" append-to-body
                   :close-on-click-modal="false">
            <el-form :rules="rules" ref="formData" size="mini" :model="form" label-width="80px">
                <el-form-item label="类型">
                    <el-cascader
                            size="mini"
                            :props="cascaderProps"
                            placeholder="未选择"
                            :show-all-levels="false"
                            :options="typeTree"
                            filterable
                            :clearable="false"
                            v-model="form.type"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="特别警示">
                    <el-input type="textarea" :autosize="true" v-model="form.specialWarning"></el-input>
                </el-form-item>
                <el-form-item label="化学式">
                    <el-input type="textarea" :autosize="true" v-model="form.chemicalFormula"></el-input>
                </el-form-item>
                <el-form-item label="危险性">
                    <el-form-item label="燃烧爆炸危险性">
                        <el-input type="textarea" :autosize="true" v-model="form.dangerCombustionExplosion"></el-input>
                    </el-form-item>
                    <el-form-item label="人体危害">
                        <el-input type="textarea" :autosize="true" v-model="form.dangerBody"></el-input>
                    </el-form-item>
                    <el-form-item label="环境影响">
                        <el-input type="textarea" :autosize="true" v-model="form.dangerEnvironmental"></el-input>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="理化特性及用途">
                    <el-form-item label="理化特性">
                        <el-input type="textarea" :autosize="true" v-model="form.characteristic"></el-input>
                    </el-form-item>
                    <el-form-item label="用途">
                        <el-input type="textarea" :autosize="true" v-model="form.purpose"></el-input>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="个体防护">
                    <el-input type="textarea" :autosize="true" v-model="form.individualProtection"></el-input>
                </el-form-item>

                <el-form-item label="理化特性及用途">
                    <el-form-item label="隔离与公共安全">
                        <el-input type="textarea" :autosize="true" v-model="form.emergencyQuarantine"></el-input>
                    </el-form-item>
                    <el-form-item label="泄漏处理">
                        <el-input type="textarea" :autosize="true" v-model="form.emergencyLeakage"></el-input>
                    </el-form-item>
                    <el-form-item label="火灾扑救">
                        <el-input type="textarea" :autosize="true" v-model="form.emergencyFire"></el-input>
                    </el-form-item>
                    <el-form-item label="急救">
                        <el-input type="textarea" :autosize="true" v-model="form.emergencyFirstAid"></el-input>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="附件">
                    <file-uploader ref="fileUploader"></file-uploader>
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
    import {
        createDangerousChemicals,
        deleteDangerousChemicals,
        fetchDangerousChemicals,
        fetchDangerousChemicalsTable,
        fetchTypeList,
        updateDangerousChemicals
    } from 'src/api/dangerous-chemicals'
    import {showNotify} from 'src/utils/tools'
    import TreeList from './treeList'
    import FileUploader from "./fileUploader";
    import {mapGetters} from 'vuex'
    import {Notification} from 'element-ui'

    export default {
        name: "dangerousChemicals",
        components: {
            FileUploader,
            TreeList,
        },
        data() {
            return {
                listLoading: false,
                dangerousChemicalsData: [],
                clientHeight: 0,
                showLeftBar: true,
                initLeftWidth: 250,
                leftWidth: 250,
                rightWidth: 0,
                formDialogVisible: false,
                formDialogStatus: '',
                dialogTitle: {
                    update: '编辑',
                    create: '创建'
                },
                form: {
                    selectedFilterTypeId: 0
                },
                rules: {
                    name: [{required: true, message: '名称不能为空', trigger: 'blur'}]
                },
                showSearch: false,
                searchBarHeight: 0,
                pageBarHeight: 0,
                editingType: false,
                downloadStatusOptions: [{
                    value: 1,
                    label: '可下载',
                }, {
                    value: 2,
                    label: '已作废',
                }],
                keyWords: {
                    nameOrId: "",
                    basicAttributes: "",
                    shape: "",
                    color: "",
                    smell: ""
                },
                selectedFilterTypeId: 0,
                pageNumber: 1,
                pageSize: 50,
                totalRow: 0,
                typeTree: [],
                cascaderProps: {
                    value: 'id',
                    expandTrigger: 'hover',
                    checkStrictly: true
                },
            }
        },
        computed: {
            ...mapGetters({
                currentUserId: 'id'
            }),
        },
        watch: {
            showSearch(val) {
                if (!val) {
                    this.keyWords = {
                        nameOrId: "",
                        basicAttributes: "",
                        shape: "",
                        color: "",
                        smell: ""
                    };
                    this.loadTable();
                }
                this.$nextTick(() => {
                    this.searchBarHeight = this.$refs.searchBar.clientHeight;
                })
            }
        },
        mounted() {
            this.fetchTypeDataList()
            this.loadTable();
            this.fixTableHeight();
            this.$nextTick(() => {
                this.searchBarHeight = this.$refs.searchBar.clientHeight;
                this.pageBarHeight = this.$refs.pageBar.clientHeight;
            });
        },
        activated() {
            this.fixTableHeight();
        },
        methods: {
            handleSelectType(selectedFilterTypeId) {
                this.selectedFilterTypeId = selectedFilterTypeId
                this.loadTable()
            },
            loadTable() {
                this.listLoading = true;
                fetchDangerousChemicalsTable(this.pageNumber, this.pageSize, this.selectedFilterTypeId, this.keyWords).then(response => {
                    this.dangerousChemicalsData = response.data.dangerousChemicalsTable;
                    this.totalRow = response.data.totalRow;
                    this.listLoading = false;
                })
            },
            handleCreate() {
                this.form = {
                    type: this.selectedFilterTypeId,
                    filePath: '',
                    fileName: ''
                };
                this.formDialogStatus = 'create';
                this.formDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.fileUploader.clearFiles();
                })
            },
            handelDelete(id, name) {
                this.$confirm('将删除条目 <span style="color:blue">' + name + '</span>，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.listLoading = true;
                    deleteDangerousChemicals(id).then(response => {
                        this.listLoading = false;
                        this.loadTable();
                        showNotify(response, '删除');
                    })
                }).catch(() => {
                    this.$message({
                        type: 'error',
                        message: '出现错误'
                    });
                });
            },
            handleUpdate(row) {
                this.listLoading = true;
                fetchDangerousChemicals(row.id).then(response => {
                    this.form = response.data.dangerousChemicals;
                    if (this.form.fileName !== '') {
                        this.$nextTick(() => {
                            this.$refs.fileUploader.setFiles(this.form.fileName, this.form.filePath);
                        })
                    } else {
                        this.$nextTick(() => {
                            this.$refs.fileUploader.clearFiles(this.form.fileName, this.form.filePath);
                        })
                    }
                });
                this.listLoading = false
                this.formDialogStatus = 'update';
                this.formDialogVisible = true;
                // this.$nextTick(() => {
                //   this.$refs['formData'].clearValidate()
                // })

            },
            postData() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        if (this.$refs.fileUploader.getUploadingState()) {
                            Notification({
                                message: '文件尚未完成上传',
                                type: 'error',
                                duration: 1500,
                            });
                            return;
                        }
                        let fileList = this.$refs.fileUploader.fileList;
                        if (fileList.length > 0) {
                            this.form.fileName = fileList[0].name;
                            this.form.filePath = fileList[0].url;
                        }
                        console.log('this.form', this.form);

                        if (this.formDialogStatus === 'update') {
                            this.listLoading = true;
                            updateDangerousChemicals(this.form).then(response => {
                                this.listLoading = false;
                                this.formDialogVisible = false;
                                this.loadTable();
                                showNotify(response, '更新');
                            })
                        } else if (this.formDialogStatus === 'create') {
                            this.listLoading = true;
                            createDangerousChemicals(this.form).then(response => {
                                this.listLoading = false;
                                this.formDialogVisible = false;
                                this.loadTable();
                                showNotify(response, '添加');
                            })
                        }
                    }
                })
            },
            getStatusName(status) {
                switch (status) {
                    case 1:
                        return {name: "可下载", type: "primary", canDownLoad: true};
                    case 2:
                        return {name: "已作废", type: "danger", canDownLoad: false};
                    case 3:
                        return {name: "审核中", type: "warning", canDownLoad: false};
                    default:
                        return {name: "未设置", type: "warning", canDownLoad: false};
                }
            },
            handleSwitchType() {
                if (this.showLeftBar) {
                    this.leftWidth = 0
                } else {
                    this.leftWidth = this.initLeftWidth;
                }
                this.showLeftBar = !this.showLeftBar;
            },
            handleSwitchSearch() {
                this.showSearch = !this.showSearch;
            },
            handleEditingType() {
                this.editingType = !this.editingType;
            },
            //typeSelector
            fetchTypeDataList() {
                fetchTypeList(true).then(response => {
                    this.typeTree = response.data.typeList;
                })
            },

            handleCurrentChange(val) {
                this.pageNumber = val;
                this.loadTable();
            },
            fixTableHeight() {
                const that = this;
                this.$nextTick(function () {
                    that.clientHeight = that.$refs.mainDiv.clientHeight;
                    window.onresize = function temp() {
                        that.clientHeight = that.$refs.mainDiv.clientHeight;
                    };
                })
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    pre {
        padding: 0;
        margin: 0 10px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .left-bar-full-width {
        right: 0
    }

    .left-bar-width {
        width: 250px
    }
</style>
