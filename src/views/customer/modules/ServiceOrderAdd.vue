<template>
  <a-drawer :visible="visible" destroyOnClose title="添加服务申请" :width="960" @close="close">

    <a-form-model ref="form" :model="form" layout="inline">
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="申请人">
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
          <a-form-model-item label="技术人员">
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
          <a-form-model-item label="财务人员">
            <select-man
              placeholder="请输入财务人员"
              style="width:300px;"
              :type="1"
              keyField="fina"
              @blur="getBoss"
              @change="changeStateUser"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item label="技术经理">
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
          <a-form-model-item label="技术总监">
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
          <a-form-model-item label="其他人员">
            <select-man
              placeholder="请输入其他人员"
              style="width:300px;"
              :type="1"
              keyField="other"
              @change="changeStateUser"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="预计起止日期">
            <a-range-picker
              style="width:300px;"
              @change="changeRangeDate"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <vxe-grid
        ref="xTable"
        resizable
        stripe
        keep-source
        size="small"
        :data="customerList"
        :max-height="200"
        :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
        :edit-rules="validRules"
      >
        <vxe-table-column type="seq" width="60" fixed="left"/>
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
              @changeCompany="(data) => changeCompany(data, row)"
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
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" minWidth="60" align="center">
          <template v-slot="{ row, index }">
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
                @confirm="delTableRow(index)"
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
        style="margin-top: 12px;"
        @click="insertEvent"
      >
        添加
      </a-button>

      <a-form-model-item label="备注">
        <a-textarea
          style="width: 910px;"
          placeholder="请输入"
          v-model='form.remark'
          :defaultValue="currentOrder.remark"
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
        :disabled="tableEdit"
      >
        暂存
      </a-button>
      <a-popconfirm
        title="是否确认提交?"
        placement="leftTop"
        :disabled="tableEdit"
      >
        <a-button type="primary" :disabled="tableEdit">
          提交
        </a-button>
      </a-popconfirm>
    </div>
  </a-drawer>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SelectMan from '@/components/Selects/SelectMan'
import moment from 'moment/moment'
import SelectCompany from '@/components/Selects/SelectCompany'

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
        companyName: [{ required: true, message: '公司必须选择' }],
        causes: [{ required: true, message: '事由必须填写' }]
      }
    }
  },
  computed: {
    ...mapState({
      editing: state => state.service.editing,
      tableEdit: state => state.service.tableEdit
    }),
    ...mapGetters(['userInfo'])
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
      this.visible = false
    },
    getDeptTitle () {
      if (this.userInfo.deptIds.length > 0) {
        this.$http.get('/dept/tree').then(({ success, data }) => {
          if (success) {
            this.deptTitle = this.deepTree(data, this.userInfo.deptIds[0])
          }
        })
      }
    },
    deepTree (data, value) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (+item.value === value) return item.title
        if (item.children && item.children.length) {
          const title = this.deepTree(item.children, value)
          if (title) return title
        }
      }
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
      this.form.date = `${dateStr[0]}-${dateStr[1]}`
    },
    async insertEvent () {
      this.editCus = true
      const record = {
        causes: '',
        companyName: ''
      }
      this.customerList.unshift(record)
      await this.$refs.xTable.setActiveRow(record)
    },
    changeCompany (v, r) {
      r.companyName = v
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
    }
  }
}
</script>

<style scoped>

</style>
