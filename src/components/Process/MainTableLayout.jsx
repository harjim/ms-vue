import { Card, Empty, Button, Popover, Badge } from 'ant-design-vue'
import Ystable from '@/components/Table/ystable'
import _ from 'lodash'
import { getStatusName, statusColor } from '@/utils/processDoc/auditStatus'
import SearchForm from './SearchForm'

const TableControlBtn = ({ props }) => {
  const els = []

  const handleAdd = () => props.addClick()

  const handleDel = () => props.delClick()

  if (props.add) {
    els.push(
      <Button style="margin-right: 16px;" type="primary" onClick={handleAdd}>
        添加
      </Button>
    )
  }
  if (props.del) {
    els.push(
      <Button style="margin-right: 16px;" type="primary" onClick={handleDel}>
        删除
      </Button>
    )
  }
  return els
}

export default {
  name: 'MainTableLayout',
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
    wrapper: {
      type: Function,
      default: () => (v) => v
    }
  },
  data() {
    return {
      selectedRowKeys: [],
      params: {}
    }
  },
  methods: {
    refresh(flag = false) {
      this.params = this.wrapper(this.$refs.SearchForm.getFieldsValue())
      this.$nextTick(() => {
        this.$refs.xTable.refresh(flag)
      })
    },
    handleSelected({ records }) {
      this.selectedRowKeys = _.map(records, (item) => item.id)
    },
    handleAdd() {
      this.$emit('add')
    },
    handleDel() {
      const { urlPrefix, selectedRowKeys } = this
      this.$http
        .post(`${urlPrefix}/del${_.upperFirst(urlPrefix)}`, { ids: selectedRowKeys })
        .then(({ success, errorMessage }) => {
          if (success) {
            this.$message.success('操作成功')
            this.refresh()
          } else {
            this.$message.error(errorMessage)
          }
        })
    }
  },
  render() {
    const { urlPrefix, control, columns, items, params } = this

    const renderBtn = () => (
      <TableControlBtn add={control.add} del={control.del} addClick={this.handleAdd} delClick={this.handleDel} />
    )

    const renderEditEntry = (field, data) => {
      if (control.edit || control.check) {
        return <a>{data[field]}</a>
      }
      return <span>{data[field]}</span>
    }

    const renderChildTable = (index, field, data) => {
      const col = columns[index]
      if (!data[field]) {
        return <span>-</span>
      }
      return (
        <Popover autoAdjustOverflow={false} placement="bottom" trigger="click">
          <a>{data[field]}</a>
          <template slot="content">
            <vxe-grid
              border
              resizable
              highlight-hover-row
              auto-resize
              max-height="244"
              size="mini"
              data={data[col.childProp]}
              columns={col.childCol}
            />
          </template>
        </Popover>
      )
    }

    const renderStatus = (data) => <Badge color={statusColor[data.status]} text={getStatusName(data.status)} />

    return (
      <Card>
        {control.search ? (
          <div>
            <SearchForm ref="SearchForm" items={items} onRefresh={this.refresh} />
            {
              <Ystable
                ref="xTable"
                params={params}
                queryUrl={`${urlPrefix}/getList`}
                toolbar={{ refresh: true, zoom: true, custom: true }}
                showOverflow="tooltip"
                columns={columns}
                onCheckbox-all={this.handleSelected}
                onCheckbox-change={this.handleSelected}
                {...{
                  scopedSlots: {
                    editEntry: ({ column, row }) => renderEditEntry(column.property, row),
                    childTable: ({ column, row, $columnIndex }) => renderChildTable($columnIndex, column.property, row),
                    status: ({ row }) => renderStatus(row),
                    buttons: () => renderBtn()
                  }
                }}
              />
            }
          </div>
        ) : (
          <Empty description={false} />
        )}
      </Card>
    )
  }
}
