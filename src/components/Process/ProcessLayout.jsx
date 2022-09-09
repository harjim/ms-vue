import DoubleColumn from './DoubleColumn'

export default {
  name: 'ProcessLayout',
  components: {
    DoubleColumn
  },
  props: {
    com: {
      type: String,
      default: 'DoubleColumn'
    }
  },
  data() {
    return {
      visible: false,
      title: ''
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
    const { com, visible, title } = this

    return (
      <com visible={visible} title={title} onClose={this.close}>
        <template slot="node">{this.$slots.node}</template>
        <template slot="content">{this.$slots.content}</template>
        <template slot="audit">{this.$slots.audit}</template>
      </com>
    )
  }
}
