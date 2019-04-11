import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 产品管理模块
import productRouter from './modules/product'

/**
* hidden: true                   if `hidden:true` 不会显示在边栏中（默认值为false）
* alwaysShow: true               设置为true时 左侧菜单栏 不论子菜单多少都会显示根菜单
* redirect: noredirect           if `redirect:noredirect` 在面包屑中将无法点击导航
* name:'router-name'             用于keep-alive 必须设置 默认keep-alive
* meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个）
    title: 'title'               在子菜单和面包屑中显示的名称（lang中设置）
    icon: 'svg-name'             菜单icon
    noCache: false               if true, 则keep-alive中不缓存页面
    breadcrumb: true             if false, 在面包屑导航条中不显示
    affix: true                  if true, 在tagview中默认添加的路由并且不可删除
  }
**/

// 无需权限的基础页面
export const constantRoutes = [
  {
    path: '/login', // 登录
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404', // 404找不到该页面
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401', // 无权限提示页面
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/icon',
    component: Layout,
    redirect: '/icon/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '', // 系统首页
    component: Layout,
    redirect: 'overview',
    children: [
      {
        path: 'overview',
        component: () => import('@/views/home/index'),
        name: 'Overview',
        meta: { title: 'overview', icon: 'overview', noCache: true, affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
*/
export const asyncRoutes = [
  productRouter,
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history',
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
