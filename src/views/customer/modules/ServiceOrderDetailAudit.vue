<template>
  <a-tabs class="tabs" animated default-active-key="1" @change="changeTab">
    <a-tab-pane key="1" tab="审核" v-if="$auth('customer:serviceApply:review')">
      <a-textarea
        placeholder="请输入审核意见"
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
      <a-row>
        <a-col :span="4" :offset="10" style="margin-top: 16px;display: flex;justify-content: space-between;">
          <a-button size="small">通过</a-button>
          <a-popconfirm
            title="是否确认驳回？"
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

export default {
  name: 'ServiceOrderDetailAudit',
  props: {
    instanceId: {
      type: Number
    }
  },
  data () {
    return {
      statusColor,
      defaultTab: undefined,
      loading: false,
      logList: []
    }
  },
  beforeMount () {
    if (this.$auth('customer:serviceApply:review')) {
      this.defaultTab = '1'
    } else if (this.$auth('customer:serviceApply:audit')) {
      this.defaultTab = '2'
      this.getAuditLog()
    }
  },
  methods: {
    getStatusName,
    // 获取日志
    getAuditLog () {
      this.loading = true
      this.$http.get('/rdFeeAudit/getAuditLog', { params: { instanceId: this.instanceId } }).then(({
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
      if (v === '2') this.getAuditLog()
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
