<template>
    <div id="asideTree" class="aside-tree">
        <el-scrollbar >
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
               <button class="drop-btn" ><i class="iconfont icontuodongdian"></i></button>
                <div class="node-label-wrap">
                    <span class="node-label">{{data.label}}</span>
                    <span>({{data.leafSum }})</span>
                </div>
                <span
                    class="set-tree-type"
                    @click.stop="handleShow($event,node,data)"
                    v-show="data.id === treeNodeId"
                >
                    <i class="iconfont iconsangedian" style="font-size:30px"></i>
                </span>
            </div>
        </el-tree>
        </el-scrollbar>
        <div class="category-name-pic" ref="operateSection">
            <UploadCategoryPic
                :isUpload="false"
                :modifyCategoryData="modifyCategoryData"
                @createCategory="createCategory"
                @closeUploadCategoryPic="closeUploadCategoryPic"
            />
        </div>
        <div @click="closeUploadCategoryPic1" class="tree-handle" ref="operateSection1">
            <button v-if="curClickNode.data.level <3" type="text" size="mini" @click="create">添加子分类</button>
            <button v-if="curClickNode.data.level>0" type="text" size="mini" @click="rename">修改名称</button>

            <button
                v-if="curClickNode.data.level>0"
                type="text"
                size="mini"
                @click="batchRemove"
            >删除分类</button>
        </div>
    </div>
</template>
<script>
import UploadCategoryPic from "@/components/ProductManage/uploadCategoryPic";
import { trim } from "@/utlis/index"
export default {
    props: ["treeResult", "picSearchOptions", "isrightPannel"], // 与产品分类不一致的地方 picSearchOptions
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
            modifyCategoryData: {}, // 编辑分类需要传当前节点的名称和imgurl,

            curClickNode: { data: { level: "" } }
        };
    },
    mounted() {
        document.addEventListener("click", () => {
            this.$nextTick(() => {
                if (this.$refs.operateSection1)
                    this.$refs.operateSection1.style.display = "none";
            });
        });
    },
    methods: {
        createCategory(displayName, thumbnailPicUrl) {
            if (this.isAdd) {
                this.$emit("create", {
                    DisplayName: trim(displayName),
                    ParentId: this.createCategoryData.id,
                    thumbnailPicUrl: thumbnailPicUrl
                });
            } else {
                this.$emit(
                    "rename", // 与产品分类不一致的地方
                    this.createCategoryData.id,
                    trim(displayName),
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
                    draggingNode.parentId = targetNode.parentId ? targetNode.parentId: 0;
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

            console.log(draggingNode, targetNode, dropType)
            draggingNode = draggingNode.data;
            targetNode = targetNode.data;
            //判断是否大于三层
            if (
                dropType === "inner" ||
                draggingNode.parentId !== targetNode.parentId
            ) {
                return this.getLevel(draggingNode, 1) + targetNode.level <= 3;
            }else{
               
            }
            return true;
        },
        // 添加分类  0720
        create(ev, node, data) {
            this.modifyCategoryData = {}; //创建新分类 不需传
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
            this.modifyCategoryData = this.curClickData;
            this._handleShowMoreOperate(ev, node, data);
        },
        modifyNode(id, parentId, idOrderByArr) {
            this.$emit("modifyNode", id, parentId, idOrderByArr);
        },
        // 描述： 删除分类
        batchRemove(node, data) {
            data = this.curClickData;
            this.$emit("batchRemove", this.getAllNodeIds(data));
        },
        // 点击节点的时候
        changeCategory(data) {
            let allCategoryEle = document.querySelector(".el-tree")
                .childNodes[0].childNodes[0];
            if (data.level === 0) {
                this.setCss(allCategoryEle, {
                    background: "#e0faff",
                    color: "#00C1DE",
                    borderLeft: "2px solid #0595E6"
                });
            } else {
                this.setCss(allCategoryEle, {
                    background: "#fff",
                    color: "#606266",
                    border:0
                });
            }
            console.log(data,'   dfadfad')
           
            this.closeUploadCategoryPic();
            this.closeUploadCategoryPic1();
          this.picSearchOptions.categoryIdList = this.getAllNodeIds(data); // 与产品分类不一致的地方
          this.picSearchOptions.pageIndex = 1;// 与产品分类不一致的地方
           this.$emit("getPicList", data);
           this.$emit("chooseCategoryNode", data);// 与产品分类不一致的地方
        },
        // 取消第一个全部分类默认选中的样式
        setCss(obj, css) {
            for (var attr in css) {
                obj.style[attr] = css[attr];
            }
        },
        // 操作按钮出现 || 消失
        handleShow(ev, node, data) {
            console.log(node);
            if (this.curId === node.data.id) {
                node.checked = false;
                this.curId = 1;
            } else {
                node.checked = true;
                this.curId = node.data.id;
            }
            this.curClickData = data;
            this.curClickNode = node;
            this._handleShowMoreOperate1(ev, node);
        },
        // 分类上传图片
        _handleShowMoreOperate(ev, node, data) {
            console.log(this.curClickNode);
            this.createCategoryData = this.curClickData;
            this.$refs.operateSection.style.left =
                ev.pageX - ev.offsetX + 16 + "px";
            this.$refs.operateSection.style.top = ev.pageY - ev.offsetY + "px";
            this.$refs.operateSection.style.display = "block";
        },

        // 新增 0730  关闭分类操作菜单
        closeUploadCategoryPic1() {
            this.$refs.operateSection1.style.display = "none";
        },
        handleCategory1() {
            this.closeUploadCategoryPic1();
        },
        // 新增0730   分类操作菜单显示
        _handleShowMoreOperate1(ev, row) {
            this.$refs.operateSection1.style.left =
                ev.pageX - ev.offsetX + 46 + "px";
            this.$refs.operateSection1.style.top =
                ev.pageY - ev.offsetY  + "px";
            if (this.$refs.operateSection1.style.display === "block") {
                this.$refs.operateSection1.style.display = "none";
            } else {
                this.$refs.operateSection1.style.display = "block";
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../style/manageAsideTree";
.category-name-pic {
    width: 282px;
    height: 140px;
    background: #fff;
    display: none;
    position: absolute;
    z-index: 19;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.09);
}

.categoryPic {
    width: 16px;
    height: 16px;
    padding-right: 5px;
}
</style>
