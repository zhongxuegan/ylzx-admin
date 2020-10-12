<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					转发瓜分收入千元大奖
				</el-breadcrumb-item>
				<el-breadcrumb-item>新建活动</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
					<el-form-item label="期数" prop="num">
						<el-input-number class="inputNum" v-model="activityForm.config.num" :min="1" controls-position="right"></el-input-number>
					</el-form-item>
					<el-form-item label="活动名称" prop="config.title"><el-input v-model="activityForm.config.title"></el-input></el-form-item>
					<el-form-item label="开始时间" prop="config.startTime">
						<el-date-picker
							type="datetime"
							:picker-options="pickerOptions"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择开始日期"
							@change="startDateChange"
							v-model="activityForm.config.startTime"
						></el-date-picker>
					</el-form-item>
					<el-form-item prop="config.endTime" label="结束时间">
						<el-date-picker
							type="datetime"
							:picker-options="pickerOptions"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择结束日期"
							@change="endDateChange"
							v-model="activityForm.config.endTime"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="活动周期" prop="generalConfig.divideUpPeriod">
						<el-input type="number" v-model.number="activityForm.generalConfig.divideUpPeriod">
							<template slot="append">
								日
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="状态" prop="config.status">
						<el-switch v-model="activityForm.config.status" active-color="#13ce66" inactive-color="#dddddd" active-value="1" inactive-value="0"></el-switch>
					</el-form-item>
					<el-form-item label="瓜分金额" prop="generalConfig.divideUpAmt">
						<el-input type="number" v-model.number="activityForm.generalConfig.divideUpAmt">
							<template slot="append">
								元
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="最低瓜分人数" prop="generalConfig.divideUpLeastPeoples">
						<el-input type="number" v-model.number="activityForm.generalConfig.divideUpLeastPeoples" :min="3000">
							<template slot="append">
								人
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="转发收入门槛" prop="generalConfig.divideUpForward">
						<el-input type="number" v-model.number="activityForm.generalConfig.divideUpForward">
							<template slot="append">
								元
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="规则" prop="config.scheme">
						<div class="edit_container"><tinymce ref="content" :height="300" :childHasChange="hasC" v-model="activityForm.config.scheme" /></div>
					</el-form-item>
					<el-form-item>
						<el-button @click="reset('activityForm')">取 消</el-button>
						<el-button type="primary" @click="submitForm('activityForm')">确 定</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import { formatUnit } from '@/utils/index.js';
import { verifyDateMinxins, pickerOptionsMinxins, operateMinxins } from '../mixins/mixins.js';
export default {
	name: 'forward_thousand_award_addActivity',
	mixins: [verifyDateMinxins, pickerOptionsMinxins, operateMinxins],
	data() {
		return {
			hasC: false,
			activityForm: {
				config: {
					num: null,
					title: '',
					startTime: null,
					endTime: null,
					status: '0',
					scheme: '',
					type: '5'
				},
				generalConfig: {
					divideUpPeriod: null,
					divideUpAmt: 1000,
					divideUpLeastPeoples: 3000,
					divideUpForward: 3
				}
			},
			formLabelWidth: '150px',
			rules: {
				'config.title': [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				'config.startTime': [{ required: true, message: '请选择开始时间', trigger: 'change' }],
				'generalConfig.divideUpPeriod': [{ required: true, message: '请输入活动周期', trigger: 'blur' }],
				'config.status': [{ required: true, message: '请选择状态', trigger: 'change' }],
				'generalConfig.divideUpAmt': [{ required: true, message: '请输入瓜分金额', trigger: 'blur' }],
				'generalConfig.divideUpLeastPeoples': [{ required: true, message: '请输入最低瓜分人数', trigger: 'blur' }],
				'generalConfig.divideUpForward': [{ required: true, message: '请输入转发收入门槛', trigger: 'blur' }]
			}
		};
	},
	methods: {
		async saveActivity() {
			let postData = JSON.parse(JSON.stringify(this.activityForm));
			if (postData.config.endTime == '' || postData.config.endTime == null) postData.config.endTime = '2038-01-19 03:14:07';
			postData = formatUnit(postData);
			let {
				data: { code, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/activity/config', postData);
			if (code == '200') {
				this.$message.success(message);
				this.$refs.activityForm.resetFields();
				this.$refs.content.setContent('');
				this.activityForm.config.num += 1;
			}
		}
	},
	created() {
		this.activityForm.config.num = this.$route.query.num;
	}
};
</script>
