<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-calendar"></i>
					客服信息管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box" style="width:800px;margin: auto;">
				<el-form ref="form" :model="form" label-width="150px">
					<el-form-item label="客服QQ号">
						<template v-if="isEdit">
							<el-input v-model="form.qq"></el-input>
						</template>
						<template v-else>
							<span>{{ form.qq }}</span>
						</template>
					</el-form-item>
					<el-form-item class="mt20" label-width="0" v-for="(item, index) in form.qqGroupList" :key="index">
						<template v-if="isEdit">
							<el-form-item :label="'联系我们qq群' + (index + 1)"><el-input v-model="item.qq" placeholder="请输入QQ群号"></el-input></el-form-item>
							<el-form-item :label="'QQ群' + (index + 1) + 'key值'">
								<div>
									<el-input v-model="item.key" placeholder="请输入key值"></el-input>
									<span>key值获取教程：https://www.jianshu.com/p/14bdf3884465</span>
								</div>
							</el-form-item>
						</template>
						<template v-else>
							<el-form-item :label="'联系我们qq群' + (index + 1)">
								<span>{{ item.qq }}</span>
							</el-form-item>
							<el-form-item :label="'QQ群' + (index + 1) + 'key值'">
								<span>{{ item.key }}</span>
							</el-form-item>
						</template>
					</el-form-item>
					<el-form-item v-if="isEdit">
						<el-button type="info" @click="remove">删除</el-button>
						<el-button type="warning" @click="add">增加</el-button>
					</el-form-item>
					<el-form-item label="客服微信">
						<template v-if="isEdit">
							<el-input v-model="form.wechat"></el-input>
						</template>
						<template v-else>
							<span>{{ form.wechat }}</span>
						</template>
					</el-form-item>
					<el-form-item label="公众号名称">
						<template v-if="isEdit">
							<el-input type="textarea" v-model="form.wxUnionName"></el-input>
						</template>
						<template v-else>
							<span>{{ form.wxUnionName }}</span>
						</template>
					</el-form-item>
					<!-- <el-form-item label="普通用户公告">
						<template v-if="isEdit">
							<el-input type="textarea" v-model="form.generalNotice"></el-input>
						</template>
						<template v-else>
							<span>{{ form.generalNotice }}</span>
						</template>
					</el-form-item>
					<el-form-item label="vip用户公告">
						<template v-if="isEdit">
							<el-input type="textarea" v-model="form.vipNotice"></el-input>
						</template>
						<template v-else>
							<span>{{ form.vipNotice }}</span>
						</template>
					</el-form-item> -->
					<el-form-item label="是否显示收徒排行">
						<el-switch 
							v-model="form.showApprenticeRanking" 
							active-color="#4ad430" inactive-color="#ccc" 
							active-value="1" 
							inactive-value="0"
							:disabled="!isEdit">
						</el-switch>
					</el-form-item>
					<el-form-item label="提现须知">
						<div class="edit_container"><tinymce :height="300" :childHasChange="hasC" v-model="form.withdrawNotice" /></div>
					</el-form-item>
					<el-form-item label="新手指南">
						<div class="edit_container"><tinymce :height="300" :childHasChange="hasC" v-model="form.noviceDoc" /></div>
					</el-form-item>
					<!-- <el-form-item label="赚钱秘籍">
						<div class="edit_container"><tinymce :height="300" :childHasChange="hasC" v-model="form.earningCheats" /></div>
					</el-form-item>
					<el-form-item label="朋友圈解决方案">
						<div class="edit_container"><tinymce :height="300" :childHasChange="hasC" v-model="form.timelineSolution" /></div>
					</el-form-item>
					<el-form-item label="邀请攻略">
						<div class="edit_container"><tinymce :height="300" :childHasChange="hasC" v-model="form.invitationStrategy" /></div>
					</el-form-item> -->
					<el-form-item style="display:block;text-align:center;">
						<el-button v-if="!isEdit" type="primary" @click="edit">修改</el-button>
						<template v-else>
							<el-button type="default" @click="reset">取消</el-button>
							<el-button type="primary" @click="confirm">确认</el-button>
						</template>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'baseform',
	data() {
		return {
			isEdit: false,
			hasC: false, // 富文本在编辑切换的时候不会改变，利用这个变量来控制他的改变
			originForm: {},
			form: {
				qq: '',
				wechat: '',
				id: '',
				generalNotice: '',
				vipNotice: '',
				withdrawNotice: '',
				earningCheats: '',
				noviceDoc: '',
				wxUnionName: '',
				qqGroup: '',
				qqGroupList: [{ qq: '', key: '' }]
			}
		};
	},
	created() {
		this.getData();
	},
	methods: {
		add() {
			this.form.qqGroupList.push({ qq: '', key: '' });
		},
		remove() {
			if (this.form.qqGroupList.length <= 1) return;
			this.form.qqGroupList.pop();
		},
		edit() {
			this.isEdit = true;
		},
		reset() {
			this.isEdit = false;
			this.form = JSON.parse(JSON.stringify(this.originForm));
		},
		async getData() {
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/system/service/info');
			if (data.qqGroup !== null) {
				data.qqGroupList = data.qqGroup.split('/').map(item => {
					let itemList = item.split(',');
					return { qq: itemList[0], key: itemList[1] };
				});
			} else {
				data.qqGroupList = [];
			}
			this.form = JSON.parse(JSON.stringify(data));
			this.originForm = JSON.parse(JSON.stringify(data));
		},

		async confirm() {
			let postData = JSON.parse(JSON.stringify(this.form));
			postData.qqGroup = postData.qqGroupList.map(item => item.qq + ',' + item.key).join('/');
			delete postData.qqGroupList;
			let {
				data: { code, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/system/service/info/update', postData);
			if (code == '200') {
				this.$message.success(message);
				this.getData();
				this.isEdit = false;
				return;
			}
			this.$message.error(message);
		}
	}
};
</script>
<style scoped>
.mt20{
	margin-bottom: -3px;
}
.form-box span{
	color: #333;
}
</style>