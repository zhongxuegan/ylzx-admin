<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					收徒阶梯奖励
				</el-breadcrumb-item>
				<el-breadcrumb-item>收徒阶梯奖励设置</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box" style="width:800px;margin: auto;">
				<el-form :model="setAcceptForm" :label-width="formLabelWidth" :rules="rules" label-position="right" class="form--wrap" ref="setAcceptForm">
					<el-form-item label="活动名称" prop="config.title">
						<template v-if="isEdit">
							<el-input class="w200" v-model.number="setAcceptForm.config.title" autocomplete="off"></el-input>
						</template>
						<template v-else>
							<span>{{ setAcceptForm.config.title }}</span>
						</template>
					</el-form-item>
					<el-form-item label="状态" prop="config.status">
						<template v-if="isEdit">
							<el-switch v-model="setAcceptForm.config.status" active-color="#13ce66" inactive-color="#dddddd" active-value="1" inactive-value="0"></el-switch>
						</template>
						<template v-else>
							<el-switch
								disabled
								v-model="setAcceptForm.config.status"
								active-color="#13ce66"
								inactive-color="#dddddd"
								active-value="1"
								inactive-value="0"
							></el-switch>
						</template>
					</el-form-item>
					<el-form-item
						v-for="(item, index) in setAcceptForm.multiConfigs"
						:key="index"
						:label="`徒弟${item.numberValue}提奖励`"
						:prop="'multiConfigs.' + index + '.awardAmt'"
					>
						<template v-if="isEdit">
							<el-input type="number" v-model.number="item.awardAmt">
								<template slot="append">
									元
								</template>
							</el-input>
						</template>
						<template v-else>
							<span>{{ item.awardAmt + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item v-if="isEdit">
						<el-button @click="addPrenticeAward">新增</el-button>
						<el-button @click.prevent="removePrenticeAward">移除</el-button>
					</el-form-item>
					<el-form-item label="徒弟提现满额" prop="generalConfig.effectiveDiscipleDrawMoney">
						<template v-if="isEdit">
							<el-input class="w200" type="number" v-model.number="setAcceptForm.generalConfig.effectiveDiscipleDrawMoney" autocomplete="off">
								<template slot="append">
									元
								</template>
							</el-input>
						</template>
						<template v-else>
							<span>{{ setAcceptForm.generalConfig.effectiveDiscipleDrawMoney + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="师父满额奖励" prop="generalConfig.effectiveDiscipleDrawMoneyAward">
						<template v-if="isEdit">
							<el-input class="w200" type="number" v-model.number="setAcceptForm.generalConfig.effectiveDiscipleDrawMoneyAward" autocomplete="off">
								<template slot="append">
									元
								</template>
							</el-input>
						</template>
						<template v-else>
							<span>{{ setAcceptForm.generalConfig.effectiveDiscipleDrawMoneyAward + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="规则" prop="scheme">
						<template v-if="isEdit">
							<div class="edit_container"><tinymce ref="content" :height="300" :childHasChange="hasC" v-model="setAcceptForm.config.scheme" /></div>
						</template>
						<template v-else>
							<span v-html="setAcceptForm.config.scheme"></span>
						</template>
					</el-form-item>
					<el-form-item>
						<template v-if="isEdit">
							<el-button @click="cancel('setAcceptForm')">取 消</el-button>
							<el-button type="primary" @click="submitForm('setAcceptForm')">确 定</el-button>
						</template>
						<template v-else>
							<el-button type="primary" @click="isEdit = true">修改</el-button>
						</template>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import { formatUnit } from '../../utils/index.js';
export default {
	name: 'set_accept_award',
	data() {
		return {
			hasC: false,
			isEdit: false,
			isUpdate: false, //判断是向后端添加还是修改
			rules: {
				'config.title': [{ required: true, message: '请输入标题', trigger: 'blur' }],
				status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
				'multiConfigs.0.awardAmt': [{ required: true, message: '请输入徒弟1提奖励', trigger: 'blur' }]
			},
			formLabelWidth: '150px',
			setAcceptForm: {
				config: {
					id: null,
					status: '0',
					scheme: '',
					type: '2'
				},
				generalConfig: {
					effectiveDiscipleDrawMoney: '',
					effectiveDiscipleDrawMoneyAward: ''
				},
				multiConfigs: [
					{ numberValue: 1, awardAmt: '' },
					{ numberValue: 2, awardAmt: '' },
					{ numberValue: 3, awardAmt: '' },
					{ numberValue: 4, awardAmt: '' },
					{ numberValue: 5, awardAmt: '' }
				]
			},
			keepForm: {}
		};
	},
	methods: {
		addPrenticeAward() {
			this.setAcceptForm.multiConfigs.push({
				numberValue: (this.setAcceptForm.multiConfigs.length + 1).toString(),
				awardAmt: null
			});
		},
		removePrenticeAward() {
			if (this.setAcceptForm.multiConfigs.length <= 1) return;
			this.setAcceptForm.multiConfigs.pop();
		},
		cancel(formName) {
			this.$refs[formName].clearValidate();
			this.setAcceptForm = JSON.parse(JSON.stringify(this.keepForm));
			this.isEdit = false;
		},
		rest(formName) {
			this.$confirm('确认清空吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(res => {
					this.$refs[formName].resetFields();
					this.$refs.content.setContent('');
				})
				.catch(() => {});
		},
		async saveAcceptAward() {
			let postData = JSON.parse(JSON.stringify(this.setAcceptForm));
			let url;
			// 元 转 分
			postData = formatUnit(postData);
			postData.config.startTime = this.$moment().format('YYYY-MM-DD HH:mm:ss');
			postData.config.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss');
			if (this.isUpdate) {
				url = this.BASE_URL + `admin/activity/config/update?id=${postData.config.id}`;
			} else {
				url = this.BASE_URL + 'admin/activity/config';
			}
			let {
				data: { code, data, message }
			} = await this.$axios.post(url, postData);
			if (code == '200') {
				this.isEdit = false;
				this.$message.success(message);
			}
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let msg;
					if (this.isUpdate) {
						msg = '确定修改吗';
					} else {
						msg = '确定添加吗';
					}
					this.$confirm(msg, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
						.then(() => {
							this.saveAcceptAward();
						})
						.catch(() => {});
				} else {
					return false;
				}
			});
		},
		async getData() {
			let params = { type: '2' };
			let {
				data: { code, data, message }
			} = await this.$axios.get(this.BASE_URL + 'admin/activity/config/type/detail', { params });
			if (code == 200) {
				this.setAcceptForm = formatUnit(data, true);
				this.keepForm = JSON.parse(JSON.stringify(this.setAcceptForm));
				this.isUpdate = true; //执行修改
				return;
			}
			this.isUpdate = false; //执行添加
		}
	},
	created() {
		this.getData();
	}
};
</script>