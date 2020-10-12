<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					限时提价
				</el-breadcrumb-item>
				<el-breadcrumb-item>新增限时提价</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form :model="dataForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="dataForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="开始日期" prop="startDate">
								<el-date-picker
									v-model="dataForm.startDate"
									type="date"
									value-format="yyyy-MM-dd"
									placeholder="选择日期"
									@change="startDateChange"
								></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="结束日期" prop="endDate">
								<el-date-picker v-model="dataForm.endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="endDateChange"></el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<el-divider></el-divider>
					<el-form-item label-width="0px" v-for="(item, index) in dataForm.children" :key="index">
						<el-row>
							<el-col :span="12">
								<el-form-item
									label="开始时间"
									:prop="'children.' + index + '.startInterval'"
									:rules="[{ required: true, message: '开始时间不能为空', trigger: 'change' }]">
									<el-time-picker v-model="item.startInterval" value-format="hh:mm:ss" placeholder="开始时间"></el-time-picker>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item
									label="结束时间"
									:prop="'children.' + index + '.endInterval'"
									:rules="[{ required: true, message: '结束时间不能为空', trigger: 'change' }]">
									<el-time-picker v-model="item.endInterval" value-format="hh:mm:ss" placeholder="结束时间"></el-time-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="普通IP收入" :prop="'children.' + index + '.incomePricePerIP'">
									<el-input class="handle-input" v-model="item.incomePricePerIP" placeholder="普通IP收入"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="普通IP成本" :prop="'children.' + index + '.costPricePerIP'">
									<el-input class="handle-input" v-model="item.costPricePerIP" placeholder="普通IP成本"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="VIP IP收入" :prop="'children.' + index + '.vipIncomePricePerIP'">
									<el-input class="handle-input" v-model="item.vipIncomePricePerIP" placeholder="VIP IP收入"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="VIP IP成本" :prop="'children.' + index + '.vipCostPricePerIP'">
									<el-input class="handle-input" v-model="item.vipCostPricePerIP" placeholder="VIP IP成本"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item>
						<el-button @click.prevent="removeTime" type="warning">删除</el-button>
						<el-button @click.prevent="addTime" type="info">新增</el-button>
					</el-form-item>
					<el-form-item>
						<el-button @click="reset">取 消</el-button>
						<el-button type="primary" @click="submitForm('dataForm')">确 定</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'time_price_add',
	data() {
		return {
			formLabelWidth: '100px',
			dataForm: {
				startDate: null,
				endDate: null,
				children: [
					{
						startInterval: '',
						endInterval: '',
						incomePricePerIP: null,
						costPricePerIP: null,
						vipIncomePricePerIP: null,
						vipCostPricePerIP: null
					}
				]
			},
			rules: {
				startDate: [{ required: true, message: '开始日期不能为空', trigger: 'change' }],
				endDate: [{ required: true, message: '结束日期不能为空', trigger: 'change' }]
			}
		};
	},
	methods: {
		startDateChange() {
			if (this.dataForm.startDate > this.dataForm.endDate) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
				this.dataForm.startDate = this.dataForm.endDate;
			}
		},
		endDateChange() {
			if (this.dataForm.startDate > this.dataForm.endDate) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.dataForm.endDate = this.dataForm.startDate;
			}
		},
		addTime() {
			this.dataForm.children.push({
				startInterval: null,
				endInterval: null,
				incomePricePerIP: null,
				costPricePerIP: null,
				vipIncomePricePerIP: null,
				vipCostPricePerIP: null
			});
		},
		removeTime(item) {
			if (this.dataForm.children.length <= 1) return;
			this.dataForm.children.pop();
		},
			reset() {
			this.$confirm('确定清空吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$refs['dataForm'].resetFields();
			}).catch(() => {});
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确定添加吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.saveAward();
					}).catch(() => {});
				}
			});
		},
		saveAward() {
			let postData = this.dataForm;
			this.$axios
				.post(this.BASE_URL + `admin/timePrice/saveTimePrice?startDate=${this.dataForm.startDate}&endDate=${this.dataForm.endDate}`, this.dataForm.children)
				.then(res => {
					if (res.data.code === '200') {
						this.$message({
							message: '保存成功',
							type: 'success'
						});
						this.$refs['dataForm'].resetFields();
					} else {
						this.$message({
							message: '保存失败',
							type: 'error'
						});
					}
				});
		}
	}
};
</script>

<style scoped>
.handle-input {
	width: 220px;
}
</style>
