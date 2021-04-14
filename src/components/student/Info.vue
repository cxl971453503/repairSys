<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path: '/Studenthome'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
        <el-breadcrumb-item>我的个人信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-form :model="stuInfoForm" :rules="stuInfoFormRules" ref="stuInfoFormRef" label-width="100px">
                <el-form-item label="学号" prop="id">
                    <el-input v-model="stuInfoForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="stuInfoForm.name" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="stuInfoForm.age" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                        <el-radio v-model="stuInfoForm.sex" :label="0" :disabled="editInfo">男</el-radio>
                        <el-radio v-model="stuInfoForm.sex" :label="1" :disabled="editInfo">女</el-radio>
                    </el-form-item>
                <el-form-item label="年级" prop="grade">
                    <el-select v-model="stuInfoForm.grade" placeholder="请选择" disabled>
                        <el-option
                        v-for="item in gradeLst"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="stuInfoForm.username" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="stuInfoForm.password" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="stuInfoForm.phone" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="住址">
                    <el-input :placeholder="this.getplacename" disabled></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部区域 -->
            <span :class="this.editInfo == false ? 'footer-button-none' : 'footer-button-flex'">
                <el-button type="primary" @click="editInfo = false">修 改</el-button>
            </span>
            <span :class="this.editInfo == true ? 'footer-button-none' : 'footer-button-flex'">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="editStudentInfo">确 定</el-button>
            </span>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        // 验证手机的规则
        var checkMobile = (rule, value, cb) => {
            // 验证手机号的正则表达式
            const regMoblie = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

            if(regMoblie.test(value)){
                return cb();
            }

            cb(new Error('请输入合法的手机号'));
        }
        var checkAge = (rule, value, cb) => {
            if(isNaN(parseInt(value))){
                return cb(new Error('请输入数字'));
            }else {
                if(parseInt(value) > rule.max_age || parseInt(value) < rule.min_age){
                    return cb(new Error('年龄范围在10到100岁之间'));
                }else{
                    return cb();
                }
            }
        }
        return{
            nowtime: null,
            // 登录学生信息
            stuInfoForm:{},
            stuInfoFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur'},
                    { min: 2, max: 20, message: '姓名的长度在2~20个字符之间', trigger: 'blur'}
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur'},
                    { max_age: 100, min_age: 10, validator: checkAge, trigger: 'blur'}
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
            gradeLst: [],
            placeList: [],
            getplacename: '',
            editInfo: true,
        }
    },
    created(){
        this.getStudentInfo();
        this.getPlaceList();
        this.getGradeList();
    },
    methods: {
        updateDate(){
            this.nowtime = new Date().getTime();
        },
        // 登录后获取学生信息
        async getStudentInfo(){
            const {data:res} = await this.$http.get('/student/getStudentById',{
                params: {
                    id: null,
                    token: window.sessionStorage.token
                }
            })
            this.stuInfoForm = res.data;

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
            this.queryPlaceName(this.stuInfoForm.region);
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
        },
        editStuInfo(){
            this.editInfo = false;
        },
        // 更新学生信息信息并提交
        editStudentInfo() {
            this.updateDate();
            // 预验证
            this.$refs.stuInfoFormRef.validate(valid => {
                if(!valid) return;

                this.$http.get('/student/updateStudentById',{
                    params:{
                        id: this.stuInfoForm.id,
                        username: this.stuInfoForm.username,
                        password: this.stuInfoForm.password,
                        name: this.stuInfoForm.name,
                        region: this.stuInfoForm.region,
                        grade: this.stuInfoForm.grade,
                        phone: this.stuInfoForm.phone,
                        age: this.stuInfoForm.age,
                        sex: this.stuInfoForm.sex,
                        lasthandletime: this.stuInfoForm.lasthandletime
                    }
                });
                // 关闭对话框
                this.editInfo = true;
                this.$message.success('修改信息成功！');
                // 刷新数据列表
                this.getStudentInfo();
            })
        },
        cancelEdit(){
            this.$refs.stuInfoFormRef.resetFields();
            this.getStudentInfo();
            this.editInfo = true;
        }
    }
}
</script>
<style scoped>
.content {
    display: flex;
    justify-content: center;
}
.footer-button-flex {
    display: flex;
    justify-content: flex-end;
}
.footer-button-none {
    display: none;
}
</style>