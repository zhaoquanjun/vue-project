<template>
    <div id="asideTree" class="aside-tree">
        <div class="el-scrollbar" v-scrollBar>
            <el-tree
                :data="treeResult"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                @node-drag-end="handleDragEnd"
                @node-click="changeCategory"
                @node-drag-enter="dragEnter"
                ref="tree"
                :draggable="draggable"
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                :highlight-current="true"
            >
                <div
                    class="custom-tree-node"
                    @mouseover="handlerOver(data)"
                    @mouseleave="handlerMouseLeave"
                    slot-scope="{ node, data }"
                    style="cursor: pointer;"
                >
                    <img
                        class="categoryPic"
                        v-if="data.thumbnailPicUrl && isProduct"
                        :src="data.thumbnailPicUrl+'?x-oss-process=image/resize,m_lfit,h_40,w_40'"
                    />
                    <button class="drop-btn" v-if="node.data.level>0 && draggable">
                        <i class="iconfont icontuodongdian"></i>
                    </button>
                    <div class="node-label-wrap" :class="{'label-weight':node.data.level<=1}">
                        <el-tooltip :disabled="data.label.length < 8" effect="dark" :content="data.label" placement="top">
                            <span class="node-label">{{data.label}}</span>
                        </el-tooltip>
                        <span v-if="!isProduct">({{data.inUseSum }})</span>
                    </div>
                    <span
                        class="set-tree-type"
                        @click.stop="handleShow($event,node,data)"
                        v-show="data.id === treeNodeId && draggable"
                    >
                        <i class="iconfont iconsangedian" style="font-size:24px"></i>
                    </span>
                </div>
            </el-tree>
        </div>
        <div
            class="category-name-pic"
            :class="{upload:isProduct}"
            v-show="isHandlerCategoryMenuShow"
            ref="operateSection"
        >
            <UploadCategoryPic
                v-if="isHandlerCategoryMenuShow"
                :isUpload="isProduct?true:false"
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
import UploadCategoryPic from "@/components/ProductManage/productUploadCategoryPic";
import { trim } from "@/utlis/index";
export default {
    // picSearchOptions
    props: ["treeResult", "listOptions", "isArticle", "isProduct", "isPopup"], // 与产品分类不一致的地方 picSearchOptions isPopup是否为图片弹框
    components: {
        UploadCategoryPic
    },
    data() {
        return {
            draggable: true, // 是否允许拖拽
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
            curClickNode: { data: { level: "" } },
            isHandlerCategoryMenuShow: false,
            isChangeCategoryShow:false,
            categoryId: 0
        };
    },
    mounted() {
        document.addEventListener("click", () => {
            this.$nextTick(() => {
                if (this.$refs.operateSection1)
                    this.$refs.operateSection1.style.display = "none";
            });
        });
        this.draggable = this.isContentwrite;
    },
    methods: {
        createCategory(displayName, thumbnailPicUrl) {
            if (this.isAdd) {
                if (this.isArticle) {
                    this.$emit("create", {
                        CategoryName: trim(displayName),
                        ParentId: this.createCategoryData.id
                    });
                } else {
                    this.$emit("create", {
                        DisplayName: trim(displayName),
                        ParentId: this.createCategoryData.id,
                        thumbnailPicUrl: thumbnailPicUrl
                    });
                }
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

        //////////////
        handlerOver(data) {
            if (!isNaN(data.id)) this.treeNodeId = data.id;
            if (this.isNewAdd) this.treeNodeId = null;
        },
        selectCategoryByNodeId(nodeId) {
            nodeId = nodeId || 0;
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(nodeId);
            });
        },
        handlerMouseLeave() {
            this.treeNodeId = this.curId = null;
        },
        cancelhadnleTreeInput(data, node) {
            if (this.isRename) {
                if (data.label == "") {
                    this.$notify({
                        customClass: "notify-warning", //  notify-success ||  notify-error
                        message: `分类名称不能为空!`,
                        showClose: false,
                        duration: 1500
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
            // let level = this.getLevel(draggingNodeDom, 1) + targetNodeDom.level;
            let eles = document.getElementsByClassName("el-tree-node__content");
            for (let i = 0; i < eles.length; i++) {
                let ele = eles[i];
                ele.style.background = "";
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
                    console.log("none");
                    return;
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
            if (targetNode.data.level == 0) return;
            draggingNode = draggingNode.data;
            targetNode = targetNode.data;
            //判断是否大于三层
            if (
                dropType === "inner" ||
                draggingNode.parentId !== targetNode.parentId
            ) {
                let level = this.getLevel(draggingNode, 1) + targetNode.level;
                return level <= 3;
            } else {
            }
            return true;
        },
        allowDrag(draggingNode) {
            return draggingNode.data.level !== 0;
        },
        dragEnter(draggingNode, targetNode, ev) {
            if (targetNode.data.level == 0) return;
            // document.querySelectorAll('.el-tree-node__content').style.background=""
            let eles = document.getElementsByClassName("el-tree-node__content");
            for (let i = 0; i < eles.length; i++) {
                let ele = eles[i];
                ele.style.background = "";
            }

            ev.srcElement.style.background = "#F8FAFC";
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
            if(this.categoryId == data.id){
                return
            }
            this.categoryId = data.id
            let allCategoryEle = document.querySelector(".el-tree")
                .childNodes[0].childNodes[0];
            if (data.level === 0) {
                this.setCss(allCategoryEle, {
                    background: "#F8FAFC",
                    color: "#262626",
                    borderLeft: "2px solid #0595E6"
                });
            } else {
                this.setCss(allCategoryEle, {
                    background: "#fff",
                    color: "#262626",
                    border: 0
                });
            }
            this.closeUploadCategoryPic();
            this.closeUploadCategoryPic1();

            
            this.listOptions.categoryIdList = this.getAllNodeIds(data);
            this.listOptions.pageIndex = 1; // 与产品分类不一致的地方
            this.$emit("chooseCategoryNode", data); // 与产品分类不一致的地方
            this.$emit("getList", data);
        },
        // 取消第一个全部分类默认选中的样式
        setCss(obj, css) {
            for (var attr in css) {
                obj.style[attr] = css[attr];
            }
        },
        // 操作按钮出现 || 消失
        handleShow(ev, node, data) {
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
            this.createCategoryData = this.curClickData;
            if(this.isPopup){
                let location = this.handlerClicklocation();
                this.$refs.operateSection.style.left =
                    ev.pageX - location.clientWidth - ev.offsetX + 8 + "px";
                this.$refs.operateSection.style.top =
                    ev.pageY - location.clientHeight - ev.offsetY + "px";
            }else{
                this.$refs.operateSection.style.left = ev.pageX - ev.offsetX + 16 + "px";
                this.$refs.operateSection.style.top = ev.pageY - ev.offsetY + "px";
            }
            // this.$refs.operateSection.style.display = "block";
            this.isHandlerCategoryMenuShow = true;
        },
        // 关闭 分类操作菜单显示
        closeUploadCategoryPic() {
            // this.$refs.operateSection.style.display = "none";
            this.isHandlerCategoryMenuShow = false;
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
            if(this.isPopup){
                let location = this.handlerClicklocation();
                this.$refs.operateSection1.style.left =
                    ev.pageX - location.clientWidth - ev.offsetX + 32 + "px";
                this.$refs.operateSection1.style.top =
                    ev.pageY - location.clientHeight - ev.offsetY + "px";
            }else{
                this.$refs.operateSection1.style.left = ev.pageX - ev.offsetX + 32 + "px";
                this.$refs.operateSection1.style.top = ev.pageY - ev.offsetY + "px";
            }
            if (this.$refs.operateSection1.style.display === "block") {
                this.$refs.operateSection1.style.display = "none";
            } else {
                this.$refs.operateSection1.style.display = "block";
            }
        },
        handlerClicklocation() {
            let content = document.getElementsByClassName("contentDialog")[0];
            let contentW = parseFloat(getComputedStyle(content).width);
            let contentH = parseFloat(getComputedStyle(content).height);
            let clientWidth =
                ((document.documentElement.clientWidth ||
                    document.body.clientWidth) -
                    contentW) /
                2;
            let clientHeight =
                ((document.documentElement.clientHeight ||
                    document.body.clientHeight) -
                    contentH) /
                2;
            return { clientWidth, clientHeight };
        }
    },
    computed: {
        isContentwrite() {
            return this.$store.state.dashboard.isContentwrite;
        }
    }
};
</script>

<style lang="scss" scoped>

// .category-name-pic {
//     width: 282px;
//     height: 140px;
//     background: #fff;
//     display: block;
//     position: absolute;
//     z-index: 2000;
//     box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.09);
// }

// .upload {
//     height: 200px;
// }

// .categoryPic {
//     width: 16px;
//     height: 16px;
//     padding-right: 5px;
// }

// .label-weight {
//     font-weight: 500;
//     // line-height: 40px;
//     // height: 40px !important;
// }

// .aside-tree{
//     // height: calc(100% - 60px);
//     padding-top: 25px;
//     .drop-btn{
//         display: none;
//         width:20px;height:20px;
//         position: absolute;
//         left: 5px;
//         top: 10px;
//         cursor:grab;
//       i{
//           color: #A1A8B1;
//       }
//     }
//     .custom-tree-node {
//         overflow: hidden;
//         text-overflow: ellipsis;
//         white-space: nowrap;
//         display: block;
//         width: 100%;
//         height: 100%;
//         display: flex;
//         align-items: center;
//          .node-label-wrap{
//              color: #262626;
//             display: flex;align-items: center;height: 100%;width: 100%;
//         }
//           .node-label {
//             display: block;
//             max-width: 100px;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//         }
//         .category-name {
//             width: 86px;
//             height: 30px;
//             border: none;
//             border: 1px solid rgba(229, 229, 229, 1);
//         }
//     }
//     .tree-handle {
//         display: none;
//         position: absolute;
//         right: -88px;
//         top: 0;
//         z-index: 1000;
//         background: #ffffff;
//         width: 120px;
//         background: rgba(255, 255, 255, 1);
//         box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.07);
//         padding: 5px 0;
//         border-radius: 2px;
//         button {
//             width: 100%;
//             display: block;
//             padding: 8px 14px;
//             text-align: left;
//             font-size: 14px;
//             &:hover {
//                 background: $--background-color-hover;
//             }
//         }
//     }
//     .set-tree-type {
//         cursor: pointer;
//         position: absolute;
//         right: 5px;
//         // width: 33px;
//         // height: 28px;
//         // top: 5px;
//         z-index: 10;
//         border-radius: 2px;
//         text-align: center;
//         // background: #e0faff;
//     }
//     .set-tree-type:hover{
//         // background: #C5F0F8;
       
// //     }
// // }
</style>
