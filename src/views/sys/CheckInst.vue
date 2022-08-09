<template>
  <a-card :bordered="false">
    <a-form-model layout="inline" :model="params">
      <a-form-model-item label="机构名称">
        <a-input v-model="params.instName" placeholder="请输入机构名称"/>
      </a-form-model-item>
      <a-form-model-item label="联系人">
        <a-input v-model="params.linkMan" placeholder="请输入联系人"/>
      </a-form-model-item>
      <a-form-model-item label="创建人">
        <a-input v-model="params.creatorName" placeholder="请输入创建人"/>
      </a-form-model-item>
    </a-form-model>
    <ystable
      ref="xtable"
      query-url="/checkInst/getList"
      :params="params"
      :seq-config="{ startIndex: 1 }"
      :toolbar="{
        refresh: true,
        zoom: true,
        custom: true
      }"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
    >
      <template #buttons>
        <span style="margin-right:10px;" v-if="$auth('sys:checkInst:search')">
          <a-button type="primary" @click="refresh(true)">查询</a-button>
        </span>
        <span style="margin-right:10px;" v-if="$auth('sys:checkInst:add')">
          <a-button type="primary" @click="$refs.instModal.open()">添加</a-button>
        </span>
        <span style="margin-right:10px;" v-if="$auth('sys:checkInst:del')">
          <a-popconfirm v-if="$auth('sys:checkInst:del')" title="是否确定删除?" @confirm="() => handleDelChecked()">
            <a-button type="primary" :disabled="selectedRowKeys.length === 0" :loading="delLoad">删除</a-button>
          </a-popconfirm>
        </span>
      </template>
      <vxe-table-column type="checkbox" width="50" align="center" fixed="left"/>
      <vxe-table-column
        title="查新机构名称"
        field="instName"
        key="instName"
        align="left"
        show-header-overflow
        :width="200"
        show-overflow="tooltip"
        fixed="left"
      />
      <vxe-table-column
        title="账户名"
        field="accountName"
        key="accountName"
        align="left"
        show-header-overflow
        :width="150"
        show-overflow="tooltip"
      />
      <vxe-table-column
        title="开户行"
        field="accountBank"
        key="accountBank"
        align="left"
        show-header-overflow
        :width="200"
        show-overflow="tooltip"
      />
      <vxe-table-column
        title="账号"
        field="accountNo"
        key="accountNo"
        align="left"
        show-header-overflow
        :width="200"
        show-overflow="tooltip"
      />
      <vxe-table-column
        title="快递费"
        field="postage"
        key="postage"
        align="right"
        show-header-overflow
        :width="150"
        show-overflow="tooltip"
      />
      <vxe-table-column
        title="联系人"
        field="linkMan"
        key="linkMan"
        align="left"
        show-header-overflow
        :width="150"
        show-overflow="tooltip"
      />
      <vxe-table-column
        title="联系电话"
        field="linkTel"
        key="linkTel"
        align="left"
        show-header-overflow
        :width="150"
        show-overflow="tooltip"
      />
      <vxe-table-column
        title="创建人"
        field="creatorName"
        key="creatorName"
        align="left"
        show-header-overflow
        :width="150"
        show-overflow="tooltip"
      />
      <vxe-table-column
        title="创建时间"
        field="createTime"
        key="createTime"
        align="center"
        show-header-overflow
        :width="150"
        show-overflow="tooltip"
      />
      <vxe-table-column
        title="付款备注"
        field="payRemark"
        key="payRemark"
        align="left"
        show-header-overflow
        :width="200"
        show-overflow="tooltip"
      />
      <vxe-table-column title="操作" width="150" align="center" fixed="right">
        <template v-slot="{ row }">
          <a v-if="$auth('sys:checkInst:edit')">编辑</a>
          <a-divider type="vertical" v-if="$auth('sys:checkInst:edit')"/>
          <a-popconfirm v-if="$auth('sys:checkInst:del')" title="是否确定删除?" @confirm="handleDel(row)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </vxe-table-column>
    </ystable>
    <AddCheckInst ref="instModal"/>
  </a-card>
</template>

<script>
import ystable from '@/components/Table/ystable'
import { message } from 'ant-design-vue'
import AddCheckInst from '@/views/sys/modules/AddCheckInst'

export default {
  name: 'CheckInst',
  components: {
    AddCheckInst,
    ystable
  },
  data () {
    return {
      params: {
        instName: '',
        linkMan: '',
        creatorName: ''
      },
      selectedRowKeys: [],
      selectUser: [],
      delLoad: false
    }
  },
  methods: {
    refresh (flag) {
      this.$refs.xtable.refresh(flag)
    },
    selectChangeEvent ({ checked, records }) {
      this.selectedRowKeys = records.map(item => {
        return item.id
      })
      this.selectUser = records
    },
    selectAllEvent ({ checked, records }) {
      this.selectedRowKeys = records.map(item => {
        return item.id
      })
      this.selectUser = records
    },
    handleDel ({ id }) {
      this.delCheckInst([id])
    },
    handleDelChecked () {
      this.delLoad = true
      try {
        this.delCheckInst(this.selectedRowKeys)
      } finally {
        this.selectedRowKeys = []
        this.selectUser = []
        this.delLoad = false
      }
    },
    delCheckInst (ids) {
      this.$http.post('/checkInst/delCheckInst', { ids }).then(({ success, errorMessage }) => {
        if (success) {
          message.success('删除成功')
          this.refresh(true)
        } else {
          message.error(errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
& /deep/ .ant-descriptions-title {
  position: relative;
}

& /deep/ .ant-descriptions-title:before {
  content: '';
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #EDEDED;
}

.appendix-box {
  display: inline-flex;
  align-items: center;
  column-gap: 4px;
}
</style>
