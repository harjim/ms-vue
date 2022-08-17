<template>
  <a-drawer
    :visible="visible"
    destroyOnClose
    title="服务记录详情"
    :width="960"
    :drawerStyle="{ height: '100vh' }"
    :bodyStyle="{ overflowY: 'hidden' }"
    @close="close"
  >
    <tab-layout>
      <template #up>
        <div style="width: 100%;">
          <a-descriptions :column="2">
            <a-descriptions-item label="客户名称">
              {{ order.companyName }}
            </a-descriptions-item>
            <a-descriptions-item label="关联单号">
              <template v-if="!editing">
                {{ order.serviceNo }}
              </template>
              <template v-else>
                <a-popover>
                  <template slot="content">
                    <ystable
                      ref="pTable"
                      query-url="/serviceRecord/getServiceNo"
                      :params="order"
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
                    v-model="order.serviceNo"
                    style="width: 200px;"
                    :disabled="!order.customerId"
                    placeholder="请选择服务单号"
                  />
                </a-popover>
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="业务员">
              <template v-if="!editing">
                {{ order.ownerName }}
              </template>
              <template v-else>
                <search-select
                  style="width: 200px;"
                  url="/user/userForSelect"
                  searchField="realName"
                  sTitle="realName"
                  placeholder="请输入业务员"
                  v-model="owner"
                  :allowClear="false"
                />
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="所属部门">
              <template v-if="!editing">
                {{ order.deptName }}
              </template>
              <template v-else>
                <a-input v-model="order.deptName" placeholder="请输入所属部门" disabled/>
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="创建人">
              {{ order.creatorName }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ order.createTime }}
            </a-descriptions-item>
          </a-descriptions>
          <div style="position: absolute;top: 0;right: 0;" v-if="!editing">
            <div style="color: rgba(0, 0, 0, .4);text-align: right;">流程状态</div>
            <div style="font-size: 24px;" :style="{ color: getStatusColor }">{{ getStatusTitle }}
            </div>
          </div>
        </div>
        <vxe-grid
          ref="xTable"
          resizable
          stripe
          show-footer
          keep-source
          size="small"
          :data="order.list"
          :max-height="400"
          :footer-method="footerMethod"
          show-overflow="title"
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
            width="180"
            align="center"
            :edit-render="{ immediate: true }"
          >
            <template v-slot:edit="{ row }">
              <a-range-picker style="width: 100%;" @change="changeRangeDate"/>
            </template>
          </vxe-table-column>
          <vxe-table-column field="amount" title="费用" align="right" width="180" :edit-render="{ immediate: true }">
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
          <vxe-table-column field="remark" title="备注" minWidth="180" :edit-render="{ immediate: true }">
            <template v-slot:edit="{ row }">
              <a-textarea
                style="width: 100%;"
                v-model="row.remark"
                :auto-size="{ minRows: 1, maxRows: 5 }"
              />
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" minWidth="100" align="center" v-if="editing">
            <template v-slot="{ row, rowIndex }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <a style="margin-right: 10px;" @click="validAllAndSave">保存</a>
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
          @click="insertEvent"
          :disabled="tableEdit"
        >
          添加
        </a-button>
      </template>
      <template #down>
        <template v-if="$auth('customer:serviceApply:review') || $auth('customer:serviceApply:audit')">
          <ServiceOrderDetailAudit @refresh="$emit('refresh')" storeName="workRecord" detail="recordOrder"/>
        </template>
      </template>
    </tab-layout>

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
        :disabled="!getIsEditStatus"
        v-if="!editing"
        @click="onEdit"
      >
        编辑
      </a-button>
      <a-button
        v-else
        :style="{ marginRight: '8px' }"
        :disabled="tableEdit || order.list.length === 0"
        @click="handleSaveForm('/serviceRecord/editServiceRecord')"
      >
        暂存
      </a-button>
      <a-popconfirm
        title="是否确认提交?"
        placement="left"
        :autoAdjustOverflow="false"
        :disabled="!getIsEditStatus || tableEdit"
        @confirm="handleSaveForm('/serviceRecord/submit')"
      >
        <a-button type="primary" :disabled="!getIsEditStatus || tableEdit || order.list.length === 0">
          提交
        </a-button>
      </a-popconfirm>
    </div>
  </a-drawer>
