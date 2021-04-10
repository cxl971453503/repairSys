<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path: '/Studenthome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>设备管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看设备</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="根据设备名搜索" v-model="queryInfo.name" clearable @clear="getDeviceList">
                        <el-button slot="append" icon="el-icon-search" @click="getDeviceList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 学生列表区域 -->
            <el-table :data="deviceList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="设备名" prop="name"></el-table-column>
                <el-table-column label="设备型号" prop="type"></el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageindex" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // 获取设备的参数对象
            queryInfo: {
                // 当前每页显示多少条数据
                pageSize: 5,
                // 当前页数
                pageindex: 1,
                // 查阅的名字
                name: null
            },
            total: 0,
            deviceList: []
        }
    },
    created(){
        this.getDeviceList();
    },
    methods:{
        async getDeviceList(){
            const {data:res} = await this.$http.get("device/findAllDevice",{
                params: this.queryInfo
            })
            this.deviceList = res.data;
            this.total = res.total;
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getDeviceList();
        },
        // 监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pageindex = newPage;
            this.getDeviceList();
        }
    }
}
</script>
<style scoped>

</style>