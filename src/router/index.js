import Vue from 'vue'
import Router from 'vue-router'
import API from '@/api'
import jBox from 'assets/plugins/jBox'
import Index from '@/pages/Index'
import Success from '@/pages/Success'
import ErrorPage from '@/pages/404'
import TimeoutPage from '@/pages/401'
import NetWorkError from '@/pages/502'
import EmptyRouter from '@/pages/EmptyRouter'

import User from '@/pages/user/index'
import Settings from '@/pages/settings/index'
import Product from '@/pages/product/index'
import UserCenter from '@/pages/userCenter/index'
import Password from '@/pages/password/index'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: "/index"
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    meta: {
      title: '首页',
      isAuth: false
    }
  },
  {
    path: '/success',
    name: 'success',
    component: Success,
    meta: {
      title: '成功页面',
      isAuth: false
    }
  },
  {
    path: '/401',
    name: '401',
    component: TimeoutPage,
    meta: {
      title: '登陆超时'
    }
  },
  {
    path: '/404',
    name: '404',
    component: ErrorPage,
    meta: {
      title: '404页面'
    }
  },
  {
    path: '/502',
    name: '502',
    component: NetWorkError,
    meta: {
      title: '网络错误'
    }
  },
  {
    path: '/product',
    name: 'product',
    component: Product.List,
    meta: {
      title: '产品列表'
    }
  },
  {
    path: '/usercenter',
    name: 'usercenter',
    component: User.UserCenter,
    meta: {
      title: '个人中心',
      isAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: User.Login,
    meta: {
      title: '登陆'
    }
  },
  {
    path: '/invite/:id',
    name: 'invite',
    component: EmptyRouter,
    meta: {
      title: '邀请好友',
      isAuth: true
    },
    children: [
      { path: 'index/:user?', name: 'inviteIndex', component: User.InviteIndex, meta: { title: '立即邀请', isAuth: true } },
      { path: 'friend/:user?', name: 'inviteFriend', component: User.InviteFriend, meta: { title: '邀请好友' } },
      { path: 'list/:user?', name: 'inviteList', component: User.InviteList, meta: { title: '我的邀请' } },
      { path: 'done/:mobile?', name: 'InviteDone', component: User.InviteDone, meta: { title: '结果页面' } },
      { path: 'agreement/:mobile?', name: 'agreement', component: User.InviteAgreement, meta: { title: '用户服务协议' } }
    ]
  },
  {
    path: '/usercenter/settings',
    name: 'settings',
    component: Settings.Settings,
    meta: {
      title: '设置',
      isAuth: true
    }
  },
  {
    path: '/usercenter/:id',
    name: 'userSettings',
    component: EmptyRouter,
    meta: {
      title: '个人中心'
    },
    children: [
      { path: 'capital/:mobile?', name: 'capital', component: UserCenter.Capital, meta: { title: '资金管理', isAuth: true } },
      { path: 'income/:mobile?', name: 'income', component: UserCenter.Income, meta: { title: '我的收入', isAuth: true } },
      { path: 'incomedetails/:type?', name: 'incomeDetails', component: UserCenter.IncomeDetails, meta: { title: '我的收入详情', isAuth: true } },
      { path: 'order/:mobile?', name: 'order', component: UserCenter.Order, meta: { title: '我的保单', isAuth: true } },
      { path: 'customer/:mobile?', name: 'customer', component: UserCenter.Customer, meta: { title: '客户管理', isAuth: true } },
      { path: 'withdraw/:mobile?', name: 'withdraw', component: UserCenter.Withdraw, meta: { title: '提现', isAuth: true } },
      { path: 'help/:mobile?', name: 'help', component: UserCenter.Help, meta: { title: '理赔帮助', isAuth: true } },
      { path: 'question/:mobile?', name: 'question', component: UserCenter.Question, meta: { title: '常见问题', isAuth: true } }
    ]
  },
  {
    path: '/usercenter/:id/psd',
    name: 'passwordSettings',
    component: EmptyRouter,
    meta: {
      title: '密码管理'
    },
    children: [
      { path: 'vermobile/:type?', name: 'vermobile', component: Password.VerMobile, meta: { title: '验证手机', isAuth: true } },
      { path: 'changepaypwd/:mobile?', name: 'changepaypwd', component: Password.ChangePayPwd, meta: { title: '修改支付密码' } },
      { path: 'settingpay/:mobile?', name: 'settingPay', component: Password.SettingPay, meta: { title: '设置支付密码', isAuth: true } },
      { path: 'forgetlogin/:mobile?', name: 'forgetLogin', component: Password.ForgetLogin, meta: { title: '忘记登陆密码' } },
      { path: 'changelogin/:mobile?', name: 'changeLogin', component: Password.ChangeLogin, meta: { title: '登录密码修改', isAuth: true } }
    ]
  },
  {
    path: '*',
    component: ErrorPage,
    meta: {
      title: '404页面'
    }
  }
];

const router = new Router({
  mode: 'history',
  routes: routes,
  linkExactActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 }
    }
  }
})


//路由拦截器
router.beforeEach((to, from, next) => {
  jBox.close();

  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.query.title) {
    document.title = to.query.title
  }

  if (!to.name || ((Object.keys(to.params).length !== 0) && (to.params.id && to.params.id !== "s"))) {
    next('/404');
    return false;
  }

  if (to.meta.isAuth) {
    API.user.getUserLoginStaus().then(status => {
      if (status) {
        next();
      } else {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next();
  }
})

export default router;
