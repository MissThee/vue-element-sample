import {asyncRouterMap, constantRouterMap} from 'src/router'

/**
 * 通过meta.page判断是否与当前用户权限匹配
 * @param pages
 * @param route
 * @param isAdmin
 */
function hasPermission(pages, route, isAdmin) {
  if (isAdmin === 1) {
    return true
  }
  if (route.meta && route.meta.page) {
    return pages.indexOf(route.meta.page) >= 0
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param pages
 * @param isAdmin
 */
function filterAsyncRouter(asyncRouterMap, pages, isAdmin) {
  return asyncRouterMap.filter(route => {
    if (hasPermission(pages, route, isAdmin)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, pages, isAdmin)
      }
      return true
    }
    return false
  })
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({commit}, pages, isAdmin) {
      return new Promise(resolve => {
        let accessedRouters;
        if (pages && pages.indexOf(0) >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, pages, isAdmin)
        }
        commit('SET_ROUTERS', accessedRouters);
        resolve()
      })
    }
  }
}

export default permission
