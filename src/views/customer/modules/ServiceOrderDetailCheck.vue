<template>
  <div>
    <a-descriptions :column="2">
      <a-descriptions-item label="申请人">
        {{ orderDetail.ownerName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属部门">
        {{ orderDetail.deptName }}
      </a-descriptions-item>
      <a-descriptions-item label="技术人员">
        <template v-if="isCheck">
          {{ orderDetail.techList && orderDetail.techList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入技术人员"
            style="width:300px;"
            :type="1"
            keyField="techList"
            :list="orderDetail.techList"
            @changeorder="change"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="财务人员">
        <template v-if="isCheck">
          {{ orderDetail.finaList && orderDetail.finaList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入财务人员"
            style="width:300px;"
            :type="2"
            keyField="finaList"
            :list="orderDetail.finaList"
            @changeorder="(data) => changeBoss('fina', data)"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="技术经理">
        {{ orderDetail.techManagerName }}
      </a-descriptions-item>
      <a-descriptions-item label="财务经理">
        {{ orderDetail.finaManagerName }}
      </a-descriptions-item>
      <a-descriptions-item label="技术总监">
        {{ orderDetail.techDirectorName }}
      </a-descriptions-item>
      <a-descriptions-item label="财务总监">
        {{ orderDetail.finaDirectorName }}
      </a-descriptions-item>
      <a-descriptions-item label="其他人员">
        <template v-if="isCheck">
          {{ orderDetail.otherList && orderDetail.otherList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入其他人员"
            style="width:300px;"
            :type="5"
            keyField="otherList"
            :list="orderDetail.otherList"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="预计起止日期">
        <template v-if="isCheck">
          {{ detail.date }}
        </template>
        <template v-else>
          <a-range-picker :defaultValue="[moment(orderDetail.begin), moment(orderDetail.end)]" style="width:300px;"/>
        </template>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider/>
    <vxe-grid
      resizable
      stripe
      size="small"
      :data="orderDetail.customerList"
      :columns="columns"
      :max-height="200"
    >
    </vxe-grid>
    <a-descriptions style="margin-top: 16px;">
      <a-descriptions-item label="备注">
        {{ orderDetail.remark }}
      </a-descriptions-item>
    </a-descriptions>
    <div style="position: absolute;top: 50px;right: -20px;">
      <div style="color: rgba(0, 0, 0, .4);text-align: right;">流程状态</div>
      <div style="font-size: 24px;" :style="{ color: statusColor[orderDetail.status] }">{{
        getStatusName(orderDetail.status)
      }}
      </div>
    </div>
  </div>
</template>

<script>
import { getStatusName, statusColor } from '@/utils/processDoc/auditStatus'
import SearchSelect from '@/components/Selects/SearchSelect'
import SelectMan from '@/components/Selects/SelectMan'
import moment from 'moment'

export default {
  name: 'ServiceOrderDetailCheck',
  components: { SelectMan, SearchSelect },
  props: {
    detail: {
      type: Object,
      default: () => ({})
    },
    isCheck: {
      type: Boolean
    }
  },
  data () {
    const columns = [
      { type: 'seq', title: '序号', width: 50, align: 'center', fixed: 'left' },
      {
        title: '公司',
        field: 'companyName',
        minWidth: 200
      },
      {
        title: '事由',
        field: 'causes'
      }
    ]
    return {
      statusColor,
      columns,
      form: {},
      orderDetail: {}
    }
  },
  mounted () {
    this.orderDetail = JSON.parse(JSON.stringify(this.detail))
  },
  methods: {
    moment,
    getStatusName,
    changeMan (v) {
      console.log(v)
    },
    change (data) {
      console.log(data)
    },
    changeBoss (k, data) {
      console.log('changeBoss')
      this.orderDetail[`${k}DirectorId`] = data[`${k}DirectorId`]
      this.orderDetail[`${k}DirectorName`] = data[`${k}DirectorName`]
      this.orderDetail[`${k}ManagerId`] = data[`${k}ManagerId`]
      this.orderDetail[`${k}ManagerName`] = data[`${k}ManagerName`]
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
