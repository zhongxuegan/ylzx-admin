<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					限时高价设置
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="addActivity('/setTimeHightPrice_add')">新增活动</el-button></div>
			<el-table v-loading="tableLoading" :span-method="objectSpanMethod" :data="tableData" border class="table">
				<el-table-column label="日期" align="center">
					<template slot-scope="scope">
						{{ scope.row.startDate }}
						<span>&nbsp;-&nbsp;</span>
						{{ scope.row.endDate }}
					</template>
				</el-table-column>
				<el-table-column label="时间段" align="center">
					<template slot-scope="scope">
						{{ scope.row.startTime }}
						<span>&nbsp;~&nbsp;</span>
						{{ scope.row.endTime }}
					</template>
				</el-table-column>
				<el-table-column prop="limitHighAdUnit" align="center" label="限时高价/元" sortable></el-table-column>
				<!-- <el-table-column prop="turn_gain_rato" align="center" label="转赚比" sortable></el-table-column> -->
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="editActivity(scope.row, scope.$index)">编辑</el-button>
						<el-button type="primary" @click="del(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:current-page.sync="page"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑框 -->
		<el-dialog title="新增活动" :validate-on-rule-change="false" width="60%" @closed="dialogClose" :visible.sync="dialogFormVisible">
			<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="开始日期" prop="config.startTime">
							<el-date-picker
								type="datetime"
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
						<el-form-item label="转赚比" :prop="'detail.'+index+'.turn_gain_ratio'">
							<el-input class="input"></el-input>
						</el-form-item>
					</el-col> -->
				</el-row>
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
import { verifyDateMinxins, addActivityMinxins, handlePageMinxins } from './mixins/mixins.js';
export default {
	name: 'setTimeHeightPrice',
	mixins: [verifyDateMinxins, addActivityMinxins, handlePageMinxins],
	data() {
		return {
			tableLoading: true,
			tableData: [],
			page: 1,
			size: 10,
			cur_total: 0,
			dialogFormVisible: false,
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
		async editActivity(row) {
			let {
				data: { code, data }
			} = await this.$axios.get(this.BASE_URL + `admin/activity/config/detail?id=${row.id}`);
			if (code == '200') {
				this.activityForm = Object.assign({}, formatUnit(data, true));
			}
			this.dialogFormVisible = true;
		},
		dialogClose() {
			this.dialogFormVisible = false;
		},
		del(row) {
			this.$confirm('确认删除吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$axios.post(this.BASE_URL + `admin/activity/config/delete?id=${row.id}`).then(res => {
						if (res.data.code == '200') {
							this.getData();
							this.$message.success(res.data.message);
							this.dialogClose();
						}
					});
				})
				.catch(() => {});
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0 || columnIndex === 2 || columnIndex === 3) {
				if (row.rowNum && row.rowNum !== null) {
					return [row.rowNum, 1];
				} else return [0, 0];
			}
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
							this.saveActivity();
						})
						.catch(() => {});
				} else {
					return false;
				}
			});
		},
		async saveActivity() {
			let postData = JSON.parse(JSON.stringify(this.activityForm));
			let id = postData.config.id;
			postData = formatUnit(postData);
			let {
				data: { code, message }
			} = await this.$axios.post(this.BASE_URL + `admin/activity/config/update?id=${id}`, postData);
			if (code == '200') {
				this.$message.success(message);
				this.getData();
				this.dialogClose();
			}
		},
		getDetail(id) {
			return new Promise((resolve, reject) => {
				this.$axios
					.get(this.BASE_URL + `admin/activity/config/detail?id=${id}`)
					.then(res => {
						resolve(res);
					})
					.catch(error => {
						reject(error);
					});
			});
		},
		dataFormat(dataList, detailList) {
			let newList = [];
			dataList.forEach(item => {
				detailList.forEach(item2 => {
					let value = item2.data.data;
					if (value.config.id === item.id) {
						value.multiConfigs.forEach((item3, index) => {
							newList.push({
								id: item.id,
								startDate: item.startTime,
								endDate: item.endTime,
								type: item.type,
								limitHighAdUnit: value.generalConfig.limitHighAdUnit / 100,
								startTime: item3.startTime,
								endTime: item3.endTime,
								rowNum: index === 0 ? value.multiConfigs.length : null
							});
						});
					}
				});
			});
			return newList;
		},
		async getData() {
			let params = {
				page: this.page,
				size: this.size,
				type: '0'
			};
			let {
				data: { code, data }
			} = await this.$axios.get(this.BASE_URL + 'admin/activity/config', { params });
			if (code == '200') {
				if (data.list.length > 0) {
					// 获取所有id
					let ids = data.list.map(item => item.id);
					let pList = ids.map(item => this.getDetail(item));
					Promise.all(pList)
						.then(res => {
							data.list = this.dataFormat(data.list, res);
							this.tableData = data.list;
							this.cur_total = Number(data.totalCount);
						})
						.catch(console.error);
				}else{
					this.tableData = data.list;
				}
				this.tableLoading = false;
			}
		}
	},
	created() {
		this.getData();
	},
	activated() {
		this.getData();
	}
};
</script>

<style scoped>
.input {
	width: 220px;
}
</style>
