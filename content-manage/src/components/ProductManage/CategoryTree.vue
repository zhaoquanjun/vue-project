<template>
  <div>
    <el-tree
      :data="categoryTreeData"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      accordion
      ref="tree"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <input v-model="data.label">
        <span>({{data.leafSum }})</span>
        <span>
          <el-button type="text" size="mini" @click="rename(data)">重命名</el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
let id = 1000;
export default {
  props: ["categoryTreeData", "searchOption"],
  data() {},
  methods: {
    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级分类 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级分类 3-2-2") === -1;
    },
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}
            >
              Append
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              Delete
            </el-button>
          </span>
        </span>
      );
    }
  },
  rename(data) {
    this.$emit("rename", data.id, data.label);
  }
};
</script>
<style scoped>
.el-tree /deep/ .el-tree-node__content {
  height: 44px;
}
.el-tree /deep/ .el-tree-node__label {
  font-size: 12px;
}
</style>

