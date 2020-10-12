<template>
	<div>
		<el-activity-page
			breadcrumbName="签到活动"
			:tableData="tableData"
			:tableConfig="tableConfig"
			:tableLoading="tableLoading"
			:page="page"
			:total="cur_total"
			@add="addActivity('/sign_add', true)"
			@lookDetail="lookDetail"
			@edit="editActivity"
			@pageChange="handleCurrentChange"
			@sizeChange="handleSizeChange"
		></el-activity-page>
		<!-- 编辑弹出框 -->
		<el-dialog title="新增活动" :validate-on-rule-change="false" width="70%" @closed="dialogClose" :visible.sync="dialogFormVisible">
			<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
				<el-form-item label="期数" prop="config.num" :label-width="formLabelWidth">
					<el-input-number v-model="activityForm.config.num" disabled :min="0" controls-position="right"></el-input-number>
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
						:readonly="activityForm.config.status === '1' && activityForm.config.id !== ''"
					></el-date-picker>
				</el-form-item>
				<el-form-item prop="config.endTime" label="结束时间">
					<el-date-picker
						type="datetime"
						:picker-options="pickerOptions"
						@change="endDateChange"
						value-format="yyyy-MM-dd HH:mm:ss"
						placeholder="选择结束日期"
						v-model="activityForm.config.endTime"
						:readonly="activityForm.config.status === '1' && activityForm.config.id !== ''"
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
				<el-form-item label="规则" prop="scheme">
                    <tinymce id="tinymce" ref="content" :height="300" :childHasChange="hasC" v-model="activityForm.config.scheme" />
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm('activityForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { formatUnit } from '@/utils/index.js';
import { verifyDateMinxins, addActivityMinxins, editActivityMinxins, handlePageMinxins, pickerOptionsMinxins } from './mixins/mixins.js';
export default {
	// 组件名称
	name: 'sign_management',
	mixins: [verifyDateMinxins, addActivityMinxins, editActivityMinxins, handlePageMinxins, pickerOptionsMinxins],
	data() {
		return {
			sendOnce: true,
			hasC: false,
			page: 1,
			size: 10,
			cur_page: 1,
			cur_size: 1,
			cur_total: 0,
			periodsNum: null,
			tableLoading: true,
			tableData: [],
			tableConfig: [
				{ label: '期数', prop: 'num', sortable: true, width: '100' },
				{ label: '开始时间', prop: 'startTime', sortable: true },
				{ label: '结束时间', prop: 'endTime', sortable: true },
				{ label: '状态', prop: 'status', sortable: false, formatter: this.statusFormat }
			],
			dialogFormVisible: false,
			formLabelWidth: '200px',
			activityForm: {
				config: {
					id: '',
					num: null,
					title: '',
					startTime: '',
					endTime: '',
					status: null,
					scheme: ''
				},
				generalConfig: {
					signInForward: ''
				},
				multiConfigs: [{ numberValue: 1, awardAmt: '' }]
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
		lookDetail(row) {
			this.$router.push({
				path: '/sign_detail',
				query: {
					id: row.id,
					num: row.num
				}
			});
			
		},
		dialogClose() {
			this.dialogFormVisible = false;
		},
		add() {
			this.activityForm.multiConfigs.push({
				id: 0,
				awardAmt: '',
				numberValue: this.activityForm.multiConfigs.length + 1
			});
		},
		remove() {
			if (this.activityForm.multiConfigs.length <= 1) return;
			this.activityForm.multiConfigs.pop();
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确认以上信息无误？提交了不能更改', '提示', {
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
				type: 1,
				page: this.page,
				size: this.size
			};
			let {
				data: { code, data }
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
		elActivityPage: () => import('./components/elActivityPage.vue')
	}
};
</script>
