<template>
  <div>
    <a-descriptions :column="2">
      <a-descriptions-item label="申请人">
        {{ detail.ownerName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属部门">
        {{ detail.deptName }}
      </a-descriptions-item>
      <a-descriptions-item label="技术人员">
        {{ detail.techList && detail.techList.map(i => i.userName).join(', ') }}
      </a-descriptions-item>
      <a-descriptions-item label="财务人员">
        {{ detail.finaList && detail.finaList.map(i => i.userName).join(', ') }}
      </a-descriptions-item>
      <a-descriptions-item label="技术经理">
        {{ detail.techManagerName }}
      </a-descriptions-item>
      <a-descriptions-item label="财务经理">
        {{ detail.finaManagerName }}
      </a-descriptions-item>
      <a-descriptions-item label="技术总监">
        {{ detail.techDirectorName }}
      </a-descriptions-item>
      <a-descriptions-item label="财务总监">
        {{ detail.finaDirectorName }}
      </a-descriptions-item>
      <a-descriptions-item label="其他人员">
        {{ detail.otherList && detail.otherList.map(i => i.userName).join(', ') }}
      </a-descriptions-item>
      <a-descriptions-item label="预计起止日期">
        {{ detail.date }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider/>
    <vxe-grid
      resizable
      stripe
      size="small"
      :data="detail.customerList"
      :columns="columns"
      :max-height="200"
    >
    </vxe-grid>
    <a-descriptions style="margin-top: 16px;">
      <a-descriptions-item label="备注">
        {{ detail.remark }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
export default {
  name: 'ServiceOrderDetailCheck',
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const columns = [
      { type: 'seq', title: '序号', width: 60, align: 'center', fixed: 'left' },
      {
        title: '公司',
        field: 'companyName',
        minWidth: 200
      },
      {
        title: '事由',
        field: 'causes'
      }
    ]
    return {
      columns
    }
  }
}
</script>

<style scoped>

</style>
