<template>
    <div>
        <el-tree
            :data="treeResult"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            @node-click="changeCategory"
            @node-contextmenu="handlerContextMenu"
            accordion
            ref="tree"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
        >
            <div
                class="custom-tree-node"
                @mouseover="handlerOver(data)"
                @mouseleave="handlerMouseLeave"
                slot-scope="{ node, data }"
            >
                <div style="display: inline-block;" v-if="renameShowId === data.id || data.isNewAdd">
                    <input
                        style="width: 86px;height: 30px;border:none;border:1px solid rgba(229,229,229,1)"
                        v-model="data.label"
                        v-filter-special-char
                    >
                    <span class="enter" @click.stop="hadnleTreeInput(data,data.isNewAdd)">
                        <svg-icon icon-class="tree-yes"></svg-icon>
                    </span>
                    <span class="cancel">
                        <svg-icon icon-class="tree-no"></svg-icon>
                    </span>
                </div>
                <template v-else>
                    <span>{{data.label}}</span>
                    <span v-if="data.level<=1">({{data.leafSum }})</span>
                </template>
                <!-- 三个点 分类操作 -->
                <span
                    class="set-tree-type"
                    @click.stop="handleShow(node,data)"
                    v-show="data.id === treeNodeId"
                >
                    <svg-icon icon-class="tree-handler"></svg-icon>
                </span>
                <div class="tree-handle" v-show="node.data.id == curId">
                    <button
                        v-if="node.data.level>0"
                        type="text"
                        size="mini"
                        @click.stop="rename(data)"
                    >重命名</button>
                    <button
                        v-if="node.data.level <3"
                        type="text"
                        size="mini"
                        @click.stop=" create(data)"
                    >新增子节点</button>
                    <button
                        v-if="node.data.level>0"
                        type="text"
                        size="mini"
                        @click.stop="batchRemove( node,data)"
                    >删除</button>
                </div>
            </div>
        </el-tree>
    </div>
