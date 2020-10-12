<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					转发收入阶梯奖励
				</el-breadcrumb-item>
				<el-breadcrumb-item>新建活动</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
					<el-form-item label="期数" prop="config.num">
						<el-input-number class="inputNum" v-model="activityForm.config.num" :min="1" controls-position="right"></el-input-number>
					</el-form-item>
					<el-form-item label="活动名称" prop="config.title">
						<el-input v-model="activityForm.config.title" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="开始时间" prop="config.startTime">
						<el-date-picker
							type="datetime"
							:picker-options="pickerOptions"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择开始日期"
							v-model="activityForm.config.startTime"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="连续达标天数" prop="generalConfig.forwardAwardDays">
						<el-input type="number" v-model.number="activityForm.generalConfig.forwardAwardDays">
							<template slot="append">
								天
							</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="config.endTime" label="结束时间">
						<el-date-picker
							type="datetime"
							readonly
							:picker-options="pickerOptions"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择结束日期"
							v-model="activityForm.config.endTime"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="状态" prop="config.status">
						<el-switch v-model="activityForm.config.status" active-color="#13ce66" inactive-color="#dddddd" active-value="1" inactive-value="0"></el-switch>
					</el-form-item>

					<el-form-item label="过期领取时间" prop="generalConfig.forwardAwardExpTime">
						<el-input type="number" v-model.number="activityForm.generalConfig.forwardAwardExpTime">
							<template slot="append">
								小时
							</template>
						</el-input>
					</el-form-item>
					<el-form-item v-for="(item, index) in activityForm.multiConfigs" label-width="0px">
						<el-form-item></el-form-item>
						<el-form-item :label="`转发收入门槛${item.numberValue}`" :prop="'multiConfigs.' + index + '.rankNum'">
							<el-input type="number" v-model.number="item.rankNum">
								<template slot="append">
									元
								</template>
							</el-input>
						</el-form-item>
						<el-form-item :label="`门槛${item.numberValue}奖励金额`" :prop="'multiConfigs.' + index + '.awardAmt'">
							<el-input type="number" v-model.number="item.awardAmt">
								<template slot="append">
									元
								</template>
							</el-input>
						</el-form-item>
						<el-form-item :label="`达标天数奖励${item.numberValue}`" :prop="'multiConfigs.' + index + '.subNumberValue'">
							<el-input type="number" v-model.number="item.subNumberValue">
								<template slot="append">
									元
								</template>
							</el-input>
						</el-form-item>
					</el-form-item>
					<el-form-item>
						<el-button @click="add">新增</el-button>
						<el-button @click.prevent="remove">移除</el-button>
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
import { pickerOptionsMinxins, operateMinxins } from '../mixins/mixins.js';
export default {
	name: 'forward_income_award_addActivity',
	mixins: [pickerOptionsMinxins, operateMinxins],
	data() {
		const validateTimes = (rule, value, callback) => {
			let forwardAwardDays = this.activityForm.generalConfig.forwardAwardDays;
			this.activityForm.config.endTime = this.$moment(value)
				.add(forwardAwardDays, 'days')
				.format('YYYY-MM-DD HH:mm:ss');
			callback();
		};
		const validateDays = (rule, value, callback) => {
			let startTime = this.activityForm.config.startTime;
			if (startTime !== null) {
				this.activityForm.config.endTime = this.$moment(startTime)
					.add(value, 'days')
					.format('YYYY-MM-DD HH:mm:ss');
				callback();
			} else {
				this.$refs.activityForm.validateField('config.startTime');
			}
		};
		return {
			hasC: false,
			formLabelWidth: '150px',
			rules: {
				'config.title': [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				'config.startTime': [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
					{ required: true, validator: validateTimes, trigger: 'change' }
				],
				'config.status': [{ required: true, message: '请选择状态', trigger: 'change' }],
				'generalConfig.forwardAwardDays': [
					{ required: true, message: '请输入连续达标天数', trigger: 'blur' },
					{ required: true, validator: validateDays, trigger: 'blur' }
				],
				'generalConfig.forwardAwardExpTime': [{ required: true, message: '请输入过期领取时间', trigger: 'blur' }],
				'multiConfigs.0.rankNum': [{ required: true, message: '请输入转发收入门槛1', trigger: 'blur' }],
				'multiConfigs.0.awardAmt': [{ required: true, message: '请输入门槛1奖励金额', trigger: 'blur' }]
			},
			activityForm: {
				config: {
					num: null,
					title:'',
					startTime: null,
					endTime: null,
					status: '0',
					scheme: '',
					type: '6'
				},
				generalConfig: {
					forwardAwardDays: null,
					forwardAwardExpTime: null
				},
				multiConfigs: [
					{ numberValue: 1, rankNum: null, awardAmt: null, subNumberValue: null },
					{ numberValue: 2, rankNum: null, awardAmt: null, subNumberValue: null },
					{ numberValue: 3, rankNum: null, awardAmt: null, subNumberValue: null }
				]
			}
		};
	},
	methods: {
		add() {
			this.activityForm.multiConfigs.push({
				numberValue: this.activityForm.multiConfigs.length + 1,
				rankNum: null,
				awardProportion: null,
				awardAmt: null
			});
		},
		remove() {
			if (this.activityForm.multiConfigs.length <= 1) return;
			this.activityForm.multiConfigs.pop();
		},
		async saveActivity() {
			let postData = JSON.parse(JSON.stringify(this.activityForm));
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
