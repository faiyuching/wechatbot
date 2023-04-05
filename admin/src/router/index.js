import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '仪表盘', icon: 'dashboard' }
  //   }]
  // },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/bot',
    component: Layout,
    redirect: '/bot/login-status',
    children: [{
      path: '/login-status',
      name: 'LoginStatus',
      component: () => import('@/views/bot/login-status'),
      meta: { title: 'Bot登录状态', icon: 'bot' }
    }]
  },
  {
    path: '/information',
    component: Layout,
    redirect: '/information/index',
    children: [{
      path: 'index',
      name: 'InformationList',
      component: () => import('@/views/information/information-list'),
      meta: { title: '消息管理', icon: 'information-list' }
    }]
  },
  {
    path: '/behavior',
    component: Layout,
    redirect: '/behavior/auto-reply',
    name: 'Behavior',
    meta: { title: '行为管理', icon: 'material' },
    children: [
      {
        path: 'auto-reply',
        name: 'AutoReply',
        component: () => import('@/views/auto-reply/auto-reply-list'),
        meta: { title: '自动回复', icon: 'keyword-list' }
      },
      {
        path: 'contact-welcome',
        name: 'ContactWelcome',
        component: () => import('@/views/contact/contact-welcome'),
        meta: { title: '好友欢迎语', icon: 'friend-welcome' }
      },
      {
        path: 'group-welcome',
        name: 'GroupWelcome',
        component: () => import('@/views/group/group-welcome'),
        meta: { title: '入群欢迎语', icon: 'friend-welcome' }
      },
      {
        path: 'bulk-message',
        name: 'BulkMessage',
        component: () => import('@/views/bulk-message/bulk-message-list'),
        meta: { title: '群发消息', icon: 'bulk-message' }
      }
    ]
  },
  {
    path: '/contact',
    component: Layout,
    redirect: '/contact/index',
    name: 'Contact',
    meta: { title: '通讯录', icon: 'contact-manage' },
    children: [
      {
        path: 'index',
        name: 'ContactList',
        component: () => import('@/views/contact/contact-list'),
        meta: { title: '联系人', icon: 'contact-list' }
      },
      {
        path: 'group',
        name: 'GroupList',
        component: () => import('@/views/group/group-list'),
        meta: { title: '微信群', icon: 'room' }
      },
    ]
  },
  {
    path: '/project-home',
    component: Layout,
    children: [
      {
        path: 'https://gitee.com/yuqing17/wechatbot',
        meta: { title: '项目主页', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
