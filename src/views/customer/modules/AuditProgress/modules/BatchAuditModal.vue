<!--
 * @Author: ldx
 * @Date: 2021-02-06 10:01:50
 * @LastEditTime: 2021-09-14 18:44:03
 * @LastEditors: zdf
 * @Description: 过程文件批量审核modal
 * @FilePath: \MS-VUE\src\views\customer\modules\AuditProgress\modules\BatchAuditModal.vue
-->
<template>
  <a-modal
    :zIndex="1001"
    :title="title"
    :width="650"
    :visible="isVisible"
    :afterClose="afterClose"
    :maskClosable="false"
    style="top: 0px;"
    :destroyOnClose="true"
    :getContainer="popupContainer"
    :bodyStyle="{ height: '65vh', maxHeight: '65vh', overflow: 'auto' }"
    :footer="null"
    @cancel="isVisible = false"
  >
    <template #footer>
      <a-button
        type="default"
        @click="isVisible = false"
      >取消
      </a-button>
    </template>
    <div
      id="tableBox"
      style="height:calc(100% - 200px);"
    >
      <vxe-grid
        :data="tableData"
        height="auto"
        size="small"
        ref="table"
        highlight-current-row
        highlight-hover-row
        show-overflow="title"
        resizable
        auto-resize
        :columns="columns"
      >
        <template #stageSlot="{row}">
          {{ stageMap[row.currentObj.stage] }}
        </template>
        <template #docAuditSlot="{row}">
          <a-checkbox
            :checked="row.checked"
            :id="`${row.currentObj.id}`"
            @change="(e) => checkboxChange(e,row)"
          >
          </a-checkbox>
        </template>
        <template #backupDataAuditSlot="{row}">
          <a-checkbox
            :checked="row.checked"
            :id="`${row.docFileId}`"
            @change="(e) => checkboxChange(e,row)"
          >
          </a-checkbox>
        </template>
        <template #noveltySearchSlot="{row}">
          <a-checkbox
            :checked="row.checked"
            :id="`${row.docFileIds}`"
            @change="(e) => checkboxChange(e,row)"
          >
          </a-checkbox>
        </template>
        <template #projectAuditSlot="{row}">
          <a-checkbox
            :checked="row.checked"
            :id="`${row.id}`"
            @change="(e) => checkboxChange(e,row)"
          >
          </a-checkbox>
        </template>
        <template #projectName="{row}">
          {{ row.rdTitle }}-{{ row.pname }}
        </template>
      </vxe-grid>
    </div>
    <div
      id="audit_wrap"
      style="height: 200px;"
    >
      <a-form :form="form">
        <a-form-item
          label="审批意见"
          :extra="onComputeTextarea('suggestion',200)"
          style="margin-bottom: 0px;"
        >
          <a-textarea
            v-decorator="['suggestion', {rules:[{required: true, whitespace:true,min: 4, message: '请输入5个字以上审批意见'}]}]"
            placeholder="请输入审批意见"
            :rows="4"
          />
        </a-form-item>
        <a-row>
          <a-col style="text-align: center;">
            <a-popconfirm
              placement="top"
              :disabled="!btnDisabled"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleSubmit(false)"
              :getPopupContainer="getPopupContainer"
            >
              <template slot="title">
                <p>您确定要驳回审核吗?</p>
              </template>
              <a-button
                :disabled="!btnDisabled"
                class="btn-space"
                :class="{reject:btnDisabled }"
                :loading="spinning"
              >驳回
              </a-button>
            </a-popconfirm>
            <a-popconfirm
              :disabled="!btnDisabled"
              placement="top"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleSubmit(true)"
              :getPopupContainer="getPopupContainer"
            >
              <template slot="title">
                <p>您确定要通过审核吗?</p>
              </template>
              <a-button
                :disabled="!btnDisabled"
                class="btn-space"
                :class="{success:btnDisabled }"
                :loading="spinning"
              >通过
              </a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
import { isEditStatus, statusMap } from '@/utils/processDoc/auditStatus'
import { popupContainer } from './js/screenFullMountDom'
import { cloneDeep } from 'lodash'

