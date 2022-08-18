<template>
  <a-select
    mode="multiple"
    label-in-value
    :value="value"
    :placeholder="placeholder"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    @search="fetchUser"
    @change="handleChange"
    @blur="$emit('blur', keyField, value, type)"
  >
    <a-spin v-if="fetching" slot="notFoundContent" :delay="300"/>
    <a-select-option v-for="item in dataSource" :key="item.userId">{{ item.userName }}</a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'SelectMan',
  props: {
    type: {
      type: Number,
      required: true
    },
    keyField: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      default: () => ([])
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data () {
    this.fetchUser = this.debounce(this.fetchUser)
    return {
      value: [],
      dataSource: [],
      fetching: false
    }
  },
  mounted () {
    this.value = this.list ? this.list.map(item => ({
      key: item.userId,
      label: item.userName
    })) : []
  },
  methods: {
    debounce (fn, delay = 800) {
      let timer = null
      return function () {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          fn.apply(this, arguments)
        }, delay)
      }
    },
    fetchUser (v) {
      this.dataSource = []
      if (!v) return
      const params = {
        userIds: this.value.map(i => i.key),
        userName: v,
        type: this.type
      }
      this.fetching = true
      this.$http.get('/serviceApply/getMemberList', { params }).then(({
        success,
        data,
        errorMessage
      }) => {
        if (success) {
          this.dataSource = data[`${this.keyField}List`]
        } else {
          this.$message.error(errorMessage)
        }
      }).finally(() => {
        this.fetching = false
      })
    },
    handleChange (value) {
      Object.assign(this, {
        value,
        data: [],
        fetching: false
      })
      this.$emit('change', this.keyField, value)
      this.dataSource = []
    }
  }
}
</script>

<style scoped>

</style>
