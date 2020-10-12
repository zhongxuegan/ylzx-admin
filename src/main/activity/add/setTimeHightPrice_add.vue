<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					限时高价设置
				</el-breadcrumb-item>
				<el-breadcrumb-item>新增活动</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="开始日期" prop="config.startTime">
								<el-date-picker
									type="datetime"
									:picker-options="pickerOptions"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择开始日期"
									@change="startDateChange"
									v-model="activityForm.config.startTime"
								></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="结束日期" prop="config.endTime">
								<el-date-picker
									type="datetime"
									:picker-options="pickerOptions"
									@change="endDateChange"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择结束日期"
									v-model="activityForm.config.endTime"
								></el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<el-divider></el-divider>
					<el-form-item label-width="0" v-for="(item, index) in activityForm.multiConfigs" :key="index">
						<el-row>
							<el-col :span="12">
								<el-form-item
									label="开始时间"
									:prop="'multiConfigs.' + index + '.startTime'"
									:rules="[{ required: true, message: '开始时间不能为空', trigger: 'change' }]"
								>
									<el-time-picker v-model="item.startTime" value-format="HH:mm:ss" placeholder="开始时间"></el-time-picker>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item
									label="结束时间"
									:prop="'multiConfigs.' + index + '.endTime'"
									:rules="[{ required: true, message: '结束时间不能为空', trigger: 'change' }]"
								>
									<el-time-picker v-model="item.endTime" value-format="HH:mm:ss" placeholder="结束时间"></el-time-picker>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item>
						<el-button type="warning" @click="remove">删 除</el-button>
						<el-button type="info" @click="add">增 加</el-button>
					</el-form-item>
					<el-row>
						<el-col :span="12">
							<el-form-item label="限时高价" prop="generalConfig.limitHighAdUnit">
								<el-input class="input" type="number" v-model="activityForm.generalConfig.limitHighAdUnit">
									<template slot="append">
										元
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<!-- <el-col :span="12">
							<el-form-item label="转赚比" :prop="'detail.'+index+'.turn_gain_rato'">
								<el-input class="input"></el-input>
							</el-form-item>
						</el-col> -->
					</el-row>
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
	name: 'setTimeHightPrice_addActivity',
	mixins: [verifyDateMinxins, pickerOptionsMinxins, operateMinxins],
	data() {
		return {
			formLabelWidth: '100px',
			activityForm: {
				config: {
					startTime: null,
					endTime: null,
					type: '0'
				},
				generalConfig: {
					limitHighAdUnit: null
				},
				multiConfigs: [{ startTime: null, endTime: null }]
			},
			rules: {
				'config.startTime': [{ required: true, message: '开始日期不能为空', trigger: 'change' }],
				'config.endTime': [{ required: true, message: '结束日期不能为空', trigger: 'change' }],
				'generalConfig.limitHighAdUnit': [{ required: true, message: '请输入限时高价', trigger: 'blur' }]
			}
		};
	},
	methods: {
		remove() {
			if (this.activityForm.multiConfigs.length <= 1) return;
			this.activityForm.multiConfigs.pop();
		},
		add() {
			this.activityForm.multiConfigs.push({
				startTime: null,
				endTime: null
			});
		},
		async saveActivity() {
			let postData = JSON.parse(JSON.stringify(this.activityForm));
			postData = formatUnit(postData);
			let {
				data: { code, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/activity/config', postData);
			if (code == '200') {
				this.$refs.activityForm.resetFields();
				this.$message.success(message);
			}
		}
	}
};
</script>

<style scoped>
.input {
	width: 220px;
}
</style>
