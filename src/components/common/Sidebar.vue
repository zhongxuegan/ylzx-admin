<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '测试首页'
                    },
					{
						icon: 'el-icon-lx-home',
                        index: 'setWebsite',
                        title: '网站设置',
						subs: [
									{
										index: 'setParameter',
										title: '参数设置',
									},
									{
										index: 'setActivity',
										title: '活动设置',
									},
									{
										index: 'inform_management',
										title: '通知管理',
									},
									{
										index: 'advertising_management',
										title: '广告管理',
									},
									{
										index: 'app_version_management',
										title: 'app版本管理',
									},
									{
										index: 'service_info_management',
										title: '客服信息管理',
									}
								]
					},
					{
						icon: 'el-icon-lx-home',
                        index: 'news_article_management',
                        title: '新闻文章管理',
						subs: [
									{
										index: 'news_management',
										title: '新闻管理',
									},
									{
										index: 'classify_management',
										title: '分类管理',
									},
									{
										index: 'article_issue',
										title: '文章发布',
									},
									{
										index: 'weChat_import',
										title: '微信导入',
									},
									{
										index: 'article_list_management',
										title: '文章列表管理',
									}
								]
					},
					{
						icon: 'el-icon-lx-home',
                        index: 'statistical_form',
                        title: '统计报表',
						subs: [
									{
										index: 'visit_statistics',
										title: '访问统计',
									},
									{
										index: 'day_statistics',
										title: '日段统计',
									},
									{
										index: 'operation_form',
										title: '运营报表',
									}
								]
					},
					{
						icon: 'el-icon-lx-home',
                        index: 'finance_management',
                        title: '财务管理',
						subs: [
									{
										index: 'await_withdraw',
										title: '等待提现',
									},
									{
										index: 'withdraw_dispose_list',
										title: '已经提现、拒绝支付列表',
									},
									{
										index: 'weChat_pay_dispose',
										title: '微信支付转账批量处理',
									},
									{
										index: 'pay_record',
										title: '支付记录',
									},
									{
										index: 'pay_failure',
										title: '支付失败',
									}
								]
					},
					{
						icon: 'el-icon-lx-home',
                        index: 'member_management',
                        title: '会员管理',
						subs: [
									{
										index: 'top50',
										title: 'top50',
									},
									{
										index: 'recruit_manito',
										title: '收徒大神',
									},
									{
										index: 'inform',
										title: '域名池管理',
									},
									{
										index: 'advertising',
										title: '会员管理',
									},
									{
										index: 'activity',
										title: '封禁大户',
									},
									{
										index: 'inform',
										title: '会员封禁解禁',
									},
									{
										index: 'advertising',
										title: '所有会员汇总统计分析',
									}
								]
					},
					{
						icon: 'el-icon-lx-home',
                        index: 'website',
                        title: '网站设置',
						subs: [
									{
										index: 'parameter',
										title: '参数设置',
									},
									{
										index: 'activity',
										title: '活动设置',
									},
									{
										index: 'inform',
										title: '通知管理',
									},
									{
										index: 'advertising',
										title: '广告管理',
									}
								]
					}
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
