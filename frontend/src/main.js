import Vue from 'vue';
import App from './App.vue';
// import './plugins/base'
// import './plugins/chartist'
import './plugins/vee-validate'
// import './plugins/vue-world-map'
import vuetify from './plugins/vuetify';
import router from '@/router';
import VueTheMask from 'vue-the-mask';
import VueIziToast from 'vue-izitoast';
import 'izitoast/dist/css/iziToast.min.css';

Vue.use(VueTheMask);
Vue.use(VueIziToast);

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App),
  router
}).$mount('#app')
