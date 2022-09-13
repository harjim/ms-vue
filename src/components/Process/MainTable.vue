<template>
  <a-card :border="false">
    <template v-if="control.search">
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item v-for="item in items" :key="item.field" :label="item.label">
          <component :is="item.component" v-decorator="[item.field]" style="width: 240px" v-bind="item.props" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" htmlType="submit">查询</a-button>
        </a-form-item>
      </a-form>
      <ystable
        ref="xTable"
        :params="getParams()"
        :queryUrl="`${urlPrefix}/getList`"
        :toolbar="{ refresh: true, zoom: true, custom: true }"
        showOverflow="tooltip"
        :columns="columns"
        @checkbox-all="handleSelected"
        @checkbox-change="handleSelected"
      >
        <template v-slot:buttons>
          <a-button v-if="control.add" style="margin-right: 16px" type="primary" @click="$emit('add')">添加</a-button>
          <a-button
            v-if="control.del"
            style="margin-right: 16px"
            type="primary"
            :disabled="selectedRowKeys.length === 0"
            @click="handleDel"
          >
            删除
          </a-button>
        </template>

        <template #editEntry="{ column, row }">
          <a v-if="control.edit || control.check">{{ row[column.property] }}</a>
          <span v-else>{{ row[column.property] }}</span>
        </template>

        <template #childTable="{ column, row, $columnIndex }">
          <span v-if="!row[column.property]">-</span>
          <a-popover v-else :autoAdjustOverflow="false" placement="bottom" trigger="click">
            <a>{{ row[column.property] }}</a>
            <template slot="content">
              <vxe-grid
                border
                resizable
                highlight-hover-row
                auto-resize
                max-height="244"
                :data="row[columns[$columnIndex].childProp]"
                :columns="columns[$columnIndex].childCol"
              />
            </template>
          </a-popover>
        </template>

        <template #status="{ row }">
          <a-badge :color="statusColor[row.status || 5]" :text="getStatusName(row.status)" />
        </template>
      </ystable>
    </template>
    <a-empty v-else :description="false" />
  </a-card>
</template>

<script>
import ystable from '@/components/Table/ystable'
import { SearchSelect, YearSelect, DeptSelect } from '../Selects/index'
import { Input, Select } from 'ant-design-vue'
import { getStatusName, statusColor } from '@/utils/processDoc/auditStatus'
import _ from 'lodash'

export default {
  name: 'MainTable',
  components: {
    ystable,
    Input,
    Select,
    SearchSelect,
    YearSelect,
    DeptSelect
  },
  props: {
    urlPrefix: {
      type: String,
      default: ''
    },
    control: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    wrapperParams: {
      type: Function,
      default: () => () => {}
    }
  },
  data() {
    return {
      statusColor,
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      params: {}
    }
  },
  methods: {
    getStatusName,
    refresh(flag = false) {
      this.$refs.xTable.refresh(flag)
    },
    handleSelected({ records }) {
      this.selectedRowKeys = _.map(records, (item) => item.id)
    },
    handleDel() {
      this.$http
        .post(`${this.urlPrefix}/del${_.upperFirst(this.urlPrefix)}`, { ids: this.selectedRowKeys })
        .then(({ success, errorMessage }) => {
          if (success) {
            this.$message.success('操作成功')
            this.refresh(true)
          } else {
            this.$message.error(errorMessage)
          }
        })
    },
    getParams() {
      const values = this.form.getFieldsValue()
      return this.wrapperParams(values)
    },
    handleSubmit(e) {
      e.preventDefault()
      this.refresh(true)
    }
  }
}
</script>
