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
    }
  },
  data() {
    return {
      list: {}
    }
  },
  methods: {
    addListItem(field, col) {
      const values = this.list[field] || []
      let nItem = {}
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
    }
  },
  render(h) {
    const { items, form, list } = this
    const { getFieldDecorator } = form

    const renderFormItem = (item) => (
      <FormItem label={item.label}>
        {getFieldDecorator(item.field, {
          rules: item.rules
        })(renderItem(item))}
      </FormItem>
    )

    const renderItem = ({ component, props, style }) => {
      return h(component, {
        style,
        props
      })
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

    const renderList = ({ label, field, columns, btns }) => {
      return (
        <div>
          <FormItem label={label}>
            <vxe-table
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
              {columns.map((col) => {
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
                    ></vxe-table-column>
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
                } else {
                  return (
                    <vxe-table-column
                      type={col.type}
                      title={col.title}
                      field={col.field}
                      width={col.width}
                    ></vxe-table-column>
                  )
                }
              })}
            </vxe-table>
            {btns.length === 1 ? (
              <div>
                <Button block type="dashed" icon="plus" onClick={() => this.addListItem(field, columns)}>
                  添加
                </Button>
              </div>
            ) : (
              <div class="form-box__table-btn">
                <Button block type="dashed" icon="plus">
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
            )}
          </FormItem>
        </div>
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

export default Form.create({
  onValuesChange: (props, values) => {
    console.log(props, values)
  }
})(FormData)
