<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{background:'#F5F5F5'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="handleDisable"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
      <el-table-column prop="count" label="权限数量(项)"></el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <el-popover :ref="`popover-${scope.$index}`" placement="bottom" width="400" trigger="click">
            <span slot="reference">{{scope.row.remark}} {{scope.$index}}</span>
            <div class="textareaWrap">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="textarea3"
              ></el-input>
              <div class="btn-wrap">
                <button
                  class="cancel"
                  slot="refenrence"
                  type="primary"
                  @click="cancelInput(scope.$index)"
                >取消</button>
                <button class="save">保存</button>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageing">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="1000"></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      textarea3: "123,",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          phone: "13520303156",
          remark: "备注",
          count: 5,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          phone: "13520303156",
          remark: "备注",
          count: 5,
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          phone: "13520303156",
          remark: "备注",
          count: 5,
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          phone: "13520303156",
          remark: "备注",
          count: 5,
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      multipleSelection: []
    };
  },
  methods: {
    handleDisable(row, index) {
      // 函数需要一个返回值,true为可选,false为不可选择
      if (index == 0) {
        return false;
      } else {
        return true;
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
        this.tableData = this.tableData.filter((item)=>{
        return item !== row
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    cancelInput(id) {
      this.$refs[`popover-${id}`].doClose();
    },
    // deleteMemberListItem(){
    //   this.tableData = this.tableData.filter((item)=>{
    //     return 
    //   })
    // }
  }
};
</script>
<style lang="scss" scoped>
.textareaWrap {
  padding: 10px;
  box-shadow: 0 0 5px #ccc;
  background: #fff;
  position: relative;
  .btn-wrap {
    text-align: right;
    padding-top: 10px;
    button {
      padding: 5px 10px;
      border: none;
    }
    .cancel {
      border: 1px solid #eeeeee;
      margin-right: 10px;
    }
    .save {
      background: #00c1de;
    }
  }
}
.hide {
  display: none;
}
.remark-textarea {
  display: block;
  position: absolute;
  top: 41px;
  left: 0;
  z-index: 100000;
}
.pageing {
  display: flex;
  float: right;
  margin-top: 30px;
}
.myCell .el-checkbox__input {
  display: none;
}
</style>


