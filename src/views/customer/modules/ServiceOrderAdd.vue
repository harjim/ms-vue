<template>
  <a-drawer :visible="visible" destroyOnClose title="添加服务申请" :width="960" @close="close">
    <a-form-model ref="form" :model="form" :label-col="{ span: 6 }">
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="申请人" :label-col="{ span: 4 }">
            {{ userInfo.realName }}
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="所属部门">
            {{ deptTitle }}
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item label="技术人员" required :label-col="{ span: 4 }">
            <select-man
              placeholder="请输入技术人员"
              style="width:300px;"
              :type="1"
              keyField="tech"
              @blur="getBoss"
              @change="changeStateUser"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="财务人员" required>
            <select-man
              placeholder="请输入财务人员"
              style="width:300px;"
              :type="2"
              keyField="fina"
              @blur="getBoss"
              @change="changeStateUser"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item label="技术经理" :label-col="{ span: 4 }">
            {{ boss.techManagerName }}
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="财务经理">
            {{ boss.finaManagerName }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="技术总监" :label-col="{ span: 4 }">
            {{ boss.techDirectorName }}
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="财务总监">
            {{ boss.finaDirectorName }}
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item label="其他人员" :label-col="{ span: 4 }">
            <select-man
              placeholder="请输入其他人员"
              style="width:300px;"
              :type="5"
              keyField="other"
              @change="changeStateUser"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="预计起止日期" required>
            <a-range-picker
              style="width:300px;"
              @change="changeRangeDate"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <div style="margin-top: 32px;margin-bottom: 32px;">
        <vxe-grid
          ref="xTable"
          resizable
          stripe
          keep-source
          size="small"
          :data="customerList"
          :max-height="400"
          show-overflow="title"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
          :edit-rules="validRules"
        >
          <vxe-table-column type="seq" width="60" fixed="left" title="序号"/>
          <vxe-table-column
            field="companyName"
            title="公司"
            minWidth="200"
            :edit-render="{ immediate: true }"
          >
            <template v-slot:edit="{ row }">
              <select-company
                style="width: 100%"
                prop="companyName"
                @changeCompany="(data, option) => {
                  row.companyName = data
                  row.customerId = option.key
                }"
              />
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="causes"
            title="事由"
            minWidth="200"
            :edit-render="{ immediate: true }"
          >
            <template v-slot:edit="{ row }">
              <a-textarea
                style="width: 100%;"
                v-model="row.causes"
                :auto-size="{ minRows: 1, maxRows: 5 }"
              />
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" minWidth="60" align="center">
            <template v-slot="{ row, rowIndex }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <a style="margin-right: 10px;" @click="validAllAndSave">保存</a>
                <a-popconfirm
                  title="是否取消添加?"
                  @confirm="cancelRowEvent"
                >
                  <a>取消</a>
                </a-popconfirm>
              </template>
              <template v-else>
                <a-popconfirm
                  title="是否删除该记录?"
                  @confirm="delTableRow(rowIndex)"
                >
                  <a>删除</a>
                </a-popconfirm>
              </template>
            </template>
          </vxe-table-column>
        </vxe-grid>
        <a-button
          :disabled="editCus"
          type="dashed"
          block
          icon="plus"
          style="margin-top: 6px;"
          @click="insertEvent"
        >
          添加
        </a-button>
      </div>

      <a-form-model-item label="备注" :label-col="{ span: 1 }">
        <a-textarea
          style="width: 874px;"
          placeholder="请输入"
          v-model="form.remark"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </a-form-model-item>
    </a-form-model>

    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button
        :style="{ marginRight: '8px' }"
        :disabled="cantSaveForm"
        @click="handleSaveForm('/serviceApply/addServiceApply')"
      >
        暂存
      </a-button>
      <a-popconfir
        title="是否确认提交?"
        placement="left"
        :autoAdjustOverflow="false"
        :disabled="cantSaveForm"
        @confirm="handleSaveForm('/serviceApply/submit')"
      >
        <a-button type="primary" :disabled="cantSaveForm">
          提交
        </a-button>
      </a-popconfir>
    </div>
  </a-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import SelectMan from '@/components/Selects/SelectMan'
