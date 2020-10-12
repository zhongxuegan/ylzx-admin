import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			redirect: '/dashboard',
		}, {
			path: '/',
			//component: resolve => require(['../components/common/Home.vue'], resolve),
			component: (resolve) => require(['../main/common/Home.vue'], resolve),
			meta: {
				title: '自述文件'
			},
			children: [{
					path: '/dashboard',
					component: (resolve) =>
						require(['../main/common/Dashboard.vue'], resolve),
					meta: {
						title: '系统首页'
					},
				}, {
					path: '/setOperation',
					component: (resolve) =>
						require(['../main/basic/setOperation.vue'], resolve),
					meta: {
						title: '运营设置'
					},
				}, {
					path: '/setSMS',
					component: (resolve) =>
						require(['../main/basic/setSMS.vue'], resolve),
					meta: {
						title: '短信接口设置'
					},
				}, {
					path: '/domain_pool_management',
					component: (resolve) =>
						require(['../main/basic/domain_pool_management.vue'], resolve),
					meta: {
						title: '域名池管理'
					},
				}, {
					path: '/servise_info_management',
					component: (resolve) =>
						require(['../main/basic/servise_info_management.vue'], resolve),
					meta: {
						title: '客服信息管理'
					},
				}, {
					path: '/app_version_management',
					component: (resolve) =>
						require(['../main/basic/app_version_management.vue'], resolve),
					meta: {
						title: 'app版本管理'
					},
				}, {
					path: '/app_version_management_add',
					component: (resolve) =>
						require(['../main/basic/add/app_version_management_add.vue'], resolve),
					meta: {
						title: '添加版本'
					},
				}, {
					path: '/classify_management',
					component: (resolve) =>
						require(['../main/news/classify_management.vue'], resolve),
					meta: {
						title: '分类管理'
					},
				}, {
					path: '/article_management',
					component: (resolve) =>
						require(['../main/news/article_management.vue'], resolve),
					meta: {
						title: '文章管理'
					},
				}, {
					path: '/article_management_add',
					component: (resolve) =>
						require(['../main/news/article_management_add.vue'], resolve),
					meta: {
						title: '新增文章'
					},
				}, {
					path: '/advertising_position_management',
					component: (resolve) =>
						require([
							'../main/advertising/advertising_position_management.vue',
						], resolve),
					meta: {
						title: '广告位管理'
					},
				}, {
					path: '/advertising_position_management_add',
					component: (resolve) =>
						require([
							'../main/advertising/add/advertising_position_management_add.vue',
						], resolve),
					meta: {
						title: '新增广告位'
					},
				}, {
					path: '/app_advert',
					component: (resolve) =>
						require(['../main/advertising/app_advert.vue'], resolve),
					meta: {
						title: 'App广告管理'
					},
				}, {
					path: '/app_advert_space',
					component: (resolve) =>
						require(['../main/advertising/app_advert_space.vue'], resolve),
					meta: {
						title: 'App广告位管理'
					},
				}, {
					path: '/await_withdraw',
					component: (resolve) =>
						require(['../main/finance/await_withdraw.vue'], resolve),
					meta: {
						title: '等待提现'
					},
				}, {
					path: '/weChat_pay',
					component: (resolve) =>
						require(['../main/finance/weChat_pay.vue'], resolve),
					meta: {
						title: '微信支付'
					},
				}, {
					path: '/pay_record',
					component: (resolve) =>
						require(['../main/finance/pay_record.vue'], resolve),
					meta: {
						title: '支付记录'
					},
				}, {
					path: '/user_data_monitoring',
					component: (resolve) =>
						require(['../main/statistics/user_data_monitoring.vue'], resolve),
					meta: {
						title: '用户数据监测'
					},
				}, {
					path: '/all_day_time_interval_monitoring',
					component: (resolve) =>
						require([
							'../main/statistics/all_day_time_interval_monitoring.vue',
						], resolve),
					meta: {
						title: '全天分时段监测'
					},
				}, {
					path: '/user_data_query',
					component: (resolve) =>
						require(['../main/statistics/user_data_query.vue'], resolve),
					meta: {
						title: '用户数据查询'
					},
				}, {
					path: '/user_retention_analysis',
					component: (resolve) =>
						require([
							'../main/statistics/user_retention_analysis.vue',
						], resolve),
					meta: {
						title: '用户留存分析'
					},
				}, {
					path: '/advert_group_count',
					component: (resolve) =>
						require(['../main/statistics/advert_group_count.vue'], resolve),
					meta: {
						title: '广告全天分时统计'
					},
				}, {
					path: '/user_apprentice_num_query',
					component: (resolve) =>
						require([
							'../main/statistics/user_apprentice_num_query.vue',
						], resolve),
					meta: {
						title: '用户徒弟数量查询'
					},
				}, {
					path: '/account_manager',
					component: (resolve) =>
						require(['../main/system/account_manager.vue'], resolve),
					meta: {
						title: '用户管理'
					},
				}, {
					path: '/menu_manager',
					component: (resolve) =>
						require(['../main/system/menu_manager.vue'], resolve),
					meta: {
						title: '菜单管理'
					},
				}, {
					path: '/article_monitoring',
					component: (resolve) =>
						require(['../main/statistics/article_monitoring.vue'], resolve),
					meta: {
						title: '文章点击监测'
					},
				}, {
					path: '/user_data',
					component: (resolve) => require(['../main/system/user.vue'], resolve),
					meta: {
						title: '用户信息'
					},
				}, {
					path: '/elite_club_management',
					component: (resolve) =>
						require(['../main/activity/elite_club_management.vue'], resolve),
					meta: {
						title: '收徒精英会管理'
					},
				}, {
					path: '/elite_club_management_add',
					component: (resolve) =>
						require(['../main/activity/add/elite_club_management_add.vue'], resolve),
					meta: {
						title: '新增活动'
					},
				}, {
					path: '/elite_club_award_record',
					component: (resolve) =>
						require(['../main/activity/elite_club_award_record.vue'], resolve),
					meta: {
						title: '收徒精英会奖励记录'
					},
				}, {
					path: '/SVIP',
					component: (resolve) => require(['../main/system/svip.vue'], resolve),
					meta: {
						title: 'SVIP管理'
					},
				}, {
					path: '/back_page_manager',
					component: (resolve) =>
						require(['../main/advertising/back_page_manage.vue'], resolve),
					meta: {
						title: '后退页管理'
					},
				}, {
					path: '/h5_manager',
					component: (resolve) =>
						require(['../main/news/h5_manager.vue'], resolve),
					meta: {
						title: 'h5管理'
					},
				}, {
					path: '/inner_manager',
					component: (resolve) =>
						require(['../main/activity/inner_manager.vue'], resolve),
					meta: {
						title: '内部收徒管理'
					},
				}, {
					path: '/login_data',
					component: (resolve) =>
						require(['../main/system/login_data.vue'], resolve),
					meta: {
						title: '登录信息'
					},
				}, {
					path: '/domain_manager',
					component: (resolve) =>
						require(['../main/basic/domain_manager.vue'], resolve),
					meta: {
						title: '配置管理'
					},
				}, {
					path: '/white_list_manager',
					component: (resolve) =>
						require(['../main/basic/white_list_manager.vue'], resolve),
					meta: {
						title: '白名单管理'
					},
				}, {
					path: '/timed_task',
					component: (resolve) =>
						require(['../main/basic/timed_task.vue'], resolve),
					meta: {
						title: '定时任务管理'
					}
				}, {
					path: '/reset_forward_kouliang',
					component: (resolve) =>
						require(['../main/basic/reset_forward_kouliang'], resolve),
					meta: {
						title: '重置转发扣量'
					}
				}, {
					path: '/home_popup_windows',
					component: (resolve) =>
						require(['../main/basic/home_popup_windows.vue'], resolve),
					meta: {
						title: '首页弹窗'
					}
				}, {
					path: '/home_popup_windows_addWindows',
					component: (resolve) =>
						require(['../main/basic/add/home_popup_windows_addWindows'], resolve),
					meta: {
						title: '新建弹窗'
					}
				}, {
					path: '/time_price',
					component: (resolve) =>
						require(['../main/basic/time_price.vue'], resolve),
					meta: {
						title: '限时提价'
					},
				}, {
					path: '/time_price_add',
					component: (resolve) =>
						require(['../main/basic/add/time_price_add.vue'], resolve),
					meta: {
						title: '新增限时提价'
					},
				}, {
					path: '/line_chart',
					component: (resolve) =>
						require(['../main/statistics/line_chart.vue'], resolve),
					meta: {
						title: '曲线报表'
					},
				}, {
					path: '/common_question',
					component: (resolve) =>
						require(['../main/basic/common_question.vue'], resolve),
					meta: {
						title: '常见问题管理'
					},
				}, {
					path: '/common_question_classify',
					component: (resolve) =>
						require(['../main/basic/common_question_classify.vue'], resolve),
					meta: {
						title: '常见问题分类管理'
					},
				}, {
					path: '/activity_center',
					component: (resolve) =>
						require(['../main/advertising/activity_center.vue'], resolve),
					meta: {
						title: '活动中心'
					},
				}, {
					path: '/activity_center_add',
					component: (resolve) =>
						require(['../main/advertising/add/activity_center_add.vue'], resolve),
					meta: {
						title: '新增活动'
					},
				}, {
					path: '/sign_add',
					component: (resolve) =>
						require(['../main/activity/add/sign_add.vue'], resolve),
					meta: {
						title: '新建活动'
					},
				}, {
					path: '/sign',
					component: (resolve) =>
						require(['../main/activity/sign.vue'], resolve),
					meta: {
						title: '签到活动'
					},
				}, {
					path: '/sign_detail',
					component: (resolve) =>
						require(['../main/activity/detail/sign_detail.vue'], resolve),
					meta: {
						title: '签到活动详情'
					},
				}, {
					path: '/accept_apprentice_award',
					component: (resolve) =>
						require(['../main/activity/accept_apprentice_award.vue'], resolve),
					meta: {
						title: '收徒阶梯奖励'
					},
				}, {
					path: '/set_accept_award',
					component: (resolve) =>
						require(['../main/activity/set_accept_award.vue'], resolve),
					meta: {
						title: '收徒阶梯奖励设置'
					},
				}, {
					path: '/push_prentice_work',
					component: (resolve) =>
						require(['../main/activity/push_prentice_work.vue'], resolve),
					meta: {
						title: '督促徒弟干活奖励'
					},
				}, {
					path: '/push_prentice_work_add',
					component: (resolve) =>
						require(['../main/activity/add/push_prentice_work_add'], resolve),
					meta: {
						title: '新建活动'
					},
				}, {
					path: '/push_prentice_work_detail',
					component: (resolve) =>
						require(['../main/activity/detail/push_prentice_work_detail.vue'], resolve),
					meta: {
						title: '督促徒弟干活奖励详情'
					},
				}, {
					path: '/accept_apprentice_competition',
					component: (resolve) =>
						require(['../main/activity/accept_apprentice_competition'], resolve),
					meta: {
						title: '收徒大赛'
					},
				}, {
					path: '/accept_apprentice_competition_detail',
					component: (resolve) =>
						require(['../main/activity/detail/accept_apprentice_competition_detail'], resolve),
					meta: {
						title: '收徒大赛详情'
					},
				}, {
					path: '/accept_apprentice_competition_add',
					component: (resolve) =>
						require(['../main/activity/add/accept_apprentice_competition_add'], resolve),
					meta: {
						title: '新建活动'
					},
				}, {
					path: '/forward_thousand_award',
					component: (resolve) =>
						require(['../main/activity/forward_thousand_award'], resolve),
					meta: {
						title: '转发瓜分千元大奖'
					},
				}, {
					path: '/forward_thousand_award_add',
					component: (resolve) =>
						require(['../main/activity/add/forward_thousand_award_add'], resolve),
					meta: {
						title: '新建活动'
					},
				}, {
					path: '/forward_thousand_award_detail',
					component: (resolve) =>
						require(['../main/activity/detail/forward_thousand_award_detail'], resolve),
					meta: {
						title: '转发瓜分千元大奖详情'
					},
				}, {
					path: '/forward_income_award',
					component: (resolve) =>
						require(['../main/activity/forward_income_award'], resolve),
					meta: {
						title: '转发收入阶梯奖励'
					},
				}, {
					path: '/forward_income_award_add',
					component: (resolve) =>
						require(['../main/activity/add/forward_income_award_add'], resolve),
					meta: {
						title: '新建活动'
					},
				}, {
					path: '/forward_income_award_detail',
					component: (resolve) =>
						require(['../main/activity/detail/forward_income_award_detail'], resolve),
					meta: {
						title: '转发收入阶梯奖励详情'
					},
				}, {
					path: '/setTimeHightPrice',
					component: (resolve) =>
						require(['../main/activity/setTimeHightPrice'], resolve),
					meta: {
						title: '限时高价设置'
					},
				}, {
					path: '/setTimeHightPrice_add',
					component: (resolve) =>
						require(['../main/activity/add/setTimeHightPrice_add'], resolve),
					meta: {
						title: '新增活动'
					},
				}, {
					path: '/user_fission_keep',
					component: (resolve) =>
						require(['../main/statistics/user_fission_keep'], resolve),
					meta: {
						title: '用户裂变留存'
					},
				}, {
					path: '/finance_statistics',
					component: (resolve) =>
						require(['../main/statistics/finance_statistics'], resolve),
					meta: {
						title: '营收记录'
					},
				}, {
					path: '/download_link_statistics',
					component: (resolve) =>
						require(['../main/statistics/download_link_statistics'], resolve),
					meta: {
						title: '下载链接统计'
					},
				}, {
					path: '/business_advertising_statistics',
					component: (resolve) =>
						require(['../main/statistics/business_advertising_statistics'], resolve),
					meta: {
						title: '商务广告统计'
					},
				}, {
					path: '/edit_data_statistics',
					component: (resolve) =>
						require(['../main/statistics/edit_data_statistics'], resolve),
					meta: {
						title: '编辑数据统计'
					},
				}, {
					path: '/advertising_everyday_statistics',
					component: (resolve) =>
						require(['../main/statistics/advertising_everyday_statistics'], resolve),
					meta: {
						title: '广告每天统计'
					},
				}, {
					path: '/user_data_monitor',
					component: (resolve) =>
						require(['../main/statistics/user_data_monitor'], resolve),
					meta: {
						title: '用户数据监测'
					},
				}, {
					path: '/setPreventSeal',
					component: (resolve) =>
						require(['../main/basic/setPreventSeal'], resolve),
					meta: {
						title: '防刷参数设置'
					},
				},
				//下面的模板页
				{
					path: '/icon',
					component: (resolve) =>
						require(['../components/page/Icon.vue'], resolve),
					meta: {
						title: '自定义图标'
					},
				},
				{
					path: '/table',
					component: (resolve) =>
						require(['../components/page/BaseTable.vue'], resolve),
					meta: {
						title: '基础表格'
					},
				},
				{
					path: '/tabs',
					component: (resolve) =>
						require(['../components/page/Tabs.vue'], resolve),
					meta: {
						title: '消息'
					},
				},
				{
					path: '/form',
					component: (resolve) =>
						require(['../components/page/BaseForm.vue'], resolve),
					meta: {
						title: '基本表单'
					},
				},
				{
					// 富文本编辑器组件
					path: '/editor',
					component: (resolve) =>
						require(['../components/page/VueEditor.vue'], resolve),
					meta: {
						title: '富文本编辑器'
					},
				},
				{
					// markdown组件
					path: '/markdown',
					component: (resolve) =>
						require(['../components/page/Markdown.vue'], resolve),
					meta: {
						title: 'markdown编辑器'
					},
				},
				{
					// 图片上传组件
					path: '/upload',
					component: (resolve) =>
						require(['../components/page/Upload.vue'], resolve),
					meta: {
						title: '文件上传'
					},
				},
				{
					// vue-schart组件
					path: '/charts',
					component: (resolve) =>
						require(['../components/page/BaseCharts.vue'], resolve),
					meta: {
						title: 'schart图表'
					},
				},
				{
					// 拖拽列表组件
					path: '/drag',
					component: (resolve) =>
						require(['../components/page/DragList.vue'], resolve),
					meta: {
						title: '拖拽列表'
					},
				},
				{
					// 拖拽Dialog组件
					path: '/dialog',
					component: (resolve) =>
						require(['../components/page/DragDialog.vue'], resolve),
					meta: {
						title: '拖拽弹框'
					},
				},
				{
					// 权限页面
					path: '/permission',
					component: (resolve) =>
						require(['../components/page/Permission.vue'], resolve),
					meta: {
						title: '权限测试',
						permission: true
					},
				},
				{
					path: '/404',
					component: (resolve) =>
						require(['../components/page/404.vue'], resolve),
					meta: {
						title: '404'
					},
				},
				{
					path: '/403',
					component: (resolve) =>
						require(['../components/page/403.vue'], resolve),
					meta: {
						title: '403'
					},
				},
			],
		},
		{
			path: '/login',
			component: (resolve) => require(['../main/common/Login.vue'], resolve),
			//component: resolve => require(['../components/page/Login.vue'], resolve)
		},
		{
			path: '*',
			redirect: '/404',
		},
	],
})
