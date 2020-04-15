<template>
  <el-tree
    :data="treeData"
    show-checkbox
    :default-expand-all="true"
    node-key="id"
    ref="tree"
    highlight-current
    :check-strictly="true"
    @check-change="check"
  ></el-tree>
</template>
<script>
export default {
  props: ['treeResult', 'language'],
  data() {
    return {
      chooseNode: [],
      chooseIds: []
    }
  },
  mounted() {
    this.formateTreeResult(false)
  },
  computed: {
    treeData: {
      get: function() {
        let data = JSON.parse(JSON.stringify(this.treeResult))
        if (
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
        console.log(data, '[][][')
        return data
      },
      set: function() {}
    }
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
    setCheckedKeys(ids) {
      this.$refs.tree.setCheckedKeys(ids)
      this.chooseIds = ids
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes()
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    check(node) {
      if (!this.chooseNode.includes(node)) {
        this.chooseNode.push(node)
      } else {
        this.chooseNode = this.chooseNode.filter((item) => {
          return item !== node
        })
      }
      this.getAllNodeIds()
      this.$emit('chooseNode')
    },
    getAllNodeIds() {
      let nodeIds = []
      function r(nodes) {
        nodes.forEach((item) => {
          if (item.children.length > 0) r(item.children)
          nodeIds.push(item.id)
        })
        return nodeIds
      }
      return r(this.treeResult)
    },
    formateTreeResult(flag) {
      let that = this
      function r(nodes) {
        nodes.forEach((item) => {
          if (item.children.length > 0) r(item.children)
          if (!that.chooseNode.includes(item)) {
            that.$set(item, 'disabled', flag)
          }
        })
      }
      return r(this.treeResult)
    }
  },
  watch: {
    chooseNode() {
      if (this.chooseNode.length >= 5) {
        this.formateTreeResult(true)
      } else {
        this.formateTreeResult(false)
      }
    },
    treeResult() {
      this.formateTreeResult(false)
    }
  }
}
</script>
<style scoped>
.el-tree {
  max-height: 65vh;
  overflow-y: auto;
}
</style>
