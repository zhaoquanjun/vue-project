<template>
    <div>
        <el-tree :data="treeResult"
                 node-key="id"
                 default-expand-all
                 :expand-on-click-node="false"
                 @node-drag-end="handleDragEnd"
                 @node-click="changeCategory"
                 accordion
                 ref="tree"
                 draggable
                 :allow-drop="allowDrop">
            <div class="custom-tree-node"
                 @mouseover="handlerOver(data)"
                 @mouseleave="handlerMouseLeave"
                 slot-scope="{ node, data }">
                <div style="display: inline-block;"
                     v-if="renameShowId === data.id || data.isNewAdd">
                    <input class="category-name" maxlength="20"
                           v-model="data.label"
                           v-filter-special-char
                           @input="changeCategoryInput(data.label)">
                    <span class="enter" @click.stop="hadnleTreeInput(data,data.isNewAdd)">
                        <svg-icon icon-class="tree-yes"></svg-icon>
                    </span>
                    <span class="cancel" @click.stop="cancelhadnleTreeInput(data,node)">
                        <svg-icon icon-class="tree-no"></svg-icon>
                    </span>
                </div>
                <template v-else>
                    <img v-if="data.thumbnailPicUrl" :src="data.thumbnailPicUrl+'?x-oss-process=image/resize,m_lfit,h_40,w_40'" />
                    <div style="cursor:move">
                        <span>{{data.label}}</span>
                        <span v-if="data.level<=1">({{data.leafSum }})</span>
                    </div>
                </template>
                <!-- 三个点 分类操作 -->
                <span class="set-tree-type"
                      @click.stop="handleShow(node,data)"
                      v-show="data.id === treeNodeId">
                    <svg-icon icon-class="tree-handler"></svg-icon>
                </span>
                <div class="tree-handle" v-show="node.data.id === curId">
                    <button v-if="node.data.level <3"
                            type="text"
                            size="mini"
                            @click.stop=" create(data,node)">
                        添加子分类
                    </button>
                    <button v-if="node.data.level>0"
                            type="text"
                            size="mini"
                            @click.stop="rename(data)">
                        修改名称
                    </button>

                    <button v-if="node.data.level>0"
                            type="text"
                            size="mini"
                            @click.stop="batchRemove( node,data)">
                        删除分类
                    </button>
                </div>
            </div>
        </el-tree>
    </div>
</template>
<script>
    export default {
        props: ["treeResult", "productSearchOptions", "isrightPannel"],
        data() {
            return {
                flag: false,
                curId: null,
                treeNodeId: null,
                renameShowId: null,
                isNewAdd: false,// false 允许创建子节点
                curlabelName: "",
                isRename: false,
                newAddNode: "",
                renameData: "",
            };
        },
        methods: {
            handlerOver(data) {
                if (!isNaN(data.id)) this.treeNodeId = data.id;
                if (this.isNewAdd) this.treeNodeId = null;
            },
            handlerMouseLeave() {
                this.treeNodeId = this.curId = null;
            },
            //修改节点名称 OR 新增节点
            hadnleTreeInput(data, isNewAdd) {
                this.isNewAdd = false; //点击确定修改后 开启允许创建子节点
                if (data.label == "") {
                    this.$message({
                        message: "分类名称不能为空",
                        type: "warning"
                    });
                }
                if (isNewAdd) {
                    this.$emit("create", {
                        DisplayName: data.label,
                        ParentId: data.parentId
                    });
                    return;
                }
                if (data.label != "") {
                    this.$emit("update", data.id, data.label, data.thumbnailPicUrl);
                    this.renameShowId = this.curId = null;
                }
                this.treeNodeId = null;
            },
            //
            cancelhadnleTreeInput(data, node) {
                if (this.isRename) {
                    if (data.label == "") {
                        this.$message({
                            message: "分类名称不能为空",
                            type: "warning"
                        });
                        return
                    }
                    if (this.curlabelName != "") {
                        data.label = this.curlabelName;
                    }

                } else {

                    node.parent.childNodes.splice(0, 1)
                    this.isRename = false;
                    this.isNewAdd = false;
                }
                // 点击取消按钮 关闭input框
                this.renameShowId = this.curId = null;
            },
            handleDragEnd(draggingNodeDom, targetNodeDom, dropType, ev) {
                var draggingNode = draggingNodeDom.data;
                var targetNode = targetNodeDom.data;
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
                        targetNode.parentId ? targetNode.parentId : 0;
                        break;
                    }
                    case "none":
                    default: {
                        return;
                    }
                }
                var idOrderByArr = [];
                for (var i = 0; i < targetNodeDom.parent.childNodes.length; i++) {
                    var childNode = targetNodeDom.parent.childNodes[i];
                    idOrderByArr.push(childNode.data.id);
                }
                this.modifyNode(
                    draggingNode.id,
                    draggingNode.parentId,
                    idOrderByArr
                );
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

            create(data, node) {
                if (!this.isNewAdd) {
                    this.isNewAdd = true;
                    const newChild = {
                        parentId: data.id,
                        label: "",
                        isNewAdd: true
                    };
                    data.children.unshift(newChild);
                }
                this.curId = null;
                this.newAddData = data;

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
                this.isRename = true;
                this.renameData = data;
                this.isNewAdd = true;
            },
            modifyNode(id, parentId, idOrderByArr) {
                this.$emit("modifyNode", id, parentId, idOrderByArr);
            },
            // 描述：
            batchRemove(node, data) {
                console.log(data, 'remove-----')
                this.$emit("batchRemove", this.getAllNodeIds(data));
            },
            changeCategory(data) {
                if (this.isrightPannel) {
                    console.log(data)
                    this.$emit("chooseNode", data)
                    return false
                }
                if (data.isNewAdd) return;
                this.curlabelName = data.label;
                this.productSearchOptions.categoryIdList = this.getAllNodeIds(data);
                this.$emit("getProList");
                // 点击其他区域 把当前新增但未确定的节点删除掉
                this.newAddData && this.newAddData.children.shift()
                if (this.renameShowId !== data.id) this.isNewAdd = false;

                //  // 点击其他区域 把当前重命名但未确定的，恢复重命名之前label
                if (this.renameData && this.renameShowId !== data.id) {
                    this.renameData.label = this.curlabelName;
                    this.renameShowId = null;
                }
            },
            handleShow(node, val) {
                node.checked = true;
                this.curId = node.data.id;
            },
            changeCategoryInput(label) {
                console.log(label);
            }
        },
        mounted() {
            // document.addEventListener("click",()=>{
            //    this.curId = null;
            // })
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
        .enter

    {
        margin: 0 5px;
    }

    .category-name {
        width: 86px;
        height: 30px;
        border: none;
        border: 1px solid rgba(229, 229, 229, 1);
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
        button

    {
        width: 100%;
        display: block;
        padding: 8px 14px;
        text-align: left;
        &:hover

    {
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
