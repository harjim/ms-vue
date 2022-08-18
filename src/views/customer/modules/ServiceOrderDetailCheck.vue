<template>
  <div>
    <a-descriptions :column="2" layout="horizontal">
      <a-descriptions-item label="申请人">
        {{ currentOrder.ownerName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属部门">
        {{ currentOrder.deptName }}
      </a-descriptions-item>
      <a-descriptions-item label="技术人员">
        <template v-if="!getIsEditStatus">
          {{ currentOrder.techList && currentOrder.techList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入技术人员"
            style="width:300px;"
            :type="1"
            keyField="tech"
            :list="currentOrder.techList"
            @change="changeStateUser"
            @blur="getBoss"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="财务人员">
        <template v-if="!getIsEditStatus">
          {{ currentOrder.finaList && currentOrder.finaList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入财务人员"
            style="width:300px;"
            :type="2"
            keyField="fina"
            :list="currentOrder.finaList"
            @change="changeStateUser"
            @blur="getBoss"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="技术经理">
        {{ currentOrder.techManagerName || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="财务经理">
        {{ currentOrder.finaManagerName || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="技术总监">
        {{ currentOrder.techDirectorName || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="财务总监">
        {{ currentOrder.finaDirectorName || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="其他人员">
        <template v-if="!getIsEditStatus">
          {{ currentOrder.otherList && currentOrder.otherList.map(i => i.userName).join(', ') }}
        </template>
        <template v-else>
          <select-man
            placeholder="请输入其他人员"
            style="width:300px;"
            :type="5"
            keyField="other"
            :list="currentOrder.otherList"
            @change="changeStateUser"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="预计起止日期">
        <template v-if="!getIsEditStatus">
          {{ currentOrder.date }}
        </template>
        <template v-else>
          <date-range
            style="width: 300px;"
            :default-value="[moment(currentOrder.begin), moment(currentOrder.end)]"
            @onChange="onChange"/>
        </template>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider/>

    <ServiceEditTable
      ref="ServiceEditTable"
      :custom-list="currentOrder.customerList"
      :valid-rules="validRules"
      :edit="getIsEditStatus"
    >
      <vxe-table-column
        field="companyName"
        title="公司"
        :edit-render="{ immediate: true }"
      >
        <template v-slot="{ row }">
          <template v-if="!getIsEditStatus">
            <span>{{ row.companyName }}</span>
          </template>
          <select-company
            v-else
            style="width: 100%"
            prop="companyName"
            :defaultValue="row.companyName"
            @changeCompany="(data, option) => {
              row.companyName = data
              row.customerId = option.key
            }"
          />
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="causes"
        title="事由"
        :edit-render="{ immediate: true }"
      >
        <template v-slot="{ row }">
          <template v-if="!getIsEditStatus">
            <span>{{ row.causes }}</span>
          </template>
          <a-textarea
            v-else
            style="width: 100%;"
            v-model="row.causes"
            :auto-size="{ minRows: 1, maxRows: 5 }"
          />
        </template>
      </vxe-table-column>
    </ServiceEditTable>

    <a-descriptions style="margin-top: 16px;">
      <a-descriptions-item label="备注">
        <template v-if="!getIsEditStatus">
          <span v-if="currentOrder.remark" v-html="currentOrder.remark.replace(/\n/g, '<br/>')"></span>
          <span v-else>-</span>
        </template>
        <template v-else>
          <a-textarea
            style="width: 1034px;"
            placeholder="请输入"
            :defaultValue="currentOrder.remark"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            @change="changeRemark"
          />
        </template>
      </a-descriptions-item>
    </a-descriptions>

    <div style="position: absolute;top: -20px;right: 4px;" v-if="!getIsEditStatus">
      <div style="color: rgba(0, 0, 0, .4);text-align: right;">流程状态</div>
      <div style="font-size: 24px;" :style="{ color: getStatusColor }">{{ getStatusTitle }}
      </div>
    </div>
  </div>
</template>

<script>
import SelectMan from '@/components/Selects/SelectMan'
import moment from 'moment'
import { mapGetters, mapState } from 'vuex'
import SelectCompany from '@/components/Selects/SelectCompany'
import ServiceEditTable from '@/views/customer/modules/ServiceEditTable'
import DateRange from '@/components/DateRange/DateRange'

export default {
  name: 'ServiceOrderDetailCheck',
  components: { DateRange, ServiceEditTable, SelectCompany, SelectMan },
  data () {
    return {
      form: {},
      validRules: {
        companyName: [{ required: true, message: '公司必须选择', trigger: 'blur' }],
        causes: [{ required: true, message: '事由必须填写', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      currentOrder: state => state.service.currentOrder
    }),
    ...mapGetters('service', ['getStatusColor', 'getStatusTitle', 'getIsEditStatus'])
  },
  methods: {
    moment,
    onChange (dates, dateStr) {
      this.$store.commit('service/CHANGE_DATE', dateStr)
    },
    changeRemark (e) {
      this.$store.commit('service/CHANGE_REMARK', e.target.value)
    },
    changeStateUser (k, v) {
      this.$store.commit({
        type: 'service/CHANGE_USER',
        key: `${k}List`,
        data: v.map(item => ({
          userId: item.key,
          userName: item.label
        }))
      })
    },
    getBoss (keyField, value, type) {
      this.$store.dispatch({
        type: 'service/changeBoss',
        key: keyField,
        userIds: value.map(i => i.key),
        types: type
      })
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

& /deep/ .ant-descriptions-item-label {
  width: 100px;
  text-align: right;
}

& /deep/ .ant-descriptions-item:last-child {
  display: flex;
}
</style>
