<template>
  <div>
    <ProcessLayout ref="CheckDrawer" com="DoubleColumn" :processType="processType" :items="items"> </ProcessLayout>
    <QuickAddCheckDrawer ref="QuickAddCheckDrawer" @select="quickSelect" />
  </div>
</template>

<script>
import ProcessLayout from '@/components/Process/ProcessLayout'
import QuickAddCheckDrawer from './QuickAddCheckDrawer'
import _ from 'lodash'

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
        columns: [
          { type: 'seq', title: '序号', width: '60' },
          {
            title: '项目编号',
            field: 'rdTitle',
            width: '270',
            slot: {
              component: 'Input',
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
            field: 'unitPrice',
            label: '总价',
            style: { width: '300px' },
            props: { placeholder: '0' }
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
      this.$refs.QuickAddCheckDrawer.open(values)
    },
    quickSelect(arr) {
      const temp = _.map(arr, (item) => ({
        ..._.pick(item, ['pname', 'rdTitle'])
      }))
      const list = this.$refs.CheckDrawer.$refs.FormData.list.list
      this.$refs.CheckDrawer.$refs.FormData.list = _.uniqBy(_.concat(list, temp), 'rdTitle')
      this.$nextTick(() => {
        this.$refs.CheckDrawer.$refs.FormData.setFieldsValue({
          list: list
        })
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
