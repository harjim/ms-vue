import { Steps, Badge } from 'ant-design-vue'
import DoubleColumn from './DoubleColumn'
import { getStatusName, statusColor, isEditStatus } from '@/utils/processDoc/auditStatus'
import { Ellipsis } from '../index'
import _ from 'lodash'
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
    urlPrefix: {
      type: String,
      default: ''
    },
    processType: {
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
    },
    wrapperForm: {
      type: Function,
      default: () => () => {}
    },
    formValuesChange: {
      type: Function,
      default: () => () => {}
    }
  },
  data() {
    return {
      visible: false,
      spinning: false,
      title: '',
      currentNode: 0,
      stepList: [],
      row: {}
    }
  },
  computed: {
    canEdit() {
      return isEditStatus(this.row.status)
    }
  },
  methods: {
    open() {
      this.title = '添加'
      if (this.com === 'DoubleColumn') {
        this.currentNode = 0
        this.stepList = [...this.processType]
      }
      this.visible = true
    },
    edit(id) {
      this.title = '编辑'
      this.visible = true
      this.spinning = true
      this.$http
        .get(`${this.urlPrefix}/getInfo`, { params: { id } })
        .then(({ success, data }) => {
          if (success) {
            this.row = data
            this.initial(data)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    initial(val) {
      if (this.com === 'DoubleColumn') {
        this.currentNode = val.nodeNumber
        this.stepList = [...this.processType].map((item) => {
          const i = { ...item }
          if (val.nodeList && val.nodeList.length) {
            if (val.nodeList[item.value]) {
              i.createTime = val.nodeList[i.value].createTime
              i.remark = val.nodeList[i.value].suggestion
              i.userName = val.nodeList[i.value].userName
            }
          }
          return i
        })
      }
      const { form, list } = this.wrapperForm(val)
      this.$refs.FormData.$refs.WrappedComponent.list = list
      if (this.canEdit) {
        this.$refs.FormData.setFieldsValue({
          ...form
        })
      }
    },
    close() {
      this.$refs.FormData.$refs.WrappedComponent.close()
      Object.assign(this.$data, this.$options.data())
    },
    quickAdd(field, arr) {
      this.$refs.FormData.$refs.WrappedComponent.quickAdd(field, arr)
    },
    add() {
      const url = `${this.urlPrefix}/add${_.upperFirst(this.urlPrefix)}`
      this.handle(url)
    },
    submit() {
      const url = `${this.urlPrefix}/submit`
      this.handle(url)
    },
    handle(url) {
      this.$refs.FormData.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.spinning = true
          const params = this.wrapperParams(values)
          this.$http
            .post(url, params)
            .then(({ success, errorMessage }) => {
              if (success) {
                this.$message.success('操作成功')
                this.close()
                this.$emit('refresh', true)
              } else {
                this.$message.error(errorMessage)
              }
            })
            .catch((e) => {
              console.log(e)
            })
            .finally(() => {
              this.spinning = false
            })
        }
      })
    }
  },
  render() {
    const { com, visible, title, spinning, stepList, currentNode, row, items, canEdit } = this

    const renderStep = () => (
      <template slot="node">
        <Steps current={currentNode} direction="vertical" size="small">
          {stepList.map((item) => (
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
                  {item.remark && (
                    <Ellipsis style={{ paddingTop: '8px', fontSize: '14px' }} length={50} tooltip>
                      {item.remark}
                    </Ellipsis>
                  )}
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
        <FormData ref="FormData" items={items} row={row} canEdit={canEdit} />
      </template>
    )

    return (
      <com
        visible={visible}
        title={title}
        spinning={spinning}
        onClose={this.close}
        onAdd={this.add}
        onSubmit={this.submit}
      >
        {stepList.length > 0 && renderStep()}
        {renderContent()}
        <template slot="audit">{this.$slots.audit}</template>
      </com>
    )
  }
}
