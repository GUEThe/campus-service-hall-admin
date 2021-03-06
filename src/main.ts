import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import i18n from '@/lang' // Internationalization
import '@/icons/components'
import '@/permission'
import '@/utils/error-log' // Error log
import '@/registerServiceWorker'
import EventProxy from 'vue-event-proxy'
import { DeptFilter } from '@/filters'
import { mockXHR } from '../mock'
import moment from 'moment'
mockXHR()

Vue.use(ElementUI, {
  size: AppModule.size, // set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})
Vue.use(EventProxy)
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.config.productionTip = false
Vue.filter('stateFilter', (state: number) => {
  switch (state) {
    case -1: {
      return '未处理'
    }
    case 0: {
      return '审核不通过'
    }
    case 1: {
      return '审核通过'
    }
    default:
      break
  }
})
Vue.filter('userServiceStatusFilter', (state: number) => {
  switch (state) {
    case -1: {
      return '待处理'
    }
    case 0: {
      return '审核不通过'
    }
    case 1: {
      return '办理中'
    }
    case 2: {
      return '完成'
    }
    default:
      break
  }
})
Vue.filter('serviceTypeFilter', (type: number) => {
  switch (type) {
    case 0: {
      return '其它业务'
    }
    case 1: {
      return '学生业务'
    }
    case 2: {
      return '教师业务'
    }
    case 3: {
      return '一般业务'
    }
    default:
      break
  }
})
Vue.filter('TimeFilter', (value: any) => {
  if (!value) {
    return ''
  }
  return moment(value - 8 * 3600 * 1000).format('YYYY-MM-DD HH:mm')
})
Vue.filter('deptFilter', DeptFilter)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
