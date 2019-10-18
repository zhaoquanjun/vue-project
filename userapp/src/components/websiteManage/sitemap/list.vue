<template>
  <div class="table-list" id="table-list">
    <el-table
      ref="multipleTable"
      :data="listData.list"
      tooltip-effect="dark"
      class="content-table"
      @selection-change="handleSelectionChange"
    >
      <template slot="empty">
        <div class="empty-table">
          <img src="~img/memberManage/table-empty.png" />
          <span>无数据</span>
        </div>
      </template>
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="title" :label="type + '标题'" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.title}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pagePath" :label="type + '地址'" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div class="overflow">{{scope.row.pagePath}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="更新时间" min-width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.updateTime.substr(0,10) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="权重" min-width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.priority" @change="chosePriority(scope.row)">
            <el-option
              v-for="item in priorityList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="更新频率" min-width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.frequencyStr" @change="chosefrequency(scope.row)">
            <el-option
              v-for="item in frequencyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80">
        <template slot-scope="scope">
          <div>
            <button class="hoverBtn" style="margin-right:16px" @click="remove(scope.row)">
              <i class="iconfont iconshanchu"></i>
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="list-footer" v-show="listData.totalRecord > 0">
      <div class="pageing" id="pageing">
        <slot name="paging"></slot>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="listData.totalRecord"
          :page-count="listData.totalPage"
          :page-size="listData.pageSize"
          :page-sizes="[10,20,50]"
          @current-change="changePage"
          @size-change="changeSize"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Object
    },
    listType: {
      type: String
    }
  },
  data() {
    return {
      type: "页面",
      priorityList: [
        {
          value: 1.0,
          label: 1.0
        },
        {
          value: 0.9,
          label: 0.9
        },
        {
          value: 0.8,
          label: 0.8
        },
        {
          value: 0.7,
          label: 0.7
        },
        {
          value: 0.6,
          label: 0.6
        },
        {
          value: 0.5,
          label: 0.5
        },
        {
          value: 0.4,
          label: 0.4
        },
        {
          value: 0.3,
          label: 0.3
        },
        {
          value: 0.2,
          label: 0.2
        },
        {
          value: 0.1,
          label: 0.1
        }
      ],
      frequencyList: [
        {
          value: "always",
          label: "经常"
        },
        {
          value: "hourly",
          label: "每小时"
        },
        {
          value: "daily",
          label: "每天"
        },
        {
          value: "weekly",
          label: "每周"
        },
        {
          value: "monthly",
          label: "每月"
        },
        {
          value: "yearly",
          label: "每年"
        },
        {
          value: "never",
          label: "从不"
        }
      ]
    };
  },
  methods: {
    // 单选或全选操作
    handleSelectionChange(list) {
      console.log(list);
      this.$emit("handleSelectionChange", list);
    },
    chosePriority(row) {
      let para = {
        idList: [row.id],
        priority: row.priority
      };
      this.$emit("update", para);
    },
    chosefrequency(row) {
      let para = {
        idList: [row.id],
        frequency: row.frequencyStr
      };
      this.$emit("update", para);
    },
    remove(row) {
      this.$emit("remove", [row.id]);
    },
    changePage(page) {
      this.$emit("chagePage", page);
    },
    changeSize(size) {
      this.$emit("changeSize", size);
    }
  },
  watch: {
    listType() {
      if (this.listType == "page") {
        this.type = "页面";
      } else if (this.listType == "news") {
        this.type = "文章";
      } else if (this.listType == "product") {
        this.type = "产品";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.table-list {
  border: 1px solid #e1e6ea;
  border-top: none;
  border-bottom: none;
}
.overflow {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.hoverBtn {
  padding: 8px;
  background: transparent;
  &:hover {
    background: rgba(240, 243, 247, 1);
  }
}
</style>


