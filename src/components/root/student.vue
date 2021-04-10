<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理学生</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="根据姓名搜索" v-model="queryInfo.name" clearable @clear="getStudentList">
                        <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 学生列表区域 -->
            <el-table :data="studentList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="年龄" prop="age"></el-table-column>
                <el-table-column label="性别">
                    <template slot-scope="scope">{{scope.row.sex == 0 ? "男" : "女"}}</template>
                </el-table-column>
                <el-table-column label="操作" width="90px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-tooltip effect="dark" content="更新学生信息" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageindex" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!-- 修改用户的对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
                <!-- 内容主体区域 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <el-form-item label="学号">
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
                    <el-form-item label="年级" prop="grade">
                        <el-select v-model="editForm.grade" placeholder="请选择">
                            <el-option
                            v-for="item in gradeLst"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
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
                    <el-form-item label="住址">
                        <el-input :placeholder="this.getplacename" disabled></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editStudentInfo">确 定</el-button>
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
            placeList: [],
            studentList: [],
            gradeLst: [],
            // 控制修改学生信息对话框的显示与隐藏
            editDialogVisible: false,
            // 存储当前修改学生的信息
            editForm: [],
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur'},
                    { min: 2, max: 20, message: '姓名的长度在2~20个字符之间', trigger: 'blur'}
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur'},
                    { min: 2, max: 2, message: '年龄在10~100之间', trigger: 'blur'}
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur'}
                ],
                grade: [
                    { required: true, message: '请选择年级', trigger: 'blur'}
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur'},
                    { min: 6, max: 16, message: '用户名的长度在6~16个字符之间', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur'},
                    { min: 6, max: 16, message: '密码的长度在6~16个字符之间', trigger: 'blur'}
                ],
                phone: [
                    { required: true, message: '请输入联系方式', trigger: 'blur'},
                    { validator: checkMobile, trigger: 'blur'}
                ]
            },
            getplacename: ''
        }
    },
    created(){
        this.getStudentList()
        this.getPlaceList()
        this.getGradeList()
    },
    methods:{
        updateDate(){
            this.nowtime = new Date().getTime();
        },
        // 获取/更新学生列表信息
        async getStudentList(){
            const {data: res} = await this.$http.get('/student/findAllStudent',{
                params: this.queryInfo
            });
            this.studentList = res.data;
            this.total = res.total;
        },
        async getPlaceList(){
            const {data: res} = await this.$http.get('/getPlace',{
                params: null
            });
            for(let index in res.data){
                if(res.data[index].level == 0){
                    this.placeList.push(res.data[index]);
                    this.placeList[index].children = [];
                    this.placeList[index].newname = res.data[index].name;
                }else if(res.data[index].level == 1){
                    for(let i = 0; i < this.placeList.length; i++){
                        if(this.placeList[i].id == res.data[index].pid) {
                            this.placeList[i].children.push(res.data[index]);
                            this.placeList[i].children[this.placeList[i].children.length - 1].newname = this.placeList[i].newname + this.placeList[i].children[this.placeList[i].children.length - 1].name;
                        }
                    }
                }else{
                    for(let i = 0; i < this.placeList.length; i++){
                        for(let j = 0; j < this.placeList[i].children.length; j++){
                            if(this.placeList[i].children[j].id == res.data[index].pid) {
                                if(!this.placeList[i].children[j].children) {
                                    this.placeList[i].children[j].children = [];
                                }
                                this.placeList[i].children[j].children.push(res.data[index]);
                                this.placeList[i].children[j].children[this.placeList[i].children[j].children.length - 1].newname = this.placeList[i].children[j].newname + this.placeList[i].children[j].children[this.placeList[i].children[j].children.length - 1].name;
                            }
                        }
                    }
                }
            }
        },
        queryPlaceName(queryid){
            for(let i = 0;i < this.placeList.length;i++){
                for(let j = 0; j < this.placeList[i].children.length; j++){
                    for(let k = 0; k < this.placeList[i].children[j].children.length; k++){
                        if(this.placeList[i].children[j].children[k].id == queryid){
                            this.getplacename = this.placeList[i].children[j].children[k].newname;
                            break;
                        }
                    }
                    
                }
            }
        },
        async getGradeList(){
            const {data:res} = await this.$http.get('/getGrade',{
                params: null
            })
            this.gradeLst = res.data;
            // console.log(this.gradeLst);
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
        // 展示更新学生信息的对话框
        async showEditDialog(id) {
            const {data: res} = await this.$http.get('/student/getStudentById',{
                params: {id:id}
            });
            this.queryPlaceName(res.data.region);
            // console.log(this.getplacename);
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 监听更新学生信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 更新学生信息信息并提交
        editStudentInfo() {
            this.updateDate();
            // 预验证
            this.$refs.editFormRef.validate(valid => {
                if(!valid) return;

                this.$http.get('/student/updateStudentById',{
                    params:{
                        id: this.editForm.id,
                        username: this.editForm.username,
                        password: this.editForm.password,
                        name: this.editForm.name,
                        region: this.editForm.region,
                        grade: this.editForm.grade,
                        phone: this.editForm.phone,
                        age: this.editForm.age,
                        sex: this.editForm.sex,
                        lasthandletime: this.editForm.lasthandletime
                    }
                });
                // 关闭对话框
                this.editDialogVisible = false;
                this.$message.success('修改信息成功！');
                // 刷新数据列表
                this.getStudentList();
            })
        }
    }
}
</script>
<style scoped>

</style>