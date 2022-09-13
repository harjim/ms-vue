<template>
  <component :is="comp" :visible="visible" :title="title" :spinning="spinning">
    <template slot="node">
      <a-steps :current="currentNode" direction="vertical" size="small">
        <a-step v-for="item in stepList" :key="item.value">
          <template slot="title">
            <span :style="{ fontWeight: item.value === currentNode ? '700' : 'normal' }">
              <div>{{ item.label }}</div>
              <a-badge
                v-if="item.value === currentNode"
                :color="statusColor[row.status === undefined ? 5 : row.status]"
                :text="getStatusName(row.status)"
              />
            </span>
          </template>
          <template slot="description" v-if="item.createTime">
            <Ellipsis v-if="item.remark" style="padding-top: 8px; font-size: 14px" :length="50" :tooltip="true">{{
              item.remark
            }}</Ellipsis>
            <div>{{ item.userName }} {{ item.createTime }}</div>
          </template>
        </a-step>
      </a-steps>
    </template>

    <template slot="content">
      <slot name="content"></slot>
    </template>
  </component>
</template>

<script>
import DoubleColumn from './DoubleColumn.vue'
import { getStatusName, statusColor, isEditStatus } from '@/utils/processDoc/auditStatus'
import Ellipsis from '../Ellipsis/Ellipsis.vue'

export default {
  name: 'ProcessLayout',
  components: {
    DoubleColumn,
    Ellipsis
  },
  props: {
    comp: {
      type: String,
      default: 'DoubleColumn'
    },
    processType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      statusColor,
      visible: false,
      title: '',
      spinning: false,
      currentNode: 0,
      stepList: [],
      row: {}
    }
  },
  methods: {
    getStatusName,
    isEditStatus,
    open() {
      this.title = '添加'
      this.stepList = [...this.processType]
      this.visible = true
    }
  }
}
</script>

<style lang="less" scoped></style>
