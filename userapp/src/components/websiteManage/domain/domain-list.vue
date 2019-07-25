<template>
     <div class="table-wrap" id="table-list">
                    <el-table
                        ref="multipleTable"
                        :data="siteInfo"
                        tooltip-effect="dark"
                        class="content-table"
                    >
                        <el-table-column prop="siteName" label="站点名称"></el-table-column>
                        <el-table-column prop="backupTime" label="备份时间"></el-table-column>
                        <el-table-column prop="dataSize" label="备份包大小"></el-table-column>
                        <el-table-column prop="userName" label="备份人"></el-table-column>
                        <el-table-column prop="description" label="备注" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <div class="handle-btn-wrap">
                                    <button class="handle-btn backup-btn" ></button>
                                    <button class="handle-btn download-btn" ></button>
                                    <button class="handle-btn delete-btn" ></button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
</template>
