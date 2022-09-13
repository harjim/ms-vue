import { Form, Input, Select, Row, Col, DatePicker, Button, Popconfirm, InputNumber } from 'ant-design-vue'
import { SearchSelect, YearSelect, DeptSelect, CompanySelect, CheckInstSelect } from '../Selects/index'
import _ from 'lodash'
import './FormData.less'

const FormItem = Form.Item
const TextArea = Input.TextArea

const FormData = {
  components: {
    Row,
    Col,
    YearSelect,
    Input,
    SearchSelect,
    Select,
    DatePicker,
    DeptSelect,
    CompanySelect,
    CheckInstSelect,
    InputNumber,
    TextArea
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default: () => ({})
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: {}
    }
  },
  computed: {},
  methods: {
    close() {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data())
    },
    addListItem(field, col) {
      const values = this.list[field] || []
      const nItem = {}
      for (const colItem of col) {
        if (colItem.slot) nItem[colItem.field] = null
      }
      const nextValues = _.concat(values, nItem)
      this.list = {
        ...this.list,
        [field]: nextValues
      }
    },
    delListItem(field, idx) {
      const values = this.list[field]
      values.splice(idx, 1)
      const fValues = this.form.getFieldValue(field)
      this.form.setFieldsValue({
        [field]: fValues.filter((v, i) => i !== idx)
      })
    },
    quickAdd(field, arr) {
      const values = this.list[field] || []
      const nextVal = _.uniqBy(_.concat(values, arr), 'rdTitle')
      this.list = {
        ...this.list,
        [field]: nextVal
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          [field]: nextVal
        })
      })
    }
  },
  render(h) {
    const { items, form, list, canEdit } = this
    const { getFieldDecorator } = form

    const renderFormItem = (item) => (
      <FormItem label={item.label}>
        {getFieldDecorator(item.field, {
          rules: item.rules
        })(renderItem(item))}
      </FormItem>
    )

    const renderItem = ({ component, props, style, field, eField }) => {
      if (canEdit) {
        return h(component, {
          style,
          props
        })
      } else {
        return <span>{this.row[eField] || this.row[field]}</span>
      }
    }

    const renderWrapper = ({ children }) => (
      <Row>
        {children.map((item) => (
          <Col span={item.span ? item.span : 24 / children.length}>{renderFormItem(item)}</Col>
        ))}
      </Row>
    )

    const renderListItem = (field, item) => {
      return (
        <FormItem>
          {getFieldDecorator(field, {
            rules: item.rules
          })(renderItem(item))}
        </FormItem>
      )
    }

    const renderListCol = (columns, field) => {
      return columns.map((col) => {
        if (col.slot) {
          return (
            <vxe-table-column
              type={col.type}
              title={col.title}
              field={col.field}
              width={col.width}
              {...{
                scopedSlots: {
                  default: ({ row, $rowIndex }) => {
                    return renderListItem(`${field}[${$rowIndex}].${col.field}`, col.slot)
                  }
                }
              }}
            />
          )
        } else if (col.type === 'operate') {
          return (
            <vxe-table-column
              title={col.title}
              {...{
                scopedSlots: {
                  default: ({ row, $rowIndex }) => (
                    <Popconfirm
                      title="是否删除该项目记录"
                      autoAdjustOverflow={false}
                      placement="topRight"
                      onConfirm={() => this.delListItem(field, $rowIndex)}
                    >
                      <a>移除</a>
                    </Popconfirm>
                  )
                }
              }}
            />
          )
        }
        return <vxe-table-column type={col.type} title={col.title} field={col.field} width={col.width} />
      })
    }

    const renderBtn = (btns, field, columns) => {
      return btns.length === 1 ? (
        <div>
          <Button block type="dashed" icon="plus" onClick={() => this.addListItem(field, columns)}>
            添加
          </Button>
        </div>
      ) : (
        <div class="form-box__table-btn">
          <Button block type="dashed" icon="plus" onClick={() => this.addListItem(field, columns)}>
            添加
          </Button>
          <Button
            block
            type="dashed"
            disabled={!form.getFieldValue('customerId') || !form.getFieldValue('year')}
            onClick={() => btns[1].click()}
          >
            引入项目
          </Button>
        </div>
      )
    }

    const renderList = ({ label, field, required, columns, btns }) => {
      if (canEdit) {
        return (
          <div>
            <FormItem label={label} required={required}>
              <vxe-grid
                auto-resize
                resizable
                stripe
                keep-source
                row-key
                max-height="244"
                edit-config={{ trigger: 'manual', mode: 'row', autoClear: false, showIcon: false }}
                show-overflow="tooltip"
                data={list[field]}
              >
                {renderListCol(columns, field)}
              </vxe-grid>
              {renderBtn(btns, field, columns)}
            </FormItem>
          </div>
        )
      }
      return (
        <FormItem label={label} required={required}>
          <vxe-grid
            auto-resize
            resizable
            stripe
            keep-source
            row-key
            max-height="244"
            edit-config={{ trigger: 'manual', mode: 'row', autoClear: false, showIcon: false }}
            show-overflow="tooltip"
            columns={columns}
            data={list[field]}
          />
        </FormItem>
      )
    }

    return (
      <Form layout="inline" class="form-box">
        {items.map((item) => {
          switch (item.component) {
            case 'Row':
              return renderWrapper(item)
            case 'List':
              return renderList(item)
            default:
              return renderFormItem(item)
          }
        })}
      </Form>
    )
  }
}

export default Form.create({})(FormData)
