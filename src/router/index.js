import Vue from 'vue'
import VueRouter from 'vue-router'
// 登录界面
import Login from '../components/Login.vue'
// 管理员界面
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Student from '../components/root/student.vue'
import Personnel from '../components/root/personnel.vue'
import Repair from '../components/root/repair.vue'
import Accessory from '../components/root/accessory.vue'
import Device from '../components/root/device.vue'
// 学生界面
import Studenthome from '../components/StudentHome.vue'
import Stuinfo from '../components/student/Info.vue'
import Sturepair from '../components/student/Myrepair.vue'
import Stuquerydevice from '../components/student/Querydevice.vue'
import WelcomeStu from '../components/student/Welcomestu.vue'
// 维修人员界面
import Personnelhome from '../components/PersonnelHome.vue'
import Perinfo from '../components/personnel/Info.vue'
import Peraccessory from '../components/personnel/Myaccessory.vue'
import Perrepair from '../components/personnel/Myrepair.vue'
import Perquerydevice from '../components/personnel/Querydevice.vue'
import Perqueryrepair from '../components/personnel/Queryrepair.vue'
import WelcomePer from '../components/personnel/Welcomeper.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path: '/',
      redirect: '/login'  //路由重定向
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children:[
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/student',
          component: Student
        },
        {
          path: '/personnel',
          component: Personnel
        },
        {
          path: '/repair',
          component: Repair
        },
        {
          path: '/accessory',
          component: Accessory
        },
        {
          path: '/device',
          component: Device
        }
      ]
    },
    {
      path: '/Studenthome',
      component: Studenthome,
      redirect: '/WelcomeStu',
      children:[
        {
          path: '/WelcomeStu',
          component: WelcomeStu
        },
        {
          path: '/stuinfo',
          component: Stuinfo
        },
        {
          path: '/sturepair',
          component: Sturepair
        },
        {
          path: '/stuquerydevice',
          component: Stuquerydevice
        }
      ]
    },
    {
      path: '/Personnelhome',
      component: Personnelhome,
      redirect: '/WelcomePer',
      children:[
        {
          path: '/WelcomePer',
          component: WelcomePer
        },
        {
          path: '/perinfo',
          component: Perinfo
        },
        {
          path: '/perrepair',
          component: Perrepair
        },
        {
          path: '/perqueryrepair',
          component: Perqueryrepair
        },
        {
          path: '/Myaccessory',
          component: Peraccessory
        },
        {
          path: '/perquerydevice',
          component: Perquerydevice
        },
      ]
    }
  ]
})

export default router
