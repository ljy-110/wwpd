// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api/install'
import url from './api/teaback/url'
// import md5 from 'js-md5'
import axios from 'axios'

// eslint-disable-next-line standard/object-curly-even-spacing
import { Button, Form, Field, Toast, Notify, NavBar, Tab, Tabs, Uploader, Tag, Dialog, Overlay, Cell, CellGroup, Icon, Popup,Empty,PullRefresh,Loading,List} from 'vant'
Vue.use(Button).use(Form).use(Field).use(Toast).use(Notify).use(NavBar).use(Tab).use(Tabs).use(Uploader).use(Tag).use(Dialog).use(Overlay).use(Cell).use(List)
.use(CellGroup).use(Icon).use(Popup).use(Empty).use(PullRefresh).use(Loading)
Vue.use(api)
// Vue.prototype.$md5 = md5
Vue.prototype.$axios = axios
Vue.prototype.$baseUrl = url.baseUrl
Vue.prototype.$img = url.photos
import common from '../static/js/common'
Vue.prototype.$uploadImg = common.uploadImg
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  components: { App },
  template: '<App/>'
})
