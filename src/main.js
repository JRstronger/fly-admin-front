import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/assets/styles/border.css'
import '@/assets/styles/reset.css'
import SvgIcon from '@/icons'
import '@/assets/font/font_f.css'
import "@/router/permission.js"

const app = createApp(App)
SvgIcon(app);
app.use(store)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
