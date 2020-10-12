<template>
	<div class="white__list">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-calendar"></i>
					基本设置
				</el-breadcrumb-item>
				<el-breadcrumb-item>白名单管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box" style="width:600px;">
				<el-form ref="form" :model="form" label-width="100px">
					<el-form-item label="用户白名单">
						<template v-if="isEdit">
							<el-input v-model="form.cheatWhite" type="textarea" placeholder="用逗号隔开"></el-input>
						</template>
						<template v-else>
							<el-input type="textarea" readonly :value="form.cheatWhite"></el-input>
						</template>
					</el-form-item>
					<el-form-item label="师傅白名单">
						<template v-if="isEdit">
							<el-input type="textarea" v-model="form.cheatParentWhite" placeholder="用逗号隔开"></el-input>
						</template>
						<template v-else>
							<el-input type="textarea" readonly :value="form.cheatParentWhite"></el-input>
						</template>
					</el-form-item>
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
				cheatWhite: '',
				cheatParentWhite: ''
			}
		};
	},
	created() {
		this.getData();
	},
	methods: {
		edit() {
			this.isEdit = true;
		},
		reset() {
			this.isEdit = false;
			this.form = Object.assign({}, this.originForm);
		},
		async getData() {
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/domain/getWhiteListInfo');
			this.form = Object.assign({}, data);
			this.originForm = Object.assign({}, data);
		},
		async confirm() {
			let { cheatWhite, cheatParentWhite } = this.form;
			let { code } = await this.$axios.post(this.BASE_URL + `admin/domain/saveWhiteListInfo?cheatWhite=${cheatWhite}&cheatParentWhite=${cheatParentWhite}`);
			this.getData();
			this.isEdit = false;
		}
	}
};
</script>

<style>
.white__list .el-textarea__inner {
	height: 200px !important;
	width: 700px !important;
}
</style>
