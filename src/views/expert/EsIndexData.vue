<template>
  <a-card :bordered="false">
    <a-spin tip="请稍后..." :spinning="spinning">
      <a-form layout="inline">
        <a-form-item label="名称">
          <a-input v-model="queryParam.label" placeholder="请输入名称" style="width:180px" />
        </a-form-item>
        <a-form-item label="类型">
          <a-select allowClear placeholder="请选择类型" style="width:180px" v-model="queryParam.type">
            <a-select-option v-for="(item,index) in typeMap" :key="index">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <span class="table-page-search-submitButtons" v-if="control.search">
            <a-button type="primary" @click="search(true)">查询</a-button>
          </span>
        </a-form-item>
      </a-form>
      <ystable
        ref="table"
        queryUrl="/esIndex/getDataList"
        :params="queryParam"
        highlight-current-row
        highlight-hover-row
        show-overflow
        resizable
        @completed="()=>selectRowIds=[]"
        @checkbox-all="selectCheckBoxChange"
        @checkbox-change="selectCheckBoxChange"
        auto-resize
        :toolbar="{ refresh:true, zoom: true, custom: true, slots: { buttons: 'toolbar_buttons' } }"
      >
        <template v-slot:toolbar_buttons>
          <a-button
            style="margin-right:10px;"
            type="primary"
            @click="$refs.esIndexData.add()"
            v-if="control.add">添加</a-button>
          <a-button
            style="margin-right:10px;"
            type="primary"
            @click="deleteData"
            :disabled="selectRowIds.length === 0"
            v-if="control.delete">删除</a-button>
        </template>
        <vxe-table-column type="checkbox" width="50" header-align="center" align="center"/>
        <vxe-table-column title="序号" type="seq" width="60" header-align="center" align="right"/>
        <vxe-table-column title="类型" remoteSort field="type" width="180" header-align="center">
          <template v-slot="{row}">
            {{ typeMap[row.type] }}
          </template>
        </vxe-table-column>
        <vxe-table-column title="名称" remoteSort field="label" width="220" header-align="center"/>
        <vxe-table-column
          title="数量"
          remoteSort
          field="quantity"
          width="160"
          header-align="center"
          align="right"/>
        <vxe-table-column
          title="排序"
          remoteSort
          field="`order`"
          width="130"
          header-align="center"
          align="right">
          <template v-slot="{row}">{{ row.order }}</template>
        </vxe-table-column>
        <vxe-table-column
          remoteSort
          title="状态"
          field="disabled"
          width="110"
          header-align="center"
          align="center">
          <template v-slot="{row}">
            {{ row.disabled ? '禁用' : '启用' }}
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="120" header-align="center" align="center">
          <template v-slot="{row}">
            <a @click="$refs.esIndexData.edit(row)" v-if="control.edit">编辑</a>
            <template v-if="control.disabled && !row.disabled">
              <a-divider type="vertical" v-if="control.edit" />
              <a-popconfirm title="是否禁用?" @confirm="switchConfigData(row,true)">
                <a>禁用</a>
              </a-popconfirm>
            </template>
            <template v-if="control.enabled && row.disabled">
              <a-divider type="vertical" v-if="control.edit" />
              <a-popconfirm title="是否启用?" @confirm="switchConfigData(row,false)">
                <a>启用</a>
              </a-popconfirm>
            </template>
          </template>
        </vxe-table-column>
      </ystable>
    </a-spin>
    <es-index-data-modal ref="esIndexData" @ok="search" :typeMap="typeMap"></es-index-data-modal>
  </a-card>
</template>

<script>
import EsIndexDataModal from './modules/EsIndexDataModal'
import ystable from '@/components/Table/ystable'
const typeMap = ['企业', '人才资源库', '成果转化', '项目类型']
export default {
  name: 'ExpertIndexData',
  components: {
    EsIndexDataModal,
    ystable
  },
  data () {
    return {
      spinning: false,
      typeMap,
      selectRowIds: [],
      // 查询参数
      queryParam: {},
      control: {
        search: this.$auth('expert:esIndexData:search'),
        add: this.$auth('expert:esIndexData:add'),
        delete: this.$auth('expert:esIndexData:delete'),
        edit: this.$auth('expert:esIndexData:edit'),
        disabled: this.$auth('expert:esIndexData:disabled'),
        enabled: this.$auth('expert:esIndexData:enabled')
      }
    }
  },
  methods: {
    search (refresh) {
      this.$refs.table.refresh(refresh)
    },
    deleteData () {
      const self = this
      this.$confirm({
        title: `您确定要删除选中的记录吗?`,
        onOk () {
          self.handleDel()
        },
        onCancel () {
        }
      })
    },
    handleDel () {
      this.spinning = true
      this.$http.post('/esIndex/delData', { ids: this.selectRowIds }).then(res => {
        if (res.success && res.data) {
          this.$message.success('删除成功')
          this.search()
        } else {
          this.$$message.error(res.errorMessage || '删除失败')
        }
      }).finally(() => {
        this.spinning = false
      })
    },
    switchConfigData (row, disabled) {
      this.$http.post('/esIndex/switchConfigData', { id: row.id, disabled })
        .then(res => {
          if (res.success && res.data) {
            row.disabled = disabled
            this.$message.success('操作成功')
          } else {
            this.$message.info(res.errorMessage || '操作失败')
          }
        })
    },
    selectCheckBoxChange ({ checked, records }) {
      this.selectRowIds = records.map(a => a.id)
    }
  }
}
</script>
