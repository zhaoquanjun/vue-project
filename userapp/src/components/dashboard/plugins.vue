<template>
    <el-row class="plugin-section" :gutter="16">
        <el-col class="plugins-box" :span="12" v-for="(it, idx) in  p" :key="idx">
            <div class="box-inner" @click="checkSkipRoot(it)">
                <span class="plugin-l plugin-item" :class="pluginsPic(it)"></span>
                <span class="plugin-r plugin-item">
                    <h2>{{it.name}}</h2>
                    <p>{{it.description}}</p>
                    <p>{{it.isActive ? '激活' : '未激活'}}</p>
                </span>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { checkHasRootSkip } from "@/api/index";
export default {
    props: ["plugins"],
    data() {
        return {
            clonePlugins: "",
            p: [
                 {
                       pluginCode: "DashBoard",
                  
                    name: "网站",
                    description: "Pc，手机两站板式单独设计，更适合用户访问",
                    isActive: true,
                    imageUrl: null,
                    menuUrl: "design.console.wezhan.cn",
                    id: 1002
                },
                  {
                       pluginCode: "Content",
                    name: "微信小程序",
                    description: "助力您搭建线下微信互动行销方式",
                    isActive: true,
                    imageUrl: null,
                    menuUrl: "",
                    id: 1003
                },
                {
                       pluginCode: "Pc/Mobile",
                  
                    name: "支付宝小程序",
                    description: "即将上线,敬请关注",
                    isActive: true,
                    imageUrl: null,
                    menuUrl: "dashboard.console.wezhan.cn",
                    id: 1000
                },
                {
                    pluginCode: "MicroProgram",
                   
                    name: "微站内容管理",
                    description: "微站内容管理",
                    isActive: true,
                    imageUrl: null,
                    menuUrl: "content.console.wezhan.cn",
                    id: 1001
                },
               
              
                {
                    pluginCode: "Form",
                    name: "表单",
                    description: "帮助您轻松完成信息收集与管理",
                    isActive: true,
                    imageUrl: null,
                    menuUrl: "form.console.wezhan.cn",
                    id: 1004
                },
                {
                    pluginCode: "Identity",
                    name: "登录中心",
                    description: "微站统一登录中心",
                    isActive: true,
                    imageUrl: null,
                    menuUrl: null,
                    id: 1005
                }
            ]
        };
    },
    created() {
        console.log(JSON.stringify(this.plugins));
    },
    methods: {
        async checkSkipRoot(it) {
            let { data, status } = await checkHasRootSkip({ url: it.menuUrl });
            if (status == 200) {
                location.href = `//${it.menuUrl}`;
            }
        },
        pluginsPic(it) {
            switch (it.pluginCode) {
                case "DashBoard":
                    return it.pluginCode;
                case "Content":
                    return it.pluginCode;
                case "Pc/Mobile":
                    return "pc-mobile";
                case "MicroProgram":
                    return it.pluginCode;
                case "Form":
                    return it.pluginCode;
                case "Identity":
                    return it.pluginCode;
            }
        }
    },
    computed: {}
};
</script>

<style lang="scss" scoped>
body {
    background: #f5f5f6;
}
.plugin-section {
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
    .plugins-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        //padding-left: 48px;
        margin-bottom: 16px;
        cursor: pointer;
        .box-inner {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background: #fff;
            padding: 30px 50px;
            padding-right: 10px;
            border: 1px solid transparent;
            &:hover {
                border: 1px solid #00c1de;
            }
            .plugin-item {
                display: block;
            }
            .plugin-l {
                width: 48px;
                height: 48px;
            }
            .DashBoard {
                background: url("~img/dashboard/board-website.png") no-repeat
                    center;
                background-size: contain;
            }
            &:hover .DashBoard {
                background: url("~img/dashboard/board-websiteOn.png") no-repeat
                    center;
                background-size: contain;
            }
            .Content {
                background: url("~img/dashboard/board-micro.png") no-repeat
                    center;
                background-size: contain;
            }
            &:hover .Content {
                background: url("~img/dashboard/board-microOn.png") no-repeat
                    center;
                background-size: contain;
            }
            .pc-mobile {
                background: url("~img/dashboard/board-alipayOn.png") no-repeat
                    center;
                background-size: contain;
            }
            &:hover .pc-mobile {
                background: url("~img/dashboard/board-alipay.png") no-repeat
                    center;
                background-size: contain;
            }
            .MicroProgram {
                background: url("~img/dashboard/board-wechat.png") no-repeat
                    center;
                background-size: contain;
            }
            &:hover .MicroProgram {
                background: url("~img/dashboard/board-wechatOn.png") no-repeat
                    center;
                background-size: contain;
            }
            .Form {
                background: url("~img/dashboard/board-form.png") no-repeat
                    center;
                background-size: contain;
            }
            &:hover .Form {
                background: url("~img/dashboard/board-formOn.png") no-repeat
                    center;
                background-size: contain;
            }
            .Identity {
                background: url("~img/dashboard/board-develop.png") no-repeat
                    center;
                background-size: contain;
            }
            &:hover .Identity {
                background: url("~img/dashboard/board-developOn.png") no-repeat
                    center;
                background-size: contain;
            }
            .plugin-r {
                margin-left: 40px;
                h2 {
                    font-size: 18px;
                    line-height: 25px;
                    // padding-top: 30px;
                }
                p:first-of-type {
                    font-size: 12px;
                    padding-top: 4px;
                    line-height: 17px;
                    color: #8c8c8c;
                }
                p:last-of-type {
                    font-size: 12px;
                    padding-top: 18px;
                    line-height: 17px;
                    color: #00c1de;
                }
            }
        }
    }
}
</style>
