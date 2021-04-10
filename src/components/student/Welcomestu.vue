<template>
    <div class="content">
        欢迎来到学生报修平台，请从菜单栏选择您的操作！
        <el-dialog :visible="dialogVisible">
            <span>你有{{this.count}}条报修单发生了更新</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updatelasthandletime">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 获取设备的参数对象
            queryInfo: {
                // 当前页数
                pageindex: 1,
                // 当前每页显示多少条数据
                pageSize: 5,
                // 查阅的名字
                studentid: null
            },
            nowtime: null,
            // 登录学生信息
            studentInfo:{},
            repairList: [],
            count: 0,
            dialogVisible: false
        }
    },
    created(){
        this.getStudentInfo();
    },
    methods: {
        updateDate(){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if(month >=1 && month <= 9){
                month = "0" + month;
            }
            if(strDate >=1 && strDate <= 9){
                strDate = "0" + strDate;
            }
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            this.nowtime = year + "-" + month + "-" + strDate + " " + hour + ":" + minute + ":" + second;
        },
        // 登录后获取学生信息
        async getStudentInfo(){
            const {data:res} = await this.$http.get('/student/getStudentById',{
                params: {
                    id: null,
                    token: window.sessionStorage.token
                }
            })
            this.studentInfo = res.data;
            console.log(this.studentInfo);
            window.sessionStorage.stuid = this.studentInfo.id;
            this.queryInfo.studentid = this.studentInfo.id;
            this.getRepairList();
        },
        async getRepairList(){
            const {data:res} = await this.$http.get('/repair/getRepairByStudentid',{
                params: this.queryInfo
            })
            this.repairList = res.data.data;
            for(let i = 0; i < this.repairList.length; i++){
                if(this.repairList[i].updatetime > this.studentInfo.lasthandletime){
                    this.count += 1;
                }
            }
            this.showDialog(this.count);
        },
        showDialog(count){
            if(count > 0){
                this.dialogVisible = true;
            }
        },
        updatelasthandletime(){
            this.updateDate();
            this.$http.get('/student/updateStudentById',{
                params:{
                    id: this.studentInfo.id,
                    username: this.studentInfo.username,
                    password: this.studentInfo.password,
                    name: this.studentInfo.name,
                    region: this.studentInfo.region,
                    grade: this.studentInfo.grade,
                    phone: this.studentInfo.phone,
                    age: this.studentInfo.age,
                    sex: this.studentInfo.sex,
                    lasthandletime: this.nowtime,
                }
            })
            this.count = 0;
            this.dialogVisible = false;
        }
    }
}
</script>
<style scoped>
.content {
    display: flex;
    justify-content: center;
}
</style>