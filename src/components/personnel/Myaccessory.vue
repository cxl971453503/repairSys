<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path: '/Personnelhome'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>外出申请表</el-breadcrumb-item>
        <el-breadcrumb-item>我的申请表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <!-- <el-col :span="7">
                    <el-input placeholder="根据姓名搜索" v-model="queryInfo.name" clearable @clear="getAccessoryList">
                        <el-button slot="append" icon="el-icon-search" @click="getAccessoryList"></el-button>
                    </el-input>
                </el-col> -->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">填写申请表</el-button>
                </el-col>
            </el-row>

            <!-- 申请表列表区域 -->
            <el-table :data="AccessoryList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="配件名称" prop="name"></el-table-column>
                <el-table-column label="配件数量" prop="number"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.status == '0'">未审核</el-tag>
                        <el-tag type="success" v-if="scope.row.status == '1'">已同意</el-tag>
                        <el-tag type="danger" v-if="scope.row.status == '2'">已拒绝</el-tag>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageindex" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <el-dialog title="填写报修表" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <!-- <el-form-item label="配件名称" prop="name">
                        <el-select v-model="addForm.name">
                            <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="配件名称" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="配件数量" prop="number">
                        <el-input v-model="addForm.number"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addAccessory">提 交</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data () {
        var checkNumber = (rule, value, cb) => {
            if(isNaN(parseInt(value))){
                return cb(new Error('请输入数字'));
            }else {
                if(parseInt(value) < rule.min_number){
                    return cb(new Error('请输入合理的数量'));
                }else{
                    return cb();
                }
            }
        }
        return {
            PerInfo: {},
            // 获取用户列表的参数对象
            queryInfo: {
                // 当前页数
                pageindex: 1,
                // 当前每页显示多少条数据
                pageSize: 5,
                personnelid: null
                
            },
            nowtime: null,
            total: 0,
            AccessoryList: [],
            deviceList: [],
            // 控制填写申请表对话框的显示与隐藏
            addDialogVisible: false,
            // 存储当前填写报修表的信息
            addForm: {
                name: '',
                number: null,
                personnelid: null,
                personnelname: '',
                personnelphone: null
            },
            addFormRules: {
                name: [
                    { required: true, message: '请输入配件名称', trigger: 'blur'}
                ],
                number: [
                    { required: true, message: '请输入配件名称', trigger: 'blur'},
                    { min_number: 0, validator: checkNumber, trigger: 'blur'}
                ]
            },
        }
    },
    created(){
        this.getPersonnelInfo();
        this.getDeviceList();
    },
    methods:{
        // 登录后获取维修人员信息
        async getPersonnelInfo(){
            const {data:res} = await this.$http.get('/personnel/getPersonnelById',{
                params: {
                    id: null,
                    token: window.sessionStorage.token
                }
            })
            this.PerInfo = res.data;
            this.addForm.personnelid = res.data.id;
            this.addForm.personnelname = res.data.name;
            this.addForm.personnelphone = res.data.phone;
            window.sessionStorage.Perid = res.data.id;
        },
        // 获取/更新申请表列表信息
        async getAccessoryList(){
            this.queryInfo.personnelid = window.sessionStorage.Perid;
            const {data:res} = await this.$http.get('/accessory/getAccessoryByPersonnelid',{
                params: this.queryInfo
            });
            this.AccessoryList = res.data.data;
            console.log(this.AccessoryList);
        },
        async getDeviceList(){
            const {data:res} = await this.$http.get("device/findAllDevice",{
                params: this.queryInfo
            })
            this.deviceList = res.data;
            this.total = res.total;
            this.getAccessoryList();
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
        // 监听填写报修表对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        async addAccessory(){
            const {data:res} = await this.$http.get('/accessory/addAccessory',{
                params: this.addForm
            });
            console.log(res);
            this.getAccessoryList();
            this.addDialogVisible = false;
        }
    }
}
</script>
<style scoped>

</style>