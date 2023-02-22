import Vue from 'vue'
import Vuex from 'vuex'
import http from '../utils/http'

Vue.use(Vuex)

const sysState = localStorage.getItem('sys_state')
const defaults = { adminInfo: {} }

const store = new Vuex.Store({
  state: sysState ? JSON.parse(sysState) : defaults,
  mutations: {
    SAVE: (state, payload) => {
      Object.assign(state, payload)
      localStorage.setItem('sys_state', JSON.stringify(state))
    }
  },
  actions: {
    GetAdminInfo (ctx, payload) {
      http.post('admin/info', {
        username: payload.username
      }).then(res => {
        ctx.commit('SAVE', { adminInfo: res.result })
      })
    },
    GetRoleInfo (ctx, callback) {
      http.post('role/info', {
        rid: ctx.state.adminInfo.rid
      }).then(res => {
        ctx.commit('SAVE', { roleInfo: res.result });
        callback && callback(res.result);
      })
    }
  }
})

export default store
