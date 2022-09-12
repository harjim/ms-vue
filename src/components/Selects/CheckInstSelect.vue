<template>
  <a-select
    show-search
    allowClear
    placeholder="请输入查新机构"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    :value="val"
    @search="delayedCheckInstChange"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="checkInst in checkInstList" :key="checkInst.id">
      {{ checkInst.checkInstName }}
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
      checkInstList: [],
      val: this.value
    }
  },
  beforeCreate() {
    const defaultFn = () => () => ({})
    this.delayedCheckInstChange = _.debounce(this.delayedCheckInstChange || defaultFn, 500)
  },
  watch: {
    value(newValue) {
      this.val = newValue
    }
  },
  methods: {
    delayedCheckInstChange(checkInstName) {
      if (!checkInstName) {
        this.checkInstList = []
        return
      }
      this.fetching = true
      this.$http
        .get('checkPayment/getCheckInstList', { params: { checkInstName } })
        .then(({ success, data, errorMessage }) => {
          if (success) {
            this.checkInstList = data
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
