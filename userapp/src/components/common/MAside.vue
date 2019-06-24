<template>
    <div
        class="m-aside"
        :style="{width:width+'px',transition: 'width .5s linear',backgroundColor:'#fff'}"
        @mouseenter="collapseOpen(150,0.8)"
        @mouseleave="collapseClose"
    >
        <el-aside class="m-asideleft" :style="{width:width+'px'}">
            <ul class="left-menu">
                <li
                    class="left-menu-item"
                    v-for="(it, i) in menuList"
                    :key="i"
                    @mouseenter="changeCurHoverItem(i)"
                    @click="skipPages(it)"
                >
                    <!-- <svg-icon :icon-class="'l-' + it.code"></svg-icon> -->
                    <!-- :class="curIndex==i ? it.code+"-on" : it.code" -->
                    <i class="menu-icon" :class="curIndex==i ? it.code+'-on' : it.code"></i>
                    <span class="menu-item-content">{{it.name}}</span>
                </li>
            </ul>
        </el-aside>
        <LeftNavComponents
            v-if="menuList.length"
            :style="{width:width1+'px !important',transition: 'width '+time+' linear',backgroundColor:'#fff'}"
            class="m-asideright"
            :menuList="menuList[curIndex]"
        ></LeftNavComponents>
    </div>
</template>
<script>
import { getSliderMenuList, checkHasRootSkip } from "@/api/index";
import LeftNavComponents from "../Aside/LeftNavComponents";

export default {
    data() {
        return {
            flag: 0,
            width: 50,
            width1: 0,
            time: "0.8s",
            curIndex: 0,
            menuList: [],
            serversData: []
        };
    },
    components: {
        LeftNavComponents
    },
    created() {
        // this.filterMenuListData(this.menuData.menuList);
    },
    methods: {
        getMenuListData() {
            //let { data } = await getSliderMenuList();
            // this.serversData = data;
            let data = this.$store.state.validateMenu;
            console.log(data, "=========");
            if (data && data.isAdmin) {
                this.menuList = this.filterMenuListData(data);
            } else {
                this.menuList = this.filterUserMenuListData(data);
                // console.log(this.treeData(data, "id", "parentId", "children"));
                // this.menuList = this.treeData(data, "id", "parentId", "children");
                // console.log(this.menuList ,'--00000000000')
            }
        },
        filterMenuListData(data) {
            let filterList = [];
            let obj = {};
            // data.menuList.map((it, i) => {
            //   if (data.resourceUrls.indexOf(it.menuUrl) !== -1) {
            //     filterList.push(it);
            //   }
            // });
            data.menuList
                .sort((a, b) => {
                    return a.parentId - b.parentId;
                })
                .map((it, i) => {
                    //   debugger;
                    if (obj[it.parentId]) {
                        obj[it.parentId].children =
                            obj[it.parentId].children &&
                            obj[it.parentId].children.length
                                ? obj[it.parentId].children
                                : [];
                        obj[it.parentId].children.push(it);
                        obj[it.parentId].children.sort((v, k) => {
                            return v.orderId - k.orderId;
                        });
                    } else {
                        if (it.parentId == 0) {
                            obj[it.id] = it;
                        } else {
                            filterList.push(it);
                        }
                    }
                });
            let result = Object.values(obj).sort((c, d) => {
                return c.orderId - d.orderId;
            });
            return result;
        },

        filterUserMenuListData(data) {
            let filterList = []; // 最终筛选的 菜单集合
            let fliterParentId = []; // 二级的parenteid
            let fliterId = []; // 一级菜单的 id
            let parentList = []; // 通过二级菜单 筛选出的一级
            let cloneData = JSON.parse(JSON.stringify(data));
            cloneData.menuList.map((it, i) => {
                if (cloneData.resourceUrls.indexOf(it.menuUrl) !== -1) {
                    filterList.push(it);
                    if (it.parentId !== 0) {
                        fliterParentId.push(it.parentId);
                    } else {
                        fliterId.push(it.id);
                    }
                }
            });
            fliterParentId = Array.from(new Set(fliterParentId));
            cloneData.menuList.forEach(item => {
                if (fliterParentId.indexOf(item.id) !== -1) {
                    parentList.push(item);
                }
            });
            let result = [...filterList, ...parentList];

            return this.treeData(result);
        },
        filterUserMenuListData1(data) {
            let filterList = [];
            let obj = {};
            data.menuList.map((it, i) => {
                if (data.resourceUrls.indexOf(it.menuUrl) !== -1) {
                    filterList.push(it);
                }
            });
            console.log(filterList);

            filterList
                .sort((a, b) => {
                    return a.parentId - b.parentId;
                })
                .map((it, i) => {
                    //   debugger;
                    if (obj[it.parentId]) {
                        obj[it.parentId].children =
                            obj[it.parentId].children &&
                            obj[it.parentId].children.length
                                ? obj[it.parentId].children
                                : [];
                        obj[it.parentId].children.push(it);
                        obj[it.parentId].children.sort((v, k) => {
                            return v.orderId - k.orderId;
                        });
                    } else {
                        if (it.parentId == 0) {
                            obj[it.id] = it;
                        } else {
                            filterList.push(it);
                        }
                    }
                });
            let result = Object.values(obj).sort((c, d) => {
                return c.orderId - d.orderId;
            });
            return result;
        },
        treeData(source) {
            let cloneData = JSON.parse(JSON.stringify(source));
            console.log(cloneData);
            return cloneData.filter(father => {
                let branchArr = cloneData.filter(
                    child => father.id == child.parentId
                );
                branchArr.length > 0 ? (father.children = branchArr) : "";
                return father.parentId == 0; // 如果第一层不是parentId=0，请自行修改
            });
        },

        changeCurHoverItem(i) {
            this.curIndex = i;
        },
        skipPages(item) {
             let host = window.location.host;
             
        },
        collapseOpen(width, time) {
            this.width = width;
            this.width1 = 120;
            this.time = time + "s";
        },
        collapseClose() {
            this.width = 50;
            this.width1 = 0;
            this.time = "0s";
        }
    },
    computed: {
        validateMenu() {
            return this.$store.state.validateMenu;
        }
    },
    watch: {
        validateMenu() {
            this.getMenuListData();
        }
    }
};
</script>

