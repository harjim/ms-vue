<template>
  <a-form :form="form">
    <a-row>
      <a-col :span="12">
        <a-form-item label="客户名称">
          <CompanySelect
            style="width: 330px"
            v-decorator="['customerId', { rules: [{ required: true, message: '请输入客户名称' }] }]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="年份">
          <YearSelect
            style="width: 330px"
            v-decorator="['year', { rules: [{ required: true, message: '请选择年份' }] }]"
            placeholder="请选择年份"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="12">
        <a-form-item label="业务员">
          <SearchSelect
            style="width: 330px"
            v-decorator="['ownerId', { rules: [{ required: true, message: '请输入业务员' }] }]"
            url="/user/userForSelect"
            searchField="realName"
            sTitle="realName"
            :multiple="false"
            placeholder="请输入业务员"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="所属部门">
          <DeptSelect
            style="width: 330px"
            v-decorator="['deptId', { rules: [{ required: true, message: '请选择所属部门' }] }]"
            placeholder="请选择所属部门"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="12">
        <a-form-item label="技术人员">
          <SearchSelect
            style="width: 330px"
            v-decorator="['techId', { rules: [{ required: true, message: '请输入技术人员' }] }]"
            url="/user/userForSelect"
            searchField="realName"
            sTitle="realName"
            :multiple="false"
            placeholder="请输入技术人员"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="财务经理">
          <SearchSelect
            style="width: 330px"
            v-decorator="['finaManagerId', { rules: [{ required: true, message: '请输入财务经理' }] }]"
            url="/user/userForSelect"
            searchField="realName"
            sTitle="realName"
            :multiple="false"
            placeholder="请输入财务经理"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="12">
        <a-form-item label="分公司总经理">
          <SearchSelect
            style="width: 330px"
            v-decorator="['ownerMangerId', { rules: [{ required: true, message: '请输入分公司总经理' }] }]"
            url="/user/userForSelect"
            searchField="realName"
            sTitle="realName"
            :multiple="false"
            placeholder="请输入分公司总经理"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="财务总监">
          <SearchSelect
            style="width: 330px"
            v-decorator="['finaDirectorId', { rules: [{ required: true, message: '请输入财务总监' }] }]"
            url="/user/userForSelect"
            searchField="realName"
            sTitle="realName"
            :multiple="false"
            placeholder="请输入财务总监"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="12">
        <a-form-item label="查新日期">
          <a-date-picker
            style="width: 330px"
            v-decorator="['checkDate', { rules: [{ required: true, message: '请输入查新日期' }] }]"
            placeholder="年-月-日"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="查新机构">
          <CheckInstSelect
            style="width: 330px"
            v-decorator="['checkInstId', { rules: [{ required: true, message: '请输入查新机构' }] }]"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item label="查新项目">
      <vxe-table
        auto-resize
        resizable
        stripe
        keep-source
        row-key
        :max-height="244"
        :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false, showIcon: false }"
        show-overflow="tooltip"
        :data="list"
      >
        <vxe-table-column type="seq" width="60" fixed="left" title="序号" align="center" />
        <vxe-table-column title="项目编号" width="260">
          <template v-slot="{ row, $rowIndex }">
            <a-form-item>
              <a-input
                style="width: 230px"
                v-decorator="[`list[${$rowIndex}].rdTitle`, { rules: [{ required: true, message: '请输入项目编号' }] }]"
                placeholder="请输入项目编号"
              />
            </a-form-item>
          </template>
        </vxe-table-column>
        <vxe-table-column title="项目名称" width="400">
          <template v-slot="{ row, $rowIndex }">
            <a-form-item>
              <a-input
                style="width: 370px"
                v-decorator="[`list[${$rowIndex}].pname`, { rules: [{ required: true, message: '请输入项目名称' }] }]"
                placeholder="请输入项目编号"
              />
            </a-form-item>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="60" align="center">
          <template v-slot="{ row, $rowIndex }">
            <template>
              <a-popconfirm
                title="是否删除该项目记录?"
                :autoAdjustOverflow="false"
                placement="topRight"
                @confirm="delListItem($rowIndex)"
              >
                <a>移除</a>
              </a-popconfirm>
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
      <div class="table_btn">
        <a-button block type="dashed" icon="plus" @click="addListItem">添加</a-button>
        <a-button
          block
          type="dashed"
          icon="plus"
          :disabled="!form.getFieldValue('customerId') || !form.getFieldValue('year')"
          @click="quickAdd"
          >引入</a-button
        >
      </div>
    </a-form-item>

    <a-row>
      <a-col :span="12">
        <a-form-item label="查新单价">
          <a-input-number
            style="width: 330px"
            v-decorator="['unitPrice', { rules: [{ required: true, message: '请输入查新单价' }] }]"
            placeholder="请输入查新单价"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="总价">
          <a-input-number disabled style="width: 330px" v-decorator="['totalAmount']" placeholder="0" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="12">
        <a-form-item label="查新账号">
          <a-input style="width: 330px" v-decorator="['checkUsername']" placeholder="请输入查新账号" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="查新密码">
          <a-input style="width: 330px" v-decorator="['checkPassword']" placeholder="请输入查新密码" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item label="备注">
      <a-textarea style="width: 780px" v-decorator="['remark']" :max-length="200" :rows="3" placeholder="请输入" />
    </a-form-item>
  </a-form>
</template>

<script>
import CompanySelect from '@/components/Selects/CompanySelect.vue'
import YearSelect from '@/components/Selects/YearSelect.vue'
import DeptSelect from '@/components/Selects/DeptSelect.vue'
import SearchSelect from '@/components/Selects/SearchSelect.vue'
import CheckInstSelect from '@/components/Selects/CheckInstSelect.vue'
import _ from 'lodash'

export default {
  name: 'CheckPaymentForm',
  components: { CompanySelect, YearSelect, DeptSelect, SearchSelect, CheckInstSelect },
  data() {
    return {
      form: this.$form.createForm(this),
      list: []
    }
  },
  methods: {
    addListItem() {
      this.list = [...this.list, {}]
    },
    delListItem(i) {
      const list = this.form.getFieldValue('list')
      list.splice(i, 1)
      this.list = list
      this.form.setFieldsValue({
        list: list
      })
    },
    quickAdd() {
      const values = this.form.getFieldsValue(['customerId', 'year'])
      values.customerId = values.customerId.id
      this.$emit('quickAdd', values)
    },
    quickSelect(arr) {
      this.list = _.uniqBy(_.concat(this.list, arr), 'rdTitle')
      this.$nextTick(() => {
        this.form.setFieldsValue({
          list: this.list
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
& /deep/ {
  .ant-form-item {
    display: flex;
    margin-bottom: 8px;
    & /deep/ .ant-form-item-label {
      width: 110px;
    }
  }
}

.table_btn {
  width: 100%;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 16px;
  & button:first-child {
    flex: 7;
  }
  & button:last-child {
    flex: 3;
  }
}
</style>
