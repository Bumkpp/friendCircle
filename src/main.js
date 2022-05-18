import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import 'lib-flexible/flexible';
import App from './App.vue';
import router from './router';

import axios from 'axios'
Vue.prototype.$http = axios
Vue.config.productionTip = false
axios.defaults.baseURL='http://gkd.aztop.cn'
Vue.use(Vant);


new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
