<template>
    <div class="content">
        欢迎来到工作人员维修平台
        <el-dialog :visible="dialogVisible">
            <span>有{{this.count}}条新建报修单，请及时查看并响应！</span>
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
                status: null,
                // 查阅的名字
                name: ''
            },
            nowtime: null,
            PerInfoForm: {},
            repairList: [],
            count: 0,
            dialogVisible: false,
        }
    },
    created(){
        this.getPersonnelInfo();
        this.getRepairList();
    },
    methods:{
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
        async getRepairList(){
            const {data:res} = await this.$http.get('/repair/findAllRepair',{
                params: this.queryInfo
            })
            this.repairList = res.data;
            for(let i = 0; i < this.repairList.length; i++){
                if(this.repairList[i].repairtime > this.PerInfoForm.lasthandletime){
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