import { Steps, Badge } from 'ant-design-vue'
import DoubleColumn from './DoubleColumn'
import { getStatusName, statusColor } from '@/utils/processDoc/auditStatus'
import { Ellipsis } from '../index'
import FormData from './FormData'

const Step = Steps.Step

export default {
  name: 'ProcessLayout',
  components: {
    DoubleColumn
  },
  props: {
    com: {
      type: String,
      default: 'DoubleColumn'
    },
    processType: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      title: '',
      currentNode: 0,
      row: {}
    }
  },
  methods: {
    open() {
      this.title = '添加'
      this.visible = true
    },
    close() {
      Object.assign(this.$data, this.$options.data())
    }
  },
  render() {
    const { com, visible, title, processType, currentNode, row, items } = this

    const renderStep = () => (
      <template slot="node">
        <Steps current={currentNode} direction="vertical" size="small">
          {processType.map((item) => (
            <Step key={item.value}>
              <template slot="title">
                <span style={{ fontWeight: item.value === currentNode ? '700' : 'normal' }}>
                  <div>{item.label}</div>
                  {item.value === currentNode && (
                    <Badge
                      color={statusColor[row.status === undefined ? 5 : row.status]}
                      text={getStatusName(row.status)}
                    />
                  )}
                </span>
              </template>
              {item.createTime && (
                <template slot="description">
                  <Ellipsis style={{ paddingTop: '8px', fontSize: '14px' }} length={50} tooltip>
                    {item.remark}
                  </Ellipsis>
                  <span>
                    {item.userName} {item.createTime}
                  </span>
                </template>
              )}
            </Step>
          ))}
        </Steps>
      </template>
    )

    const renderContent = () => (
      <template slot="content">
        <FormData ref="FormData" items={items} />
      </template>
    )

    return (
      <com visible={visible} title={title} onClose={this.close}>
        {processType.length > 0 && renderStep()}
        {renderContent()}
        <template slot="audit">{this.$slots.audit}</template>
      </com>
    )
  }
}
