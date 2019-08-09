<template>
  <div class="animate" style="overflow: hidden;height: 100%;">
    <el-row :gutter="20" class="grid-tool-bar">
      <el-col :span="24">
        <el-button size="mini" style="float:left;margin-left: 10px" type="primary" @click="handleCreate()">添加</el-button>
        <el-input style="float:left;width: 150px;margin:0 0 0 20px" placeholder="员工编号\姓名\账号" size="mini" v-model="keyWords.searchWords"></el-input>
        <el-button style="float:left" size="mini" type="primary" @click="loadTable()">查找</el-button>
      </el-col>
    </el-row>
    <el-table ref="table1" :v-loading="listLoading" :data="userTableData" :height="clientHeight-32" stripe :default-sort="{prop: 'name', order: 'ascending'}" border>
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="avatarFullPath" align="center" label="头像" width="90" sortable>
        <template slot-scope="scope">
          <img v-if="scope.row.avatarFullPath.length>0" :src="scope.row.avatarFullPath" height="40"/>
        </template>
      </el-table-column>
      <el-table-column prop="loginId" label="账号" width="120" sortable></el-table-column>
      <el-table-column prop="employeeId" label="员工编号" min-width="120" sortable></el-table-column>
      <el-table-column prop="name" label="姓名" width="80" sortable></el-table-column>
      <el-table-column prop="companyName" label="基层单位" min-width="120" sortable></el-table-column>
      <el-table-column prop="sex" label="性别" align="center" min-width="55" sortable>
        <template slot-scope="scope">
          {{scope.row.sex===1?'男':(scope.row.sex===2?'女':'')}}
        </template>
      </el-table-column>
      <el-table-column prop="birth" label="出生日期" min-width="100" sortable></el-table-column>
      <el-table-column prop="entryDate" label="首次参加工作日期" min-width="110" sortable></el-table-column>
      <el-table-column prop="workBeginDate" label="工龄计算起时间" min-width="99" sortable></el-table-column>
      <el-table-column prop="degree" label="文化程度" min-width="110" sortable></el-table-column>
      <el-table-column prop="group" label="员工子组" min-width="110" sortable></el-table-column>
      <el-table-column prop="qualification" label="职业资格" min-width="110" sortable></el-table-column>
      <el-table-column prop="level" label="等级" min-width="100" sortable></el-table-column>
      <el-table-column prop="postName" label="现职位" min-width="100" sortable></el-table-column>
      <el-table-column prop="role_names" label="角色" min-width="300" sortable>
        <template slot-scope="scope">
          <el-tooltip v-for="(item, key, index) in scope.row.role_ids_all_obj" :key="key" :content="item.status ==='正常'?'正常':'已停用'" effect="dark" placement="top">
            <el-tag style="margin-left: 2px" :type="item.status ==='正常'?'primary':'danger'" size="mini">{{ item.name }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="isAdmin" label="类型" width="60" align="center" sortable>
        <template slot-scope="scope">
          <el-tag :type="scope.row.isAdmin ===1?'':'success'" size="mini">{{scope.row.isAdmin ===1?'超管':'用户'}}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column prop="lastLoginDate" label="上次登录时间" width="170" sortable></el-table-column>-->
      <!--<el-table-column class="avatar-row" prop="avatar" width="60" label="头像">
      <template slot-scope="scope">
      <img :src="Global.urlPrefix+scope.row.avatar" width="40" height="40" />
      </template>
      </el-table-column>-->
      <el-table-column fixed="right" label="操作" width="106">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)" plain><i class="el-icon-edit "></i>编辑
          </el-button>
          <el-button size="mini" type="text" style="color:red;" @click="handelDelete(scope.row.id,scope.row.loginId,scope.row.isAdmin)" plain><i class="el-icon-remove "></i>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper"
      :total="totalRow"
    >
    </el-pagination>
    <el-dialog :title="dialogTitle[formDialogStatus]" :visible.sync="formDialogVisible" :close-on-click-modal="false" append-to-body>
      <el-form :rules="rules" ref="formData" size="mini" :model="form"   label-width="5em">
        <el-form-item label="账号" prop="loginId">
          <el-input v-model="form.loginId"></el-input>
        </el-form-item>
        <!--<el-form-item v-show="formDialogStatus==='create'" label="密码" :rules="formDialogStatus==='create'?rules.password:[]" prop="password">-->
        <!--<el-input v-model="form.password"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item   label="密码" :rules="formDialogStatus==='create'?rules.password:[]" prop="password">
          <el-input v-model="form.password" :placeholder="formDialogStatus==='create'?'':'若不修改密码，留空即可'"></el-input>
        </el-form-item>
        <el-form-item label="员工编号" prop="employeeId">
          <el-input v-model="form.employeeId"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="个人简介" prop="individualResume">
          <el-input type="textarea" v-model="form.individualResume"></el-input>
        </el-form-item>
        <el-form-item label="基层单位"   prop="company">
          <tree-selector ref="companySelector"  @setCurrentId="updateCompanyId"></tree-selector>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="未选择">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-date-picker v-model="form.birth" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="首次参加工作日期" prop="entryDate" class="double-line-label">
          <el-date-picker v-model="form.entryDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="工龄计算起时间" prop="workBeginDate" class="double-line-label">
          <el-date-picker v-model="form.workBeginDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="文化程度" prop="level">
          <el-input v-model="form.degree"></el-input>
        </el-form-item>
        <el-form-item label="员工子组" prop="group">
          <el-input v-model="form.group"></el-input>
        </el-form-item>
        <el-form-item label="职业资格" prop="qualification">
          <el-input v-model="form.qualification"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input v-model="form.level"></el-input>
        </el-form-item>
        <el-form-item label="现职位" prop="post">
          <tree-selector ref="postSelector" @setCurrentId="updatePostId"></tree-selector>
        </el-form-item>
        <el-form-item label="角色" prop="checkedRoles">
          <el-checkbox-group v-model="form.checkedRoles">
            <el-checkbox v-for="role in roles" :label="role.value" :key="role.value">{{role.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <image-cropper ref="imageCropper"></image-cropper>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="postFormData()">确定</el-button>
        <!--<el-button v-else type="primary" @click="postData()">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import ImageCropper from 'src/components/ImageCropper'
  import {createUser, deleteUser, fetchRoles, fetchUser, fetchUserTable, updateUser} from 'src/api/user'
  import {fetchCompanyList} from 'src/api/company'
  import {fetchPostList} from 'src/api/post'

  import {showNotify} from 'src/utils/tools'
  import TreeSelector from "src/components/treeSelector/index";
  import Avatar from 'vue-image-crop-upload'

  export default {
    name:'userOption',
    components: {
      TreeSelector,
      Avatar,
      ImageCropper
    },
    data() {
      return {
        // Global,
        clientHeight: 0,
        listLoading: false,
        userTableData: [],
        formDialogVisible: false,
        dialogTitle: {
          update: '编辑',
          create: '创建'
        },
        formDialogStatus: '',
        form: {},
        roles: [],
        user: {},
        rules: {
          loginId: [{required: true, message: '用户名不能为空', trigger: 'blur'},
            // {validator: validateLoginId, trigger: 'change'}
          ],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          name: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        },
        avatarDialogVisible: false,
        previews: {},
        editingAvatarUrl: '',
        loginIdCanUse: '',
        sexOptions: [{
          value: 1,
          label: '男'
        }, {
          value: 2,
          label: '女'
        }],
        needCheckLoginId: true,
        pageNumber: 1,
        pageSize: 50,

        totalRow: 0,
        keyWords: {searchWords: ''},
      }
    },
    computed: {
      scale: function () {
        return {x: 60 / this.previews.w, y: 60 / this.previews.h}
      }
    },
    created() {
      this.fullHeight()
      this.loadTable()
    },
    mounted() {
      this.fetchCompanyData()
      this.fetchPostData()
    },
    methods: {
      fullHeight() {
        this.clientHeight = `${document.documentElement.clientHeight}` - 120;
        const that = this;
        window.onresize = function temp() {
          that.clientHeight = `${document.documentElement.clientHeight}` - 120;
        };
      },
      loadTable() {
        this.listLoading = true;
        fetchUserTable(this.pageNumber, this.pageSize, this.keyWords).then(response => {
          this.userTableData = response.data.userTable;
          this.totalRow = response.data.totalRow;
          this.listLoading = false;
        })
      },
      handleCreate() {
        this.form = {
          checkedRoles: [],
        };

        fetchRoles().then(response => {
          this.roles = response.data.roles;
        })
        this.formDialogStatus = 'create';
        this.formDialogVisible = true;
        this.initCompanySelector(this.companyData, -1)
        this.initPostSelector(this.postData, -1)
        this.$nextTick(function () {
          this.$refs.imageCropper.clearFile();
        })
      },
      handelDelete(id, loginId, isAdmin) {
        if (isAdmin === 1) {
          this.$notify({
            title: '提示',
            message: '【超管】类型账号不可删除',
            type: 'warning'
          })
          return;
        }
        this.$confirm('将删除用户 <span style="color:blue">' + loginId + '</span>，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.listLoading = true;
          deleteUser(id).then(response => {
            this.listLoading = false;
            this.loadTable();
            showNotify(response, '删除');
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      handleUpdate(row) {
        this.listLoading = false
        this.formDialogVisible = true;
        let self = this;
        fetchUser(row.id).then(response => {
          this.form = response.data.user;
          this.$nextTick(function () {
            this.$refs.imageCropper.imgFullPath = self.form.avatarFullPath;
            this.$refs.imageCropper.imgPath = self.form.imgPath;
          })
        });
        fetchRoles().then(response => {
          this.roles = response.data.roles;
        })
        this.formDialogStatus = 'update';
        // this.$nextTick(() => {
        //   this.$refs['formData'].clearValidate()
        // })
        // this.$refs.table1.tableData //表格本地排序后数据

        this.initCompanySelector(this.companyData, row.company)
        this.initPostSelector(this.postData, row.post)
      },
      postFormData() {
        if (this.$refs.imageCropper.imgPath !== '') {
          this.form.avatar = this.$refs.imageCropper.imgPath;
        }
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            if (this.formDialogStatus === 'update') {
              updateUser(this.form).then(response => {
                this.formDialogVisible = false;
                this.loadTable();
                showNotify(response, '更新');
              })
            } else if (this.formDialogStatus === 'create') {
              createUser(this.form).then(response => {
                this.formDialogVisible = false;
                this.loadTable();
                showNotify(response, '添加');
              })
            }
          }
        })
      },
      // saveAvatar() {
      //   this.$refs.cropper.getCropData((data) => {
      //     // do something
      //     console.log(data)
      //   })
      // },
      // uploadAvatar(e) {
      //   //上传图片
      //   // this.option.img
      //   var file = e.target.files[0]
      //   if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
      //     alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
      //     return false
      //   }
      //   if (e.target.files[0].size > 1024 * 1024 * 2) {
      //     alert('图片大小不能超过2M')
      //     return false
      //   }
      //   var reader = new FileReader()
      //   reader.onload = (e) => {
      //     let data
      //     if (typeof e.target.result === 'object') {
      //       // 把Array Buffer转化为blob 如果是base64不需要
      //       data = window.URL.createObjectURL(new Blob([e.target.result]))
      //     } else {
      //       data = e.target.result
      //     }
      //     this.editingAvatarUrl = data
      //   }
      //   // 转化为base64
      //   reader.readAsDataURL(file)
      //   // 转化为blob
      //   //reader.readAsArrayBuffer(file)
      // },
      // uploadButton() {
      //   document.getElementById("uploads").click();
      // },
      // finish(type) {
      //   this.$refs.cropper.getCropData((data) => {
      //     test.location.href = data
      //   })
      // },

      //companySelector
      fetchCompanyData() {
        fetchCompanyList().then(response => {
          this.companyData = response.data.companyList;
        })
      },
      updateCompanyId(id) {
        this.form.company = id
      },
      initCompanySelector(companyData, companyId) {
        this.$nextTick(() => {
          //dialog中控件统一由dialog的@open="XXX"调用，需使用 this.$nextTick(() => {...})等页面渲染完后调用
          this.$refs.companySelector.initData(companyData)
          this.$refs.companySelector.initCurrentPath(companyId)
        })
      },
      //postSelector
      fetchPostData() {
        fetchPostList().then(response => {
          this.postData = response.data.postList;
          // this.$refs.postSelector.initData(response.data.postList)
        })
      },
      updatePostId(id) {
        this.form.post = id
      },
      initPostSelector(postData, postId) {
        this.$nextTick(() => {
          //dialog中控件统一由dialog的@open="XXX"调用，需使用 this.$nextTick(() => {...})等页面渲染完后调用
          this.$refs.postSelector.initData(postData)
          this.$refs.postSelector.initCurrentPath(postId)
        })
      },
      handleCurrentChange(val) {
        this.pageNumber = val
        this.loadTable();
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
