import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import { debug } from 'util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' }) // 已登录直接到主页
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0 // 确定用户是否通过getinfo获取了权限角色
      if (hasRoles) { // 用户有权限路由直接跳转
        next()
      } else { // 查询用户权限
        try {
          const { roles } = await store.dispatch('user/getInfo') // note: 获取用户角色 （必须是对象数组）! such as: ['admin'] or ,['developer','editor']
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles) // 基于角色生成可访问的路由映射
          router.addRoutes(accessRoutes) // 动态添加可访问的路由
          next({ ...to, replace: true }) // 设置replace:true，这样导航就不会留下历史记录。
        } catch (error) { // 删除token并转到登录页重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
