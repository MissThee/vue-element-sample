const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.app.visitedViews,
  cachedViews: state => state.app.cachedViews,

  id: state => state.user.id,
  name: state => state.user.name,
  company:state=>state.user.company,
  companyName:state=>state.user.companyName,
  isAdmin: state => state.user.isAdmin,
  roles: state => state.user.roles,
  pages: state => state.user.pages,
  avatar: state => state.user.avatar,

  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
};
export default getters
