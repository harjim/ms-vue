<template>
  <div>
    <MainTableLayout
      ref="MainTableLayout"
      :control="control"
      :columns="columns"
      :items="items"
      url-prefix="checkPayment"
      @add="add"
      @edit="edit"
    />
    <CheckPaymentDrawer ref="CheckPaymentDrawer" :processType="processType" @refresh="refresh" />
    <preview-modal ref="previewModal" />
  </div>
</template>

<script>
import PreviewModal from '@/components/PreviewModal/PreviewModal.vue'
import MainTableLayout from '@/components/Process/MainTableLayout'
import CheckPaymentDrawer from './modules/CheckPaymentDrawer.vue'

export default {
  name: 'CheckPayment',
  components: {
    PreviewModal,
    MainTableLayout,
    CheckPaymentDrawer
  },
  data() {
    const processType = [
      { value: 0, label: '业务员' },
      { value: 1, label: '分公司总经理' },
      { value: 2, label: '财务经理' },
      { value: 3, label: '财务总监' },
      { value: 4, label: '出纳支付' }
    ]
    const statusMap = {
      0: '进行中',
      1: '通过',
      2: '驳回',
      4: '提交',
      5: '未提交'
    }
    const columns = [
      { type: 'checkbox', width: '60', align: 'center', fixed: 'left' },
      { title: '年份', field: 'year', width: '100', align: 'center', fixed: 'left', sortable: true },
      {
        title: '客户名称',
        field: 'companyName',
        width: '160',
        fixed: 'left',
        slots: { default: 'editEntry' }
      },
      { title: '所属部门', field: 'deptName', width: '100', sortable: true },
      { title: '业务员', field: 'ownerName', width: '100', sortable: true },
      {
        title: '查新数量',
        field: 'rdCnt',
        width: '80',
        slots: { default: 'childTable' },
        childProp: 'list',
        childCol: [
          { title: '序号', type: 'seq', width: '60' },
          { title: '项目编号', field: 'rdTitle', width: '160' },
          { title: '项目名称', field: 'pname', width: '240' }
        ]
      },
      { title: '技术人员', field: 'techName', width: '100', sortable: true },
      { title: '分公司总经理', field: 'ownerMangerName', width: '140', sortable: true },
      { title: '财务经理', field: 'finaManagerName', width: '100', sortable: true },
      { title: '财务总监', field: 'finaDirectorName', width: '100', sortable: true },
      { title: '节点', field: 'nodeName', width: '100' },
      { title: '流程状态', field: 'status', width: '100', slots: { default: 'status' } },
      { title: '创建人', field: 'creatorName', width: '100' },
      { title: '当前处理人', field: 'auditUsers', width: '100' },
      { title: '创建时间', field: 'createTime', width: '160', align: 'center' },
      { title: '最后修改时间', field: 'lastUpdateTime', width: '160', align: 'center' }
    ]
    const items = [
      { component: 'Input', field: 'companyName', label: '客户名称', props: { placeholder: '请输入客户名称' } },
      { component: 'YearSelect', field: 'year', label: '年份', props: { placeholder: '请选择项目年份' } },
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
      },
      { component: 'Input', field: 'auditUsers', label: '当前处理人', props: { placeholder: '请输入当前处理人' } },
      {
        component: 'Select',
        field: 'nodeNumber',
        label: '节点',
        props: { placeholder: '请选择节点', options: processType, allowClear: true }
      },
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
        component: 'SearchSelect',
        field: 'techId',
        label: '技术人员',
        props: {
          placeholder: '请输入技术人员',
          url: '/user/userForSelect',
          searchField: 'realName',
          sTitle: 'realName',
          multiple: false
        }
      },
      {
        component: 'SearchSelect',
        field: 'finaManagerId',
        label: '财务经理',
        props: {
          placeholder: '请输入财务经理',
          url: '/user/userForSelect',
          searchField: 'realName',
          sTitle: 'realName',
          multiple: false
        }
      }
    ]
    return {
      items,
      columns,
      processType,
      control: {
        search: this.$auth('innovation:checkPayment:search'),
        add: this.$auth('innovation:checkPayment:add'),
        del: this.$auth('innovation:checkPayment:del'),
        edit: this.$auth('innovation:checkPayment:edit'),
        check: this.$auth('innovation:checkPayment:check')
      }
    }
  },
  methods: {
    preview(filePath, filename) {
      if (filePath === '') {
        this.$message.info('请先上传文件')
        return
      }
      this.$refs.PreviewModal.show(filePath, filename)
    },
    add() {
      this.$refs.CheckPaymentDrawer.open()
    },
    refresh(flag) {
      this.$refs.MainTableLayout.refresh(flag)
    },
    edit(id) {
      this.$refs.CheckPaymentDrawer.edit(id)
    }
  }
}
</script>
