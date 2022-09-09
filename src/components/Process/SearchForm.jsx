import { Form, Input, Select, Button } from 'ant-design-vue'
import { SearchSelect, YearSelect } from '../Selects/index'

const FormItem = Form.Item

const SearchForm = {
  components: { YearSelect, Input, SearchSelect, Select },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.$emit('refresh', true)
    }
  },
  render(h) {
    const { items, form } = this
    const { getFieldDecorator } = form

    const renderItem = ({ component, props }) => {
      return h(component, {
        style: { width: '240px' },
        props
      })
    }

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        {items.map((item) => (
          <FormItem label={item.label}>{getFieldDecorator(item.field)(renderItem(item))}</FormItem>
        ))}
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create({})(SearchForm)
