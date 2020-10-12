<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					收徒精英会管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="addActivity">新增活动</el-button></div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="periodsNum" label="期数" align="center" width="60"></el-table-column>
				<el-table-column prop="startTime" align="center" label="开始时间"></el-table-column>
				<el-table-column prop="endTime" align="center" label="结束时间"></el-table-column>
				<el-table-column prop="statusText" align="center" label="状态"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="editActivity(scope.row)">编辑</el-button>
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
					:current-page.sync="cur_page"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑活动" :validate-on-rule-change="false" width="70%" @closed="dialogClose" :visible.sync="dialogFormVisible">
			<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
				<el-form-item label="期数" prop="periodsNum" :label-width="formLabelWidth">
					<el-input v-model="activityForm.periodsNum" readonly="" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item prop="startTime" label="活动开始时间">
					<el-date-picker
						type="date"
						:picker-options="pickerOptions"
						:readonly="activityForm.status === '1' && activityForm.id !== ''"
						value-format="yyyy-MM-dd"
						placeholder="选择开始日期"
						v-model="activityForm.startTime"
					></el-date-picker>
				</el-form-item>
				<el-form-item prop="endTime" label="活动结束时间">
					<el-date-picker
						type="date"
						:picker-options="pickerOptions"
						:readonly="activityForm.status === '1' && activityForm.id !== ''"
						@change="endCountDateChange"
						value-format="yyyy-MM-dd"
						placeholder="选择结束日期"
						v-model="activityForm.endTime"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="活动状态" prop="status">
					<el-switch v-model="activityForm.status" active-color="#13ce66" inactive-color="#dddddd" active-value="1" inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="参与奖最低收徒人数" prop="minDiscipleCount">
					<el-input
						v-model="activityForm.minDiscipleCount"
						:readonly="activityForm.status === '1' && activityForm.id !== ''"
						type="number"
						min="1"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="参与奖奖励金额" type="number" prop="minRewardAmount" min="0">
					<el-input v-model="activityForm.minRewardAmount" :readonly="activityForm.status === '1' && activityForm.id !== ''" type="number" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item
					v-for="(rankingAward, index) in activityForm.rankingAwardList"
					:label="`第${index + 1}名`"
					:key="rankingAward.rankingNum"
					min="0"
					:prop="'rankingAwardList.' + index + '.awardAMount'"
					:rules="{required: true,message: '奖励金额不能为空',trigger: 'blur'}">
					<el-input v-model="rankingAward.awardAMount" :readonly="activityForm.status === '1' && activityForm.id !== ''" min="0" type="number"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="addRankAward">新增</el-button>
					<el-button @click.prevent="removeRankAward">移除</el-button>
				</el-form-item>
				<el-form-item label="规则" prop="rule">
					<div class="edit_container"><tinymce :height="300" :childHasChange="hasC" readonly v-model="activityForm.rule" /></div>
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
export default {
	name: 'elite_club',
	data() {
		return {
			hasC: false, // 富文本在编辑切换的时候不会改变，利用这个变量来控制他的改变
			pageNum: 1,
			pageSize: 10,
			cur_page: 1,
			cur_size: 1,
			cur_total: 0,
			periodsNum: null,
			tableLoading: false,
			dialogFormVisible: false,
			periodsNumTotal: 1,
			dataList: [],
			status: true,
			rule: '',
			formLabelWidth: '150px',
			activityForm: {
				periodsNum: '',
				startTime: '',
				endTime: '',
				rule: '',
				id: '',
				status: '1',
				minDiscipleCount: null,
				minRewardAmount: null,
				rankingAwardList: [
					{ awardAMount: null, rankingNum: 1 },
					{ awardAMount: null, rankingNum: 2 },
					{ awardAMount: null, rankingNum: 3 },
					{ awardAMount: null, rankingNum: 4 },
					{ awardAMount: null, rankingNum: 5 }
				]
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
				}
			},
			rules: {
				startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
				endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
				minRewardAmount: [{ required: true, message: '请输入参与奖奖励金额', trigger: 'blur' }],
				minDiscipleCount: [{ required: true, message: '请输入参与奖最低收徒人数', trigger: 'blur' }]
			}
		};
	},
	created() {
		this.getData();
	},
	methods: {
		startCountDateChange() {
			if (this.activityForm.startTime > this.activityForm.endTime) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
			}
		},
		endCountDateChange() {
			if (this.activityForm.startTime > this.activityForm.endTime) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
			}
		},
		handleCurrentChange(val) {
			this.pageNum = val;
			this.cur_page = val;
			this.getData();
		},

		handleSizeChange(val) {
			this.pageNum = 1;
			this.cur_page = 1;
			this.pageSize = val;
			this.getData();
		},

		dialogClose() {
			this.hasC = true;
			// this.$refs['activityForm'].resetFields();
		},

		addActivity() {
			let newNum;
			if (this.dataList.length > 0) {
				let numList = this.dataList.map(item => item.periodsNum);
				newNum = Math.max.apply(null, numList) + 1;
			} else {
				newNum = 1;
			}
			this.$router.push('/elite_club_management_add?num=' + newNum);
		},
		editActivity(data) {
			this.dialogFormVisible = true;
			let temp = data;
			if (temp.rankingAwardList) {
				temp.rankingAwardList = data.rankingAwardList;
			} else {
				temp.rankingAwardList = this.activityForm.rankingAwardList;
			}

			this.activityForm = Object.assign(this.activityForm, temp);
			this.activityForm.status = this.activityForm.status.toString();
			this.hasC = false;
		},
		changeStatus() {
			this.cur_page = 1;
			this.pageNum = 1;
			this.getData();
		},

		removeRankAward(item) {
			var index = this.activityForm.rankingAwardList.pop();
		},
		addRankAward() {
			let length = this.activityForm.rankingAwardList ? this.activityForm.rankingAwardList.length : 0;
			this.activityForm.rankingAwardList = this.activityForm.rankingAwardList ? this.activityForm.rankingAwardList : [];
			this.activityForm.rankingAwardList.push({
				awardAMount: null,
				rankingNum: length + 1
			});
		},

		formatDate(string, format = 'YYYY-MM-DD HH:mm:ss') {
			return this.$moment(string).format(format);
		},

		saveAward() {
			let postData = this.activityForm;
			postData.startTime = this.formatDate(postData.startTime);
			postData.endTime = this.formatDate(postData.endTime);
			this.$axios.post(this.BASE_URL + 'admin/activity/saveActivity', postData).then(res => {
				if (res.data.code === '200') {
					this.$message({
						message: '保存成功',
						type: 'success'
					});
					this.getData();
					this.$refs['activityForm'].resetFields();
					setTimeout(() => {
						this.dialogFormVisible = false;
					}, 1000);
				} else {
					this.$message({
						message: '保存失败',
						type: 'error'
					});
				}
			});
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
							this.saveAward();
						})
						.catch(() => {});
				} else {
					return false;
				}
			});
		},

		confirmEdit(row) {
			const { userId, status, mobile, nickname, name, wechat, alipay } = row;
			this.$axios
				.post(this.BASE_URL + 'admin/activity/findActivityByPage', {
					userId,
					status,
					mobile,
					nickname,
					name,
					wechat,
					alipay
				})
				.then(res => {
					this.$message({
						message: '更新用户信息成功',
						type: 'success'
					});
					this.getData();
				});
		},
		operateList(list) {
			if (!Array.isArray(list)) return;
			list.map(item => {
				item.startTime = this.formatDate(item.startTime, 'YYYY-MM-DD');
				item.endTime = this.formatDate(item.endTime, 'YYYY-MM-DD');
				item.createTime = this.formatDate(item.createTime);
				item.updateTime = this.formatDate(item.updateTime);
				item.statusText = item.status ? '开启' : '关闭';
			});
			return list;
		},
		async getData() {
			let { pageNum, periodsNum, pageSize } = this;
			this.tableLoading = true;

			this.$axios
				.post(this.BASE_URL + 'admin/activity/findActivityByPage', {
					page: pageNum,
					size: pageSize,
					periodsNum
				})
				.then(res => {
					this.tableLoading = false;
					this.dataList = this.operateList(res.data.data.list);
					this.cur_total = res.data.data.total;
					this.periodsNumTotal = res.data.data.total + 1;
				});
		}
	}
};
</script>
<style scoped>
.handle-box {
	padding-bottom: 10px;
}
.handle-input {
	width: 150px;
	display: inline-block;
}
.mr10 {
	margin-right: 10px;
}
.el-input {
	width: 70%;
}
.form--wrap {
}
.form--wrap .line {
	text-align: center;
}
</style>
