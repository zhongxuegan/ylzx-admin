<template>
	<div>
		<el-activity-page
			breadcrumbName="转发瓜分收入千元大奖"
			:tableData="tableData"
			:tableConfig="tableConfig"
			:tableLoading="tableLoading"
			:page="page"
			:total="cur_total"
			@add="addActivity('/forward_thousand_award_add',true)"
			@lookDetail="lookDetail"
			@edit="editActivity"
			@pageChange="handleCurrentChange"
			@sizeChange="handleSizeChange"
		></el-activity-page>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑活动" :validate-on-rule-change="false" width="70%" @closed="dialogClose" :visible.sync="dialogFormVisible">
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
						:readonly="activityForm.config.status === '1' && activityForm.config.id !== ''"
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
						:readonly="activityForm.config.status === '1' && activityForm.config.id !== ''"
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
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogClose">取 消</el-button>
				<el-button type="primary" @click="submitForm('activityForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { formatUnit } from '../../utils/index.js';
import { verifyDateMinxins, addActivityMinxins, editActivityMinxins, handlePageMinxins, pickerOptionsMinxins } from './mixins/mixins.js';
export default {
	name: 'forward_thousand_award',
	mixins: [verifyDateMinxins, addActivityMinxins, editActivityMinxins, handlePageMinxins, pickerOptionsMinxins],
	data() {
		return {
			hasC: false,
			tableLoading: true,
			tableData: [],
			tableConfig: [
				{ label: '期数', prop: 'num', sortable: true, width: '100' },
				{ label: '开始时间', prop: 'startTime', sortable: true },
				{ label: '结束时间', prop: 'endTime', sortable: true },
				{ label: '状态', prop: 'status', sortable: false, formatter: this.statusFormat }
			],
			cur_total: 0,
			page: 1,
			size: 10,
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
					divideUpAmt: null,
					divideUpLeastPeoples: null,
					divideUpForward: null
				}
			},
			dialogFormVisible: false,
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
		lookDetail(row) {
			// 产看详情
			this.$router.push('/forward_thousand_award_detail?id=' + row.id);
		},
		dialogClose() {
			this.dialogFormVisible = false;
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确定修改吗', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
						.then(() => {
							this.saveEdit();
						})
						.catch(() => {});
				} else {
					return false;
				}
			});
		},
		async saveEdit() {
			let postData = JSON.parse(JSON.stringify(this.activityForm));
			if (postData.config.endTime == '' || postData.config.endTime == null) postData.config.endTime = '2038-01-19 03:14:07';
			let id = postData.config.id;
			// 元 转 分
			postData = formatUnit(postData);
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + `admin/activity/config/update?id=${id}`, postData);
			if (code == '200') {
				this.$message.success(message);
				this.dialogFormVisible = false;
				this.getData();
			}
		},
		statusFormat(row, column, cellValue, index) {
			return cellValue === '0' ? '下架' : '上架';
		},
		async getData() {
			let params = {
				type: 5,
				page: this.page,
				size: this.size
			};
			let {
				data: { code, data, message }
			} = await this.$axios.get(this.BASE_URL + 'admin/activity/config', { params });
			if (code == '200') {
				this.tableData = data.list;
				this.cur_total = parseInt(data.totalCount);
				this.tableLoading = false;
			}
		}
	},
	created() {
		this.getData();
	},
	activated() {
		this.getData();
	},
	components: {
		elActivityPage: () => import('./components/elActivityPage')
	}
};
</script>
