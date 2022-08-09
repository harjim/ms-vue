<template>
  <a-modal
    :title="`${edit ? '编辑' : '添加'}查新机构`"
    :width="800"
    destroyOnClose
    :maskClosable="false"
    :visible="visible"
    @cancel="close">
    <a-form-model :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
      <a-form-model-item label="机构名称" prop="instName">
        <a-input v-model="form.instName" placeholder="请输入机构名称"/>
      </a-form-model-item>
      <a-divider orientation="left">
        汇款账号信息
      </a-divider>
      <a-form-model-item label="账户名" prop="accountName">
        <a-input v-model="form.accountName" placeholder="请输入账户名"/>
      </a-form-model-item>
      <a-form-model-item label="开户行" prop="accountBank">
        <a-input v-model="form.accountBank" placeholder="请输入开户行"/>
      </a-form-model-item>
      <a-form-model-item label="账号" prop="accountNo">
        <a-input v-model="form.accountNo" placeholder="请输入账号"/>
      </a-form-model-item>
      <a-divider orientation="left">
        收费标准
      </a-divider>
      <a-form-model-item label="快递费">
        <a-input v-model="form.postage" placeholder="请输入快递费"/>
      </a-form-model-item>
      <a-form-model-item label="付款备注">
        <a-input v-model="form.payRemark" placeholder="请输入付款备注"/>
      </a-form-model-item>
      <a-form-model-item label="联系人">
        <a-input v-model="form.linkMan" placeholder="请输入联系人"/>
      </a-form-model-item>
      <a-form-model-item label="联系电话">
        <a-input v-model="form.linkTel" placeholder="请输入联系电话"/>
      </a-form-model-item>
      <a-form-model-item label="附件">
        <a-input v-model="form.linkTel" placeholder="请输入联系电话"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'AddCheckInst',
  data () {
    return {
      visible: false,
      edit: false,
      form: {}
    }
  },
  methods: {
    open (data) {
      if (data) {
        this.form = data
        this.edit = true
      }
      this.edit = false
      this.visible = true
    },
    close () {
      this.visible = false
      this.form = {}
    }
  }
}
</script>

<style scoped>

</style>
