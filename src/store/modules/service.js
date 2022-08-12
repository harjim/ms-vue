const service = {
  namespaced: true,
  state: {
    currentOrder: {}
  },

  mutations: {
    SET_DETAIL: (state, currentOrder) => {
      console.log(currentOrder)
      state.currentOrder = currentOrder
    }
  },

  actions: {}
}

export default service
