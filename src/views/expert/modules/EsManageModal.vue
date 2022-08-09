<template>
  <a-modal
    :width="800"
    :visible="visible"
    :title="title"
    :maskClosable="false"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    @cancel="visible = false"
  >
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              disabled
              v-decorator="['username', {rules:[{required: true, message: '请输入用户名'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="真实姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['realname', {rules:[{required: true, message: '请输入真实姓名'}]}]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['mobile', {rules:[{required: true, message: '请输入联系电话'}]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
            <a-radio-group v-decorator="['gender']">
              <a-radio value="1">男</a-radio>
              <a-radio value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="出生日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker placeholder="请选择出生日期" v-decorator="['birthday']" format="YYYY-MM-DD"></a-date-picker>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="email" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              v-decorator="['email', {rules:[{required: true, message: '请输入email'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="证件类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select allowClear showSearch v-decorator="['idType', {rules:[{required: true, message: '请选择证件类型'}]}]" >
              <a-select-option value="0">身份证</a-select-option>
              <a-select-option value="1">护照</a-select-option>
              <a-select-option value="2">港澳通行证</a-select-option>
            </a-select></a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="证件号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['idNo', {rules:[{required: true, message: '请输入证件号码'}]}]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="备注">
            <a-textarea v-decorator="['remark']" :rows="4"></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      title: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      id: 0,
      deptTree: [],
      visible: false,
      resultParam: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      oldDeptId: []
    }
  },
  methods: {
    moment,
    edit (record, deptTree) {
      this.title = '修改用户[' + record.username + ']'
      this.form.resetFields()
      this.visible = true
      this.id = record.id
      this.deptTree = deptTree
      this.oldDeptId = record.deptIdArr
      record.birthday = record.birthday ? moment(record.birthday) : undefined
      this.$nextTick(() => {
        if (record.mtypes) {
          record.mtypesArr = record.mtypes.split(',')
        }
        this.$initForm(this.form, record)
      })
    },
    handleSubmit () {
      this.confirmLoading = true
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          if (values.id || values.id > 0) {
            this.$http.post('/esManage/updateUser', values)
              .then(res => {
                if (res.success && res.data) {
                  this.visible = false
                  this.$message.success('更新成功')
                  this.$emit('ok', false)
                } else {
                  this.$message.error(res.errorMessage)
                }
              }).finally(res => {
                this.confirmLoading = false
              })
          }
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
