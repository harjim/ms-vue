<template>
  <a-select
    show-search
    allowClear
    placeholder="请输入客户名称"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    :value="val"
    @search="delayedCompanyNameChange"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="customer in customerList" :key="customer.id">
      {{ customer.title }}
    </a-select-option>
  </a-select>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'CompanySelect',
  props: {
    value: Number
  },
  data() {
    return {
      fetching: false,
      customerList: [],
      val: this.value
    }
  },
  beforeCreate() {
    const defaultFn = () => () => ({})
    this.delayedCompanyNameChange = _.debounce(this.delayedCompanyNameChange || defaultFn, 500)
  },
  watch: {
    value(newValue) {
      this.val = newValue
    }
  },
  methods: {
    delayedCompanyNameChange(customerName) {
      if (!customerName) {
        this.customerList = []
        return
      }
      this.fetching = true
      this.$http
        .get('customer/getCustomerSelect', { params: { customerName } })
        .then(({ success, data, errorMessage }) => {
          if (success) {
            this.customerList = data
          } else {
            this.$message.error(errorMessage)
          }
        })
        .finally(() => {
          this.fetching = false
        })
    },
    handleChange(v) {
      console.log(v)
      this.$emit('change', v)
    }
  }
}
</script>
