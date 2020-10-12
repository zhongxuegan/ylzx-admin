import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import moment from 'moment'
import Tinymce from './components/Tinymce'
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import './style/element-variables.scss'
import './assets/css/left-nav-icon/iconfont.css' //左侧导航icon
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css'
import 'babel-polyfill'
import './main/common/directives.js' //v-dialogDrag: 弹窗拖拽属性

Vue.config.productionTip = false
Vue.use(ElementUI, {
	size: 'small',
})
Vue.component('tinymce', Tinymce)
Vue.prototype.$moment = moment
Vue.prototype.$axios = axios
Vue.prototype.$message = Message
// api基础地址
Vue.prototype.BASE_URL = 'http://test.wz3.api.zhuanyuanbao.com/'

// Vue.prototype.BASE_URL = 'http://ylzx.api.sharing662.com/'
// 善良
// Vue.prototype.BASE_URL = 'http://172.17.30.77:801/'
// 诗华
// Vue.prototype.BASE_URL = 'http://172.17.43.91/'


// Vue.prototype.BASE_URL = 'https://mrzx.api.zhuanfa222.com/'

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
	//请求头带token
	// axios.defaults.headers.common['token'] = localStorage.getItem('token')
	const role = localStorage.getItem('token')
	if (!role && to.path !== '/login') {
		next('/login')
	} else if (to.meta.permission) {
		// 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
		role === 'admin' ? next() : next('/403')
	} else {
		// 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
		if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
			Vue.prototype.$alert(
				'vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看',
				'浏览器不兼容通知', {
					confirmButtonText: '确定',
				}
			)
		} else {
			next()
		}
	}
})

axios.interceptors.request.use(
	res => {
		console.log(res);
		//请求头带token
		if(!res.url.includes('login')){
			let token = localStorage.getItem('token');
			res.headers.common['token'] = token;
		}
		return res;
	},
	error => {
		return new Promise.reject('error')
	}
);

//响应拦截（配置请求回来的信息）
axios.interceptors.response.use(
	(response) => {
		// debugger
		if (response.headers['content-type'] === 'application/vnd.ms-excel') {
			return response
		} else {
			// 处理响应数据，如果登录失效 则移除token信息，跳转到登录页
			if (response.data.code == '10001') {
				router.push('/login')
			} else {
				if (response.data.code === '200') {
					return response
				} else {
					// debugger
					Message({
						message: response.data.message,
						type: 'error'
					})
					return Promise.reject('error')
				}
			}
		}
	},
	(error) => {
		// 处理响应失败
		Message({
			showClose: true,
			message: '服务错误，请重试',
			type: 'error',
		})
		return Promise.reject(error)
	}
)

new Vue({
	router,
	render: (h) => h(App),
}).$mount('#app')
