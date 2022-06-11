import axios from 'axios'
import store from '@/store/store'

// 创建axios实例
const request = axios.create({
  baseURL: process.env.baseURL, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
request.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = localStorage.getItem('Token');
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

export default request

