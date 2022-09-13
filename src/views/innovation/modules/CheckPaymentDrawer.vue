<template>
  <div>
    <ProcessLayout
      ref="CheckDrawer"
      com="DoubleColumn"
      url-prefix="checkPayment"
      :processType="processType"
      :items="items"
      :wrapperParams="wrapperParams"
      :wrapperForm="wrapperForm"
      :formValuesChange="formValuesChange"
      @refresh="(flag) => $emit('refresh', flag)"
    />
    <QuickAddCheckDrawer ref="QuickAddCheckDrawer" @select="quickSelect" />
  </div>
</template>

<script>
import ProcessLayout from '@/components/Process/ProcessLayout'
import QuickAddCheckDrawer from './QuickAddCheckDrawer'
import _ from 'lodash'
import moment from 'moment'

export default {
  components: {
    ProcessLayout,
    QuickAddCheckDrawer
  },
  props: {
    processType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const items = [
      {
        component: 'Row',
        children: [
          {
            component: 'CompanySelect',
            field: 'customerId',
            eField: 'companyName',
            label: '客户名称',
            rules: [{ required: true, message: '请输入客户名称' }],
            style: { width: '300px' }
          },
          {
            component: 'YearSelect',
            field: 'year',
            label: '年份',
            rules: [{ required: true, message: '请选择项目年份' }],
            style: { width: '300px' },
            props: { placeholder: '请选择项目年份' }
          }
        ]
      },
      {
        component: 'Row',
        children: [
          {
            component: 'SearchSelect',
            field: 'ownerId',
            eField: 'ownerName',
            label: '业务员',
            rules: [{ required: true, message: '请输入业务员选择' }],
            style: { width: '300px' },
            props: {
              placeholder: '请输入业务员选择',
              url: '/user/userForSelect',
              searchField: 'realName',
              sTitle: 'realName',
              multiple: false
            }
          },
          {
            component: 'DeptSelect',
            field: 'deptId',
            eField: 'deptName',
            label: '所属部门',
            rules: [{ required: true, message: '请选择所属部门' }],
            style: { width: '300px' },
            props: {
              placeholder: '请选择所属部门'
            }
          }
        ]
      },
      {
        component: 'Row',
        children: [
          {
            component: 'SearchSelect',
            field: 'techId',
            eField: 'techName',
            label: '技术人员',
            rules: [{ required: true, message: '请输入技术人员选择' }],
            style: { width: '300px' },
            props: {
              placeholder: '请输入技术人员选择',
              url: '/user/userForSelect',
              searchField: 'realName',
              sTitle: 'realName',
              multiple: false
            }
          },
          {
            component: 'SearchSelect',
            field: 'finaManagerId',
            eField: 'finaManagerName',
            label: '财务经理',
            rules: [{ required: true, message: '请输入财务经理选择' }],
            style: { width: '300px' },
            props: {
              placeholder: '请输入财务经理选择',
              url: '/user/userForSelect',
              searchField: 'realName',
              sTitle: 'realName',
              multiple: false
            }
          }
        ]
      },
      {
        component: 'Row',
        children: [
          {
            component: 'SearchSelect',
            field: 'ownerMangerId',
            eField: 'ownerMangerName',
            label: '分公司总经理',
            rules: [{ required: true, message: '请输入分公司总经理选择' }],
            style: { width: '300px' },
            props: {
              placeholder: '请输入分公司总经理选择',
              url: '/user/userForSelect',
              searchField: 'realName',
              sTitle: 'realName',
              multiple: false
            }
          },
          {
            component: 'SearchSelect',
            field: 'finaDirectorId',
            eField: 'finaDirectorName',
            label: '财务总监',
            rules: [{ required: true, message: '请输入财务总监选择' }],
            style: { width: '300px' },
            props: {
              placeholder: '请输入财务总监选择',
              url: '/user/userForSelect',
              searchField: 'realName',
              sTitle: 'realName',
              multiple: false
            }
          }
        ]
      },
      {
        component: 'Row',
        children: [
          {
            component: 'DatePicker',
            field: 'checkDate',
            label: '查新日期',
            style: { width: '300px' },
            rules: [{ required: true, message: '请输入查新日期' }],
            props: { placeholder: '年-月-日' }
          },
          {
            component: 'CheckInstSelect',
            field: 'checkInstId',
            eField: 'checkInstName',
            label: '查新机构',
            rules: [{ required: true, message: '请输入查新机构' }],
            style: { width: '300px' }
          }
        ]
      },
      {
        component: 'List',
        label: '查新项目',
        field: 'list',
        required: true,
        columns: [
          { type: 'seq', title: '序号', width: '60' },
          {
            title: '项目编号',
            field: 'rdTitle',
            width: '270',
            slot: {
              component: 'Input',
              field: 'rdTitle',
              rules: [{ required: true, message: '请输入项目编号' }],
              style: { width: '240px' }
            }
          },
          {
            title: '项目名称',
            field: 'pname',
            width: '400',
            slot: {
              component: 'Input',
              field: 'pname',
              rules: [{ required: true, message: '请输入项目名称' }],
              style: { width: '370px' }
            }
          },
          { type: 'operate', title: '操作' }
        ],
        btns: [{ type: 'add' }, { type: 'quickSelect', click: this.openQuick }]
      },
      {
        component: 'Row',
        children: [
          {
            component: 'InputNumber',
            field: 'unitPrice',
            label: '查新单价',
            style: { width: '300px' },
            rules: [{ required: true, message: '请输入查新单价' }],
            props: { placeholder: '请输入查新单价' }
          },
          {
            component: 'InputNumber',
            field: 'totalAmount',
            label: '总价',
            style: { width: '300px' },
            props: { placeholder: '0', disabled: true }
          }
        ]
      },
      {
        component: 'Row',
        children: [
          {
            component: 'Input',
            field: 'checkUsername',
            label: '查新账号',
            style: { width: '300px' },
            rules: [{ required: true, message: '请输入查新账号' }],
            props: { placeholder: '请输入查新账号' }
          },
          {
            component: 'Input',
            field: 'checkPassword',
            label: '查新密码',
            style: { width: '300px' },
            rules: [{ required: true, message: '请输入查新密码' }],
            props: { placeholder: '请输入查新密码' }
          }
        ]
      },
      {
        component: 'TextArea',
        field: 'remark',
        label: '备注',
        style: { width: '810px' },
        props: { placeholder: '请输入', rows: 3, maxLength: 200 }
      }
    ]
    return {
      items
    }
  },
  methods: {
    open() {
      this.$refs.CheckDrawer.open(this.processType)
    },
    openQuick() {
      const values = this.$refs.CheckDrawer.$refs.FormData.getFieldsValue(['customerId', 'year'])
      this.$refs.QuickAddCheckDrawer.open({ ...values, customerId: values.customerId.id })
    },
    quickSelect(arr) {
      const temp = _.map(arr, (item) => ({
        ..._.pick(item, ['pname', 'rdTitle'])
      }))
      this.$refs.CheckDrawer.quickAdd('list', temp)
    },
    wrapperParams(v) {
      return {
        ..._.pick(v, ['id', 'deptId', 'remark', 'unitPrice', 'year', 'checkUsername', 'checkPassword']),
        customerId: v.customerId.id,
        checkInstId: v.checkInstId.id,
        checkDate: v.checkDate.format('YYYY-MM-DD'),
        finaDirectorId: v.finaDirectorId.id,
        finaManagerId: v.finaManagerId.id,
        techId: v.techId.id,
        ownerId: v.ownerId.id,
        ownerMangerId: v.ownerMangerId.id,
        list: _.map(v.list, (item) => ({ ..._.pick(item, ['rdTitle', 'pname', 'id']) }))
      }
    },
    wrapperForm(v) {
      const form = {
        ..._.pick(v, ['id', 'deptId', 'remark', 'unitPrice', 'totalAmount', 'year', 'checkUsername', 'checkPassword']),
        customerId: { id: v.customerId, title: v.companyName },
        checkInstId: { id: v.checkInstId, checkInstName: v.checkInstName },
        checkDate: moment(v.checkDate),
        finaDirectorId: { id: v.finaDirectorId, realName: v.finaDirectorName },
        finaManagerId: { id: v.finaManagerId, realName: v.finaManagerName },
        techId: { id: v.techId, realName: v.techName },
        ownerId: { id: v.ownerId, realName: v.ownerName },
        ownerMangerId: { id: v.ownerMangerId, realName: v.ownerMangerName },
        list: _.map(v.list, (item) => ({ ..._.pick(item, ['rdTitle', 'pname', 'id']) }))
      }
      const list = {
        list: form.list
      }
      return {
        form,
        list
      }
    },
    edit(id) {
      this.$refs.CheckDrawer.edit(id)
    },
    formValuesChange(props, values) {
      console.log(props, values)
    }
  }
}
</script>

<style lang="less" scoped></style>
