<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path: '/Personnelhome'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
        <el-breadcrumb-item>我的个人信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-form :model="PerInfoForm" :rules="PerInfoFormRules" ref="PerInfoFormRef" label-width="100px">
                <el-form-item label="工号" prop="id">
                    <el-input v-model="PerInfoForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="PerInfoForm.name" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="PerInfoForm.age" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio v-model="PerInfoForm.sex" :label="0" :disabled="editInfo">男</el-radio>
                    <el-radio v-model="PerInfoForm.sex" :label="1" :disabled="editInfo">女</el-radio>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="PerInfoForm.username" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="PerInfoForm.password" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="PerInfoForm.phone" :disabled="editInfo"></el-input>
                </el-form-item>
                <el-form-item label="管理区域" prop="region">
                    <el-select v-model="PerInfoForm.region" :disabled="editInfo">
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
            <span :class="this.editInfo == false ? 'footer-button-none' : 'footer-button-flex'">
                <el-button type="primary" @click="editInfo = false">修 改</el-button>
            </span>
            <span :class="this.editInfo == true ? 'footer-button-none' : 'footer-button-flex'">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="editPerdentInfo">确 定</el-button>
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
            PerInfoForm:{},
            PerInfoFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur'},
                    { min: 2, max: 20, message: '姓名的长度在2~20个字符之间', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' },
                    { max_age: 100, min_age: 10, validator: checkAge, trigger: 'blur'}
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
            editInfo: true,
        }
    },
    created(){
        this.getPersonnelInfo();
    },
    methods: {
        updateDate(){
            this.nowtime = new Date().getTime();
        },
        // 登录后获取维修人员信息
        async getPersonnelInfo(){
            const {data:res} = await this.$http.get('/personnel/getPersonnelById',{
                params: {
                    id: null,
                    token: window.sessionStorage.token
                }
            })
            this.PerInfoForm = res.data;

        },
        // 更新维修人员信息信息并提交
        editPerdentInfo() {
            this.updateDate();
            // 预验证
            this.$refs.PerInfoFormRef.validate(valid => {
                if(!valid) return;

                this.$http.get('/personnel/updatePersonnelById',{
                    params:{
                        id: this.PerInfoForm.id,
                        username: this.PerInfoForm.username,
                        password: this.PerInfoForm.password,
                        name: this.PerInfoForm.name,
                        region: this.PerInfoForm.region,
                        phone: this.PerInfoForm.phone,
                        age: this.PerInfoForm.age,
                        sex: this.PerInfoForm.sex,
                        lasthandletime: this.PerInfoForm.lasthandletime
                    }
                });
                // 关闭对话框
                this.editInfo = true;
                this.$message.success('修改信息成功！');
                // 刷新数据列表
                this.getPersonnelInfo();
            })
        },
        cancelEdit(){
            this.$refs.PerInfoFormRef.resetFields();
            this.getPersonnelInfo();
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