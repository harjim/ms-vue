<template>
  <a-card :bordered="false">
    <template v-if="$auth('customer:serviceApply:search')">
      <a-form-model layout="inline" ref="form" :model="form">
        <a-form-model-item label="客户名称">
          <a-input v-model="form.companyName" placeholder="请输入客户名称"/>
        </a-form-model-item>
        <a-form-model-item label="财务人员">
          <a-input v-model="form.finaName" placeholder="请输入财务人员"/>
        </a-form-model-item>
        <a-form-model-item label="技术人员">
          <a-input v-model="form.techName" placeholder="请输入技术人员"/>
        </a-form-model-item>
        <a-form-model-item label="申请人">
          <a-input v-model="form.ownerName" placeholder="请输入申请人"/>
        </a-form-model-item>
        <a-form-model-item label="所属部门">
          <a-input v-model="form.deptName" placeholder="请输入所属部门"/>
        </a-form-model-item>
        <a-form-model-item label="流程状态">
          <a-input v-model="form.status" placeholder="请输入流程状态"/>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="onSearch">查询</a-button>
        </a-form-model-item>
      </a-form-model>

      <ystable
        ref="xtable"
        query-url="/serviceApply/getList"
        :params="form"
        :seq-config="{ startIndex: 1 }"
        :toolbar="{
          refresh: true,
          zoom: true,
          custom: true
        }"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
      >
        <vxe-table-column type="checkbox" width="50" align="center" fixed="left"/>
        <vxe-table-column
          title="服务单号"
          field="serviceNo"
          align="center"
          fixed="left"
          width="200"
          show-overflow="tooltip"
        >
          <template v-slot="{ row }">
            <a v-if="$auth('customer:serviceApply:check')" @click="$refs.ServiceOrderDetail.open(row)">{{
              row.serviceNo
            }}</a>
            <p v-else>{{ row.serviceNo }}</p>
          </template>
        </vxe-table-column>
        <vxe-table-column
          title="客户名称"
          field="customers"
          fixed="left"
          width="200"
          show-overflow="tooltip"
        ></vxe-table-column>
        <vxe-table-column
          title="预计起止日期"
          field="date"
          align="center"
          width="200"
          show-overflow="tooltip"
        />
        <vxe-table-column
          title="技术人员"
          field="techList"
          width="200"
          show-overflow="tooltip"
        >
          <template v-slot="{ row }">
            <div class="txt-hide">{{ row.techList.map(i => i.userName).join(', ') }}</div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          title="财务人员"
          field="finaList"
          width="200"
          show-overflow="tooltip"
        >
          <template v-slot="{ row }">
            <div class="txt-hide">{{ row.finaList.map(i => i.userName).join(', ') }}</div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          title="财务人员"
          field="otherList"
          width="200"
          show-overflow="tooltip"
        >
          <template v-slot="{ row }">
            <div class="txt-hide">{{ row.otherList.map(i => i.userName).join(', ') }}</div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          title="申请人"
          field="ownerName"
          width="200"
          show-overflow="tooltip"
        />
        <vxe-table-column
          title="所属部门"
          field="deptName"
          width="200"
          show-overflow="tooltip"
        />
        <vxe-table-column
          title="流程状态"
          field="status"
          width="200"
          show-overflow="tooltip"
        >
          <template v-slot="{ row }">
            <div style="display: flex;align-items: baseline;">
              <div
                style="background: #8c8c8c; width: 10px; height: 10px; border-radius: 100%"
                :style="{
                  background: resultColor(row.status)
                }"
              />
              <div style="margin-left: 6px;">{{ row.status !== null ? STATUS[row.status] : '草稿' }}</div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          title="当前处理人"
          field="auditUsers"
          width="200"
          show-overflow="tooltip"
        />
        <vxe-table-column
          title="创建时间"
          field="createTime"
          align="center"
          width="200"
          show-overflow="tooltip"
        />
        <vxe-table-column
          title="最后修改时间"
          field="lastUpdateTime"
          width="200"
          show-overflow="tooltip"
        />
      </ystable>
      <ServiceOrderDetail ref="ServiceOrderDetail"/>
    </template>
    <template v-else>
      <a-empty :description="false"/>
    </template>
  </a-card>
</template>

<script>
import ystable from '@/components/Table/ystable'
import ServiceOrderDetail from '@/views/customer/modules/ServiceOrderDetail'

const STATUS = {
  0: '进行中', 1: '通过', 2: '驳回'
}

export default {
  name: 'ServiceApply',
  components: {
    ServiceOrderDetail,
    ystable
  },
  data () {
    this.STATUS = STATUS
    return {
      form: {},
      selectedRowKeys: [],
      selectUser: []
    }
  },
  methods: {
    onSearch () {
      this.$refs.xtable.refresh(true)
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
    resultColor (status) {
      switch (status) {
        case 0:
          return '#0E77D1'
        case 1:
          return '#00A854'
        case 2:
          return '#F04134'
        default:
          return '#BFBFBF'
      }
    }
  }
}
</script>

<style lang="less">
.txt-hide {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
