<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
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
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加设备</el-button>
                </el-col>
            </el-row>

            <!-- 学生列表区域 -->
            <el-table :data="deviceList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="设备名" prop="name"></el-table-column>
                <el-table-column label="设备型号" prop="type"></el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-tooltip effect="dark" content="编辑设备信息" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除设备" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteDeviceById(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageindex" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!-- 修改设备信息的对话框 -->
            <el-dialog title="修改设备信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
                <!-- 内容主体区域 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <el-form-item label="设备编号">
                        <el-input v-model="editForm.id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型" prop="type">
                        <el-input v-model="editForm.type"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editDeviceInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 添加设备信息的对话框 -->
            <el-dialog title="添加设备" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
                <!-- 内容主体区域 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <el-form-item label="设备名称" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型" prop="type">
                        <el-input v-model="addForm.type"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addDeviceInfo">确 定</el-button>
                </span>
            </el-dialog>
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
            deviceList: [],
            // 控制修改设备信息对话框的显示与隐藏
            addDialogVisible: false,
            // 存储当前修改设备的信息
            addForm: {
                name: '',
                type: ''
            },
            addFormRules: {
                name: [{required: true, message: '请输入设备名称', trigger: 'blur'}]
            },
            // 控制修改设备信息对话框的显示与隐藏
            editDialogVisible: false,
            // 存储当前修改设备的信息
            editForm: {},
            editFormRules: {
                name: [{required: true, message: '请输入设备名称', trigger: 'blur'}]
            }
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
        },
        // 监听添加设备信息对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 更新设备信息信息并提交
        addDeviceInfo() {
            // 预验证
            this.$refs.addFormRef.validate(valid => {
                if(!valid) return;

                this.$http.get('/device/addDevice',{
                    params:{
                        name: this.addForm.name,
                        type: this.addForm.type
                    }
                });
                // 关闭对话框
                this.addDialogVisible = false;
                // 刷新数据列表
                this.getDeviceList();
            })
        },
        // 展示更新设备信息的对话框
        async showEditDialog(id) {
            const {data: res} = await this.$http.get('/device/getDeviceById',{
                params: {id:id}
            });
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 监听更新设备信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 更新设备信息信息并提交
        editDeviceInfo() {
            // 预验证
            this.$refs.editFormRef.validate(valid => {
                if(!valid) return;

                this.$http.get('/device/updateDeviceById',{
                    params:{
                        id: this.editForm.id,
                        name: this.editForm.name,
                        type: this.editForm.type
                    }
                });
                // 关闭对话框
                this.editDialogVisible = false;
                this.$message.success('信息修改成功！');
                // 刷新数据列表
                this.getDeviceList();
            })
        },
        // 根据id删除对应的设备
        async deleteDeviceById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            // console.log(confirmResult);
            if(confirmResult != 'confirm'){
                return this.$message.info('已经取消删除！');
            }

            await this.$http.delete('device/deleteDeviceById',{
                params: {
                    id: id
                }
            });
            this.$message.success('已经成功删除！');
            this.getDeviceList();
        }
    }
}
</script>
<style scoped>

</style>