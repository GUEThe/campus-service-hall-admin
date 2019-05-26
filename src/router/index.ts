import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

Vue.use(Router)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name is required when using <keep-alive>
    https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path*',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "authRedirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'], // you can set roles in root nav
  //     alwaysShow: true // will always show the root menu
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import(/* webpackChunkName: "pagePermission" */ '@/views/permission/page.vue'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import(/* webpackChunkName: "directivePermission" */ '@/views/permission/directive.vue'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import(/* webpackChunkName: "rolePermission" */ '@/views/permission/role.vue'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'rolePermission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/deptmanaged',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "Deptmanaged" */ '@/views/01dept/index.vue'),
        name: 'Deptmanaged',
        meta: { title: 'deptmanaged', icon: 'tree', noCache: true }
      }
    ]
  },
  {
    path: '/usermanaged',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "usermanaged" */ '@/views/02user/index.vue'),
        name: 'Usermanaged',
        meta: { title: 'usermanaged', icon: 'peoples', noCache: true }
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    meta: { title: 'service', icon: 'example', noCache: true },
    redirect: '/service/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "03service" */ '@/views/03service/index.vue'),
        name: 'Service',
        meta: { title: 'serviceList', icon: 'example', noCache: true }
      },
      {
        path: 'editservice:id?',
        component: () => import(/* webpackChunkName: "editservice" */ '@/views/03service/ServiceDetail.vue'),
        name: 'Editservice',
        meta: { title: 'editservice', noCache: true, hidden: true }
      },
      {
        path: 'editporcess:id?',
        component: () => import(/* webpackChunkName: "EditProcess" */ '@/views/03service/components/EditProcess.vue'),
        name: 'Editprocess',
        meta: { title: 'editprocess', noCache: true, hidden: true }
      }
    ]
  },
  {
    path: '/audit',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "audit" */ '@/views/05audit/index.vue'),
        name: 'audit',
        meta: { title: 'audit', icon: 'edit', noCache: true }
      }
    ]
  },
  {
    path: '/question',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "question" */ '@/views/04question/index.vue'),
        name: 'question',
        meta: { title: 'question', icon: 'wechat', noCache: true }
      }
    ]
  },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "icons" */ '@/views/svg-icons/index.vue'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // tableRouter,
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "tab" */ '@/views/tab/index.vue'),
  //       name: 'Tab',
  //       meta: { title: 'tab', icon: 'tab' }
  //     }
  //   ]
  // },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'ErrorPages',
  //   meta: { title: 'errorPages', icon: '404' },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import(/* webpackChunkName: "page401" */ '@/views/error-page/401.vue'),
  //       name: 'Page401',
  //       meta: { title: 'page401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import(/* webpackChunkName: "page404" */ '@/views/error-page/404.vue'),
  //       name: 'Page404',
  //       meta: { title: 'page404', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import(/* webpackChunkName: "errorLog" */ '@/views/error-log/index.vue'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug' }
  //     }
  //   ]
  // },
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import(/* webpackChunkName: "form" */ '@/views/form/index.vue'),
  //       meta: { title: 'form', icon: 'form' }
  //     }
  //   ]
  // },
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "clipboard" */ '@/views/clipboard/index.vue'),
  //       name: 'Clipboard',
  //       meta: { title: 'clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "i18n" */ '@/views/international/index.vue'),
  //       name: 'I18n',
  //       meta: { title: 'i18n', icon: 'international' }
  //     }
  //   ]
  // },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/Armour/vue-typescript-admin-template',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
