<template>
  <div>
    <ProcessLayout ref="ProcessLayout" :processType="processType">
      <template slot="content">
        <CheckPaymentForm ref="CheckPaymentForm" @quickAdd="quickAdd" />
      </template>
    </ProcessLayout>
    <QuickAddCheckDrawer ref="QuickAddCheckDrawer" @select="quickSelect" />
  </div>
</template>

<script>
import ProcessLayout from '@/components/Process/ProcessLayout.vue'
import QuickAddCheckDrawer from './QuickAddCheckDrawer'
import _ from 'lodash'
import moment from 'moment'
import CheckPaymentForm from './auditModules/CheckPaymentForm.vue'

export default {
  components: {
    ProcessLayout,
    QuickAddCheckDrawer,
    CheckPaymentForm
  },
  props: {
    processType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    open() {
      this.$refs.ProcessLayout.open()
    },
    quickAdd(params) {
      this.$refs.QuickAddCheckDrawer.open(params)
    },
    quickSelect(arr) {
      const temp = _.map(arr, (item) => ({
        ..._.pick(item, ['pname', 'rdTitle'])
      }))
      this.$refs.CheckPaymentForm.quickSelect('list', temp)
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
