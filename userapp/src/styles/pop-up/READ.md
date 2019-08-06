  this.$confirm(
                "删除后，图片将被移动到回收站，可在回收站中恢复，是否确定删除？",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    iconClass:"icon-warning", // 自定义图标 
                    callback: async action => {}
                }
  )    