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
            @change="changeStateUser"
            @blur="getBoss"
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
            @change="changeStateUser"
          />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="预计起止日期">
        <template v-if="!editing">
          {{ currentOrder.date }}
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
      ref="xTable"
      resizable
      stripe
      keep-source
      size="small"
      :data="currentOrder.customerList"
      :max-height="200"
      show-overflow="title"
      :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
      :edit-rules="validRules"
    >
      <vxe-table-column type="seq" width="60" fixed="left" title="序号"/>
      <vxe-table-column
        field="companyName"
        title="公司"
        minWidth="200"
        :edit-render="{ immediate: true }"
      >
        <template v-slot:edit="{ row }">
          <select-company
            style="width: 100%"
            prop="companyName"
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
        minWidth="200"
        :edit-render="{ immediate: true }"
      >
        <template v-slot:edit="{ row }">
          <a-textarea
            style="width: 100%;"
            v-model="row.causes"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" minWidth="60" align="center" v-if="editing">
        <template v-slot="{ row, rowIndex }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <a style="margin-right: 10px;" @click="validAllAndSave">保存</a>
            <a-popconfirm
              title="是否取消添加?"
              @confirm="cancelRowEvent"
            >
              <a>取消</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm
              title="是否删除该记录?"
              @confirm="delTableRow(row, rowIndex)"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
      </vxe-table-column>
    </vxe-grid>

    <a-button
      v-if="editing"
      type="dashed"
      block
      icon="plus"
      style="margin-top: 12px;"
      @click="insertEvent">添加
    </a-button>

    <a-descriptions style="margin-top: 16px;" layout="vertical">
      <a-descriptions-item label="备注">
        <template v-if="!editing">
          {{ currentOrder.remark }}
        </template>
        <template v-else>
          <a-textarea
            style="width: 910px;"
            placeholder="请输入"
            :defaultValue="currentOrder.remark"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            @change="changeRemark"
          />
        </template>
      </a-descriptions-item>
    </a-descriptions>

    <div style="position: absolute;top: 50px;right: -20px;" v-if="!editing">
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

export default {
  name: 'ServiceOrderDetailCheck',
  components: { SelectCompany, SelectMan },
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
      currentOrder: state => state.service.currentOrder,
      editing: state => state.service.editing
    }),
    ...mapGetters('service', ['getStatusColor', 'getStatusTitle'])
  },
  methods: {
    moment,
    onChange (dates, dateStr) {
      this.$store.commit('service/CHANGE_DATE', dateStr)
    },
    changeRemark (e) {
      this.$store.commit('service/CHANGE_REMARK', e.target.value)
    },
    async insertEvent () {
      const record = {
        causes: '',
        companyName: ''
      }
      await this.$store.dispatch({
        type: 'service/addCustomerItem',
        record
      })
      await this.$refs.xTable.setActiveRow(record)
    },
    async validAllAndSave () {
      const errMap = await this.$refs.xTable.validate().catch(errMap => errMap)
      if (!errMap) {
        this.$store.commit('service/SET_TABLE_EDIT', false)
        await this.$refs.xTable.clearActived()
      }
    },
    cancelRowEvent () {
      this.$refs.xTable.clearActived().then(() => {
        this.$store.dispatch({
          type: 'service/delCustomerItem',
          index: 0
        })
        this.$store.commit('service/SET_TABLE_EDIT', false)
      })
    },
    delTableRow (row, index) {
      this.$store.dispatch({
        type: 'service/delCustomerItem',
        index: index
      })
      this.$refs.xTable.remove(row)
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
</style>
