<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					收徒精英会管理
				</el-breadcrumb-item>
				<el-breadcrumb-item>
					新增活动
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
					<el-form-item label="期数" prop="periodsNum" :label-width="formLabelWidth">
						<el-input v-model="activityForm.periodsNum" readonly="" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item prop="startTime" label="活动开始时间">
						<el-date-picker
							type="datetime"
							:picker-options="pickerOptions"
							:readonly="activityForm.status === '1' && activityForm.id !== ''"
							value-format="yyyy-MM-dd"
							placeholder="选择开始日期"
							v-model="activityForm.startTime"
						></el-date-picker>
					</el-form-item>
					<el-form-item prop="endTime" label="活动结束时间">
						<el-date-picker
							type="datetime"
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
						<div class="edit_container">
							<tinymce ref="content" :height="300" :childHasChange="hasC" v-model="activityForm.rule" />
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="reset">取 消</el-button>
						<el-button type="primary" @click="submitForm('activityForm')">确 定</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>	
</template>

<script>
export default {
	name:'elite_club_management_add',
	data(){
		return{
			hasC: false, // 富文本在编辑切换的时候不会改变，利用这个变量来控制他的改变
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
		}
	},
	methods:{
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
		reset(){
			this.$confirm('确定清空吗', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$refs['activityForm'].resetFields();
				this.$refs.content.setContent('');
			}).catch(() => {});
		},
		formatDate(string, format = 'YYYY-MM-DD HH:mm:ss') {
			return this.$moment(string).format(format);
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确定保存吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.saveAward();
					}).catch(() => {});
				} else {
					return false;
				}
			});
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
					this.$refs['activityForm'].resetFields();content
					this.$refs['content'].setContent('');
				} else {
					this.$message({
						message: '保存失败',
						type: 'error'
					});
				}
			});
		},
	},
	created() {
		this.activityForm.periodsNum=this.$route.query.num;
	}
}
</script>
