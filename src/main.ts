import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/border.css'
import '@/assets/styles/reset.css'
import SvgIcon from '@/components/SvgIcon/index.vue'
import "@/icons/index";
import "@/router/permission.js"
// 国际化中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
app.component("svg-icon", SvgIcon)
app.use(ElementPlus)
app.use(store)
app.use(router)

app.mount('#app')


// createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
