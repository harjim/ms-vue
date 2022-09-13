<template>
  <a-drawer
    :visible="visible"
    :title="title"
    :width="1184"
    :spinning="spinning"
    :bodyStyle="{ padding: 0, backgroundColor: '#F6F6F6', height: 'calc(100% - 56px)' }"
  >
    <a-spin :spinning="spinning">
      <a-row class="container-box" :gutter="16">
        <a-col :span="4">
          <a-card title="节点" size="small" :bodyStyle="{ padding: '16px' }">
            <slot name="node"></slot>
          </a-card>
        </a-col>
        <a-col :span="20">
          <a-card size="small" :bodyStyle="{ padding: '16px' }">
            <slot name="content"></slot>
          </a-card>
          <a-card v-if="$slots.audit" size="small" :bodyStyle="{ padding: '16px' }">
            <slot name="audit"></slot>
          </a-card>
        </a-col>
      </a-row>

      <div class="btns">
        <a-button>暂存</a-button>
        <a-button>提交</a-button>
      </div>
    </a-spin>
  </a-drawer>
</template>

<script>
export default {
  name: 'DoubleColumn',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    spinning: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
& /deep/ .ant-spin-nested-loading {
  height: 100%;
}

& /deep/ .ant-spin-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.container-box {
  padding: 16px;
  margin: 0 !important;
}

.btns {
  height: 56px;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 8px;
  padding: 0 24px;
  border: 1px solid #e8e8e8;
}
</style>
