<template>
<!-- 
   :clearable="clearable" 
    @clear="clearHandle"
 -->
    <el-select  
    id="el-select" 
    ref="elSelect" 
    :popper-append-to-body="false" 
    :value="valueTitle" 
   
    size="small"
    >
            <el-option :value="valueTitle" :label="valueTitle">
                <el-tree
                    id="tree-option"
                    ref="selectTree"
                    :expand-on-click-node="false"
                    :accordion="accordion"
                    :data="treeResult"
                    :props="props"
                    :node-key="props.value"
                    :default-expanded-keys="defaultExpandedKey"
                    @node-click="handleNodeClick"
                ></el-tree>
            </el-option>
             
        </el-select>
</template>

<script>
export default {
  name: "el-tree-select",
  props:{
    /* 配置项 */
    props:{
      type: Object,
      default:()=>{
        return {
          value:'id',             // ID字段名
          label: 'label',         // 显示名称
          children: 'children'    // 子级字段名
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    treeResult:{
      type: Array,       
      default: ()=>{ return [] }
    },
    categoryName:{
        type:String,
        default:"全部分类"
    },
    /* 初始值 */
    value:{
      type: Number,
      default: ()=>{ return null }
    },
    /* 可清空选项 */
    clearable:{
      type:Boolean,
      default:()=>{ return true }
    },
    /* 自动收起 */
    accordion:{
      type:Boolean,
      default:()=>{ return false }
    },
  },
  data() {
    return {
      valueId:null,    // 初始值
      valueTitle:this.categoryName,
      defaultExpandedKey:[]    
    }
  },
  mounted(){
    this.initHandle()
  },
  methods: {
    // 初始化值
    initHandle(){
        console.log(this.valueId)
      if(this.valueId){
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label]     // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
        this.defaultExpandedKey = [this.valueId]      // 设置默认展开
      } 
      this.$nextTick(()=>{
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => ele.style.width = 0)
      })
 
    },
    // 切换选项
    handleNodeClick(node){
        this.$refs.elSelect.blur()
       console.log(node)
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('chooseNode',node)
      this.defaultExpandedKey = [];
      this.clearSelected()
    },
    // 清除选中
    clearHandle(){
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('chooseNode',null)
    },
    /* 清空选中样式 */
    clearSelected(){
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
     
      allNode.forEach((element)=>element.classList.remove('is-current'))
    }
  },
  watch: {
    value(){
        console.log(this.value)
      this.valueId = this.value
      this.initHandle()
    },
    categoryName(){
       this.valueTitle = this.categoryName
    }
  },
};
</script>

<style scoped>
.el-select{
    width: 80%
}
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
</style>
