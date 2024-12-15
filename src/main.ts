import './assets/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { setupRouter } from './app/router/router';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

const router = setupRouter();

app.use(router);
app.use(pinia);
app.mount('#app');
