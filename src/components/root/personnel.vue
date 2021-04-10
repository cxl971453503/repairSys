<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理维修人员</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="根据姓名搜索" v-model="queryInfo.name" clearable @clear="getPersonnelList">
                        <el-button slot="append" icon="el-icon-search" @click="getPersonnelList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加维修人员</el-button>
                </el-col>
            </el-row>

            <!-- 维修人员列表区域 -->
            <el-table :data="personnelList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="年龄" prop="age"></el-table-column>
                <el-table-column label="性别">
                    <template slot-scope="scope">{{scope.row.sex == 0 ? "男" : "女"}}</template>
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-tooltip effect="dark" content="编辑维修人员信息" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除维修人员" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deletePersonnelById(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageindex" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 修改维修人员信息的对话框 -->
            <el-dialog title="修改维修人员信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
                <!-- 内容主体区域 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <el-form-item label="工号">
                        <el-input v-model="editForm.id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model="editForm.age"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio v-model="editForm.sex" :label="0">男</el-radio>
                        <el-radio v-model="editForm.sex" :label="1">女</el-radio>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="editForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="editForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="phone">
                        <el-input v-model="editForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="管理区域" prop="region">
                        <el-select v-model="editForm.region">
                            <el-option
                            v-for="item in placeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editPersonnelInfo">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 添加维修人员的对话框 -->
            <el-dialog title="添加维修人员" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
                <!-- 内容主体区域 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model="addForm.age"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio v-model="addForm.sex" :label="0">男</el-radio>
                        <el-radio v-model="addForm.sex" :label="1">女</el-radio>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="phone">
                        <el-input v-model="addForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="管理区域" prop="region">
                        <el-select v-model="addForm.region">
                            <el-option
                            v-for="item in placeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addPersonnelInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data () {
        // 验证手机的规则
        var checkMobile = (rule, value, cb) => {
            // 验证手机号的正则表达式
            const regMoblie = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

            if(regMoblie.test(value)){
                return cb();
            }

            cb(new Error('请输入合法的手机号'));
        }
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 当前每页显示多少条数据
                pageSize: 5,
                // 当前页数
                pageindex: 1,
                // 查阅的名字
                name: null
            },
            nowtime: null,
            total: 0,
            placeList: [
                {
                    id: 1,
                    name: 'A区'
                },
                {
                    id: 2,
                    name: 'B区'
                }
            ],
            personnelList: [],
            // 控制添加维修人员信息对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                name: '',
                region: null,
                phone: null,
                age: null,
                sex: null
            },
            // 添加表单的验证规则对象
            addFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '姓名的长度在2~20个字符之间', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' },
                    { min: 2, max: 3, message: '年龄在10~100之间', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur'}
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 6, max: 16, message: '用户名的长度在6~16个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码的长度在6~16个字符之间', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择管理区域', trigger: 'blur'}
                ]
            },
            // 控制修改维修人员信息对话框的显示与隐藏
            editDialogVisible: false,
            // 存储当前修改维修人员的信息
            editForm: {},
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '姓名的长度在2~20个字符之间', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' },
                    { min: 2, max: 2, message: '年龄在10~100之间', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur'}
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 6, max: 16, message: '用户名的长度在6~16个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码的长度在6~16个字符之间', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择管理区域', trigger: 'blur'}
                ]
            }
        }
    },
    created(){
        this.getPersonnelList()
    },
    methods:{
        updateDate(){
            this.nowtime = new Date().getTime();
        },
        async getPersonnelList(){
            const {data: res} = await this.$http.get('personnel/findAllPersonnel',{
                params: this.queryInfo
            });
            this.personnelList = res.data;
            this.total = res.total;
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
        // 监听添加维修人员信息对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加维修人员
        addPersonnelInfo(){
            this.$refs.addFormRef.validate(valid => {
                if(!valid) return;

                this.$http.get('personnel/addPersonnel',{
                    params: this.addForm
                });
                this.addDialogVisible = false;
                this.getPersonnelList();
                this.$message.success('添加维修人员成功！');
            })
        },
        // 展示更新维修人员信息的对话框
        async showEditDialog(id) {
            const {data: res} = await this.$http.get('/personnel/getPersonnelById',{
                params: {id:id}
            });
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 监听更新维修人员信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 更新维修人员信息信息并提交
        editPersonnelInfo() {
            this.updateDate();
            // 预验证
            this.$refs.editFormRef.validate(valid => {
                if(!valid) return;

                this.$http.get('/personnel/updatePersonnelById',{
                    params:{
                        id: this.editForm.id,
                        username: this.editForm.username,
                        password: this.editForm.password,
                        name: this.editForm.name,
                        region: this.editForm.region,
                        phone: this.editForm.phone,
                        age: this.editForm.age,
                        sex: this.editForm.sex,
                        lasthandletime: this.editForm.lasthandletime
                    }
                });
                // 关闭对话框
                this.editDialogVisible = false;
                // 刷新数据列表
                this.getPersonnelList();
            })
        },
        //根据id删除对应的维修人员
        async deletePersonnelById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            // console.log(confirmResult);
            if(confirmResult != 'confirm'){
                return this.$message.info('已经取消删除');
            }

            await this.$http.delete('personnel/deletePersonnelById',{
                params: {
                    id: id
                }
            });
            this.$message.success('已经成功删除');
            this.getPersonnelList();
        }
    }
}
</script>
<style scoped>

</style>