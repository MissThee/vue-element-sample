import {getUserInfo, loginByUsername} from 'src/api/login'
import {userAuth} from 'src/utils/auth'
import {Message} from 'element-ui';

const user = {
  state: {
    id: '',
    name: '',
    company: '',
    companyName: '',
    isAdmin: 0,
    roles: [],
    pages: [],
    avatar: ""
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_COMPANY: (state, company) => {
      state.company = company
    },
    SET_COMPANYNAME: (state, companyName) => {
      state.companyName = companyName
    },
    SET_ISADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PAGES: (state, pages) => {
      state.pages = pages
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
  },

  actions: {
    // 用户名登录
    LoginByLoginId({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.loginId.trim(), userInfo.password).then((response) => {
          if (response.data.result) {
            Message.success(response.data.message);
          } else {
            Message.error(response.data.message);
          }
          resolve()
        }).catch(error => {
          console.log('错误LoginByLoginId：' + error);
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          commitUser({commit}, response.data.user);
          resolve(response)
        }).catch(error => {
          console.log("出错getUserInfo：" + error);
          reject(error)
        })
      })
    },

    // 登出
    Logout({commit, state}) {
      return new Promise((resolve, reject) => {
        commitUser({commit}, {});
        userAuth.removeToken();
        resolve()
      })
    },
  }
};

function commitUser({commit}, data) {
  commit('SET_ID', data.id);
  commit('SET_NAME', data.name);
  commit('SET_COMPANY', data.company);
  commit('SET_COMPANYNAME', data.companyName);
  commit('SET_ISADMIN', data.isAdmin);
  commit('SET_ROLES', data.roles);
  commit('SET_PAGES', data.pages);
  commit('SET_AVATAR', data.avatar);
}

export default user
