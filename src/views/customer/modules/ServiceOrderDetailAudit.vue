<template>
  <a-tabs class="tabs" default-active-key="1">
    <a-tab-pane key="1" tab="审核">
      <p>xxxx</p>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  name: 'ServiceOrderDetailAudit'
}
</script>

<style lang="less" scoped>
.tabs /deep/ .ant-tabs-nav-scroll {
  display: flex;
  flex-direction: row-reverse;
}
</style>
