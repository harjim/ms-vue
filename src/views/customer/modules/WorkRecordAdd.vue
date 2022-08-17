<template>
  <a-drawer :visible="visible" destroyOnClose title="添加服务记录" :width="960" @close="close">
    <a-form-model ref="form" :model="form" :label-col="{ span: 5 }">
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="客户名称" prop="customerId" required>
            <select-company
              style="width: 200px;"
              prop="companyName"
              url="/serviceRecord/getCustomerList"
              @changeCompany="getCustomerList"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="关联单号" prop="serviceNo">
            <a-popover>
              <template slot="content">
                <ystable
                  ref="pTable"
                  query-url="/serviceRecord/getServiceNo"
                  :params="form"
                  size="mini"
                  :max-height="200"
                  show-overflow="title"
                  @cell-click="clickRow"
                >
                  <vxe-table-column field="serviceNo" title="服务单号" minWidth="140"/>
                  <vxe-table-column field="ownerName" title="业务员" width="100"/>
                  <vxe-table-column field="deptName" title="所属部门" width="100"/>
                </ystable>
              </template>
              <a-input
                readOnly
                v-model="form.serviceNo"
                style="width: 200px;"
                :disabled="!form.customerId"
                placeholder="请选择服务单号"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item label="业务员" required>
            <search-select
              :disabled="!form.customerId"
              style="width: 200px;"
              url="/user/userForSelect"
              searchField="realName"
              sTitle="realName"
              placeholder="请输入业务员"
              v-model="owner"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="所属部门" prop="deptName" required>
            <a-input v-model="form.deptName" style="width: 200px;" disabled placeholder="请选择业务员"/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-divider/>

      <vxe-grid
        ref="xTable"
        resizable
        stripe
        show-footer
        keep-source
        :data="list"
        :footer-method="footerMethod"
        :max-height="400"
        :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
        :edit-rules="validRules"
      >
        <vxe-table-column type="seq" width="60" fixed="left" title="序号"/>
        <vxe-table-column field="itemType" title="事项" width="160" :edit-render="{ immediate: true }">
          <template v-slot="{ row }">
            <div>{{ type2value(row.itemType) }}</div>
          </template>
          <template v-slot:edit="{ row }">
            <a-select v-model="row.itemType" style="width: 100%;" placeholder="请选择事项">
              <a-select-option v-for="item in dictionary" :key="item.key">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="date"
          title="起止时间"
          width="200"
          align="center"
          :edit-render="{ immediate: true }"
        >
          <template v-slot:edit="{ row }">
            <a-range-picker style="width: 100%;" @change="changeRangeDate"/>
          </template>
        </vxe-table-column>
        <vxe-table-column field="amount" title="费用" align="right" width="200" :edit-render="{ immediate: true }">
          <template v-slot:edit="{ row }">
            <a-input-number
              :min="0"
              :step="0.01"
              v-model="row.amount"
              placeholder="请输入费用金额"
              style="width: 100%;"
              @change="$refs.xTable.updateFooter()"/>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" minWidth="200" :edit-render="{ immediate: true }">
          <template v-slot:edit="{ row }">
            <a-textarea
              style="width: 100%;"
              v-model="row.remark"
              :auto-size="{ minRows: 1, maxRows: 3 }"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="100" align="center" v-if="editCus">
          <template v-slot="{ row, rowIndex }">
            <template v-if="$refs.xTable.isActiveByRow(row)">
              <a style="margin-right: 10px;" @click="saveRowEvent">保存</a>
              <a-popconfirm
                :autoAdjustOverflow="false"
                placement="left"
                title="是否取消添加?"
                @confirm="cancelRowEvent"
              >
                <a>取消</a>
              </a-popconfirm>
            </template>
            <template v-else>
              <a-popconfirm
                placement="left"
                title="是否删除该记录?"
                @confirm="delTableRow(rowIndex)"
              >
                <a>删除</a>
              </a-popconfirm>
            </template>
          </template>
        </vxe-table-column>
      </vxe-grid>
      <a-button
        :disabled="editCus"
        type="dashed"
        block
        icon="plus"
        style="margin-top: 12px;"
        @click="insertEvent"
      >
        添加
      </a-button>
    </a-form-model>

    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button
        :style="{ marginRight: '8px' }"
        :disabled="editCus || !form.customerId || !form.ownerId || list.length === 0"
        @click="handleSaveForm('/serviceRecord/addServiceRecord')"
      >
        暂存
      </a-button>
      <a-popconfirm
        :autoAdjustOverflow="false"
        placement="left"
        title="是否确认提交?"
        :disabled="editCus || !form.customerId || !form.ownerId || list.length === 0"
        @confirm="handleSaveForm('/serviceRecord/submit')"

      >
        <a-button type="primary" :disabled="editCus || !form.customerId || !form.ownerId || list.length === 0">
          提交
        </a-button>
      </a-popconfirm>
    </div>
  </a-drawer>
