<template>
  <el-tree
    :data="treeResult"
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
  props: ["treeResult"],
  data() {
    return {
      chooseNode: [],
      chooseIds: []
    };
  },
  mounted() {
    this.formateTreeResult(false);
  },
  methods: {
    setCheckedKeys(ids) {
      this.$refs.tree.setCheckedKeys(ids);
      this.chooseIds = ids;
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    check(node) {
      if (!this.chooseNode.includes(node)) {
        this.chooseNode.push(node);
      } else {
        this.chooseNode = this.chooseNode.filter(item => {
          return item !== node;
        });
      }
      this.getAllNodeIds();
      this.$emit("chooseNode");
    },
    getAllNodeIds() {
      let nodeIds = [];
      function r(nodes) {
        nodes.forEach(item => {
          if (item.children.length > 0) r(item.children);
          nodeIds.push(item.id);
        });
        return nodeIds;
      }
      return r(this.treeResult);
    },
    formateTreeResult(flag) {
      let that = this;
      function r(nodes) {
        nodes.forEach(item => {
          if (item.children.length > 0) r(item.children);
          if (!that.chooseNode.includes(item)) {
            that.$set(item, "disabled", flag);
          }
        });
      }
      return r(this.treeResult);
    }
  },
  watch: {
    chooseNode() {
      if (this.chooseNode.length >= 5) {
        this.formateTreeResult(true);
      } else {
        this.formateTreeResult(false);
      }
    },
    treeResult() {
      this.formateTreeResult(false);
    }
  }
};
</script>
<style scoped>
.el-tree {
  max-height: 65vh;
  overflow-y: auto;
}
</style>