<style scoped>
.left-menu-item:hover {
    background: #e5f8fa;
    color: #00c1de;
}

.m-aside {
    position: absolute;
    left: 0;
    top: 50px;
    bottom: 0;
    z-index: 10;
}
.m-asideleft {
    overflow: hidden;
    height: 100%;
}
.m-asideright {
    width: 0px !important;
    position: absolute;
    left: 150px;
    z-index: 10;
    top: 0;
    text-align: center;
    overflow: hidden;
}
.el-menu {
    height: 100%;
}
</style>
<style lang="scss" scoped>
// 手写菜单
.left-menu {
    height: 100%;
    border-right: solid 1px #e6e6e6;
    background: #fff;
    .left-menu-item {
        cursor: pointer;
        padding: 0 20px;
        line-height: 40px;
        white-space: nowrap;
        .menu-item-content {
            margin-left: 20px;
        }
        .menu-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: middle;
        }
        .board {
            background: url("~img/menu-icon/board.png") no-repeat center;
            background-size: 100%;
        }
        .board-on {
            background: url("~img/menu-icon/board-on.png") no-repeat center;
            background-size: 100%;
        }
        .content {
            background: url("~img/menu-icon/content.png") no-repeat center;
            background-size: 100%;
        }
        .content-on {
            background: url("~img/menu-icon/content-on.png") no-repeat center;
            background-size: 100%;
        }
        .micro {
            background: url("~img/menu-icon/micro.png") no-repeat center;
            background-size: 100%;
        }
        .micro-on {
            background: url("~img/menu-icon/micro-on.png") no-repeat center;
            background-size: 100%;
        }
        .website {
            background: url("~img/menu-icon/website.png") no-repeat center;
            background-size: 100%;
        }
        .website-on {
            background: url("~img/menu-icon/website-on.png") no-repeat center;
            background-size: 100%;
        }
        .wechat {
            background: url("~img/menu-icon/wechat.png") no-repeat center;
            background-size: 100%;
        }
        .wechat-on {
            background: url("~img/menu-icon/wechat-on.png") no-repeat center;
            background-size: 100%;
        }
        .form {
            background: url("~img/menu-icon/form.png") no-repeat center;
            background-size: 100%;
        }
        .form-on {
            background: url("~img/menu-icon/form-on.png") no-repeat center;
            background-size: 100%;
        }
        .system {
            background: url("~img/menu-icon/system.png") no-repeat center;
            background-size: 100%;
        }
        .system-on {
            background: url("~img/menu-icon/system-on.png") no-repeat center;
            background-size: 100%;
        }
        .recycle {
            background: url("~img/menu-icon/recycle.png") no-repeat center;
            background-size: 100%;
        }
        .recycle-on {
            background: url("~img/menu-icon/recycle-on.png") no-repeat center;
            background-size: 100%;
        }
    }
}
</style>

