<template>
  <a-tabs class="tabs" animated :activeKey="activeKey" @change="changeTab">
    <a-tab-pane key="1" tab="审核" v-if="canReview">
      <a-form :form="form">
        <a-form-item>
          <a-textarea
            v-decorator="['suggestion', {rules: [{required: false, message: '请输入审批意见'}, { min: 5, message: '审批意见不能少于5个字符'}]}]"
            placeholder="请输入审核意见"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
      <a-row>
        <a-col :span="4" :offset="10" style="margin-top: 16px;display: flex;justify-content: space-between;">
          <a-button size="small" @click="review(true)">通过</a-button>
          <a-popconfirm
            title="是否确认驳回？"
            @confirm="review(false)"
          >
            <a-button type="danger" size="small">驳回</a-button>
          </a-popconfirm>
        </a-col>
      </a-row>
    </a-tab-pane>
    <a-tab-pane key="2" tab="日志" v-if="$auth('customer:serviceApply:audit')">
      <vxe-grid
        highlight-hover-row
        highlight-current-row
        show-overflow="title"
        resizable
        auto-resize
        :max-height="200"
        size="small"
        :loading="loading"
        :data="logList"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column
          title="节点名称"
          field="nodeName"
          width="140"
          align="left"
        >
        </vxe-table-column>
        <vxe-table-column
          title="审批状态"
          field="pass"
          width="100"
          align="left"
        >
          <template v-slot="{row}">
            <a-badge :color="statusColor[row.status]" :text="getStatusName(row.status)"/>
          </template>
        </vxe-table-column>
        <vxe-table-column
          title="参与者"
          field="auditor"
          align="left"
        >
          <template v-slot="{row}">
            {{ row.auditor ? row.auditor : '-' }}
          </template>
        </vxe-table-column>
        <vxe-table-column
          title="审批意见"
          field="suggestion"
          align="left"
        >
        </vxe-table-column>
        <vxe-table-column
          title="审批时间"
          field="createTime"
          width="160"
          align="center"
        >
        </vxe-table-column>
      </vxe-grid>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { getStatusName, statusColor } from '@/utils/processDoc/auditStatus'
import { mapState } from 'vuex'

export default {
  name: 'ServiceOrderDetailAudit',
  props: {
    storeName: {
      type: String,
      default: 'service'
    },
    detail: {
      type: String,
      default: 'currentOrder'
    }
  },
  data () {
    return {
      statusColor,
      defaultTab: undefined,
      loading: false,
      activeKey: undefined,
      logList: [],
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapState({
      currentOrder: state => state.service.currentOrder,
      recordOrder: state => state.workRecord.recordOrder
    }),
    canReview () {
      return this[this.detail].hasPermission && this.$auth('customer:serviceApply:review')
    }
  },
  watch: {
    activeKey (val) {
      if (val === '2') {
        this.getAuditLog()
      }
    }
  },
  mounted () {
    if (this.canReview) {
      this.activeKey = '1'
    } else if (this.$auth('customer:serviceApply:audit')) {
      this.activeKey = '2'
    }
  },
  methods: {
    getStatusName,
    // 获取日志
    getAuditLog () {
      if (!this[this.detail].instanceId) return
      this.loading = true
      this.$http.get('/rdFeeAudit/getAuditLog', { params: { instanceId: this[this.detail].instanceId } }).then(({
        success,
        data,
        errorMessage
      }) => {
        if (success) {
          this.logList = data
        } else {
          this.$message.error(errorMessage || '获取数据失败')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    changeTab (v) {
      this.activeKey = v
      if (v === '2') this.getAuditLog()
    },
    review (flag) {
      this.form.validateFields((err, val) => {
        if (!err) {
          const params = {
            ...val,
            status: flag ? 1 : 2,
            instanceId: this[this.detail].instanceId
          }
          const url = this.detail === 'currentOrder' ? '/serviceApply/review' : '/serviceRecord/review'
          this.$http.post(url, params).then(({ success, errorMessage }) => {
            if (success) {
              this.$message.success('审核成功')
              this.$store.commit(`${this.storeName}/CHANGE_PERMISSION`, false)
              this.activeKey = '2'
              this.form.resetFields()
              this.$emit('refresh')
            } else {
              this.$message.error(errorMessage || '审核失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tabs /deep/ .ant-tabs-nav-scroll {
  display: flex;
  flex-direction: row-reverse;
}
</style>
