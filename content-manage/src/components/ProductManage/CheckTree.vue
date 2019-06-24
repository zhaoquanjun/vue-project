<template>
    <el-tree
        :data="treeResult"
        show-checkbox
        :default-expand-all="true"
        node-key="id"
        ref="tree"
        highlight-current
        :check-strictly="true"
    ></el-tree>
</template>
<script>
export default {
    props:["treeResult"],
     methods: {
      getCheckedNodes() {
        return this.$refs.tree.getCheckedNodes();
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      }
     }
}
</script>
<style scoped>
.el-tree  {
      max-height: 65vh;
     overflow-y: auto;
}
</style>



