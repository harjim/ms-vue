<template>
  <div>
    <MainTable :control="control" :columns="columns" :items="items" url-prefix="contract" @add="add" />
    <preview-modal ref="previewModal" />
  </div>
</template>

<script>
import PreviewModal from '@/components/PreviewModal'
import MainTable from '@/components/Process/MainTable.vue'

export default {
  name: 'Contract',
  components: { PreviewModal, MainTable },
  data() {
    const processType = [
      { value: 0, label: '业务员' },
      { value: 1, label: '分公司总经理' },
      { value: 2, label: '合同审批' },
      { value: 3, label: '用印审批' }
    ]
    const statusMap = {
      0: '进行中',
      1: '通过',
      2: '驳回',
      4: '提交',
      5: '未提交'
    }
    const projectListCol = [
      { type: 'seq', width: '60', align: 'center' },
      { title: '年份', width: '80', align: 'center', slots: { default: 'years' } },
      { title: '项目类型', field: 'productName', width: '120' },
      {
        title: '收费比例',
        field: 'ratio',
        width: '80',
        align: 'right',
        formatter: ({ cellValue }) => `${cellValue}%`
      },
      { title: '签约次数', field: 'signCnt', width: '80', align: 'right' },
      { title: '备注', field: 'remark', width: '160' }
    ]
    const memberListCol = [
      { type: 'seq', width: '60', align: 'center' },
      { title: '姓名', field: 'userName', width: '120' },
      { title: '所属部门', field: 'deptName', width: '80' },
      {
        title: '贡献比',
        field: 'ratio',
        width: '80',
        align: 'right',
        formatter: ({ cellValue }) => `${cellValue}%`
      },
      { title: '备注', field: 'remark', width: '160' }
    ]
    const columns = [
      { type: 'checkbox', width: '60', align: 'center', fixed: 'left' },
      {
        title: '合同编号',
        field: 'contractNo',
        width: '150',
        fixed: 'left',
        sortable: true,
        slots: { default: 'editEntry' }
      },
      { title: '客户名称', field: 'companyName', width: '160', fixed: 'left', sortable: true },
      { title: '所属部门', field: 'deptName', width: '90' },
      { title: '业务员', field: 'ownerName', width: '80' },
      {
        title: '项目数',
        field: 'projectCnt',
        width: '80',
        align: 'right',
        slots: { default: 'childTable' },
        childProp: 'projectList',
        childCol: projectListCol
      },
      {
        title: '合作人员',
        field: 'partnerCnt',
        width: '80',
        align: 'right',
        slots: { default: 'childTable' },
        childProp: 'projectList',
        childCol: memberListCol
      },
      { title: '技术负责人', field: 'techName', width: '100' },
      { title: '财务负责人', field: 'finaName', width: '100' },
      { title: '节点', field: 'nodeName', width: '100' },
      { title: '流程状态', field: 'status', width: '100', sortable: true, slots: { default: 'status' } },
      { title: '当前处理人', field: 'auditUsers', width: '120', sortable: true },
      { title: '签署日期', field: 'signDate', width: '110', align: 'center' },
      { title: '生效日期', field: 'effectDate', width: '110', align: 'center' },
      { title: '终止日期', field: 'closeDate', width: '110', align: 'center' },
      { title: '创建时间', field: 'createTime', width: '140', align: 'center' }
    ]
    const items = [
      { component: 'Input', field: 'companyName', label: '客户名称', props: { placeholder: '请输入客户名称' } },
      {
        component: 'Select',
        field: 'status',
        label: '流程状态',
        props: {
          placeholder: '请选择流程状态',
          options: Object.keys(statusMap).map((k) => ({ value: +k, label: statusMap[k] })),
          allowClear: true
        }
      },
      {
        component: 'Select',
        field: 'nodeNumber',
        label: '节点',
        props: { placeholder: '请选择节点', options: processType, allowClear: true }
      },
      {
        component: 'DeptSelect',
        field: 'deptId',
        label: '所属部门',
        props: {
          placeholder: '请选择所属部门'
        }
      },
      {
        component: 'SearchSelect',
        field: 'ownerId',
        label: '业务员',
        props: {
          placeholder: '请输入业务员选择',
          url: '/user/userForSelect',
          searchField: 'realName',
          sTitle: 'realName',
          multiple: false
        }
      }
    ]
    return {
      columns,
      items,
      control: {
        search: this.$auth('customer:contract:search'),
        add: this.$auth('customer:contract:add'),
        del: this.$auth('customer:contract:del'),
        edit: this.$auth('customer:contract:edit'),
        check: this.$auth('customer:contract:check')
      }
    }
  },
  methods: {
    preview(filePath, filename) {
      if (filePath === '') {
        this.$message.info('请先上传文件')
        return
      }
      this.$refs.previewModal.show(filePath, filename)
    }
  }
}
</script>
