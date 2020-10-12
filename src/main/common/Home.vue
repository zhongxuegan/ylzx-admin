<template>
	<div class="wrapper">
		<v-head></v-head>
		<v-sidebar></v-sidebar>
		<div class="content-box" :class="{ 'content-collapse': collapse }">
			<v-tags></v-tags>
			<div class="content">
				<transition name="move" mode="out-in">
					<keep-alive :include="tagsList"><router-view></router-view></keep-alive>
				</transition>
				<template>
					<el-backtop class="backTop" target=".content"></el-backtop>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import bus from './bus';
export default {
	name: 'Home',
	data() {
		return {
			tagsList: [],
			collapse: true
		};
	},
	components: {
		vHead:() => import('./Header.vue'),
		vSidebar:() => import('./Sidebar.vue'),
		vTags:() => import('./Tags.vue')
	},
	created() {
		bus.$on('collapse', msg => {
			this.collapse = msg;
		});

		// 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
		bus.$on('tags', msg => {
			let arr = [];
			for (let i = 0, len = msg.length; i < len; i++) {
				msg[i].name && arr.push(msg[i].name);
			}
			this.tagsList = arr;
		});
	}
};
</script>
<style>
.backTop{
	background: transparent;
}
.backTop:hover{
	background-color: #479EF8;
	color: #fff;
}
</style>