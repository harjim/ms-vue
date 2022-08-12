<template>
  <div>
    <a-descriptions :column="2">
      <a-descriptions-item label="申请人">
        {{ currentOrder.ownerName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属部门">
        {{ currentOrder.deptName }}
      </a-descriptions-item>
      <a-descriptions-item label="技术人员">
        <template v-if="!editing">
          {{ currentOrder.techList && currentOrder.techList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入技术人员"
            style="width:300px;"
            :type="1"
            keyField="tech"
            :list="currentOrder.techList"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="财务人员">
        <template v-if="!editing">
          {{ currentOrder.finaList && currentOrder.finaList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入财务人员"
            style="width:300px;"
            :type="2"
            keyField="fina"
            :list="currentOrder.finaList"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="技术经理">
        {{ currentOrder.techManagerName }}
      </a-descriptions-item>
      <a-descriptions-item label="财务经理">
        {{ currentOrder.finaManagerName }}
      </a-descriptions-item>
      <a-descriptions-item label="技术总监">
        {{ currentOrder.techDirectorName }}
      </a-descriptions-item>
      <a-descriptions-item label="财务总监">
        {{ currentOrder.finaDirectorName }}
      </a-descriptions-item>
      <a-descriptions-item label="其他人员">
        <template v-if="!editing">
          {{ currentOrder.otherList && currentOrder.otherList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入其他人员"
            style="width:300px;"
            :type="5"
            keyField="other"
            :list="currentOrder.otherList"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="预计起止日期">
        <template v-if="!editing">
          {{ detail.date }}
        </template>
        <template v-else>
          <a-range-picker
            :defaultValue="[moment(currentOrder.begin), moment(currentOrder.end)]"
            style="width:300px;"
            @change="onChange"
          />
        </template>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider/>
    <vxe-grid
      resizable
      stripe
      size="small"
      :data="currentOrder.customerList"
      :max-height="200"
    >
      <vxe-table-column type="seq" width="60" fixed="left"></vxe-table-column>
      <vxe-table-column field="companyName" title="公司" minWidth="200"></vxe-table-column>
      <vxe-table-column field="causes" title="事由" minWidth="200"></vxe-table-column>
    </vxe-grid>

    <a-descriptions style="margin-top: 16px;">
      <a-descriptions-item label="备注">
        <template v-if="!editing">
          {{ currentOrder.remark }}
        </template>
        <template v-else>
          <a-textarea
            placeholder="请输入"
            :defaultValue="currentOrder.remark"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            @change="changeRemark"
          />
        </template>
      </a-descriptions-item>
    </a-descriptions>

    <div style="position: absolute;top: 50px;right: -20px;">
      <div style="color: rgba(0, 0, 0, .4);text-align: right;">流程状态</div>
      <div style="font-size: 24px;" :style="{ color: getStatusColor }">{{ getStatusTitle }}
      </div>
    </div>
  </div>
</template>

<script>
import { getStatusName, statusColor } from '@/utils/processDoc/auditStatus'
import SearchSelect from '@/components/Selects/SearchSelect'
import SelectMan from '@/components/Selects/SelectMan'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ServiceOrderDetailCheck',
  components: { SelectMan, SearchSelect },
  data () {
    return {
      statusColor,
      form: {}
    }
  },
  computed: {
    ...mapState({
      currentOrder: state => state.service.currentOrder,
      editing: state => state.service.editing
    }),
    ...mapGetters('service', ['getStatusColor', 'getStatusTitle'])
  },
  methods: {
    moment,
    getStatusName,
    onChange (dates, dateStr) {
      this.$store.commit('service/CHANGE_DATE', dateStr)
    },
    changeRemark (e) {
      this.$store.commit('service/CHANGE_REMARK', e.target.value)
    }
  }
}
</script>

<style lang="less" scoped>
& /deep/ tr:nth-child(2) {
  height: 50px;
}

& /deep/ tr:nth-child(5) {
  height: 50px;
}
</style>
