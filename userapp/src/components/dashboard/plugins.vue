<template>
    <el-row class="plugin-section" :gutter="16">
        <el-col class="plugins-box" :span="12" v-for="(it, idx) in plugins" :key="idx">
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
        return {};
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
            .DashBoard-on {
                background: url("~img/dashboard/board-websiteOn.png") no-repeat
                    center;
                    background-size: contain;
            }
            .Content {
                background: url("~img/dashboard/board-micro.png") no-repeat
                    center;
                    background-size: contain;
            }
            .Content-on {
                background: url("~img/dashboard/board-microOn.png") no-repeat
                    center;
                 background-size: contain;
            }
            .pc-mobile {
              background: url("~img/dashboard/board-alipayOn.png") no-repeat
                    center;
               background-size: contain;
            }
            .pc-mobile-on {
                 background: url("~img/dashboard/board-alipay.png") no-repeat center;
               background-size: contain;
            }
            .MicroProgram {
                background: url("~img/dashboard/board-wechat.png") no-repeat
                    center;
               background-size: contain;
            }
            .MicroProgram-on {
                background: url("~img/dashboard/board-wechatOn.png") no-repeat
                    center;
               background-size: contain;
            }
            .Form {
                background: url("~img/dashboard/board-form.png") no-repeat
                    center;
               background-size: contain;
            }
            .Form-on {
                background: url("~img/dashboard/board-formOn.png") no-repeat
                    center;
               background-size: contain;
            }
            .Identity {
                background: url("~img/dashboard/board-develop.png") no-repeat
                    center;
               background-size: contain;
            }
            .Identity-on {
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
                   // padding-top: 18px;
                    line-height: 17px;
                    color: #00c1de;
                }
            }
        }
    }
}
</style>
