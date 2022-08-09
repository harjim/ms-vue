<template>
  <a-modal
    :title="title"
    style="top: 20px;"
    :width="500"
    @cancel="closeModal"
    v-model="visible"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select allowClear placeholder="请选择类型" style="width:100%" v-decorator="['type',{rules:[{required: true,message: '请选择类型'}]}]">
          <a-select-option v-for="(item,index) in typeMap" :key="index">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input placeholder="请输入名称" v-decorator="['label', {rules:[{required: true, message: '请输入名称'}]}]" />
      </a-form-item>
      <a-form-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input-number
          placeholder="请输入数量"
          style="width:100%"
          :precision="0"
          v-decorator="['quantity', {rules:[{required: true, message: '请输入数量'}]}]" />
      </a-form-item>
      <a-form-item label="排序:" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input-number
          placeholder="请输入排序"
          :precision="0"
          :max="$store.state.maxOrder"
          :min="-$store.state.maxOrder"
          style="width:100%"
          v-decorator="['order', {rules:[{required: false, message: '请输入排序'}]}]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'EsIndexDataModal',
  props: {
    typeMap: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      title: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      id: 0,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    add () {
      this.title = '添加配置数据'
      this.visible = true
      this.confirmLoading = false
      this.form.resetFields()
      this.id = undefined
    },
    edit (row) {
      this.title = `编辑[${this.typeMap[row.type]}-${row.label}]`
      this.visible = true
      this.form.resetFields()
      this.id = row.id
      this.$nextTick(() => {
        this.form.setFieldsValue({
          type: row.type,
          label: row.label,
          quantity: row.quantity,
          order: row.order })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (errors) {
          this.confirmLoading = false
          return
        }
        if (this.id) {
          values.id = this.id
          this.$http.post('/esIndex/editConfigData', values).then(res => {
            if (res.success && res.data) {
              this.$emit('ok', false)
              this.$message.success('更新成功')
              this.closeModal()
            } else {
              this.$message.error(res.errorMessage || '编辑失败')
            }
          })
        } else {
          this.$http.post('/esIndex/addConfigData', values).then(res => {
            if (res.success && res.data) {
              this.$emit('ok', true)
              this.$message.success('添加成功')
              this.closeModal()
            } else {
              this.$message.error(res.errorMessage || '添加失败')
            }
          })
        }
      })
    },
    closeModal () {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
