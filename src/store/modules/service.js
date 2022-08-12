import { axios } from '@/utils/request'
import { getStatusName, statusColor } from '@/utils/processDoc/auditStatus'

const service = {
  namespaced: true,
  state: {
    cacheOrder: {},
    currentOrder: {},
    editing: false
  },

  getters: {
    getStatusColor(state) {
      return statusColor[state.currentOrder.status]
    },
    getStatusTitle(state) {
      return getStatusName(state.currentOrder.status)
    }
  },

  mutations: {
    SET_DETAIL: (state, currentOrder) => {
      state.currentOrder = JSON.parse(JSON.stringify(currentOrder))
      state.cacheOrder = JSON.parse(JSON.stringify(currentOrder))
    },
    TEMPORARILY: (state, flag) => {
      state.editing = flag
    },
    CHANGE_USER: (state, { key, data }) => {
      state.currentOrder[key] = data
    },
    CHANGE_BOSS: (state, { key, data }) => {
      state.currentOrder[`${key}DirectorId`] = data[`${key}DirectorId`]
      state.currentOrder[`${key}DirectorName`] = data[`${key}DirectorName`]
      state.currentOrder[`${key}ManagerId`] = data[`${key}ManagerId`]
      state.currentOrder[`${key}ManagerName`] = data[`${key}ManagerName`]
    },
    CHANGE_DATE: (state, dates) => {
      state.currentOrder.begin = dates[0]
      state.currentOrder.end = dates[1]
      state.currentOrder.date = `${dates[0]}-${dates[1]}`
    },
    CHANGE_REMARK: (state, v) => {
      state.currentOrder.remark = v
    }
  },

  actions: {
    changeBoss(ctx, { key, userIds, type }) {
      // 如果正在编辑状态下退出，则说明不是通过点击暂存退出的编辑状态
      if (ctx.state.editing) return
      const params = {
        userIds,
        userName: '',
        type
      }
      axios.get('/serviceApply/getMemberList', { params }).then(({ success, data, errorMessage }) => {
        if (success) {
          ctx.commit('CHANGE_BOSS', { key, data })
        } else {
          this.$message.error(errorMessage)
        }
      })
    }
  }
}

export default service
