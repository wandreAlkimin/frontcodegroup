import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from './plugins/font-awesome'
import 'materialize-css'
import VueTheMask from 'vue-the-mask';
import { createPinia } from 'pinia'
import Toast from 'vue3-toastify';

import 'vue3-toastify/dist/index.css';

import '@/assets/css/estilos.scss';

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(VueTheMask)
app.use(pinia)
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(Toast, {
    position: 'bottom-right',
    duration: 3000,
    theme: 'dark',
    singleton: true,
});
app.mount('#app');