const stageMap = {
  '100': '规划阶段',
  '200': '研究阶段',
  '300': '设计开发',
  '400': '设计验证',
  '500': '实验验证',
  '600': '试验证',
  '700': '试制',
  '800': '项目验收',
  '900': '项目收尾'
}
const columnObj = {
  docTab: [
    {
      title: '序号',
      type: 'seq',
      headerAlign: 'center',
      align: 'center',
      width: '60'
    },
    {
      title: '阶段',
      headerAlign: 'center',
      align: 'left',
      width: '100',
      slots: { default: 'stageSlot' }
    },
    {
      title: '文档名称',
      field: 'currentObj.docFileName',
      headerAlign: 'center',
      align: 'left'
    },
    {
      title: '是否审核',
      field: 'checked',
      headerAlign: 'center',
      align: 'center',
      width: '80',
      slots: { default: 'docAuditSlot' }
    }
  ],
  noveltySearchTab: [
    {
      title: '序号',
      type: 'seq',
      headerAlign: 'center',
      align: 'center',
      width: '60'
    },
    {
      title: '项目名称',
      headerAlign: 'center',
      align: 'left',
      slots: { default: 'projectName' }
    },
    {
      title: '是否审核',
      field: 'checked',
      headerAlign: 'center',
      align: 'center',
      width: '80',
      slots: { default: 'noveltySearchSlot' }
    }
  ],
  backupTab: [
    {
      title: '序号',
      type: 'seq',
      headerAlign: 'center',
      align: 'center',
      width: '60'
    },
    { title: '文档名称', field: 'docName', headerAlign: 'center', align: 'left' },
    {
      title: '是否审核',
      field: 'checked',
      headerAlign: 'center',
      align: 'center',
      width: '80',
      slots: { default: 'backupDataAuditSlot' }
    }
  ],
  projectTab: [
    {
      title: '序号',
      type: 'seq',
      headerAlign: 'center',
      align: 'center',
      width: '60'
    },
    { title: '项目名称', field: 'pname', headerAlign: 'center', align: 'left' },
    {
      title: '是否审核',
      field: 'checked',
      headerAlign: 'center',
      align: 'center',
      width: '80',
      slots: { default: 'projectAuditSlot' }
    }
  ]
}
export default {
  name: 'BatchAuditModal',
  data () {
    return {
      columnObj,
      columns: columnObj['docTab'],
      statusMap,
      stageMap,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isVisible: false,
      title: '',
      tableData: [],
      docFileIds: [],
      projectIds: [],
      btnDisabled: false,
      spinning: false,
      projectId: undefined,
      commitType: 1 // 提交类型 1： 文档提交 2：查新报告 3:留存备查资料 4:项目名称
    }
  },
  methods: {
    isEditStatus,
    popupContainer,
    getPopupContainer () {
      return popupContainer('tableBox')
    },
    docAutidShow (title, checkedFiles, projectId) {
      this.docFileIds = []
      this.projectId = projectId
      this.title = title
      this.columns = columnObj['docTab']
      this.form.resetFields()
      this.commitType = 1
      this.tableData = cloneDeep(checkedFiles)
      this.tableData.forEach((item) => {
        if (item.checked) {
          this.docFileIds.push(item.currentObj.id)
        }
      })
      this.btnDisabled = this.docFileIds.length
      this.isVisible = true
    },
    noveltSearchShow (title, checkedProjects, projectId) {
      // this.docFileIds = []
      this.projectIds = []
      this.projectId = projectId
      this.title = title
      this.columns = columnObj['noveltySearchTab']
      this.form.resetFields()
      this.commitType = 2
      this.tableData = cloneDeep(checkedProjects)
      this.tableData.forEach((item) => {
        if (item.checked) {
          // this.docFileIds.push(item.docFileId)
          this.projectIds.push(item.projectId)
        }
      })
      this.btnDisabled = this.projectIds.length
      this.isVisible = true
    },
    backupDataShow (title, chooseFiles, projectId) {
      this.docFileIds = []
      this.projectId = projectId
      this.title = title
      this.columns = columnObj['backupTab']
      this.form.resetFields()
      this.commitType = 3
      this.tableData = cloneDeep(chooseFiles)
      this.tableData.forEach((item) => {
        if (item.checked) {
          this.docFileIds.push(item.pdocFileId)
        }
      })
      this.btnDisabled = this.docFileIds.length
      this.isVisible = true
    },
    projectAuditShow (title = '批量审核立项项目', chooseFiles) {
      this.commitType = 4
      this.title = title
      this.columns = columnObj['projectTab']
      this.form.resetFields()
      chooseFiles.forEach(item => {
        this.$set(item, 'checked', true)
        this.projectIds.push(item.id)
      })
      this.tableData = cloneDeep(chooseFiles)
      this.btnDisabled = this.projectIds.length
      this.isVisible = true
    },
    afterClose () {
      this.docFileIds = []
      this.tableData = []
      this.projectIds = []
      this.projectId = undefined
      this.btnDisabled = false
    },
    handleSubmit (status) {
      this.form.validateFields((error, values) => {
        if (!error) {
          let paramObj = {}
          if (this.commitType === 1 || this.commitType === 3) {
            paramObj = {
              pass: status,
              suggestion: values.suggestion,
              docFileIds: this.docFileIds,
              projectId: this.projectId
            }
          }
          if (this.commitType === 2) {
            paramObj = {
              // 查新报告改为文档后,可以不用传docFileIds
              pass: status,
              suggestion: values.suggestion,
              projectIds: this.projectIds
            }
          }
          if (this.commitType === 4) {
            paramObj = {
              // 查新报告改为文档后,可以不用传docFileIds
              pass: status,
              suggestion: values.suggestion,
              projectIds: this.projectIds,
              moduleId: 4
            }
          }
          this.spinning = true
          this.$http.post('/projectProgress/projectAudits', paramObj).then((res) => {
            if (res.data && res.success) {
              this.$message.success('操作成功')
              this.$emit('refresh')
              this.isVisible = false
            } else {
              this.$message.error(res.errorMessage)
            }
          }).catch((error) => {
            this.$message.error(error.message)
          }).finally(() => {
            this.spinning = false
          })
        }
      })
    },
    checkboxChange (e, row) {
      row.checked = e.target.checked
      this.$nextTick(() => {
        this.docFileIds = []
        this.projectIds = []
        this.tableData.forEach((item) => {
          if (item.checked) {
            if (this.commitType === 1) {
              this.docFileIds.push(item.currentObj.id || item.docFileId)
            } else if (this.commitType === 2 || this.commitType === 4) {
              this.projectIds.push(item.projectId || item.id)
            } else if (this.commitType === 3) {
              this.docFileIds.push(item.docFileId)
            }
          }
          // if (item.checked && this.commitType === 1) {
          //   this.docFileIds.push(item.currentObj.id || item.docFileId)
          // }
          // if (item.checked && (this.commitType === 2 || this.commitType === 4)) {
          //   // this.docFileIds.push(item.docFileId)
          //   this.projectIds.push(item.projectId || item.id)
          // }
          // if (item.checked && this.commitType === 3) {
          //   this.docFileIds.push(item.docFileId)
          // }
        })
        if (this.commitType === 1 || this.commitType === 3) {
          this.btnDisabled = this.docFileIds.length
        }
        if (this.commitType === 2 || this.commitType === 4) {
          this.btnDisabled = this.projectIds.length
        }
      })
    },
    // 计算文本域的个数
    onComputeTextarea (fieldName, limitNumber = 200) {
      const content = this.form.getFieldValue(fieldName)
      const contentLenght = content ? content.length : 0
      if (contentLenght > limitNumber) {
        const obj = {}
        obj[fieldName] = { value: content.substring(0, limitNumber) }
        this.form.setFields(obj)
      }
      return `(${contentLenght}/${limitNumber})`
    }
  }
}
</script>
<style
  lang="less"
  scoped
>
#tableBox /deep/ .vxe-table .c--title {
  width: 100% !important;
}

.btn-space {
  margin-right: 12px;
}

.hover(@color:#fff) {
  color: #fff;
  box-shadow: #fff;
  border: 1px solid #fff;
  background-color: @color;
}

#audit_wrap {
  .reject {
    &:hover {
      .hover(red);
    }
  }

  .success {
    &:hover {
      .hover(#1890ff);
    }
  }
}
</style>
