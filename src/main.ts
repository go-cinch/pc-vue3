import { createApp, Directive } from 'vue';

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import { store } from './store';
import router from './router';
import '@/style/index.less';
import './permission';
import App from './App.vue';
import * as directives from '@/directives';

const app = createApp(App);

Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

app.use(TDesign);
app.use(store);
app.use(router);

app.mount('#app');
