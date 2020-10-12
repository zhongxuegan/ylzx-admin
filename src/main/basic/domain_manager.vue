<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-calendar"></i>
					基本设置
				</el-breadcrumb-item>
				<el-breadcrumb-item>配置管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box" style="width:600px;">
				<el-form ref="form" :model="form" label-width="180px">
					<el-form-item label="循环次数">
						<template v-if="isEdit">
							<el-input v-model="form.loopCount"></el-input>
						</template>
						<template v-else>
							<span>{{ form.loopCount }}</span>
						</template>
					</el-form-item>
					<el-form-item label="每次循环休息时间">
						<template v-if="isEdit">
							<el-input v-model="form.sleepTime"></el-input>
						</template>
						<template v-else>
							<span>{{ form.sleepTime }}</span>
						</template>
					</el-form-item>
					<el-form-item label="每天访问次数上限限制">
						<template v-if="isEdit">
							<el-input v-model="form.upperCount"></el-input>
						</template>
						<template v-else>
							<span>{{ form.upperCount }}</span>
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
				loopCount: '',
				sleepTime: '',
				upperCount: ''
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
			} = await this.$axios.post(this.BASE_URL + 'admin/domain/getDomainManagerInfo');
			this.form = Object.assign({}, data);
			this.originForm = Object.assign({}, data);
		},
		async confirm() {
			let {
				data: { code, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/domain/saveDomainManagerInfo', this.form);
			if (code == '200') {
				this.getData();
				this.isEdit = false;
				this.$message.success(message);
				return;
			}
			this.$message.error(message);
		}
	}
};
</script>
