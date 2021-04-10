<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>表单管理</el-breadcrumb-item>
        <el-breadcrumb-item>申请表管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="申请人姓名" v-model="queryInfo.name" clearable @clear="getAccessoryList">
                        <el-button slot="append" icon="el-icon-search" @click="getAccessoryList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="2" class="statusLable">状态：</el-col>
                <el-col :span="6">
                    <el-select v-model="queryInfo.status" @change="queryAccessoryByStatus()">
                        <el-option v-for="item in statusList" :key="item.status" :value="item.status" :label="item.name"></el-option>
                    </el-select>
                </el-col>
            </el-row>

            <!-- 申请表列表区域 -->
            <el-table :data="AccessoryList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="配件名称" prop="name"></el-table-column>
                <el-table-column label="配件数量" prop="number"></el-table-column>
                <el-table-column label="申请人姓名" prop="personnelname"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.status == '0'">未审核</el-tag>
                        <el-tag type="success" v-if="scope.row.status == '1'">已同意</el-tag>
                        <el-tag type="danger" v-if="scope.row.status == '2'">已拒绝</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="90px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="审核申请表" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageindex" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <el-dialog title="审核申请表" :visible="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
                    <el-form-item label="配件名称" prop="name">
                        <el-input v-model="editForm.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="配件数量" prop="number">
                        <el-input v-model="editForm.number" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="申请人姓名" prop="personnelname">
                        <el-input v-model="editForm.personnelname" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="申请人联系方式" prop="personnelphone">
                        <el-input v-model="editForm.personnelphone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="申请时间" prop="createtime">
                        <el-input v-model="editForm.createtime" disabled></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="danger" @click="editAccessoryRefuse" :disabled="editButton">拒 绝</el-button>
                    <el-button type="primary" @click="editAccessoryAgree" :disabled="editButton">同 意</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 当前每页显示多少条数据
                pageSize: 5,
                // 当前页数
                pageindex: 1,
                // 查阅的名字
                name: null,
                status: null
            },
            nowtime: null,
            total: 0,
            statusList: [
                {
                    status: null,
                    name: '查看全部'
                },
                {
                    status: 0,
                    name: '未审核'
                },
                {
                    status: 1,
                    name: '已通过'
                },
                {
                    status: 2,
                    name: '已拒绝'
                }
            ],
            AccessoryList: [],
            // 控制审核申请表对话框的显示与隐藏
            editDialogVisible: false,
            // 存储当前修改学生的信息
            editForm: {},
            editFormRules: {},
            editButton: false
        }
    },
    created(){
        this.getAccessoryList();
    },
    methods:{
        // 获取/更新申请表列表信息
        async getAccessoryList(){
            const {data:res} = await this.$http.get('/accessory/findAllAccessory',{
                params: this.queryInfo
            });
            this.AccessoryList = res.data;
            console.log(this.AccessoryList);
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getPersonnelList();
        },
        // 监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pageindex = newPage;
            this.getPersonnelList();
        },
        // 展示审核申请表的对话框
        async showEditDialog(id) {
            const {data: res} = await this.$http.get('/accessory/getAccessoryById',{
                params: {id:id}
            });
            
            this.editForm = res.data;
            this.editDialogVisible = true;
            if(this.editForm.status != '0'){
                this.editButton = true;
            }
            console.log(this.editForm);
        },
        // 监听更新学生信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
            this.editDialogVisible = false;
        },
        // 点击按钮同意申请表
        async editAccessoryAgree(){
            this.editForm.status = 1;
            const {data:res} = await this.$http.get('/accessory/updateAccessoryById',{
                params: this.editForm
            })
            console.log(res);
            this.getAccessoryList();
            this.editDialogVisible = false;
            this.editButton = false;
        },
        // 点击按钮拒绝申请表
        async editAccessoryRefuse(){
            this.editForm.status = 2;
            const {data:res} = await this.$http.get('/accessory/updateAccessoryById',{
                params: this.editForm
            })
            console.log(res);
            this.getAccessoryList();
            this.editDialogVisible = false;
            this.editButton = false;
        },
        queryAccessoryByStatus(){
            this.getAccessoryList();
        }
    }
}
</script>
<style scoped>
.statusLable {
    display: flex;
    justify-content: flex-end;
    line-height: 40px;
    padding-right: 0px !important;
}
</style>