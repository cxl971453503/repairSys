<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="" alt="">
                <span>学生报修平台</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"  :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <!-- :index中添加空字符串是为了将item.id转换成字符串。因为:index只能接受字符串 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体区 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            // 左侧菜单数据
            menuList: [
                {
                    "id": 125,
                    "authName": "个人信息",
                    "path": null,
                    "children": [
                        {
                            "authName": "我的个人信息",
                            "path": 'stuinfo'
                        }
                    ]
                },
                {
                    "id": 102,
                    "authName": "报修单",
                    "children": [
                        {
                            "authName": "我的报修单",
                            "path": 'sturepair'
                        }
                    ]
                },
                {
                    "id": 101,
                    "authName": "设备管理",
                    "children": [
                        {
                            "authName": "查看设备",
                            "path": 'stuquerydevice'
                        }
                    ]
                }
            ],
            iconsObj: {
                '125': 'iconfont icon-user',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
            },
            // 是否折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: '',
            // 学生信息
            studentInfo: {}
        }
    },
    created() {
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        // 点击按钮菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath = window.sessionStorage.getItem('activePath',activePath);
        },
        getScreenWidth(){
            this.screenWidth = window.screen.width;
            console.log(this.screenWidth);
        }
    }
}
</script>
<style scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    align-items: center;
    color: #fff;
    font-size: 22px;
}
.el-header > div {
    display: flex;
    align-items: center;
}
.el-header > div span{
        margin-left: 15px;
    }
.el-aside {
    background-color: #333744;
}
.el-aside .el-menu {
    border-right: none;
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4a5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
.title-button {
    background-color: #909399;
    border: solid 1px #909399;
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
    padding: 6px 10px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>