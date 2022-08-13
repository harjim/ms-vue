<template>
  <a-card :bordered="false">
    <template v-if="$auth('customer:serviceApply:search')">
      <a-form-model layout="inline" ref="form" :model="form">
        <a-form-model-item label="客户名称">
          <select-company style="width: 190px;" prop="companyName" @changeCompany="v => form.companyName = v"/>
        </a-form-model-item>
        <a-form-model-item label="财务人员">
          <search-select
            url="/user/userForSelect"
            searchField="realName"
            sTitle="realName"
            placeholder="请输入财务人员"
            style="width:190px;"
            v-model="search.finaName"
            @change="v => form.finaName = v.realName"
          />
        </a-form-model-item>
        <a-form-model-item label="技术人员">
          <search-select
            url="/user/userForSelect"
            searchField="realName"
            sTitle="realName"
            placeholder="请输入技术人员"
            style="width:190px;"
            v-model="search.techName"
            @change="v => form.techName = v.realName"
          />
        </a-form-model-item>
        <a-form-model-item label="申请人">
          <search-select
            url="/user/userForSelect"
            searchField="realName"
            sTitle="realName"
            placeholder="请输入申请人"
            style="width:190px;"
            v-model="search.ownerName"
            @change="v => form.ownerName = v.realName"
          />
        </a-form-model-item>
        <a-form-model-item label="所属部门">
          <dept-select style="width: 190px;" v-model="form.deptName" placeholder="请输入所属部门"/>
        </a-form-model-item>
        <a-form-model-item label="流程状态">
          <a-select v-model="form.status" placeholder="请输入流程状态" style="width: 190px;">
            <a-select-option v-for="(v, k) in statusMap" :key="k" :value="k">{{ v }}</a-select-option>
          </a-select>
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
        <template v-slot:buttons>
          <template v-if="$auth('customer:serviceApply:add')">
            <a-button type="primary" @click="$refs.ServiceOrderAdd.open()">添加</a-button>
          </template>
        </template>
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
            <a v-if="$auth('customer:serviceApply:check')" @click="openDetail(row)">{{
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
            <a-badge :color="statusColor[row.status]" :text="getStatusName(row.status)"/>
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
      <ServiceOrderAdd ref="ServiceOrderAdd"/>
    </template>
    <template v-else>
      <a-empty :description="false"/>
    </template>
  </a-card>
</template>

<script>
import ystable from '@/components/Table/ystable'
import ServiceOrderDetail from '@/views/customer/modules/ServiceOrderDetail'
import { getStatusName, statusColor, statusMap } from '@/utils/processDoc/auditStatus'
import DeptSelect from '@/components/Selects/DeptSelect'
import SearchSelect from '@/components/Selects/SearchSelect'
import SelectCompany from '@/components/Selects/SelectCompany'
import ServiceOrderAdd from '@/views/customer/modules/ServiceOrderAdd'

export default {
  name: 'ServiceApply',
  components: {
    ServiceOrderAdd,
    SelectCompany,
    SearchSelect,
    DeptSelect,
    ServiceOrderDetail,
    ystable
  },
  data () {
    return {
      statusMap,
      statusColor,
      form: {},
      search: {},
      selectedRowKeys: [],
      selectUser: []
    }
  },
  methods: {
    getStatusName,
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
    openDetail (row) {
      this.$store.commit('service/SET_DETAIL', row)
      this.$refs.ServiceOrderDetail.open()
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
