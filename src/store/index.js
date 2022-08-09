import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import enums from './modules/enums'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    enums
  },
  state: {
    totalMax: 9999999999,
    maxOrder: 1000000
  },
  mutations: {},
  actions: {},
  getters
})
