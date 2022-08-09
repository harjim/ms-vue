<template>
  <a-modal
    :title="title"
    style="top: 20px;"
    :width="600"
    v-model="visible"
    @ok="handleSubmit"
    @cancel="closeModal"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
  >
    <a-form @submit="handleSubmit" :form="form">

      <a-form-item label="模块名称:" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-decorator="['moduleName', {rules:[{required: true, message: '请输入模块名称'}]}]" />
      </a-form-item>
      <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea rows="5" v-decorator="['description', {rules:[{required: true, message: '请输入描述'}]}]"></a-textarea>
      </a-form-item>

      <a-form-item label="默认图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <input v-decorator="['iconPath', {rules:[{required: true, message: '请上传默认图标'}]}]" style="display:none;" />
        <a-upload
          name="file"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="actionUrl"
          :beforeUpload="beforeUpload"
          @change="info=>uploadChangeIcon(info,'iconPath')"
          :headers="headers"
        >
          <img
            v-if="iconPath"
            :src="iconPath"
            alt="icon"
            style="max-width:400px;"
            height="56"
          />
          <div v-else>
            <a-icon :type="imgLoad.iconPath ? 'loading' : 'plus'" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="激活图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <input v-decorator="['activeIconPath', {rules:[{required: true, message: '请上传激活图标'}]}]" style="display:none;" />
        <a-upload
          name="file"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="actionUrl"
          :beforeUpload="beforeUpload"
          @change="info=>uploadChangeIcon(info,'activeIconPath')"
          :headers="headers"
        >
          <img
            v-if="activeIconPath"
            :src="activeIconPath"
            alt="activeIcon"
            style="max-width:400px;"
            height="56"
          />
          <div v-else>
            <a-icon :type="imgLoad.activeIconPath ? 'loading' : 'plus'" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="配图" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <input v-decorator="['imagePath', {rules:[{required: true, message: '请上传配图'}]}]" style="display:none;" />
        <a-upload
          name="file"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="actionUrl"
          :beforeUpload="beforeUpload"
          @change="info=>uploadChangeIcon(info,'imagePath')"
          :headers="headers"
        >
          <img
            v-if="imagePath"
            :src="imagePath"
            alt="image"
            style="max-width:400px;"
            height="56"
          />
          <div v-else>
            <a-icon :type="imgLoad.imagePath ? 'loading' : 'plus'" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
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

import { getBaseUrl } from '@/utils/request'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
export default {
  name: 'EsIndexModuleModal',
  data () {
    return {
      actionUrl: getBaseUrl() + '/esIndex/importImages',
      imgLoad: {},
      headers: { 'Access-Token': '' },
      title: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      id: 0,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      activeIconPath: undefined,
      iconPath: undefined,
      imagePath: undefined
    }
  },
  mounted () {
    const token = this.$ls.get(ACCESS_TOKEN)
    this.headers['Access-Token'] = token
  },
  methods: {
    add () {
      this.title = '添加模块'
      this.visible = true
      this.form.resetFields()
      this.id = undefined
    },
    edit (record) {
      this.title = `编辑[${record.moduleName}]`
      this.visible = true
      this.form.resetFields()
      this.id = record.id
      this.$nextTick(() => {
        const data = {
          moduleName: record.moduleName,
          order: record.order,
          description: record.description,
          iconPath: record.iconPath,
          imagePath: record.imagePath,
          activeIconPath: record.activeIconPath }
        this.activeIconPath = record.activeIconPath
        this.iconPath = record.iconPath
        this.imagePath = record.imagePath
        this.form.setFieldsValue(data)
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
        values.iconPath = this.iconPath
        values.imagePath = this.imagePath
        values.activeIconPath = this.activeIconPath
        if (this.id) {
          values.id = this.id
          this.$http.post('/esIndex/editConfigModule', values).then(res => {
            if (res.success && res.data) {
              this.$emit('ok', false)
              this.$message.success('更新成功')
              this.closeModal()
            } else {
              this.$message.error(res.errorMessage || '编辑失败')
            }
          })
        } else {
          this.$http.post('/esIndex/addConfigModule', values).then(res => {
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
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJPG) {
        this.$message.error('请上传jpg或png格式的图片!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 <= 10
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
      return true
    },

    uploadChangeIcon (info, name) {
      if (info.file.status === 'uploading') {
        this.imgLoad[name] = true
      }
      if (info.file.status === 'done') {
        this.imgLoad[name] = false
        this[name] = info.file.response.data.filePath
        const data = {}
        data[name] = info.file.response.data.filePath
        this.form.setFieldsValue(data)
        const { form: { setFieldsValue } } = this
        setFieldsValue({ iconPath: this.iconPath })
      }
      this.updateLogo = true
    },
    closeModal () {
      this.visible = false
      this.confirmLoading = false
      this.activeIconPath = undefined
      this.iconPath = undefined
      this.imagePath = undefined
      this.imgLoad = { iconPath: false, activeIconPath: false, imagePath: false }
    }
  }
}
</script>
