<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path: '/Studenthome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>报修单</el-breadcrumb-item>
            <el-breadcrumb-item>我的报修单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">填写报修表</el-button>
                </el-col>
            </el-row>

            <!-- 报修表列表区域 -->
            <el-table :data="repairList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="设备" prop="name">
                    <template slot-scope="scope">
                        {{queryDeviceName(scope.row.id)}}
                    </template>
                </el-table-column>
                <el-table-column label="介绍" prop="introduce"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.status == '0'">未接取</el-tag>
                        <el-tag type="warning" v-if="scope.row.status == '1'">已接取</el-tag>
                        <el-tag type="success" v-if="scope.row.status == '2'">已完成</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="填写报修表" :visible="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="设备" prop="deviceid">
                <el-select v-model="addForm.deviceid" placeholder="请选择设备">
                <el-option v-for="(device,i) in deviceList" :key="i" :label="device.name + (device.type == '' ? '' : '—' + device.type) " :value="device.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="region">
                <el-cascader v-model="regionvalue" :options="placeList" :props="placeProp" @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="介绍" prop="introduce">
                <el-input type="textarea" v-model="addForm.introduce" placeholder="请对损坏设备进行描述"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRepair">立即提交</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // 获取设备的参数对象
            queryInfo: {
                // 当前页数
                pageindex: 1,
                // 当前每页显示多少条数据
                pageSize: 5,
                // 查阅的名字
                studentid: null
            },
            regionvalue: [],
            deviceList: [],
            placeList: [],
            repairList: [],
            stuInfo: {},
            getplacename: '',
            addDialogVisible: false,
            addForm: {
                deviceid: '',
                region: null,
                introduce: '',
                studentname: '',
                studentid: null,
                studentphone: null,
                status: 0
            },
            addFormRules: {
                deviceid: [
                    { required: true, message: '请选择报修的设备', trigger: 'change' }
                ],
                introduce: [
                    { required: true, message: '请对损坏设备进行描述', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择地址', trigger: 'blur' }
                ]
            },
            placeProp: {
                expandTrigger: 'hover',
                label: 'name',
                value: 'id',
                children: 'children'
            }
        };
    },
    created(){
        this.getStudentInfo();
        this.getDeviceList();
        this.getPlaceList();
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
            this.stuInfo = res.data;
            this.addForm.studentname = this.stuInfo.name;
            this.addForm.studentid = this.stuInfo.id;
            this.addForm.studentphone = this.stuInfo.phone;
            window.sessionStorage.Stuid = this.stuInfo.id
        },
        async getDeviceList(){
            const {data:res} = await this.$http.get("device/findAllDevice",{
                params: this.queryInfo
            })
            this.deviceList = res.data;
            this.getRepairList();
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
        async getRepairList(){
            this.queryInfo.studentid = window.sessionStorage.Stuid;
            const {data:res} = await this.$http.get('/repair/getRepairByStudentid',{
                params: this.queryInfo
            })
            this.repairList = res.data.data;
        },
        // 监听填写报修表对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
            this.addDialogVisible = false;
        },
        handleChange(value) {
            console.log(value);
        },
        async addRepair(){
            this.addForm.region = this.regionvalue[this.regionvalue.length - 1];
            const {data:res} = await this.$http.get('/repair/addRepair',{
                params: this.addForm
            })
            this.$message.success('填写报修表成功！');
            this.addDialogVisible = false;
            this.getRepairList();
        },
        queryDeviceName(id){
            for(let i = 0; i < this.deviceList.length; i++){
                if(this.deviceList[i].id == id){
                    if(this.deviceList[i].type == ''){
                        return this.deviceList[i].name;
                    }
                    return this.deviceList[i].name + '—' + this.deviceList[i].type;
                }
            }
        }
    }
}
</script>
<style scoped>

</style>