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
    mounted() {
      this.$refs.tree.setCheckedKeys([0]);
      this.$nextTick(()=>{
          console.log(this.categoryId)
          this.setCheckedKeys(this.categoryId);
      })
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
       
        checkChange(data,boolen){
          this.$emit("chooseNode", data,boolen);
        },
        // 清空选中
        resetChecked() {
            this.$refs.tree.setCheckedKeys([]);
        }
    },
    watch: {
        categoryId() {
            this.setCheckedKeys(this.categoryId);
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



