<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					签到活动
				</el-breadcrumb-item>
				<el-breadcrumb-item>新建活动</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
					<el-form-item label="期数" prop="config.num" :label-width="formLabelWidth">
						<el-input-number v-model="activityForm.config.num" :min="0" controls-position="right"></el-input-number>
					</el-form-item>
					<el-form-item label="活动名称" prop="config.title"><el-input v-model="activityForm.config.title" autocomplete="off"></el-input></el-form-item>
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
					<el-form-item label="活动状态" prop="config.status">
						<el-switch v-model="activityForm.config.status" active-color="#13ce66" inactive-color="#dddddd" active-value="1" inactive-value="0"></el-switch>
					</el-form-item>
					<el-form-item label="转发收益门槛" prop="generalConfig.signInForward">
						<el-input type="number" v-model="activityForm.generalConfig.signInForward" autocomplete="off">
							<template slot="append">
								元
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="奖励设置"></el-form-item>
					<el-form-item
						v-for="(item, index) in activityForm.multiConfigs"
						:label="`第${item.numberValue}天签到奖励金额`"
						:key="item.id"
						:prop="'multiConfigs.' + index + '.awardAmt'"
						:rules="{ required: true, message: '奖励金额不能为空', trigger: 'blur' }"
					>
						<el-input type="number" v-model="item.awardAmt">
							<template slot="append">
								元
							</template>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="add">新增</el-button>
						<el-button @click.prevent="remove">移除</el-button>
					</el-form-item>
					<el-form-item label="规则" prop="scheme"><tinymce ref="content" :height="300" :childHasChange="hasC" v-model="activityForm.config.scheme" /></el-form-item>
					<el-form-item>
						<el-button @click="reset('activityForm')">取消</el-button>
						<el-button type="primary" @click="submitForm('activityForm')">保存</el-button>
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
	name: 'sign_management_addActivity',
	mixins: [verifyDateMinxins, pickerOptionsMinxins, operateMinxins],
	data() {
		return {
			hasC: false,
			formLabelWidth: '150px',
			activityForm: {
				config: {
					id: '',
					num: null,
					title: '',
					startTime: null,
					endTime: null,
					status: null,
					scheme: '',
					type: '1'
				},
				generalConfig: {
					signInForward: ''
				},
				multiConfigs: [
					{ numberValue: 1, awardAmt: '' },
					{ numberValue: 2, awardAmt: '' },
					{ numberValue: 3, awardAmt: '' },
					{ numberValue: 4, awardAmt: '' },
					{ numberValue: 5, awardAmt: '' },
					{ numberValue: 6, awardAmt: '' },
					{ numberValue: 7, awardAmt: '' }
				]
			},
			rules: {
				'config.title': [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				'config.startTime': [{ required: true, message: '请选择开始时间', trigger: 'change' }],
				'config.status': [{ required: true, message: '请选择状态', trigger: 'change' }],
				'generalConfig.signInForward': [{ required: true, message: '请输入转发收益门槛', trigger: 'blur' }]
			}
		};
	},
	methods: {
		add() {
			this.activityForm.multiConfigs.push({
				id: 0,
				numberValue: this.activityForm.multiConfigs.length + 1,
				awardAmt: null
			});
		},
		remove() {
			if (this.activityForm.multiConfigs.length <= 1) return;
			this.activityForm.multiConfigs.pop();
		},
		async saveActivity() {
			let postData = JSON.parse(JSON.stringify(this.activityForm)); //深拷贝,防止添加失败修改页面数据
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