</template>
<script>
let id = 1000;
export default {
    props: ["treeResult", "picSearchOptions"],
    data() {
        return {
            flag: false,
            curId: null,
            treeNodeId: null,
            renameShowId: null,
            isNewAdd:false,
        };
    },
    methods: {
        handlerOver(data) {
            // console.log(data, "----");
          
           // if(this.isNewAdd) return; // 如果正在创建  其他类别不显示 三个点操作按钮
            this.treeNodeId = data.id;
            if (this.renameShowId !== data.id) {
                this.renameShowId = null;
            }
        },
        handlerMouseLeave() {
         
            this.curId = null;
        },
        //修改节点名称 OR 新增节点
        hadnleTreeInput(data,isNewAdd) {
           this.isNewAdd = false; //点击确定修改后 开启允许创建子节点
            console.log(data,'----====')
            if (data.label == "") {
                this.$message({
                    message: "分类名称不能为空",
                    type: "warning"
                });
            }
            if(isNewAdd){              
                this.$emit("create", {DisplayName: data.label + "的子集",ParentId: data.parentId});
                return
            }
            if (data.label != "") {
                this.$emit("rename", data.id, data.label);
                this.renameShowId = this.curId = null;
            }
             this.treeNodeId =null;
        },
        add() {
            console.log(this.treeResult, "3312121212");
        },
        handleDragStart(node, ev) {
            // console.log("drag start", node);
        },
        handleDragEnter(draggingNode, dropNode, ev) {
            //  console.log("tree drag enter: ", draggingNode, dropNode);
        },
        handleDragLeave(draggingNode, dropNode, ev) {
            //    console.log("tree drag leave: ", dropNode.label);
        },
        handleDragOver(draggingNode, dropNode, ev) {
            //     console.log("tree drag over: ", dropNode.label);
        },
        handleDragEnd(draggingNodeDom, targetNodeDom, dropType, ev) {
            var draggingNode = draggingNodeDom.data;
            var targetNode = targetNodeDom.data;
            console.clear();
            console.log(`模式${dropType}`);
            console.log(
                `拖动的节点 label:${draggingNode.label}|id:${
                    draggingNode.id
                }|sort:${draggingNode.sort}|parentId:${
                    draggingNode.parentId
                }|level:${draggingNode.level}`
            );
            console.log(
                `目标节点的 label:${targetNode.label}|id:${
                    targetNode.id
                }|sort:${targetNode.sort}|parentId:${
                    targetNode.parentId
                }|level:${targetNode.level}`
            );

            if (dropType === "none") {
                return;
            }
            switch (dropType) {
                case "inner": {
                    draggingNode.parentId = targetNode.id;
                    break;
                }
                case "before":
                case "after": {
                    draggingNode.parentId = targetNode.parentId;
                    break;
                }
                case "none":
                default: {
                    return;
                }
            }
            var idOrderByArr = [];
            for (
                var i = targetNodeDom.parent.childNodes.length - 1;
                i >= 0;
                i--
            ) {
                var childNode = targetNodeDom.parent.childNodes[i];
                idOrderByArr.push(childNode.data.id);
            }
            console.log(idOrderByArr);
            this.modifyNode(
                draggingNode.id,
                draggingNode.parentId,
                idOrderByArr
            );
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            console.log("tree drop: ", dropNode.label, dropType);
        },
        handlerContextMenu(event, data, Node, ev) {
            console.log(event);
        },
        allowDrop(draggingNode, targetNode, dropType) {
            draggingNode = draggingNode.data;
            targetNode = targetNode.data;
            //判断是否大于三层
            if (
                dropType === "inner" ||
                draggingNode.parentId !== targetNode.parentId
            ) {
                return this.getLevel(draggingNode, 1) + targetNode.level <= 3;
            }
            return true;
        },
        allowDrag(draggingNode) {
            return draggingNode.label.indexOf("三级分类 3-2-2") === -1;
        },
        create(data) {
            if(!this.isNewAdd){
                this.isNewAdd =true;
                  const newChild = { parentId:data.id, label: "我我我",isNewAdd:true};          
            data.children.unshift(newChild);
            }
          console.log(this.isNewAdd,'0---')
            console.log(data, "新建");
            
            this.curId = null;
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
        getLevel(node, level) {
            var localLevel = level;
            for (var i in node.children) {
                let child = node.children[i];
                var childLevel = this.getLevel(child, localLevel + 1);
                level = level < childLevel ? childLevel : level;
            }
            return level;
        },
        rename(data) {
            this.renameShowId = data.id;
            this.curId = null;
        },
        modifyNode(id, parentId, idOrderByArr) {
            this.$emit("modifyNode", id, parentId, idOrderByArr);
        },
        // 描述：
        batchRemove(node, data) {
            this.$emit("batchRemove", this.getAllNodeIds(data));
        },
        changeCategory(data) {
            console.log(data);
            this.picSearchOptions.picCategoryId = data.id;
            this.$emit("getPicList");
        },
        handleShow(node, val) {
            console.log((node.checked = true));
            this.curId = node.data.id;
        }
    }
};
</script>
<style>
.el-tree-node > .el-tree-node__children {
    overflow: visible !important;
}
</style>

<style scoped>
.el-tree /deep/ .el-tree-node__content {
    height: 44px;
    position: relative !important;
}

.el-tree /deep/ .el-tree-node__label {
    font-size: 12px;
}
</style>
<style lang="scss" scoped>
.custom-tree-node {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    // width: 84px;
    width: 100%;
    display: flex;
    align-items: center;
    .enter {
        margin: 0 5px;
    }
}
.tree-handle {
    position: absolute;
    right: -88px;
    top: 0;
    z-index: 1000;
    background: #ffffff;
    width: 92px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.07);
    padding: 5px 0;
    button {
        width: 100%;
        display: block;
        padding: 8px 14px;
        text-align: left;
        &:hover {
            background: #eee;
        }
    }
}
.set-tree-type {
    position: absolute;
    right: 5px;
    padding: 0 5px;
    z-index: 10;
}
</style>
