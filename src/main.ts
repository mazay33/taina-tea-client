import './assets/styles/main.css';

import { createApp } from 'vue';

import { setupRouter } from './app/router/router';
import App from './App.vue';

const app = createApp(App);

const router = setupRouter();

app.use(router);
app.mount('#app');
