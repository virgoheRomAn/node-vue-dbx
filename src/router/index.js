import Vue from 'vue'
import Router from 'vue-router'
import API from '@/api'
import jBox from 'assets/plugins/jBox'
import Index from '@/pages/Index'
import ErrorPage from '@/pages/404'
import TimeoutPage from '@/pages/401'
import NetWorkError from '@/pages/502'
import EmptyRouter from '@/pages/EmptyRouter'

import User from '@/pages/user/index'
import Settings from '@/pages/settings/index'
import Product from '@/pages/product/index'
import UserCenter from '@/pages/userCenter/index'
import Bank from '@/pages/banks/index'
import Password from '@/pages/password/index'
import Activity from '@/pages/activity/index'

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
      isAuth: true
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
    path: '/notice',
    name: 'notice',
    component: UserCenter.Notice,
    meta: {
      title: '公告列表',
      isAuth: false
    }
  },
  {
    path: '/notice/details/:noticeID',
    name: 'noticeDetails',
    component: UserCenter.NoticeDetails,
    meta: {
      title: '公告详情',
      isAuth: false
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
    path: '/register',
    name: 'register',
    component: User.Register,
    meta: {
      title: '注册'
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
      { path: 'done/:mobile?', name: 'InviteDone', component: User.InviteDone, meta: { title: '结果页面' } }
    ]
  },
  {
    path: '/product/:id',
    name: 'productInformation',
    component: EmptyRouter,
    meta: {
      title: '产品信息'
    },
    children: [
      { path: 'details/:code?', name: 'details', component: Product.Details, meta: { title: '产品详情' } },
      { path: 'buy/:code?', name: 'buy', component: Product.Buy, meta: { title: '购买页面', isAuth: true } },
      { path: 'done/:code?', name: 'buyDone', component: Product.Done, meta: { title: '完成页面', isAuth: true } }
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
      { path: 'banks/:mobile?', name: 'banks', component: UserCenter.Banks, meta: { title: '我的银行卡', isAuth: true } },
      { path: 'capital/:mobile?', name: 'capital', component: UserCenter.Capital, meta: { title: '资金管理', isAuth: true } },
      { path: 'income/:mobile?', name: 'income', component: UserCenter.Income, meta: { title: '我的收入', isAuth: true } },
      { path: 'appraisal/:mobile?', name: 'appraisal', component: UserCenter.Appraisal, meta: { title: '风险测评', isAuth: true } },
      { path: 'appraisalResult/:mobile?', name: 'appraisalResult', component: UserCenter.AppraisalResult, meta: { title: '风险测评-已测评', isAuth: true } },
      { path: 'activity/:mobile?', name: 'activity', component: UserCenter.Activity, meta: { title: '活动管理', isAuth: true } },
      { path: 'message/:mobile?', name: 'message', component: UserCenter.Message, meta: { title: '消息管理', isAuth: true } },
      { path: 'password/:mobile?', name: 'password', component: UserCenter.Password, meta: { title: '密码管理', isAuth: true } },
      { path: 'withdraw/:mobile?', name: 'withdraw', component: UserCenter.Withdraw, meta: { title: '提现', isAuth: true } },
      { path: 'recharge/:mobile?', name: 'recharge', component: UserCenter.Recharge, meta: { title: '充值', isAuth: true } },
      { path: 'result/:result?', name: 'result', component: UserCenter.Done, meta: { title: '结果页', isAuth: true } }
    ]
  },
  {
    path: '/usercenter/:id/bank',
    name: 'bankSettings',
    component: EmptyRouter,
    meta: {
      title: '绑定银行卡'
    },
    children: [
      { path: 'add/:user?', name: 'addBank', component: Bank.Add, meta: { title: '添加银行卡', isAuth: true } },
      { path: 'change/:cardNo?', name: 'changeBank', component: Bank.Change, meta: { title: '更换银行卡', isAuth: true } },
      { path: 'done/:cardNo?', name: 'bankDone', component: Bank.Done, meta: { title: '绑定结果页面', isAuth: true } }
    ]
  },
  {
    path: '/usercenter/:id/active',
    name: 'activitySettings',
    component: EmptyRouter,
    meta: {
      title: '活动管理'
    },
    children: [
      { path: 'packet/:user?', name: 'packet', component: Activity.Packet, meta: { title: '我的红包', isAuth: true } }
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
      { path: 'changepay/:mobile?', name: 'changePay', component: Password.ChangePay, meta: { title: '支付密码修改', isAuth: true } },
      { path: 'settingpay/:mobile?', name: 'settingPay', component: Password.SettingPay, meta: { title: '设置支付密码', isAuth: true } },
      { path: 'forgetlogin/:mobile?', name: 'forgetLogin', component: Password.ForgetLogin, meta: { title: '忘记登陆密码' } },
      { path: 'changelogin/:mobile?', name: 'changeLogin', component: Password.ChangeLogin, meta: { title: '登录密码修改', isAuth: true } }
    ]
  },
  {
    path: '/usercenter/settings/',
    name: 'settingsMenu',
    component: EmptyRouter,
    meta: {
      title: '个人设置'
    },
    children: [
      { path: 'approve/:mobile?', name: 'approve', component: Settings.Approve, meta: { title: '身份认证', isAuth: true } },
      { path: 'approveInfo/:identity?', name: 'approveInfo', component: Settings.ApproveInfo, meta: { title: '选择个人信息', isAuth: true } }
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
