# content-manage

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
 
### IMG 路径 
background: url("~img/list-mode.png") no-repeat center;
 
 ### SVN
 <svg-icon icon-class="l-recyclebin"></svg-icon>

cookies内  vtfsjogp 的值为 userInfo的appName和头像url
           tjufje 为 siteId
<!-- 对应的每一个字母为对应的字母的下一个字母 -->

### 删除对话框
 ```
this.$confirm(
                "若该分类下存在数据，删除后数据将自动移动到上一级分类中，是否确认删除该分类？",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: async action => {
                        console.log(action);
                        if (action === "confirm") {
                            let {
                                status
                            } = await imgCategoryManageApi.batchRemove(idList);
                            if (status === 200) {
                                this.getTree();
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                            }
                        } else {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        }
                    }
                }
            );

 ```