</template>

<script>
import ystable from '@/components/Table/ystable'
import { mapGetters, mapState } from 'vuex'
import ServiceOrderDetailAudit from '@/views/customer/modules/ServiceOrderDetailAudit'
import TabLayout from '@/views/customer/modules/AuditProgress/modules/TabLayout'
import SearchSelect from '@/components/Selects/SearchSelect'

export default {
  name: 'WorkRecordCheck',
  components: { SearchSelect, TabLayout, ServiceOrderDetailAudit, ystable },
  props: {
    dictionary: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      tableEdit: false,
      serviceNoList: [],
      owner: {},
      validRules: {
        itemType: [{ required: true, message: '事由必须填写', trigger: 'blur' }],
        date: [{ required: true, message: '起始日期必须选择', trigger: 'blur' }],
        amount: [{ required: true, message: '金额必须填写', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      order: state => state.workRecord.recordOrder,
      editing: state => state.workRecord.editing
    }),
    ...mapGetters('workRecord', ['getIsEditStatus', 'getStatusColor', 'getStatusTitle'])
  },
  watch: {
    owner (v) {
      if (v) {
        this.$store.commit('workRecord/CHANGE_OWNER', v)
      }
    }
  },
  methods: {
    open () {
      this.owner = {
        id: this.order.ownerId,
        realName: this.order.ownerName,
        deptName: this.order.deptName
      }
      this.getServiceNoList()
      this.visible = true
    },
    close () {
      Object.assign(this.$data, this.$options.data())
      this.$store.commit('workRecord/SET_ORDER', {})
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
    onEdit () {
      this.$store.commit('workRecord/SET_EDITING', true)
    },
    async insertEvent () {
      const record = {}
      await this.$store.commit('workRecord/ADD_ITEM', record)
      await this.$refs.xTable.setActiveRow(record)
      this.tableEdit = true
    },
    delTableRow (row, index) {
      this.$store.commit('workRecord/DEL_ITEM', index)
      this.$refs.xTable.remove(row)
    },
    cancelRowEvent () {
      this.$refs.xTable.clearActived().then(() => {
        this.tableEdit = false
        this.$store.commit('workRecord/DEL_ITEM')
      })
    },
    async validAllAndSave () {
      const errMap = await this.$refs.xTable.validate().catch(errMap => errMap)
      if (!errMap) {
        this.tableEdit = false
        await this.$refs.xTable.clearActived()
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
    getServiceNoList () {
      this.$http.get('/serviceRecord/getCustomerList', {
        params: {
          companyName: this.order.companyName
        }
      }).then(({ success, data }) => {
        if (success) {
          if (data.list) {
            const temp = []
            for (const listKey in data.list) {
              temp.push({
                key: data.list[listKey],
                label: data.list[listKey]
              })
            }
            this.serviceNoList = temp
          }
        }
      })
    },
    clickRow ({ row }) {
      this.$store.commit('workRecord/CHANGE_SERVICE', row)
      if (row.ownerId) {
        this.owner = {
          id: row.ownerId,
          realName: row.ownerName,
          deptId: row.deptId,
          deptName: row.deptName
        }
      }
    },
    changeRangeDate (dates, dateStr) {
      this.$store.commit('workRecord/CHANGE_DATE', dateStr)
    },
    handleSaveForm (url) {
      this.$store.commit('workRecord/SET_EDITING', false)
      this.$nextTick(() => {
        this.$http.post(url, this.order).then(({ success, errorMessage }) => {
          if (success) {
            this.$message.success('操作成功')
            this.close()
            this.$emit('refresh')
          } else {
            this.$message.error(errorMessage)
          }
        })
      })
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
& /deep/ .ant-spin-container {
  height: calc(100vh - 64px);
}

& /deep/ .center_wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);

  .up {
    height: 70%;
    width: 100%;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  & > .midden {
    width: 100%;
    height: 6px;
    background-color: #F0F2F5;
    border-radius: 3px;

    &:hover {
      cursor: n-resize;
      background-color: #d6d6d6;
    }
  }

  .down {
    overflow: auto;
    flex: 1;
    min-height: 300px;

    & /deep/ .ant-tabs-tabpane {
      overflow: auto;
    }
  }
}
</style>
