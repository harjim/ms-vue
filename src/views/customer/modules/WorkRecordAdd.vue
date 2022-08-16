<template>
  <a-drawer :visible="visible" destroyOnClose title="添加服务记录" :width="960" @close="close">
    <a-form-model ref="form" :model="form" layout="inline">
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="客户名称">
            <select-company
              style="width: 100%"
              prop="companyName"
              @changeCompany="(data, option) => form.customerId = option.key"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="关联单号">
            <a-input/>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item label="业务员">
            <a-input/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="所属部门">
            <a-input/>
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
        <vxe-table-column field="causes" title="事项" width="200" :edit-render="{ immediate: true }">
          <template v-slot:edit="{ row }">
            <a-input
              v-model="row.causes"
              placeholder="请输入出差事项"
              style="width: 100%;"
              :edit-render="{ immediate: true }"/>
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
        <vxe-table-column field="cost" title="费用" align="right" width="200" :edit-render="{ immediate: true }">
          <template v-slot:edit="{ row }">
            <a-input-number
              :min="0"
              :step="0.01"
              v-model="row.cost"
              placeholder="请输入费用金额"
              style="width: 100%;"
              @change="$refs.xTable.updateFooter()"/>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" width="200" :edit-render="{ immediate: true }">
          <template v-slot:edit="{ row }">
            <a-textarea
              style="width: 100%;"
              v-model="row.remark"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="100" align="center">
          <template v-slot="{ row }">
            <template v-if="$refs.xTable.isActiveByRow(row)">
              <a style="margin-right: 10px;" @click="saveRowEvent(row)">保存</a>
              <a-popconfirm
                :autoAdjustOverflow="false"
                placement="left"
                title="是否取消添加?"
                @confirm="cancelRowEvent(row)"
              >
                <a>取消</a>
              </a-popconfirm>
            </template>
            <template v-else>
              <a-popconfirm
                placement="left"
                title="是否删除该记录?"
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
        :disabled="editCus"
      >
        暂存
      </a-button>
      <a-popconfirm
        title="是否确认提交?"
        placement="leftTop"
        :disabled="editCus"
      >
        <a-button type="primary" :disabled="editCus">
          提交
        </a-button>
      </a-popconfirm>
    </div>
  </a-drawer>
</template>

<script>
import SelectCompany from '@/components/Selects/SelectCompany'
import DeptSelect from '@/components/Selects/DeptSelect'
import SearchSelect from '@/components/Selects/SearchSelect'

export default {
  name: 'WorkRecordAdd',
  components: { SearchSelect, DeptSelect, SelectCompany },
  props: {},
  data () {
    return {
      visible: false,
      editCus: false,
      form: {},
      list: [],
      validRules: {
        causes: [{ required: true, message: '事由必须填写', trigger: 'blur' }],
        date: [{ required: true, message: '起始日期必须选择', trigger: 'blur' }],
        cost: [{ required: true, message: '金额必须填写', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    open () {
      this.visible = true
    },
    close () {
      this.form = {}
      this.list = []
      this.editCus = false
      this.visible = false
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
    footerMethod ({ columns, data }) {
      return [columns.map((col, _colI) => {
        if (_colI === 0) {
          return '合计'
        }
        if (_colI === 3) {
          return data.reduce((total, row) => {
            if (isNaN(row.cost)) return total
            return total + row.cost
          }, 0).toFixed(2)
        }
        return ''
      })]
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

<style scoped>

</style>
