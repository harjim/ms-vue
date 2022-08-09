<template>
  <a-card :bordered="false">
    <a-form layout="inline">
      <a-form-item label="模块名称">
        <a-input allowClear v-model="queryParam.moduleName" placeholder="请输入模块名" style="width:180px" />
      </a-form-item>
      <a-form-item>
        <span class="table-page-search-submitButtons" v-if="control.search">
          <a-button type="primary" @click="search(true)">查询</a-button>
        </span>
      </a-form-item>
    </a-form>
    <ystable
      ref="table"
      queryUrl="/esIndex/getModuleList"
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
          @click="$refs.esIndexModule.add()"
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
      <vxe-table-column title="模块名称" remoteSort field="moduleName" width="220" header-align="center"/>
      <vxe-table-column title="默认图标" align="center" field="iconPath" width="130" header-align="center">
        <template v-slot="{row}"><img :src="row.iconPath" style="width:38px"></template>
      </vxe-table-column>
      <vxe-table-column title="激活图标" align="center" field="activeIconPath" width="130" header-align="center">
        <template v-slot="{row}"><img :src="row.activeIconPath" style="width:38px"></template>
      </vxe-table-column>
      <vxe-table-column title="配图" align="center" field="imagePath" width="150" header-align="center">
        <template v-slot="{row}"><img :src="row.imagePath" width="100px"></template>
      </vxe-table-column>
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
          <a @click="$refs.esIndexModule.edit(row)" v-if="control.edit">编辑</a>
          <template v-if="control.disabled && !row.disabled">
            <a-divider type="vertical" v-if="control.edit" />
            <a-popconfirm title="是否禁用?" @confirm="switchConfigModule(row,true)">
              <a>禁用</a>
            </a-popconfirm>
          </template>
          <template v-if="control.enabled && row.disabled">
            <a-divider type="vertical" v-if="control.edit" />
            <a-popconfirm title="是否启用?" @confirm="switchConfigModule(row,false)">
              <a>启用</a>
            </a-popconfirm>
          </template>
        </template>
      </vxe-table-column>
    </ystable>
    <es-index-module-modal ref="esIndexModule" @ok="search"></es-index-module-modal>
  </a-card>
</template>

<script>
import EsIndexModuleModal from './modules/EsIndexModuleModal'
import ystable from '@/components/Table/ystable'
import Template from '../doc/Template.vue'
export default {
  name: 'ExpertIndexModule',
  components: {
    EsIndexModuleModal,
    ystable,
    Template
  },

  data () {
    return {
      selectRowIds: [],
      control: {
        search: this.$auth('expert:esIndexModule:search'),
        add: this.$auth('expert:esIndexModule:add'),
        delete: this.$auth('expert:esIndexModule:delete'),
        edit: this.$auth('expert:esIndexModule:edit'),
        disabled: this.$auth('expert:esIndexModule:disabled'),
        enabled: this.$auth('expert:esIndexModule:enabled')
      },
      // 查询参数
      queryParam: {},
      spinning: false
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
      this.$http.post('/esIndex/delModule', { ids: this.selectRowIds }).then(res => {
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
    switchConfigModule (row, disabled) {
      this.$http.post('/esIndex/switchConfigModule', { id: row.id, disabled })
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
