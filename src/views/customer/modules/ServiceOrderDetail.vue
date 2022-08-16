<template>
  <a-drawer
    destroyOnClose
    :visible="visible"
    :title="editing ? '编辑服务单' : '服务单详情'"
    :width="960"
    :drawerStyle="{ height: '100vh' }"
    :bodyStyle="{ overflowY: 'hidden' }"
    @close="close"
  >
    <tab-layout>
      <template #up>
        <div style="height: 100%">
          <h2>服务单号:{{ currentOrder.serviceNo }}</h2>
          <ServiceOrderDetailCheck/>
        </div>
      </template>
      <template #down>
        <template
          v-if="$auth('customer:serviceApply:review') || $auth('customer:serviceApply:audit')"
        >
          <ServiceOrderDetailAudit @refresh="$emit('refresh')" storeName="service"/>
        </template>
      </template>
    </tab-layout>

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
        :disabled="!getIsEditStatus"
        v-if="!editing"
        @click="onEdit"
      >
        编辑
      </a-button>
      <a-button
        v-else
        :style="{ marginRight: '8px' }"
        :disabled="tableEdit"
        @click="handleSaveForm('/serviceApply/editServiceApply')"
      >
        暂存
      </a-button>
      <a-popconfirm
        title="是否确认提交?"
        @confirm="handleSaveForm('/serviceApply/submit')"
        placement="topLeft"
        :disabled="!getIsEditStatus || tableEdit"
      >
        <a-button type="primary" :disabled="!getIsEditStatus || tableEdit">
          提交
        </a-button>
      </a-popconfirm>
    </div>
  </a-drawer>
</template>

<script>
import ServiceOrderDetailCheck from '@/views/customer/modules/ServiceOrderDetailCheck'
import ServiceOrderDetailAudit from '@/views/customer/modules/ServiceOrderDetailAudit'
import TabLayout from '@/views/customer/modules/AuditProgress/modules/TabLayout'
import { isEditStatus } from '@/utils/processDoc/auditStatus'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ServiceOrderDetail',
  components: {
    TabLayout,
    ServiceOrderDetailAudit,
    ServiceOrderDetailCheck
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState({
      currentOrder: state => state.service.currentOrder,
      editing: state => state.service.editing,
      tableEdit: state => state.service.tableEdit
    }),
    ...mapGetters('service', ['getIsEditStatus'])
  },
  methods: {
    isEditStatus,
    open () {
      this.visible = true
    },
    close () {
      this.$store.dispatch({
        type: 'service/closeDrawer',
        edit: false
      })
      this.visible = false
    },
    // 进入编辑状态
    onEdit () {
      this.$store.commit('service/TEMPORARILY', true)
    },
    handleSaveForm (url) {
      this.$store.commit('service/TEMPORARILY', false)
      this.$nextTick(() => {
        this.$http.post(url, this.currentOrder).then(({ success, data, errorMessage }) => {
          if (success) {
            this.$message.success('操作成功')
            this.close()
            this.$emit('refresh')
          } else {
            this.$message.error(errorMessage)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
& /deep/ .ant-spin-container {
  height: calc(100vh - 64px);
}

& /deep/ .center_wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);

  .up {
    height: 70%;
    width: 100%;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  & > .midden {
    width: 100%;
    height: 6px;
    background-color: #F0F2F5;
    border-radius: 3px;

    &:hover {
      cursor: n-resize;
      background-color: #d6d6d6;
    }
  }

  .down {
    overflow: auto;
    flex: 1;
    min-height: 300px;

    & /deep/ .ant-tabs-tabpane {
      overflow: auto;
    }
  }
}
</style>
