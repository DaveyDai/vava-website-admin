import apiUrl from '@/api'
import request from '@/api/request'

const state = {}

const mutations = {}

const actions = {
  postQuery({ commit }, { api, data }) { // 公共post请求
    return new Promise((resolve, reject) => {
      request({ url: apiUrl[api], method: 'post', data }).then(response => {
        resolve(response.code === 200 ? response.data : response)
      }).catch(error => {
        if (error.code === 14006) window.location.href = '/login' // token过期重新登录
        reject(error)
      })
    })
  },
  getQuery({ commit }, { api, data }) { // 公共get请求
    return new Promise((resolve, reject) => {
      request({ url: apiUrl[api], method: 'get', data }).then(response => {
        resolve(response.code === 200 ? response.data : response)
      }).catch(error => {
        if (error.code === 14006) window.location.href = '/login' // token过期重新登录
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
