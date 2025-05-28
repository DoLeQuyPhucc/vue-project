import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.min.css'
import App from './App.vue'
import router from './router'

// Set default document title
document.title = 'LoPhim'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')