</template>

<script>
import ystable from '@/components/Table/ystable'
import SelectCompany from '@/components/Selects/SelectCompany'
import DeptSelect from '@/components/Selects/DeptSelect'
import SearchSelect from '@/components/Selects/SearchSelect'

export default {
  name: 'WorkRecordAdd',
  components: { SearchSelect, DeptSelect, SelectCompany, ystable },
  props: {
    dictionary: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      editCus: false,
      form: {},
      list: [],
      serviceNoList: [],
      owner: {},
      validRules: {
        itemType: [{ required: true, message: '事由必须填写', trigger: 'blur' }],
        date: [{ required: true, message: '起始日期必须选择', trigger: 'blur' }],
        amount: [{ required: true, message: '金额必须填写', trigger: 'blur' }]
      }
    }
  },
  watch: {
    owner (v) {
      if (!v) {
        this.form.deptId = undefined
        this.form.deptName = undefined
        this.form.ownerId = undefined
        this.form.ownerName = undefined
      } else {
        this.form.deptId = v.deptId
        this.form.deptName = v.deptName
        this.form.ownerId = v.id
        this.form.ownerName = v.realName
      }
    },
    'form.customerId' (n, o) {
      if (n !== o) this.$refs.pTable.refresh(true)
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    close () {
      Object.assign(this.$data, this.$options.data())
    },
    changeRangeDate (dates, dateStr) {
      this.list[0].begin = dateStr[0]
      this.list[0].end = dateStr[1]
      this.list[0].date = `${dateStr[0]} - ${dateStr[1]}`
    },
    async insertEvent () {
      this.editCus = true
      const record = {}
      this.list.unshift(record)
      await this.$refs.xTable.setActiveRow(record)
    },
    async saveRowEvent () {
      const errMap = await this.$refs.xTable.validate().catch(errMap => errMap)
      if (!errMap) {
        this.editCus = false
        await this.$refs.xTable.clearActived()
      }
    },
    cancelRowEvent () {
      this.$refs.xTable.clearActived().then(() => {
        this.list.shift()
        this.editCus = false
      })
    },
    delTableRow (index) {
      this.list.splice(index, 1)
    },
    footerMethod ({ columns, data }) {
      return [columns.map((col, _colI) => {
        if (_colI === 0) {
          return '合计'
        }
        if (_colI === 3) {
          return data.reduce((total, row) => {
            if (isNaN(row.amount)) return total
            return total + row.amount
          }, 0).toFixed(2)
        }
        return ''
      })]
    },
    getCustomerList (data, option) {
      if (!data) {
        this.form = {
          ...this.form,
          customerId: undefined,
          serviceNo: undefined
        }
        this.serviceNoList = []
        return
      }
      const { datasource } = option.data.attrs
      this.form.customerId = datasource.customerId
      if (datasource.ownerId) {
        this.owner = {
          id: datasource.ownerId,
          realName: datasource.ownerName,
          deptId: datasource.deptId,
          deptName: datasource.deptName
        }
      }
    },
    type2value (key) {
      let result = '-'
      if (key) {
        this.dictionary.forEach(item => {
          if (item.key === key) {
            result = item.value
            return false
          }
        })
      }
      return result
    },
    handleSaveForm (url) {
      const params = {
        ...this.form,
        list: this.list
      }
      this.$http.post(url, params).then(({ success, errorMessage }) => {
        if (success) {
          this.$message.success('暂存成功')
          this.close()
          this.$emit('refresh')
        } else {
          this.$message.error(errorMessage)
        }
      })
    },
    clickRow ({ row }) {
      this.form = {
        ...this.form,
        serviceNo: row.serviceNo
      }
      if (row.ownerId) {
        this.owner = {
          id: row.ownerId,
          realName: row.ownerName,
          deptId: row.deptId,
          deptName: row.deptName
        }
      }
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  beforeUpdate () {
  },
  updated () {
  },
  beforeDestroy () {
  },
  destroyed () {
  }
}
</script>

<style lang="less" scoped>
& /deep/ .ant-form-item {
  margin-bottom: 0;
}
</style>
