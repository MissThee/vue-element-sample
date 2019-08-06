const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.app.visitedViews,
  cachedViews: state => state.app.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  setting: state => state.user.setting,

  id: state => state.user.id,
  loginId: state => state.user.loginId,
  company: state => state.user.company,
  lastLoginDate: state => state.user.lastLoginDate,
  isAdmin: state => state.user.isAdmin,
  pages: state => state.user.pages,
  roleNames: state => state.user.roleNames,

  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
