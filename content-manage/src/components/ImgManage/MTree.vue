<template>
    <el-tree
        :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
    ></el-tree>
</template>
<script>
let id = 1000;
export default {
    data() {
        const data = [
            {
                id: 1,
                label: "一级分类 1",
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
            data: JSON.parse(JSON.stringify(data)),
            data: JSON.parse(JSON.stringify(data))
        };
    },

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
            console.log(
                "tree drag end: ",
                dropNode && dropNode.label,
                dropType
            );
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

