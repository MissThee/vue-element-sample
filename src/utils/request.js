import axios from 'axios'
import {Message} from 'element-ui'
import {userAuth} from 'src/utils/auth'
import store from "../store";
import router from "../router";

const newAxios = axios.create({// 创建axios实例
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 10000 // 请求超时时间,
});

// request拦截器，请求发送前执行
newAxios.interceptors.request.use(request => {
  request.headers['Authorization'] = userAuth.getToken(); // 让每个请求携带Authorization（从cookies中获取的）
  request.method = 'post';// 设置请求方式
  return request
}, error => {
  console.log('requestError', error);
  return Promise.reject(error)
});

// response拦截器，接收返回值后执行
newAxios.interceptors.response.use(
  response => {
    // if (response.data.code === 401) {
    //   this.$router.push({path: '/login'});
    //   return;
    // }
    let token = response.headers['Authorization'];
    if (token === undefined || token === null || token.length === 0) {
      token = response.data.token;
    }
    if (token !== undefined && token !== null && token.length > 0) {
      userAuth.setToken(token);//使用cookie存Authorization
    }
    return response
  },
  error => {
    console.log('responseError:' + error);// for debug
    Message.error(error.message);
    return Promise.reject(error)
  });

export default newAxios
