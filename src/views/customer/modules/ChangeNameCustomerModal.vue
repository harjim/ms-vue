<template>
  <a-modal
    :width="600"
    :dialog-style="{ top: '250px' }"
    :visible="visible"
    :title="title"
    @ok="handleSubmit"
    @cancel="visible = false"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item label="公司名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['companyName', {rules: [{ required: true, message: '内容不可为空' }], validateTrigger: ['change', 'blur'], initialValue: companyName}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { Ellipsis, STable } from '@/components'

export default {
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      title: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      companyName: '',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      id: 0
    }
  },
  methods: {
    open (companyName, id) {
      this.title = '变更名称 [' + companyName + ']'
      this.companyName = companyName
      this.confirmLoading = false
      this.visible = true
      this.id = id
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          values.id = this.id
          this.$http.post('/customer/changeName', values)
            .then(res => {
              if (res.success && res.data) {
                this.visible = false
                this.confirmLoading = false
                this.form.resetFields()
                this.$message.success('提交成功')
                this.$emit('refresh', false)
              } else {
                this.$message.error(res.errorMessage)
              }
            }).finally(res => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.ant-form-item-children .ant-calendar-picker {
  width: 100%;
}
</style>
