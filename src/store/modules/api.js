import * as api from '@/api'
import request from '@/api/request'

const state = {}

const mutations = {}

const login = data => {
  return request({ url: api['managerLoginUser'], method: 'post', data })
}

// 公共post请求 data.code === 14006 未登录
const actions = {
  postQuery({ commit }, params) {
    return new Promise((resolve, reject) => {
      // login({ username: username.trim(), password: password }).then(response => {
      //   const { data } = response
      //   commit('SET_TOKEN', data.token)
      //   setToken(data.token)
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
