import { getStatusName, isEditStatus, statusColor } from '@/utils/processDoc/auditStatus'

const workRecord = {
  namespaced: true,
  state: {
    recordOrder: {},
    editing: false
  },

  getters: {
    getStatusColor (state) {
      return statusColor[state.recordOrder.status]
    },
    getStatusTitle (state) {
      return getStatusName(state.recordOrder.status)
    },
    // 可以:true ;不可:false
    getIsEditStatus (state) {
      return isEditStatus(state.recordOrder.status)
    }
  },

  mutations: {
    SET_ORDER: (state, recordOrder) => {
      const temp = JSON.parse(JSON.stringify(recordOrder))
      delete temp.createTime
      delete temp.lastUpdateTime
      state.recordOrder = temp
    }
  },

  actions: {}
}

export default workRecord
