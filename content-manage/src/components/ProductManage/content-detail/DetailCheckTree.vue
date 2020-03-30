<template>
  <el-tree
    :data="treeResult"
    show-checkbox
    :default-expand-all="true"
    node-key="id"
    ref="tree"
    :check-strictly="true"
    @check-change="checkChange"
  ></el-tree>
</template>
<script>
export default {
  props: ["treeResult", "categoryId", "categoryName"],
  data() {
    return {
      chooseNode: [],
      chooseIds: []
    };
  },
  mounted() {
    this.$refs.tree.setCheckedKeys([0]);

    this.$nextTick(() => {
      this.setCheckedKeys(this.categoryId);
    });
  },
  methods: {
    setCheckedKeys(ids) {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(ids);
      });
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    setChecked(id) {
      this.$refs.tree.setChecked(id);
    },

    checkChange(data, boolen) {
      if (data.level == 0) data.disabled = true;

      if (!this.chooseNode.includes(data)) {
        this.chooseNode.push(data);
      } else {
        this.chooseNode = this.chooseNode.filter(item => {
          return item !== data;
        });
      }
      this.getAllNodeIds();
      this.$emit("chooseNode", data, boolen);
    },
    // 清空选中
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
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
            if (item.id != 0) {
              that.$set(item, "disabled", flag);
            }
          }
        });
      }
      return r(this.treeResult);
    }
  },
  watch: {
    categoryId() {
      this.setCheckedKeys(this.categoryId);
    },
    treeResult() {
      if (this.treeResult[0].level === 0) {
        this.treeResult[0].disabled = true;
      }
    },
    chooseNode() {
      if (this.chooseNode.length >= 5) {
        this.formateTreeResult(true);
      } else {
        this.formateTreeResult(false);
      }
    }
  }
};
</script>
<style scoped>
.el-tree {
  max-height: 250px;
  overflow-y: auto;
}
.el-tree /deep/ .el-tree-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
