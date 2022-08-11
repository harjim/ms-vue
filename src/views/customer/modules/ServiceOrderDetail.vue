<template>
  <a-drawer
    :visible="visible"
    title="服务单详情"
    :width="960"
    :drawerStyle="{ height: '100vh', overflowY: 'hidden' }"
    :bodyStyle="{ height: '100%', overflowY: 'hidden', display: 'flex', flexDirection: 'column' }"
  >
    <div style="flex: 6;overflow-y: auto;">
      <h2>服务单号:{{ detail.serviceNo }}</h2>
      <ServiceOrderDetailCheck :detail="detail"/>
    </div>
    <div style="flex: 4;height: 100%;">
      <ServiceOrderDetailAudit/>
    </div>
  </a-drawer>
</template>

<script>
import ServiceOrderDetailCheck from '@/views/customer/modules/ServiceOrderDetailCheck'
import ServiceOrderDetailAudit from '@/views/customer/modules/ServiceOrderDetailAudit'

export default {
  name: 'ServiceOrderDetail',
  components: { ServiceOrderDetailAudit, ServiceOrderDetailCheck },
  data () {
    return {
      visible: false,
      detail: {}
    }
  },
  methods: {
    open (data) {
      this.detail = data
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
