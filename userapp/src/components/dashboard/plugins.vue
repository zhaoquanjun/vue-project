<template>
    <el-row class="plugin-section" :gutter="16">
        <el-col class="plugins-box" :span="12" v-for="(it, idx) in  plugins" :key="idx">
            <div class="box-inner">
                <span class="plugin-l plugin-item" :class="it.pluginCode"></span>
                <span class="plugin-r plugin-item">
                    <h2>{{it.name}}</h2>
                    <p>{{it.description}}</p>
                    <p>{{it.isActive ? '激活' : '未激活'}}</p>
                    <div :class="pluginsPic(it)" class="backgroundImg"></div>
                </span>
            </div>
        </el-col>
       
    </el-row>
</template>

<script>
export default {
    props: ["plugins"],
    data() {
        return {
            clonePlugins: []
        };
    },
    methods: {
        pluginsPic(it) {
            switch (it.pluginCode) {
                case "MicroProgram":
                    return "MicroProgramGround";
                case "AliPayProgram":
                    return "AliPayProgramGround";
                case "OfficialAccounts":
                    return "OfficialAccountsGround";
                case "Form":
                    return "FormGround";
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
            position: relative;
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
            .MicroProgram {
                background: url("~img/dashboard/board-wxprogram.png") no-repeat
                    center;
                background-size: contain;
            }
            .AliPayProgram {
                background: url("~img/dashboard/board-alipay.png") no-repeat
                    center;
                background-size: contain;
            }
            .OfficialAccounts {
                background: url("~img/dashboard/board-wxpublicNumber.png")
                    no-repeat center;
                background-size: contain;
            }
            .Form {
                background: url("~img/dashboard/board-form.png") no-repeat
                    center;
                background-size: contain;
            }
            .backgroundImg {
                position: absolute;
                right: 0px;
                bottom: 0px;
            }
            .MicroProgramGround {
                width: 132px;
                height: 118px;
                background: url("~img/dashboard/board-pluginImg1.png") no-repeat;
                background-position: right bottom;
                background-size: contain;
            }
            .AliPayProgramGround {
                width: 131px;
                height: 127px;
                background: url("~img/dashboard/board-pluginImg2.png") no-repeat;
                background-position: right bottom;
                background-size: contain;
            }
            .OfficialAccountsGround {
                width: 108px;
                height: 122px;
                background: url("~img/dashboard/board-pluginImg3.png") no-repeat;
                background-position: right bottom;
                background-size: contain;
            }
            .FormGround {
                width: 132px;
                height: 107px;
                background: url("~img/dashboard/board-pluginImg4.png") no-repeat;
                background-position: right bottom;
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
