<template>
  <el-select
    id="el-select"
    ref="elSelect"
    :popper-append-to-body="popper"
    :value="valueTitle"
    :multiple="multiple"
    @remove-tag="remove"
    @node-expand="nodeExpand"
    size="small"
  >
    <el-option :value="valueTitle">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :check-strictly="true"
        :default-expand-all="true"
        :expand-on-click-node="false"
        :accordion="accordion"
        :data="treeData"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
        @check="check"
        :show-checkbox="isSHowCheckBox"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'el-tree-select',
  inject: {
    popper: {
      default: false
    }
  },
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'label', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    treeResult: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**分类名称 */
    categoryName: {
      type: [String, Array]
    },

    /** 分类ID */
    categoryId: {
      type: Number,
      default: -1
    },
    /* 初始值 */
    value: {
      type: Number,
      default: () => {
        return null
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isexpand: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    multiple: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isSHowCheckBox: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: () => {
        return 'zh-CN'
      }
    }
  },
  data() {
    return {
      valueId: null, // 初始值
      valueTitle: '',
      defaultExpandedKey: []
    }
  },
  computed: {
    treeData: {
      get: function() {
        let data = JSON.parse(JSON.stringify(this.treeResult))
        if (
          this.type === 'news' &&
          this.treeResult &&
          this.treeResult.length > 0
        ) {
          if (data[0].children && data[0].children.length > 0) {
            let childs = data[0].children
            for (var i = 0; i < childs.length; i++) {
              if (childs[i].id < 0 && childs[i].language != this.language) {
                childs.splice(i, 1)
              }
            }
          }
        }
        return data
      },
      set: function() {}
    }
  },
  mounted() {
    this.initHandle()
    this.valueTitle = this.categoryName
    this.setCheckedKeys()
  },
  methods: {
    // _setTreeNodeDisabled(data) {
    //   for (var i = 0; i < data.length; i++) {
    //     if (data[i].id < 0) {
    //       data[i].disabled = true
    //     }
    //     if (data[i].children && data[i].children.length > 0) {
    //       this._setTreeNodeDisabled(data[i].children)
    //     }
    //   }
    // },
    setCheckedKeys() {
      this.valueTitle = this.categoryName
      this.$nextTick(() => {
        this.$refs.selectTree.setCurrentKey(this.categoryId) // 设置默认选中
        //   this.$refs.tree.setCheckedKeys(ids);
      })
    },
    nodeExpand(data, node, slot) {},
    remove(cur) {
      this.valueTitle = this.valueTitle.filter(item => {
        return item != cur
      })
      this.$emit('removeSeletedCategory', cur)
    },
    // 初始化值
    initHandle() {
      // this.$refs.selectTree.setCurrentKey(this.categoryId); // 设置默认选中
      // this.defaultExpandedKey = [this.valueId]; // 设置默认展开
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(
          '.el-scrollbar .el-select-dropdown__wrap'
        )[0]
        let scrollBar = document.querySelectorAll(
          '.el-scrollbar .el-scrollbar__bar'
        )
        scrollWrap.style.cssText =
          'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => (ele.style.width = 0))
        scrollBar[0].style.display = 'none'
      })
    },
    // 切换选项
    handleNodeClick(node) {
      this.$refs.elSelect.blur()
      if (this.multiple) {
        if (this.valueTitle.indexOf(node[this.props.label]) > -1) {
          return
        }
        this.valueTitle.push(node[this.props.label])
        this.$emit('chooseNode', node)
        return
      } else {
        if (node.id >= 0) {
          this.valueTitle = node[this.props.label]
        }
        this.$emit('chooseNode', node)
      }
      // this.valueId = node[this.props.value];
      // this.defaultExpandedKey = [];
      this.clearSelected()
    },
    check(node) {
      if (this.multiple) {
        if (this.valueTitle.indexOf(node[this.props.label]) > -1) {
          return
        }
        this.valueTitle.push(node[this.props.label])
        this.$emit('chooseNode', node)
        return
      } else {
        if (node.id >= 0) {
          this.valueTitle = node[this.props.label]
        }
        this.$emit('chooseNode', node)
      }
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('chooseNode', null)
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach(element => element.classList.remove('is-current'))
    }
  },
  watch: {
    categoryName() {
      this.valueTitle = this.categoryName
    },
    categoryId() {
      this.$nextTick(() => {
        this.initHandle()
        this.$refs.selectTree.setCurrentKey(this.categoryId) // 设置默认选中
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* .el-tree /deep/ .is-checked {
    background: red;
} */
.el-select {
  width: 100%;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 240px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
  line-height: 26px;
  font-size: $--font-size-small;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li /deep/ .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
  display: block;
  width: 280px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree /deep/ .is-current .el-tree-node__label {
  color: $--color-primary;
  font-weight: 700;
}
.el-tree /deep/ .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>
