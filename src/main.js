import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import store from './store/store'


Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.use(Vuex)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
