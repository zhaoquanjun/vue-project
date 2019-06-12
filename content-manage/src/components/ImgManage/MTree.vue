<template>
    <div>
        <el-tree :data="treeResult"
                 node-key="id"
                 default-expand-all
                 :expand-on-click-node="false"
                 @node-drag-start="handleDragStart"
                 @node-drag-enter="handleDragEnter"
                 @node-drag-leave="handleDragLeave"
                 @node-drag-over="handleDragOver"
                 @node-drag-end="handleDragEnd"
                 @node-drop="handleDrop"
                 ref="tree"
                 draggable
                 :allow-drop="allowDrop"
                 :allow-drag="allowDrag">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <input v-model="data.label" /> <span>({{data.leafSum }})</span>
                <span>
                    <el-button type="text"
                               size="mini"
                               @click="rename(data)">
                        重命名
                    </el-button>
                    <el-button type="text"
                               size="mini"
                               @click=" create(data)">
                        新增子节点
                    </el-button>

                    <el-button type="text"
                               size="mini"
                               @click="batchRemove( node,data)">
                        删除
                    </el-button>

                </span>
            </span>
        </el-tree>
        <!--<input v-model="name" /> <button @click="add">新增</button>-->
    </div>
</template>
<script>
    export default {
        props: ["treeResult"],
        methods: {
            add() { console.log(this.treeResult, "3312121212"); },
            handleDragStart(node, ev) {
                // console.log("drag start", node);
            },
            handleDragEnter(draggingNode, dropNode, ev) {
                //  console.log("tree drag enter: ", draggingNode, dropNode);
            },
            handleDragLeave(draggingNode, dropNode, ev) {
                //  console.log("tree drag leave: ", dropNode.label);
            },
            handleDragOver(draggingNode, dropNode, ev) {
                //     console.log("tree drag over: ", dropNode.label);
            },
            handleDragEnd(draggingNode, dropNode, dropType, ev) {
                console.log(draggingNode, dropNode, "1111111111111");
                if (dropNode.parent) {
                    draggingNode.data.parentId = Array.isArray(dropNode.parent.data) ? dropNode.parent.data[0].id : dropNode.parent.data.id;
                }
                else {
                    draggingNode.data.parentId = 0;
                }
                console.log(dropNode.data.sort);
                draggingNode.data.sort = (dropNode.data.sort + (dropType === "before" ? 1 : -1)) ;
                this.modifyNode(draggingNode.data.id, draggingNode.data.sort, draggingNode.data.parentId);

            },
            handleDrop(draggingNode, dropNode, dropType, ev) {
                //    console.log("tree drop: ", dropNode.label, dropType);
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
            create(data) {
                console.log(data, "新建");
                this.$emit("create", { DisplayName: data.label + "的子集", ParentId: data.id });
            },
            getAllNodeIds(node, isChildNode) {
                var idList = isChildNode ? [] : [node.id];
                for (var i in node.children) {
                    let child = node.children[i];
                    idList.push(child.id);
                    idList = idList.concat(this.getAllNodeIds(child, true));
                }
                return idList;
            },
            rename(data) {
                this.$emit("rename", data.id, data.label);
            },
            modifyNode(id, sort, parentId) {
                this.$emit("modifyNode", id, sort, parentId);
            },
            batchRemove(node, data) {
                this.$emit("batchRemove", this.getAllNodeIds(data));
            },
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

<!--data() {
        const data = [
            {
                id: 1,
                label: "一级分类 3133",
                children: [
                    {
                        id: 4,
                        label: "二级分类 1-1",
                        children: [
                            {
                                id: 9,
                                label: "三级分类 1-1-1"
                            },
                            {
                                id: 10,
                                label: "三级分类 1-1-2"
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                label: "一级分类 2",
                children: [
                    {
                        id: 5,
                        label: "二级分类 2-1"
                    },
                    {
                        id: 6,
                        label: "二级分类 2-2"
                    }
                ]
            },
            {
                id: 3,
                label: "一级分类 3",
                children: [
                    {
                        id: 7,
                        label: "二级分类 3-1"
                    },
                    {
                        id: 8,
                        label: "二级分类 3-2"
                    }
                ]
            }
        ];
        return {
            data: this.treeResult,
            name: "test",
        };
    },-->
