<template>
    <div id="asideTree" class="aside-tree">
        <el-tree
            :data="treeResult"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-drag-end="handleDragEnd"
            @node-click="changeCategory"
            accordion
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
                <img
                    class="categoryPic"
                    v-if="data.thumbnailPicUrl"
                    :src="data.thumbnailPicUrl+'?x-oss-process=image/resize,m_lfit,h_40,w_40'"
                />
                <div class="node-label-wrap">
                    <el-tooltip class="item" effect="dark" :content="data.label" placement="bottom">
                        <span class="node-label">{{data.label}}</span>
                    </el-tooltip>
                    <span>({{data.leafSum }})</span>
                </div>
                <!-- 三个点 分类操作 -->
                <!--  -->
                <!-- _handleShowMoreOperate($event,node,data) -->
                <span
                    class="set-tree-type"
                    @click.stop="handleShow($event,node,data)"
                    v-show="data.id === treeNodeId"
                >
                    <svg-icon icon-class="tree-handler"></svg-icon>
                </span>
                <div class="tree-handle" v-show="node.data.id === curId">
                    <button
                        v-if="node.data.level <3"
                        type="text"
                        size="mini"
                        @click.stop=" create($event,node,data)"
                    >添加子分类</button>
                    <button
                        v-if="node.data.level>0"
                        type="text"
                        size="mini"
                        @click.stop="rename($event,node,data)"
                    >编辑分类</button>

                    <button
                        v-if="node.data.level>0"
                        type="text"
                        size="mini"
                        @click.stop="batchRemove( node,data)"
                    >删除分类</button>
                </div>
            </div>
        </el-tree>
        <div class="category-name-pic" ref="operateSection">
            <UploadCategoryPic
                :modifyCategoryData="modifyCategoryData"
                @createCategory="createCategory"
                @closeUploadCategoryPic="closeUploadCategoryPic"
            />
        </div>
    </div>
</template>
<script>
import UploadCategoryPic from "./uploadCategoryPic";
export default {
    props: ["treeResult", "productSearchOptions", "isrightPannel"],
    components: {
        UploadCategoryPic
    },
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
            createCategoryData: "", // 当前点击的创建分类节点
            isAdd: false, // true 添加 false编辑
            modifyCategoryData: {} // 编辑分类需要传当前节点的名称和imgurl
        };
    },
      mounted() {
        // document.addEventListener("click", () => {
        //     this.$nextTick(() => {
        //         if (this.$refs.operateSection)
        //             this.$refs.operateSection.style.display = "none";
        //     });
        // });
    },
    methods: {
        createCategory(displayName, thumbnailPicUrl) {
            if (this.isAdd) {
                this.$emit("create", {
                    DisplayName: displayName,
                    ParentId: this.createCategoryData.id,
                    thumbnailPicUrl: thumbnailPicUrl
                });
            } else {
                this.$emit(
                    "update",
                    this.createCategoryData.id,
                    displayName,
                    thumbnailPicUrl
                );
            }
            this.closeUploadCategoryPic();
        },
        closeUploadCategoryPic() {
            this.$refs.operateSection.style.display = "none";
        },
        //////////////
        handlerOver(data) {
            if (!isNaN(data.id)) this.treeNodeId = data.id;
            if (this.isNewAdd) this.treeNodeId = null;
        },
        handlerMouseLeave() {
            this.treeNodeId = this.curId = null;
        },
        cancelhadnleTreeInput(data, node) {
            if (this.isRename) {
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
        // 添加分类  0720
        create(ev, node, data) {
           
            this.modifyCategoryData = ""; //创建新分类 不需传
            this._handleShowMoreOperate(ev, node, data);
            this.isAdd = true;
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
        // 编辑分类 0720
        rename(ev, node, data) {
            this.isAdd = false;
            this.modifyCategoryData = data;
            this._handleShowMoreOperate(ev, node, data);
        },
        modifyNode(id, parentId, idOrderByArr) {
            this.$emit("modifyNode", id, parentId, idOrderByArr);
        },
        // 描述： 删除分类
        batchRemove(node, data) {
            console.log(data, "remove-----");
            this.$emit("batchRemove", this.getAllNodeIds(data));
        },
        // 点击节点的时候
        changeCategory(data) {
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
            this.closeUploadCategoryPic();
              this.productSearchOptions.categoryIdList = this.getAllNodeIds(data);
            this.$emit("getProList")
            this.$emit("chooseCategoryNode",data)
        },
        // 取消第一个全部分类默认选中的样式
        setCss(obj, css) {
            for (var attr in css) {
                obj.style[attr] = css[attr];
            }
        },
        // 操作按钮出现
        handleShow(ev, node, val) {
            console.log(node)
            node.checked = true;
            this.curId = node.data.id;
        },

        _handleShowMoreOperate(ev, node, data) {
            this.createCategoryData = data;
            this.$refs.operateSection.style.left =
                ev.pageX - ev.offsetX + 16 + "px";
            this.$refs.operateSection.style.top = ev.pageY - ev.offsetY + "px";
            this.$refs.operateSection.style.display = "block";
        }
    }
};
</script>
<style>
#content-manage .el-aside {
      overflow: visible !important;
    }
</style>

<style lang="scss" scoped>
@import "../style/manageAsideTree";
.category-name-pic {
    width: 282px;
    height: 190px;
    background: #fff;
    display: none;
    position: absolute;
    z-index: 19;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.09);
    // border: 1px solid rgba(216, 216, 216, 1);
    // &:after {
    //     position: absolute;
    //     content: "";
    //     left: -21px;
    //     top: 10px;
    //     border-top: 10px transparent dashed;
    //     border-left: 10px transparent dashed;
    //     border-bottom: 10px transparent dashed;
    //     border-right: 10px #fff solid;
    //      border: 1px solid rgba(216, 216, 216, 1);
    // }
}

.categoryPic {
    width: 16px;
    height: 16px;
    padding-right: 5px;
}
</style>
