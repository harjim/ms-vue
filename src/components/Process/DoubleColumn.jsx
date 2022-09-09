import { Drawer, Spin, Row, Col, Card, Button, Popconfirm } from 'ant-design-vue'

import './DoubleColumn.less'

const DoubleColumn = ({ props, slots, listeners }) => {
  const { title, visible = false, spinning = false, showBtn = true, width = 1184 } = props

  return (
    <Drawer
      title={title}
      width={width}
      visible={visible}
      bodyStyle={{
        background: ' #f3f5fa',
        height: 'calc(100% - 55px)',
        padding: 0,
        overflow: 'hidden'
      }}
      onClose={() => listeners.close()}
    >
      <Spin spinning={spinning}>
        <Row
          class="container-box"
          gutter={16}
          style={{ height: showBtn ? 'calc(100vh - 112px)' : 'calc(100vh - 72px)' }}
        >
          <Col span={4}>
            <Card title="节点" size="small" bodyStyle={{ padding: '16px' }}>
              {slots().node}
            </Card>
          </Col>
          <Col span={20}>
            <Card size="small" bodyStyle={{ padding: '16px' }}>
              {slots().content}
            </Card>
            {slots().audit && (
              <Card size="small" bodyStyle={{ padding: '16px' }}>
                {slots().audit}
              </Card>
            )}
          </Col>
        </Row>

        <div class="container-btn">
          <Button onClick={() => listeners.add()}>暂存</Button>
          <Popconfirm
            title="是否确认提交？"
            autoAdjustOverflow={false}
            placement="topRight"
            onConfirm={() => listeners.submit()}
          >
            <Button type="primary">提交</Button>
          </Popconfirm>
        </div>
      </Spin>
    </Drawer>
  )
}

export default DoubleColumn