import moment from 'moment/moment'
import SelectCompany from '@/components/Selects/SelectCompany'
import { deepTree } from '@/utils/util'

export default {
  name: 'ServiceOrderAdd',
  components: { SelectCompany, SelectMan },
  data () {
    return {
      visible: false,
      editCus: false,
      deptTitle: '-',
      boss: {
        techManagerName: '-',
        techDirectorName: '-',
        finaManagerName: '-',
        finaDirectorName: '-'
      },
      form: {},
      customerList: [],
      validRules: {
        companyName: [{ required: true, message: '公司必须选择', trigger: 'blur' }],
        causes: [{ required: true, message: '事由必须填写', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    cantSaveForm () {
      return this.editCus || this.customerList.length === 0 || ((this.form.techList ? this.form.techList.length === 0 : true) && (this.form.finaList ? this.form.finaList.length === 0 : true)) || !this.form.date
    }
  },
  methods: {
    moment,
    open () {
      this.getDeptTitle()
      this.visible = true
    },
    close () {
      this.form = {}
      this.boss = {}
      this.customerList = []
      this.editCus = false
      this.visible = false
    },
    getDeptTitle () {
      if (this.userInfo.deptIds.length > 0) {
        this.$http.get('/dept/tree').then(({ success, data }) => {
          if (success) {
            this.deptTitle = this.deepTreeTitle(data, this.userInfo.deptIds[0]).title
          }
        })
      }
    },
    deepTreeTitle (data, value) {
      const temp = deepTree(data, value)
      return temp.title || '-'
    },
    changeStateUser (k, v) {
      this.form[`${k}List`] = v.map(item => ({
        userId: item.key,
        userName: item.label
      }))
    },
    getBoss (k, v, t) {
      const params = {
        userIds: v.map(i => i.key),
        userName: '',
        type: t
      }
      this.$http.get('/serviceApply/getMemberList', { params }).then(({ success, data, errorMessage }) => {
        if (success) {
          this.boss[`${k}DirectorId`] = data[`${k}DirectorId`]
          this.boss[`${k}DirectorName`] = data[`${k}DirectorName`]
          this.boss[`${k}ManagerId`] = data[`${k}ManagerId`]
          this.boss[`${k}ManagerName`] = data[`${k}ManagerName`]
        } else {
          this.$message.error(errorMessage)
        }
      })
    },
    changeRangeDate (dates, dateStr) {
      this.form.begin = dateStr[0]
      this.form.end = dateStr[1]
      this.form.date = `${dateStr[0]} - ${dateStr[1]}`
    },
    async insertEvent () {
      this.editCus = true
      const record = {}
      this.customerList.unshift(record)
      await this.$refs.xTable.setActiveRow(record)
    },
    async validAllAndSave () {
      const errMap = await this.$refs.xTable.validate().catch(errMap => errMap)
      if (!errMap) {
        this.editCus = false
        await this.$refs.xTable.clearActived()
      }
    },
    cancelRowEvent () {
      this.$refs.xTable.clearActived().then(() => {
        this.customerList.shift()
        this.editCus = false
      })
    },
    delTableRow (index) {
      this.customerList.splice(index, 1)
    },
    handleSaveForm (url) {
      const params = {
        ...this.boss,
        ...this.form,
        customerList: this.customerList
      }
      this.$http.post(url, params).then(({ success, data, errorMessage }) => {
        if (success) {
          this.$message.success('暂存成功')
          this.close()
          this.$emit('refresh')
        } else {
          this.$message.error(errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
& /deep/ .ant-form-item {
  margin-bottom: 0;
}
</style>
