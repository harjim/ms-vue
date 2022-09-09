<template>
  <ProcessLayout ref="CheckDrawer" com="DoubleColumn">
    <span>sss</span>
    <template slot="node">
      <span>sdkjflasdkjflaksjdflkj</span>
    </template>
    <template slot="content">
      <span>sdkjflasdkjflaksjdflkj</span>
    </template>
  </ProcessLayout>
</template>

<script>
import ProcessLayout from '@/components/Process/ProcessLayout'

export default {
  components: {
    ProcessLayout
  },
  methods: {
    open() {
      this.$refs.CheckDrawer.open()
    }
  }
}
</script>

<style lang="less" scoped></style>
