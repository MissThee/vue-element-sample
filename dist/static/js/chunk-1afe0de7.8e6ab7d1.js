(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1afe0de7"],{caf6:function(t,e,n){"use strict";n.d(e,"c",function(){return a}),n.d(e,"d",function(){return o}),n.d(e,"a",function(){return r}),n.d(e,"b",function(){return l});var i=n("b775");function a(){return Object(i["a"])({url:"/post/postList"})}function o(t){return Object(i["a"])({url:"/post/update",data:{form:t}})}function r(t){return Object(i["a"])({url:"/post/create",data:{form:t}})}function l(t){return Object(i["a"])({url:"/post/delete",data:{id:t}})}},f534:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"animate",staticStyle:{overflow:"hidden",height:"100%"}},[n("el-input",{attrs:{placeholder:"输入关键字进行过滤"},model:{value:t.filterText,callback:function(e){t.filterText=e},expression:"filterText"}}),n("el-tree",{ref:"treePost",style:{height:t.clientHeight-40+"px",overflow:"auto",padding:"0px"},attrs:{data:t.treeData,props:t.defaultProps,"node-key":"id","default-expand-all":"","expand-on-click-node":!1,"render-content":t.renderContent,"filter-node-method":t.filterNode}}),n("el-dialog",{attrs:{title:t.dialogTitle[t.formDialogStatus],visible:t.formDialogVisible,"close-on-click-modal":!1,"append-to-body":""},on:{"update:visible":function(e){t.formDialogVisible=e}}},[n("el-form",{ref:"formData",attrs:{rules:t.rules,size:"mini",model:t.form,"label-width":"80px"}},[n("el-form-item",{attrs:{label:"上级分组",prop:"loginId"}},[n("el-cascader",{attrs:{props:t.cascaderProps,placeholder:"上级分组","show-all-levels":!1,options:t.postList,filterable:"",clearable:!1,"change-on-select":""},on:{change:t.setCurrentParentId},model:{value:t.currentNodePath,callback:function(e){t.currentNodePath=e},expression:"currentNodePath"}})],1),n("el-form-item",{attrs:{label:"分组名称",prop:"loginId"}},[n("el-input",{model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1)],1),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(e){t.formDialogVisible=!1}}},[t._v("取消")]),n("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.postData()}}},[t._v("确定")])],1)],1)],1)},a=[],o=(n("ac6a"),n("caf6")),r=n("b893"),l={name:"postOption",data:function(){return{clientHeight:0,treeData:[],defaultProps:{children:"children",label:"label"},dialogTitle:{update:"编辑",create:"创建"},formDialogStatus:"",rules:{name:[{required:!0,message:"分组名不能为空",trigger:"blur"}]},formDialogVisible:!1,form:{id:null,parentId:null,name:null},cascaderProps:{value:"id"},currentNodePath:[],postList:[],filterText:""}},mounted:function(){this.fetchData(),this.clientHeight="".concat(document.documentElement.clientHeight)-80;var t=this;window.onresize=function(){t.clientHeight="".concat(document.documentElement.clientHeight)-80}},watch:{filterText:function(t){this.$refs.treePost.filter(t)}},methods:{getNodePath:function(t,e){var n=[];try{var i=function e(i){if(n.push(i.id),i.id===parseInt(t))throw"GOT IT!";if(i.children&&i.children.length>0){for(var a=0;a<i.children.length;a++)e(i.children[a]);n.pop()}else n.pop()};i(e)}catch(a){}return n},fetchData:function(){var t=this;Object(o["c"])().then(function(e){t.treeData=[{id:0,label:"【所有岗位】",children:e.data.postList}]})},renderContent:function(t,e){var n=e.node,i=e.data,a=(e.store,this);return t("span",{attrs:{style:"flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;"}},[t("span",[t("span",{attrs:{style:"float: left;"}},n.label)]),t("span",[t("el-button",{attrs:{size:"mini",style:"font-size: 12px;padding: 3px",type:"text",plain:""},on:{click:function(){var t=a.deepCopy(a.treeData);a.formDialogVisible=!0,a.formDialogStatus="create",delete a.form.id,a.form.name="",a.form.parentId=i.id;var e=a.getNodePath(a.form.parentId,t[0]);a.postList=a.setDisabledNode(t,null),a.currentNodePath=e}}},"添加"),t("el-button",{attrs:{size:"mini",style:"font-size: 12px;padding: 3px;"+(0===i.id?"display:none;":""),type:"text",plain:""},on:{click:function(){if(0!==i.id){var t=a.deepCopy(a.treeData);a.formDialogVisible=!0,a.formDialogStatus="update",a.form.id=i.id,a.form.name=i.label,a.form.parentId=i.parentId;var e=a.getNodePath(a.form.id,t[0]),n=e.pop();a.postList=a.setDisabledNode(t,n),a.currentNodePath=e}}}},"编辑"),t("el-button",{attrs:{size:"mini",style:"font-size: 12px;color:red;padding: 3px;"+(0===i.id?"display:none;":""),type:"text",plain:""},on:{click:function(){0!==i.id&&a.$confirm('将删除岗位 <span style="color:blue">'+i.label+"</span>，是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",dangerouslyUseHTMLString:!0}).then(function(){a.listLoading=!0,Object(o["b"])(i.id).then(function(t){a.listLoading=!1,a.fetchData(),Object(r["b"])(t,"删除")})}).catch(function(){})}}},"删除")])])},postData:function(){var t=this;this.$refs["formData"].validate(function(e){e&&("update"===t.formDialogStatus?(t.listLoading=!0,Object(o["d"])(t.form).then(function(e){t.listLoading=!1,t.formDialogVisible=!1,t.fetchData(),Object(r["b"])(e,"更新")})):"create"===t.formDialogStatus&&(t.listLoading=!0,Object(o["a"])(t.form).then(function(e){t.listLoading=!1,t.formDialogVisible=!1,t.fetchData(),Object(r["b"])(e,"添加")})))})},setCurrentParentId:function(){this.currentNodePath.length>0&&(this.form.parentId=this.currentNodePath[this.currentNodePath.length-1])},setDisabledNode:function(t,e){var n=function t(e,n){var i=e.filter(function(t){return t.id!==n});return i.forEach(function(e){return e.children&&(e.children=t(e.children,n))}),i},i=n(t,e);return i},deepCopy:function(t){return JSON.parse(JSON.stringify(t))},filterNode:function(t,e){return!t||-1!==e.label.indexOf(t)}}},s=l,c=n("2877"),d=Object(c["a"])(s,i,a,!1,null,"0974ad04",null);e["default"]=d.exports}}]);