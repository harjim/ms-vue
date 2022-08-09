<template>
  <a-layout-content>
    <a-card :bordered="false" v-if="$auth('expert:expertManage:search')">
      <TableSearchbar :colNum="4" @search="search(true)">
        <a-form-item label="姓名">
          <a-input v-model="queryParam.realname" placeholder="请输入专家姓名" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select allowClear v-model="queryParam.gender" placeholder="请输入性别" >
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="2">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="用户类型">
          <a-select allowClear v-model="queryParam.types" placeholder="请输入用户类型" >
            <a-select-option value="0">默认类型</a-select-option>
          </a-select>
        </a-form-item>
      </TableSearchbar>
      <!-- 用户列表 -->
      <ystable
        queryUrl="/esManage/getExpertList"
        :params="queryParam"
        highlight-hover-row
        show-overflow
        resizable
        @completed="completed"
        ref="table"
        :toolbar="tableToolbar"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
      >
        <vxe-table-column type="checkbox" width="50" align="center" fixed="left"></vxe-table-column>
        <vxe-table-column
          field="username"
          width="100"
          title="用户名"
          align="center"></vxe-table-column>
        <!-- <vxe-table-column field="vatar" width="100" title="头像" align="center" ></vxe-table-column> -->
        <vxe-table-column field="realname" width="100" title="姓名" align="center" ></vxe-table-column>
        <vxe-table-column field="gender" width="80" title="性别" align="center" remoteSort>
          <template v-slot="{ row }">
            {{ genderData[row.gender] }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="age" width="120" title="年龄" align="center" remoteSort></vxe-table-column>
        <vxe-table-column field="birthday" width="120" title="出生日期" align="center" ></vxe-table-column>
        <vxe-table-column field="mobile" width="180" title="手机号码" align="center" ></vxe-table-column>
        <vxe-table-column field="email" width="180" title="email" align="center" ></vxe-table-column>
        <vxe-table-column field="idType" width="120" title="证件类型" align="center" remoteSort>
          <template v-slot="{ row }">
            {{ idTypeData[row.idType] }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="idNo" width="120" title="证件号码" align="center"></vxe-table-column>
        <vxe-table-column field="types" width="120" title="用户类型" align="center" remoteSort>
          <template v-slot="{ row }">
            {{ typesData[row.types] }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="disabled" width="80" title="状态" align="center" >
          <template v-slot="{ row }">
            {{ disabledData[row.disabled] }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" width="200" align="center" ></vxe-table-column>
        <vxe-table-column title="操作" width="220" fixed="right" align="center">
          <template v-slot="{ row }">
            <a
              href="javascript:;"
              @click="$refs.createModal.edit(row)"
              v-if="$auth('expert:expertManage:audit')"
            >编辑</a>
            <a-divider type="vertical" />
            <a
              href="javascript:;"
              @click="test(row)"
              v-if="$auth('expert:expertManage:reset')"
            >重置密码</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="是否启用用户?"
              @confirm="editStatus(row)"
              v-if="$auth('expert:expertManage:enabled')&&row.disabled===1"
            >
              <a>启用</a>
            </a-popconfirm>
            <a-popconfirm
              title="是否禁用用户?"
              @confirm="editStatus(row)"
              v-if="$auth('expert:expertManage:disabled')&&row.disabled===0"
            >
              <a>禁用</a>
            </a-popconfirm>
          </template>
        </vxe-table-column>
      </ystable>
    </a-card>
    <es-manage-modal ref="createModal" @ok="handleOk"></es-manage-modal>
    <reset-password ref="resetPassword"></reset-password>
  </a-layout-content>
</template>

<script>
import ystable from '@/components/Table/ystable'
import { STable, Ellipsis } from '@/components'
import esManageModal from './modules/EsManageModal'
import resetPassword from './modules/ResetPassword'
import DeptSelectOnly from '@/components/DeptSelectOnly'
import TableSearchbar from '@/components/TableSearchbar'
// 用户表格
export default {
  name: 'ExpertManage',
  components: {
    ystable,
    STable,
    Ellipsis,
    esManageModal,
    resetPassword,
    DeptSelectOnly,
    TableSearchbar
  },
  data () {
    return {
      selectedRowKeys: [],
      selectUser: [],
      spinning: false,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      realname_q: '',
      dataList: [],
      fullPath: undefined,
      genderData: {
        1: '男',
        2: '女'
      },
      typesData: {
        0: '默认类型'
      },
      idTypeData: {
        0: '身份证',
        1: '护照',
        2: '港澳通行证'
      },
      disabledData: {
        0: '启用',
        1: '禁用'
      },
      queryParam: {},
      tableToolbar: {
        perfect: true,
        refresh: true,
        zoom: true,
        custom: true
        // slots: {
        //   buttons: 'toolbar_buttons'
        // }
      }
    }
  },
  methods: {
    search (refresh) {
      this.selectedRowKeys = []
      this.selectUser = []
      this.$refs.table.refresh(refresh)
    },
    editStatus (record) {
      this.$http.post('/esManage/changeUserStatus', { id: record.id, disabled: record.disabled })
        .then(res => {
          if (res.success && res.data) {
            if (record.disabled === 0) {
              this.$message.success('禁用成功')
            }
            if (record.disabled === 1) {
              this.$message.success('启用成功')
            }
            this.search(false)
          } else {
            this.$message.info(res.errorMessage)
          }
        })
    },
    handleOk (ok) {
      this.search(ok)
    },
    generateList (data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.key
        this.dataList.push({ key, title: node.title, scopedSlots: { title: 'title' } })
        if (node.children) {
          this.generateList(node.children)
        }
      }
    },
    selectChangeEvent ({ checked, records }) {
      this.selectedRowKeys = records.map(item => { return item.id })
      this.selectUser = records
    },
    selectAllEvent ({ checked, records }) {
      this.selectedRowKeys = records.map(item => { return item.id })
      this.selectUser = records
    },
    completed () {
      this.selectedRowKeys = []
      this.selectUser = []
    },
    test ({ id, username }) {
      this.$refs.resetPassword.showReset(id, username)
    }
  }

}

</script>
<style lang="less" scoped>
</style>
