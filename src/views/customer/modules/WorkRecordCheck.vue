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
              {{ order.serviceNo }}
            </a-descriptions-item>
            <a-descriptions-item label="业务员">
              {{ order.salesman }}
            </a-descriptions-item>
            <a-descriptions-item label="所属部门">
              {{ deepTreeTitle(order.deptId) }}
            </a-descriptions-item>
            <a-descriptions-item label="创建人">
              {{ order.ownerName }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ order.date }}
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
          :data="order.matter"
          :max-height="400"
          :footer-method="footerMethod"
          show-overflow="title"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
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
            width="180"
            align="center"
            :edit-render="{ immediate: true }"
          >
            <template v-slot:edit="{ row }">
              <a-range-picker style="width: 100%;"/>
            </template>
          </vxe-table-column>
          <vxe-table-column field="cost" title="费用" align="right" width="180" :edit-render="{ immediate: true }">
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
          <vxe-table-column field="remark" title="备注" width="180" :edit-render="{ immediate: true }">
            <template v-slot:edit="{ row }">
              <a-textarea
                style="width: 100%;"
                v-model="row.remark"
                :auto-size="{ minRows: 2, maxRows: 5 }"
              />
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" minWidth="100" align="center">
            <template v-slot="{ row, index }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <a style="margin-right: 10px;">保存</a>
                <a-popconfirm
                  :autoAdjustOverflow="false"
                  placement="left"
                  title="是否取消添加?"
                >
                  <a>取消</a>
                </a-popconfirm>
              </template>
              <template v-else>
                <a-popconfirm
                  title="是否删除该记录?"
                >
                  <a>删除</a>
                </a-popconfirm>
              </template>
            </template>
          </vxe-table-column>
        </vxe-grid>
      </template>
      <template #down>
        <template v-if="$auth('customer:serviceApply:review') || $auth('customer:serviceApply:audit')">
          <ServiceOrderDetailAudit :instance-id="order.instanceId"/>
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
        v-if="true"
      >
        编辑
      </a-button>
      <a-button
        v-else
        :style="{ marginRight: '8px' }"
      >
        暂存
      </a-button>
      <a-popconfirm
        title="是否确认提交?"
        placement="leftTop"
        :disabled="!getIsEditStatus"
      >
        <a-button type="primary" :disabled="!getIsEditStatus">
          提交
        </a-button>
      </a-popconfirm>
    </div>
  </a-drawer>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { deepTree } from '@/utils/util'
import ServiceOrderDetailAudit from '@/views/customer/modules/ServiceOrderDetailAudit'
import TabLayout from '@/views/customer/modules/AuditProgress/modules/TabLayout'

export default {
  name: 'WorkRecordCheck',
  components: { TabLayout, ServiceOrderDetailAudit },
  props: {
    deptArr: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState({
      order: state => state.workRecord.recordOrder,
      editing: state => state.workRecord.editing
    }),
    ...mapGetters('workRecord', ['getIsEditStatus', 'getStatusColor', 'getStatusTitle'])
  },
  watch: {},
  methods: {
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
      this.$store.commit('workRecord/SET_ORDER', {})
    },
    deepTreeTitle (value) {
      if (!value) return '-'
      const temp = deepTree(this.deptArr, value)
      return temp.title
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

    & /deep/ .ant-tabs-tabpane {
      overflow: auto;
    }
  }
}
</style>
