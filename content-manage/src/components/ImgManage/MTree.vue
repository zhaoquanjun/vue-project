<template>
    <div id="asideTree" class="aside-tree">
        <el-tree
            :data="treeResult"
            node-key="id"
            :default-expand-all="isexpand"
            :expand-on-click-node="false"
            :indent="10"
            @node-drag-end="handleDragEnd"
            @node-click="changeCategory"
            ref="tree"
            draggable
            :allow-drop="allowDrop"
            :highlight-current="true"
        >
            <div
                class="custom-tree-node"
                @mouseover="handlerOver(data)"
                @mouseleave="handlerMouseLeave"
                slot-scope="{ node, data }"
            >
                <div
                    style="display: inline-block;"
                    v-if="renameShowId === data.id || data.isNewAdd"
                >
                    <input
                        class="category-name"
                        maxlength="20"
                        v-model="data.label"
                        @input="changeCategoryInput(data.label)"
                    />
                    <span class="enter" @click.stop="hadnleTreeInput(data,data.isNewAdd)">
                        <svg-icon icon-class="tree-yes"></svg-icon>
                    </span>
                    <span class="cancel" @click.stop="cancelhandleTreeInput(data,node)">
                        <svg-icon icon-class="tree-no"></svg-icon>
                    </span>
                </div>
                <template v-else>
                    <div class="node-label-wrap">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            :content="data.label"
                            placement="bottom"
                        >
                            <span class="node-label">{{data.label}}</span>
                        </el-tooltip>
                        <span>({{data.leafSum }})</span>
                    </div>
                </template>
                <!-- 三个点 分类操作 -->
                <span
                    class="set-tree-type"
                    @click.stop="handleShow($event,node,data)"
                    v-show="data.id === treeNodeId"
                >
                    <svg-icon icon-class="tree-handler"></svg-icon>
                </span>
            </div>
        </el-tree>
        <div @click="handleCategory" class="tree-handle" ref="operateSection">
            <button v-if="curClickNode.data.level <3" @click="create">添加子分类</button>
            <button v-if="curClickNode.data.level>0" @click="rename">修改名称</button>
            <button v-if="curClickNode.data.level>0" @click="batchRemove">删除分类</button>
        </div>
    </div>
