<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>报修单</el-breadcrumb-item>
            <el-breadcrumb-item>所有报修单</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="根据姓名搜索" v-model="queryInfo.name" clearable @clear="getRepairList">
                        <el-button slot="append" icon="el-icon-search" @click="getRepairList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="2" class="statusLable">状态：</el-col>
                <el-col :span="6">
                    <el-select v-model="queryInfo.status" @change="queryAccessoryByStatus()">
                        <el-option v-for="item in statusList" :key="item.status" :value="item.status" :label="item.name"></el-option>
                    </el-select>
                </el-col>
            </el-row>

            <el-table :data="repairList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="设备" prop="devicename">
                </el-table-column>
                <el-table-column label="介绍" prop="introduce"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.status == '0'">未接取</el-tag>
                        <el-tag type="warning" v-if="scope.row.status == '1'">已接取</el-tag>
                        <el-tag type="success" v-if="scope.row.status == '2'">已完成</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="管理报修表" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageindex" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            
            <el-dialog title="接取报修单" :visible="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <el-form-item label="学生姓名">
                        <el-input v-model="editForm.studentname" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="学生联系方式">
                        <el-input v-model="editForm.studentphone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="维修地址">
                        <el-input :placeholder="this.getplacename" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="申请时间">
                        <el-input v-model="editForm.repairtime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="维修设备">
                        <el-input :placeholder="editForm.devicename" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="介绍">
                        <el-input v-model="editForm.introduce" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="editForm.status == 1" label="接取时间">
                        <el-input :placeholder="editForm.updatetime" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="editForm.status == 2" label="完成时间">
                        <el-input :placeholder="editForm.updatetime" disabled>
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">确 认</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            PerInfo: {},
            nowtime: null,
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
            total: 0,
            statusList: [
                {
                    status: null,
                    name: '查看全部'
                },
                {
                    status: 0,
                    name: '未接取'
                },
                {
                    status: 1,
                    name: '已接取'
                },
                {
                    status: 2,
                    name: '已完成'
                }
            ],
            repairList: [],
            deviceList: [],
            placeList: [],
            submitForm: {},
            editDialogVisible: false,
            editForm: {},
            editFormRules: {},
            getplacename: '',
            getdevicename: '',
            disableBtn: false
        }
    },
    created(){
        this.getPersonnelInfo();
        this.getDeviceList();
        this.getPlaceList();
    },
    methods:{
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
            this.PerInfo = res.data;
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
        async getRepairList(){
            const {data:res} = await this.$http.get('/repair/findAllRepair',{
                params: this.queryInfo
            })
            this.repairList = res.data;
            for(let i = 0; i < this.repairList.length; i++){
                this.repairList[i].devicename = this.queryDeviceName(this.repairList[i].deviceid);
            }
            this.total = res.total;
        },
        async getDeviceList(){
            const {data:res} = await this.$http.get('/device/findAllDevice',{
                params: {
                    pageindex: 1,
                    pageSize: 100
                }
            })
            this.deviceList = res.data;
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
        async showEditDialog(id){
            const {data:res} = await this.$http.get('/repair/getRepairById',{
                params: {
                    id:id
                }
            })
            this.queryPlaceName(res.data.region);
            if(res.data.status != 0 ){
                this.disableBtn = true;
            }else{
                this.disableBtn = false;
            }
            this.submitForm = res.data;
            this.editForm.studentname = res.data.studentname;
            this.editForm.studentphone = res.data.studentphone;
            this.editForm.repairtime = res.data.repairtime;
            this.editForm.introduce = res.data.introduce;
            this.editForm.deviceid = res.data.deviceid;
            this.editForm.status = res.data.status;
            this.editForm.updatetime = res.data.updatetime;
            this.editForm.devicename = this.queryDeviceName(this.editForm.deviceid);
            this.editDialogVisible = true;
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
            this.editDialogVisible = false;
        },
        queryAccessoryByStatus(){
            this.getRepairList();
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