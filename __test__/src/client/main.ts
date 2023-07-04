import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'

const ClientApplication = createApp(App)

ClientApplication
    .use(router)
    .mount('#app')