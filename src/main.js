import Vue from 'vue'
import App from './App.vue'
import { rtdbPlugin } from 'vuefire'

Vue.config.productionTip = false
Vue.use(rtdbPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
