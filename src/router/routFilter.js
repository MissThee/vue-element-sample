import router from './index'
import store from '../store'
import {userAuth} from 'src/utils/auth' // 验权

router.beforeEach((to, from, next) => {
  console.log(from.path, to.path);
  if (userAuth.getToken()) { // 判断是否有token
    if (!store.getters.id || store.getters.id === "") { // 判断当前用户是否已拉取user_info信息
      store.dispatch('GetUserInfo').then(res => { // 拉取user_info
        const pages = res.data.user.pages;
        const isAdmin = res.data.user.isAdmin;
        store.dispatch('GenerateRoutes', pages, isAdmin).then(() => { // 生成可访问的路由表
          router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
        });
        next();
      }).catch(() => {
        store.dispatch('Logout').then(() => {
          console.log('获取用户信息出错');
          if (to.path !== "/login") {
            next({path: "/login"});
          } else {
            next();
          }
        })
      })
    } else {
      next();
    }
  } else {
    if (to.path !== "/login") {
      next({path: "/login"});
    } else {
      next();
    }
  }

});

router.afterEach(() => {

});
