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
import dataV from '@jiaminghi/data-view'
const app = createApp(App)
app.component("svg-icon", SvgIcon)
app.use(ElementPlus)
app.use(store)
app.use(router)
app.use(dataV)

app.mount('#app')


// createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
