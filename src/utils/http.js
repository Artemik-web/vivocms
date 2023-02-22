import axios from 'axios'

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
    'SC-Token': localStorage.getItem('SC-Token')
  }
})



const error = err => {
  if (err.response) {
    const { status } = err.response
    if (status === 401) {
      alert('访问被拒绝')
    } else if (status === 403) {
      alert('资源不可用')
    } else if (status === 404) {
      alert('找不到页面')
    } else if (status === 405) {
      alert('不允许此方法')
    } else if (status === 500) {
      alert('服务内部错误')
    } else {
      alert('未知错误')
    }
    return Promise.reject(err)
  }
}

http.interceptors.request.use(function (config) {
  return config
}, error)

http.interceptors.response.use(function (response) {
  return response.data
}, error)

export default http
