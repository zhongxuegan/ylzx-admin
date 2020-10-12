<template>
	<div class="sidebar">
		<el-menu class="sidebar-el-menu" 
			:default-active="onRoutes" 
			:collapse="collapse" 
			background-color="#479EF8" 
			text-color="#fff"
			active-text-color="#333" 
			unique-opened router>
			<template v-for="(item, index) in items">
				<template v-if="item.childrens.length != 0">
					<el-submenu :index="item.nodeUrl" :key="item.nodeUrl">
						<template slot="title">
							<i :class="item.icon"></i>
							<span slot="title">{{ item.nodeName }}</span>
						</template>
						<template v-for="subItem in item.childrens">
							<el-submenu v-if="subItem.childrens.length != 0" :index="subItem.nodeUrl" :key="subItem.nodeUrl">
								<template slot="title">
									{{ subItem.nodeName }}
								</template>
								<el-menu-item v-for="(threeItem, i) in subItem.childrens" :key="i" :index="threeItem.nodeUrl">{{ threeItem.nodeName }}</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="subItem.nodeUrl" :key="subItem.nodeUrl">{{ subItem.nodeName }}</el-menu-item>
						</template>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.nodeUrl" :key="item.nodeUrl">
						<i :class="item.icon"></i>
						<span slot="title">{{ item.nodeName }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
import bus from './bus';
export default {
	data() {
		return {
			collapse: true,
			items: [],
			iconList: [
				{ name: '基本设置', url: 'setBasic', value: 'wz icon-jibenshezhi1' },
				{ name: '新闻管理', url: 'news_management', value: 'wz icon-ICon-' },
				{ name: '广告管理', url: 'advertising_management', value: 'wz icon-ziyuan' },
				{ name: '活动管理', url: 'finance_management', value: 'wz icon-huodongguanli1 size' },
				{ name: '财务管理', url: 'service_management', value: 'wz icon-caiwushezhi-copy-copy size' },
				{ name: '统计报表', url: 'statistical_statement', value: 'wz icon-tongjibaobiao size' },
				{ name: '系统管理', url: 'system_manager', value: 'wz icon-xitongguanli1 size' }
			]
		};
	},
	computed: {
		onRoutes() {
			return this.$route.path.replace('/', '');
		}
	},
	methods: {
		getIcon(url) {
			let icon = 'el-icon-warning-outline';
			this.iconList.forEach(item => {
				if (item.url === url) icon = item.value;
			});
			return icon;
		},
		async getData() {
			const formData = new FormData();
			formData.append('accountName', localStorage.getItem('ms_username'));
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/account/findMenuByAccountName', formData);
			if (code !== '200') return;
			data.forEach((item, index) => {
				item.icon = this.getIcon(item.nodeUrl);
			});
			this.items = data;
		}
	},
	created() {
		// 通过 Event Bus 进行组件间通信，来折叠侧边栏
		bus.$on('collapse', msg => {
			this.collapse = msg;
		});
		this.getData();
		// const formData = new FormData();
		// formData.append('accountName', localStorage.getItem('ms_username'));

		// this.$axios.post(this.BASE_URL + 'admin/account/findMenuByAccountName', formData).then(res => {
		// 	if (res.data.code == '200') {
		// 		res.data.data.forEach((item, index) => {
		// 			item.icon = this.getIcon(item.nodeUrl);
		// 		});
		// 		this.items = res.data.data;
		// 	}
		// });

		// 临时处理给于编辑只有文章权限问题
		// if (localStorage.getItem("ms_username") == "bianji") {
		//     this.items = [
		//         {
		//             index: 'news_management',
		//             title: '新闻管理',
		// 			subs: [
		// 						{
		// 							index: 'classify_management',
		// 							title: '分类管理',
		// 						},
		// 						{
		// 							index: 'article_management',
		// 							title: '文章管理',
		// 						}
		// 					]
		// 		}
		//     ]
		// } else if (localStorage.getItem("ms_username") == "tuiguang") {
		//     this.items = [
		//         {
		//             index: 'news_management',
		//             title: '查',
		// 			subs: [
		// 						{
		// 							index: 'user_apprentice_num_query',
		// 							title: '用户徒弟数量查询',
		// 						}
		// 					]
		// 		}
		//     ]
		// } else {
		//     this.items = [
		// 		{
		//               index: 'setBasic',
		//             title: '基本设置',
		// 			subs: [
		// 						{
		// 							index: 'setOperation',
		// 							title: '运营设置',
		// 						},
		// 						{
		// 							index: 'setSMS',
		// 							title: '短信接口设置',
		// 						},
		// 						{
		// 							index: 'domain_pool_management',
		// 							title: '域名池管理',
		// 						},
		// 						{
		// 							index: 'servise_info_management',
		// 							title: '客服信息管理',
		// 						},
		// 						{
		// 							index: 'app_version_management',
		// 							title: 'app版本管理',
		// 						}
		// 					]
		// 		},
		// 		{
		//             index: 'news_management',
		//             title: '新闻管理',
		// 			subs: [
		// 						{
		// 							index: 'classify_management',
		// 							title: '分类管理',
		// 						},
		// 						{
		// 							index: 'article_management',
		// 							title: '文章管理',
		// 						}
		// 					]
		// 		},
		// 		{
		// 			index: 'advertising_management',
		//             title: '广告管理',
		// 			subs: [
		// 						{
		// 							index: 'advertising_position_management',
		// 							title: '广告位管理',
		// 						},
		// 						{
		// 							index: 'advertising_list',
		// 							title: '广告列表',
		//                         }
		// 					]
		// 		},
		// 		{
		//             index: 'finance_management',
		//             title: '财务管理',
		// 			subs: [
		// 						{
		// 							index: 'await_withdraw',
		// 							title: '等待提现',
		// 						},
		// 						{
		// 							index: 'pay_record',
		// 							title: '支付记录',
		// 						}
		// 					]
		// 		},
		// 		{
		//             index: 'service_management',
		//             title: '客服管理',
		// 			subs: [

		// 				  ]
		// 		},
		// 		{
		//             index: 'statistical_statement',
		//             title: '统计报表',
		// 			subs: [
		// 						{
		// 							index: 'user_data_monitoring',
		// 							title: '用户数据监测',
		//                         },
		//                         {
		// 							index: 'all_day_time_interval_monitoring',
		// 							title: '全天分时段监测',
		//                         },
		//                         {
		// 							index: 'advert_group_count',
		// 							title: '广告全天分时统计',
		//                         },
		//                         {
		// 							index: 'user_data_query',
		// 							title: '用户数据查询',
		//                         },
		//                         {
		// 							index: 'user_retention_analysis',
		// 							title: '用户留存分析',
		//                         },
		//                         {
		// 							index: 'user_apprentice_num_query',
		// 							title: '用户徒弟数量查询',
		// 						},
		// 				  ]
		//         },
		//         {
		//             index: 'system_manager',
		//             title: '系统管理',
		// 			subs: [
		//                 {
		//                     index: 'account_manager',
		//                     title: '用户管理',
		//                 },
		//                 {
		//                     index: 'menu_manager',
		//                     title: '菜单管理',
		//                 }
		//             ]
		//         },
		//     ]
		// }
	}
};
</script>

<style scoped>
.sidebar {
	display: block;
	position: absolute;
	left: 0;
	top: 70px;
	bottom: 0;
	overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
	width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
	width: 250px;
}
.sidebar > ul {
	height: 100%;
}
.sidebar i {
	color: #fff !important;
	font-size: 1.4rem;
	margin-right: 10px;
}
.size {
	font-size: 1.2rem !important;
}
.el-menu-item.is-active {
    font-weight: bold;
}

</style>
