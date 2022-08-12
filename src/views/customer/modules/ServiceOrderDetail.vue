<template>
  <a-drawer
    :visible="visible"
    title="服务单详情"
    :width="960"
    :drawerStyle="{ height: '100%' }"
    :bodyStyle="{ overflowY: 'hidden' }"
    @close="close"
  >
    <div id="box">
      <tab-layout>
        <template #up>
          <div style="height: 100%">
            <h2>服务单号:{{ detail.serviceNo }}</h2>
            <ServiceOrderDetailCheck :is-check="isCheck" />
          </div>
        </template>
        <template #down>
          <template
            v-if="
              $auth('customer:serviceApply:review') ||
              $auth('customer:serviceApply:audit')
            "
          >
            <ServiceOrderDetailAudit :instance-id="detail.instanceId" />
          </template>
        </template>
      </tab-layout>
    </div>
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
        :disabled="!isEditStatus(detail.status)"
        v-if="!editing"
        @click="onEdit"
      >
        编辑
      </a-button>
      <a-button
        v-else
        :style="{ marginRight: '8px' }"
        :disabled="!isEditStatus(detail.status)"
        @click="temporarilySave"
      >
        暂存
      </a-button>
      <a-button type="primary" :disabled="!isEditStatus(detail.status)">
        提交
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import ServiceOrderDetailCheck from '@/views/customer/modules/ServiceOrderDetailCheck'
import ServiceOrderDetailAudit from '@/views/customer/modules/ServiceOrderDetailAudit'
import TabLayout from '@/views/customer/modules/AuditProgress/modules/TabLayout'
import { isEditStatus } from '@/utils/processDoc/auditStatus'
import { mapState } from 'vuex'

export default {
  name: 'ServiceOrderDetail',
  components: {
    TabLayout,
    ServiceOrderDetailAudit,
    ServiceOrderDetailCheck,
  },
  data () {
    return {
      visible: false,
    }
  },
  computed: {
    ...mapState({
      editing: state => state.service.editing,
    }),
  },
  methods: {
    isEditStatus,
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
    },
    // 进入编辑状态
    onEdit () {
      this.$store.commit('service/TEMPORARILY', true)
    },
    // 暂存
    temporarilySave () {
      this.$store.commit('service/TEMPORARILY', false)
    }
  },
}
</script>

<style lang="less" scoped>
#box {
  & /deep/ .ant-spin-container {
    height: 100%;
  }

  & /deep/ .center_wrap {
    display: flex;
    flex-direction: column;
    height: 100%;

    .up {
      height: 70%;
      width: 100%;
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

      & /deep/ .ant-tabs-tabpane {
        overflow: auto;
      }
    }
  }
}
</style>