</template>
<script>
let id = 1000;
export default {
    props: ["treeResult", "picSearchOptions", "isrightPannel", "isexpand"],
    data() {
        return {
            flag: false,
            curId: null,
            treeNodeId: null,
            renameShowId: null,
            isNewAdd: false, // false 允许创建子节点
            curlabelName: "",
            isRename: false,
            newAddNode: "",
            renameData: "",
            curClickNode: { data: { level: "" } }
        };
    },
    mounted() {
        document.addEventListener("click", () => {
            this.$nextTick(() => {
                if (this.$refs.operateSection)
                    this.$refs.operateSection.style.display = "none";
            });
        });
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
                return false;
            }
            if (isNewAdd) {
                this.$emit("create", {
                    DisplayName: data.label,
                    ParentId: data.parentId
                });
                return;
            }
            if (data.label != "") {
                this.$emit("rename", data.id, data.label);
                this.renameShowId = this.curId = null;
            }
            this.treeNodeId = null;
        },
        // 取消修改节点名称 OR 新增节点
        cancelhandleTreeInput(data, node) {
            if (this.isRename) {
                // 重命名节点名称不能为空
                if (data.label == "") {
                    this.$message({
                        message: "分类名称不能为空",
                        type: "warning"
                    });
                    return;
                }
                if (this.curlabelName != "") {
                    data.label = this.curlabelName;
                }
            } else {
                node.parent.childNodes.splice(0, 1);
                this.isRename = false;
                this.isNewAdd = false;
            }
            // 点击取消按钮 关闭input框
            this.renameShowId = this.curId = null;
        },
        // 拖拽完成
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
                    draggingNode.parentId = targetNode.parentId
                        ? targetNode.parentId
                        : 0;
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
        //  新增分类
        create() {
            if (!this.isNewAdd) {
                this.isNewAdd = true;
                const newChild = {
                    parentId: this.curClickData.id,
                    label: "",
                    isNewAdd: true
                };
                this.curClickData.children.unshift(newChild);
            }
            this.curId = null;
            this.newAddData = this.curClickData;
        },
        //  获取全部子节点的id
        getAllNodeIds(node, isChildNode) {
            var idList = isChildNode ? [] : [node.id];
            for (var i in node.children) {
                let child = node.children[i];
                idList.push(child.id);
                idList = idList.concat(this.getAllNodeIds(child, true));
            }
            return idList;
        },
        // 获取层级
        getLevel(node, level) {
            var localLevel = level;
            for (var i in node.children) {
                let child = node.children[i];
                var childLevel = this.getLevel(child, localLevel + 1);
                level = level < childLevel ? childLevel : level;
            }
            return level;
        },
        // 重命名分类名称
        rename() {
            this.renameShowId = this.curClickData.id;
            this.curId = null;
            this.isRename = true;
            this.renameData = this.curClickData;
            this.isNewAdd = true;
        },
        modifyNode(id, parentId, idOrderByArr) {
            this.$emit("modifyNode", id, parentId, idOrderByArr);
        },
        // 描述：
        batchRemove() {
            this.$emit("batchRemove", this.getAllNodeIds(this.curClickData));
        },
        // 点击分类节点
        changeCategory(data) {
            if (this.isrightPannel) {
                console.log(data);
                this.$emit("chooseNode", data);
                for (
                    var i = 0;
                    i < this.$refs.tree.store._getAllNodes().length;
                    i++
                ) {
                    this.$refs.tree.store._getAllNodes()[
                        i
                    ].expanded = this.isexpand;
                }
                return false;
            }

            if (data.isNewAdd) return;
            this.curlabelName = data.label;
            this.picSearchOptions.categoryIdList = this.getAllNodeIds(data);
             this.picSearchOptions.pageIndex = 1;
            // 点击其他区域 把当前新增但未确定的节点删除掉
            this.newAddData && this.newAddData.children.shift();
            if (this.renameShowId !== data.id) this.isNewAdd = false;

            //  // 点击其他区域 把当前重命名但未确定的，恢复重命名之前label
            if (this.renameData && this.renameShowId !== data.id) {
                this.renameData.label = this.curlabelName;
                this.renameShowId = null;
            }

            //  设置level为0 的是否被选中的样式
            let allCategoryEle = document.querySelector(".el-tree")
                .childNodes[0].childNodes[0];
            if (data.level === 0) {
                this.setCss(allCategoryEle, {
                    background: "#f7f7f7",
                    color: "#00C1DE",
                    border: "2px solid #00C1DE;"
                });
            } else {
                this.setCss(allCategoryEle, {
                    background: "#fff",
                    color: "#606266",
                    border: "none"
                });
            }
            this.$emit("getPicList", data);
            this.closeCategoryHandleMenu();
        },
        // 取消第一个全部分类默认选中的样式
        setCss(obj, css) {
            for (var attr in css) {
                obj.style[attr] = css[attr];
            }
        },
        handleShow(ev, node, data) {
            node.checked = true;
            this.curId = node.data.id;
            // 07 22新增
            this._handleShowMoreOperate(ev, node);
            this.curClickData = data;
            this.curClickNode = node;
        },
        // 新增0722   分类操作菜单显示
        _handleShowMoreOperate(ev, row) {
            this.$refs.operateSection.style.left =
                ev.pageX - ev.offsetX + 16 + "px";
            this.$refs.operateSection.style.top =
                ev.pageY - ev.offsetY - 50 + "px";
            if (this.$refs.operateSection.style.display === "block") {
                this.$refs.operateSection.style.display = "none";
            } else {
                this.$refs.operateSection.style.display = "block";
            }
        },
        // 新增 0722  关闭分类操作菜单
        closeCategoryHandleMenu() {
            this.$refs.operateSection.style.display = "none";
        },
        handleCategory() {
            this.closeCategoryHandleMenu();
        },
        changeCategoryInput(label) {
            console.log(label);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../style/manageAsideTree";
.tree-handle {
    display: none;
}
</style>
