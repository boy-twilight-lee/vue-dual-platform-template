import App from './App.vue'
import router from '@/router'
import store from '@/store'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import '@/styles/index.less'
import '@/utils/js-bradge/CXJSBridge'
import { setJsBridgeDevice } from '@/utils'
import SvgIcon from '@/components/svg-icon'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueDOMPurifyHTML)
app.use(SvgIcon)
app.mount('#app')
// 注册设备
setJsBridgeDevice()
