(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5c1efe46"],{"2cb3":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"animate",staticStyle:{overflow:"hidden",height:"100%"}},[n("el-input",{attrs:{placeholder:"输入关键字进行过滤"},model:{value:t.filterText,callback:function(e){t.filterText=e},expression:"filterText"}}),n("el-tree",{ref:"treeCompany",style:{height:t.clientHeight-40+"px",overflow:"auto",padding:"0px"},attrs:{data:t.treeData,"node-key":"id","default-expand-all":"","expand-on-click-node":!1,"render-content":t.renderContent,"filter-node-method":t.filterNode}}),n("el-dialog",{attrs:{title:t.dialogTitle[t.formDialogStatus],visible:t.formDialogVisible,"close-on-click-modal":!1,"append-to-body":""},on:{"update:visible":function(e){t.formDialogVisible=e}}},[n("el-form",{ref:"formData",attrs:{rules:t.rules,size:"mini",model:t.form,"label-width":"80px"}},[n("el-form-item",{attrs:{label:"上级部门",prop:"loginId"}},[n("el-cascader",{attrs:{props:t.cascaderProps,placeholder:"上级部门","show-all-levels":!1,options:t.companyList,filterable:"",clearable:!1,"change-on-select":""},on:{change:t.setCurrentParentId},model:{value:t.currentNodePath,callback:function(e){t.currentNodePath=e},expression:"currentNodePath"}})],1),n("el-form-item",{attrs:{label:"部门名称",prop:"loginId"}},[n("el-input",{model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1)],1),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(e){t.formDialogVisible=!1}}},[t._v("取消")]),n("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.postData()}}},[t._v("确定")])],1)],1)],1)},i=[],o=(n("ac6a"),n("fcac")),r=n("b893"),l={name:"companyOption",data:function(){return{clientHeight:0,treeData:[],dialogTitle:{update:"编辑",create:"创建"},formDialogStatus:"",rules:{name:[{required:!0,message:"部门名不能为空",trigger:"blur"}]},formDialogVisible:!1,form:{id:null,parentId:null,name:null},cascaderProps:{value:"id"},currentNodePath:[],companyList:[],filterText:""}},mounted:function(){this.fetchData(),this.clientHeight="".concat(document.documentElement.clientHeight)-90;var t=this;window.onresize=function(){t.clientHeight="".concat(document.documentElement.clientHeight)-90}},watch:{filterText:function(t){this.$refs.treeCompany.filter(t)}},methods:{fetchData:function(){var t=this;Object(o["c"])().then(function(e){t.treeData=[{id:0,label:"【所有部门】",children:e.data.companyList}]})},renderContent:function(t,e){var n=e.node,a=e.data,i=(e.store,this);return t("span",{attrs:{style:"flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;"}},[t("span",[t("span",{attrs:{style:"float: left;"}},n.label)]),t("span",[t("el-button",{attrs:{size:"mini",style:"font-size: 12px;padding: 3px",type:"text",plain:""},on:{click:function(){i.formDialogVisible=!0,i.formDialogStatus="create",delete i.form.id,i.form.name="",i.form.parentId=a.id;var t=Object(r["a"])(i.form.parentId,i.treeData);i.companyList=i.treeData,i.currentNodePath=t}}},"添加"),t("el-button",{attrs:{size:"mini",style:"font-size: 12px;padding: 3px;"+(0===a.id?"display:none;":""),type:"text",plain:""},on:{click:function(){if(0!==a.id){var t=i.deepCopy(i.treeData);i.formDialogVisible=!0,i.formDialogStatus="update",i.form.id=a.id,i.form.name=a.label,i.form.parentId=a.parentId;var e=Object(r["a"])(i.form.id,t),n=e.pop();i.companyList=i.setDisabledNode(t,n),i.currentNodePath=e}}}},"编辑"),t("el-button",{attrs:{size:"mini",style:"font-size: 12px;color:red;padding: 3px;"+(0===a.id?"display:none;":""),type:"text",plain:""},on:{click:function(){0!==a.id&&i.$confirm('将删除部门 <span style="color:blue">'+a.label+"</span>，是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",dangerouslyUseHTMLString:!0}).then(function(){i.listLoading=!0,Object(o["b"])(a.id).then(function(t){i.listLoading=!1,i.fetchData(),Object(r["b"])(t,"删除")})}).catch(function(){})}}},"删除")])])},postData:function(){var t=this;this.$refs["formData"].validate(function(e){e&&("update"===t.formDialogStatus?(t.listLoading=!0,Object(o["d"])(t.form).then(function(e){t.listLoading=!1,t.formDialogVisible=!1,t.fetchData(),Object(r["b"])(e,"更新")}).error()):"create"===t.formDialogStatus&&(t.listLoading=!0,Object(o["a"])(t.form).then(function(e){t.listLoading=!1,t.formDialogVisible=!1,t.fetchData(),Object(r["b"])(e,"添加")})))})},setCurrentParentId:function(){this.currentNodePath.length>0&&(this.form.parentId=this.currentNodePath[this.currentNodePath.length-1])},setDisabledNode:function(t,e){var n=function t(e,n){var a=e.filter(function(t){return t.id!==n});return a.forEach(function(e){return e.children&&(e.children=t(e.children,n))}),a},a=n(t,e);return a},deepCopy:function(t){return JSON.parse(JSON.stringify(t))},filterNode:function(t,e){return!t||-1!==e.label.indexOf(t)}}},c=l,s=n("2877"),d=Object(s["a"])(c,a,i,!1,null,"49740047",null);e["default"]=d.exports},fcac:function(t,e,n){"use strict";n.d(e,"c",function(){return i}),n.d(e,"d",function(){return o}),n.d(e,"a",function(){return r}),n.d(e,"b",function(){return l});var a=n("b775");function i(t,e){return Object(a["a"])({url:"/company/companyList",data:{currentUserCompany:t,limitType:e}})}function o(t){return Object(a["a"])({url:"/company/update",data:{form:t}})}function r(t){return Object(a["a"])({url:"/company/create",data:{form:t}})}function l(t){return Object(a["a"])({url:"/company/delete",data:{id:t}})}}}]);