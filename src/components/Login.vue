<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user"  placeholder="用户名" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima"  placeholder="密码" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <!-- 登录 -->
                    <el-button type="primary" @click="login">登录</el-button>
                    <!-- 重置 -->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button type="primary" @click="root">管理员</el-button>
        <el-button type="primary" @click="personnel">维修人员</el-button>
        <el-button type="primary" @click="student">学生</el-button>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // 登录表单数据保存对象
            loginForm:{
                // 用户名绑定对象
                username: 'root01',
                // 密码绑定对象
                password: 'root01'
            },
            // 登录表单绑定规则
            loginRules:{
                // 用户名绑定规则
                username: [
                    {required: true, message: "请输入用户名", trigger: 'blur'},
                    {min: 6, max: 16, message: "用户名长度为6~16个字节", trigger: 'blur'}
                ],
                // 密码绑定规则
                password: [
                    {required: true, message: "请输入密码", trigger: 'blur'},
                    {min: 6, max: 16, message: "密码长度为6~16个字节", trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) return this.$message.error("用户名或密码错误，请重新输入！");
                const {data:res} = await this.$http.get('login',{
                    params: this.loginForm
                });
                this.$message.success("登录成功！");
                window.sessionStorage.setItem('token', res.data.token);
                if(res.data.power == 0){
                    this.$router.push('/home');
                }else if(res.data.power == 1){
                    this.$router.push('/Personnelhome');
                }else if(res.data.power == 2){
                    this.$router.push('/Studenthome');
                }
            })
        },
        root(){
            this.loginForm.username = 'root01',
            this.loginForm.password = 'root01'
        },
        personnel(){
            this.loginForm.username = 'personnel01',
            this.loginForm.password = 'personnel01'
        },
        student(){
            this.loginForm.username = 'student01',
            this.loginForm.password = 'student01'
        }
    }
}
</script>
<style scoped>
.login_container {
    width: 100%;
    height: 100%;
    background-color: #2b4b6b;
}
.login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.login_box .avatar_box img {
    position: absolute;
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    background-color: #fff;
    border: 2px solid #eee;
    box-shadow: 0 0 5px #ddd;
    left: 50%;
    transform: translate(-50%,-50%);
}
.btns {
    display: flex;
    justify-content: flex-end;
}
.login_form {
    position: absolute;
    bottom: 15px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

@media screen and (max-width:475px) {
    .login_box {
        position: absolute;
        width: 275px;
        height: 200px;
        background-color: #fff;
        border-radius: 3px;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .login_box .avatar_box img {
        position: absolute;
        width: 60px;
        border-radius: 50%;
        padding: 10px;
        background-color: #fff;
        border: 2px solid #eee;
        box-shadow: 0 0 5px #ddd;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .login_form {
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .el-form-item {
        margin-bottom: 10px;
    }
}
</style>