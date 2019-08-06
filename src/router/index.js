import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

const _import = file => () => import('src/views/' + file + '.vue');
// const _import = file => require('src/views/' + file + '.vue').default;

Vue.use(Router);

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/

import applicationIcon from '../assets/icon/application.png'

export const constantRouterMap = [
  {path: '/', redirect: '/login', hidden: true},
  {path: '/login', component: _import('login/index'), hidden: true, noCache: true},
  {path: '/404', component: _import('errorPage/404'), hidden: true},
  {path: '/401', component: _import('errorPage/401'), hidden: true},
  {
    path: '/main',
    component: Layout,
    redirect: '/main/dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: {title: 'dashboard', icon: applicationIcon, noCache: true}
    },]
  },
  {path: '*', redirect: '/404', hidden: true},
];

export default new Router({
  // mode: 'history', //后端支持可开
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/fireService',
    component: Layout,
    redirect: '/fireService/importantCompany/index',
    meta: {
      title: 'business',
      icon: applicationIcon,
    },
    children: [
      {
        path: 'importantCompany/index',
        component: _import('fireService/importantCompany/index'),
        name: 'importantCompany',
        meta: {
          title: 'importantCompany',
          icon: applicationIcon,
          page: 201//自定义字段，用于判断当前登录的用户是否可以使用此模块，是否显示在侧边栏
        }
      },
      {
        path: 'dangerousChemicals/index',
        component: _import('fireService/dangerousChemicals/index'),
        name: 'dangerousChemicals',
        meta: {
          title: 'dangerousChemicals',
          icon: applicationIcon,
          page: 202
        }
      },
    ]
  },
  {
    path: '/systemManage',
    component: Layout,
    redirect: '/systemManage/user/index',
    meta: {
      title: 'systemOption',
      icon: applicationIcon
    },
    children: [{
      path: 'user/index',
      component: _import('systemManage/user/index'),
      name: 'userOption',
      meta: {
        title: 'userOption',
        icon: applicationIcon,
        page: 101
      }
    }, {
      path: 'role/index',
      component: _import('systemManage/role/index'),
      name: 'roleOption',
      meta: {
        title: 'roleOption',
        icon: applicationIcon,
        page: 102
      }
    }, {
      path: 'company/index',
      component: _import('systemManage/company/index'),
      name: 'companyOption',
      meta: {
        title: 'companyOption',
        icon: applicationIcon,
        page: 103
      }
    }, {
      path: 'post/index',
      component: _import('systemManage/post/index'),
      name: 'postOption',
      meta: {
        title: 'postOption',
        icon: applicationIcon,
        page: 104
      }
    }
    ]
  },
];
