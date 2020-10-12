<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					限时提价
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="add">新增</el-button></div>
			<el-table v-loading="tableLoading" :span-method="objectSpanMethod" :data="dataList" border row-key="id" class="table">
				<el-table-column prop="startDate" label="日期" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.startDate }}</span>
						-
						<span>{{ scope.row.endDate }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="时段">
					<template slot-scope="scope">
						<span>{{ scope.row.startInterval }}</span>
						-
						<span>{{ scope.row.endInterval }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="普通会员 IP收入/IP成本">
					<template slot-scope="scope">
						<span>{{ scope.row.incomePricePerIP }}</span>
						/
						<span>{{ scope.row.costPricePerIP }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="VIP IP收入/IP成本">
					<template slot-scope="scope">
						<span>{{ scope.row.vipIncomePricePerIP }}</span>
						/
						<span>{{ scope.row.vipCostPricePerIP }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="findTime(scope.row.startDate)">编辑</el-button>
						<el-button type="primary" @click="confirmDelete(scope.row.startDate)">删除</el-button>
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
					:current-page.sync="currentPage"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="新增/编辑" width="60%" :visible.sync="dialogFormVisible">
			<el-form :model="dataForm" :inline="true" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="dataForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="开始日期" prop="startDate" :label-width="formLabelWidth">
							<el-date-picker v-model="dataForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="startDateChange"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="结束日期" prop="endDate" :label-width="formLabelWidth">
							<el-date-picker v-model="dataForm.endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="endDateChange"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<div style="border-top:1px solid #ccc;padding-top:15px;" v-for="(item, index) in dataForm.children" :key="index">
					<el-row>
						<el-col :span="12">
							<el-form-item label="开始时间" :key="index" :rules="[{ required: true, message: '', trigger: 'blur' }]">
								<el-time-picker v-model="item.startInterval" value-format="hh:mm:ss" placeholder="开始时间"></el-time-picker>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="结束时间" :key="index" :rules="[{ required: true, message: '', trigger: 'blur' }]">
								<el-time-picker v-model="item.endInterval" value-format="hh:mm:ss" placeholder="结束时间"></el-time-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="普通IP收入" :key="index"><el-input v-model="item.incomePricePerIP" placeholder="普通IP收入"></el-input></el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="普通IP成本" :key="index"><el-input v-model="item.costPricePerIP" placeholder="普通IP成本"></el-input></el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="VIP IP收入" :key="index"><el-input v-model="item.vipIncomePricePerIP" placeholder="VIP IP收入"></el-input></el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="VIP IP成本" :key="index"><el-input v-model="item.vipCostPricePerIP" placeholder="VIP IP成本"></el-input></el-form-item>
						</el-col>
					</el-row>
				</div>
				<el-form-item>
					<el-button @click.prevent="removeTime" type="warning">删除</el-button>
					<el-button @click.prevent="addTime" type="info">新增</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm('dataForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'elite_club',
	data() {
		return {
			page: 1,
			size: 10,
			cur_total: 0,
			currentPage: 1,
			tableLoading: false,
			dialogFormVisible: false,
			dataList: [],
			rule: '',
			formLabelWidth: '90px',
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
	created() {
		this.getData();
	},
	methods: {
		startDateChange() {
			if (this.dataForm.startDate > this.dataForm.endDate) {
				this.$message({
					message: '开始日期不得大于结束日期',
					type: 'warning'
				});
				this.dataForm.startDate = this.$moment(this.dataForm.endDate).subtract(1, 'days').format('YYYY-MM-DD');
			}
		},
		endDateChange() {
			if (this.dataForm.startDate > this.dataForm.endDate) {
				this.$message({
					message: '结束日期不得小于开始日期',
					type: 'warning'
				});
				this.dataForm.endDate = this.$moment(this.dataForm.startDate).add(1, 'days').format('YYYY-MM-DD')
			}
		},
		handleCurrentChange(val) {
			this.page = val;
			this.currentPage = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.page = 1;
			this.currentPage = 1;
			this.size = val;
			this.getData();
		},

		async findTime(time) {
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + `admin/timePrice/findTimePriceByDate?startDate=${time}`);
			this.dataForm = Object.assign(data);
			this.dialogFormVisible = true;
		},

		add() {
			this.$router.push('/time_price_add');
		},
		editActivity(data) {
			this.findTime();
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
						this.getData();
						this.$refs['dataForm'].resetFields();
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
					this.saveAward();
				}
			});
		},

		confirmDelete(time) {
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.deleteTime(time);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
		},

		async deleteTime(time) {
			let {
				data: { code }
			} = await this.$axios.post(this.BASE_URL + `admin/timePrice/deleteTimePrice?startDate=${time}`);
			if (+code === 200) {
				this.$message.success({
					message: '删除成功'
				});
				this.getData();
			}
		},
		async getData() {
			let { page, size } = this;
			this.tableLoading = true;
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + `admin/timePrice/listTimePrice?page=${page}&size=${size}`);
			this.dataList = this.operateList(data.list);
			this.tableLoading = false;
			this.cur_total = data.total;
		},
		operateList(list) {
			if (!Array.isArray(list)) return;
			let arr = [];
			if (!Array.isArray(list)) return;
			for (let i = 0; i < list.length; i++) {
				for (let j = 0; j < list[i].children.length; j++) {
					arr.push({
						num: j === 0 ? list[i].children.length : null,
						startDate: list[i].startDate,
						endDate: list[i].endDate,
						startInterval: list[i].children[j].startInterval,
						endInterval: list[i].children[j].endInterval,
						incomePricePerIP: list[i].children[j].incomePricePerIP,
						costPricePerIP: list[i].children[j].costPricePerIP,
						vipCostPricePerIP: list[i].children[j].vipCostPricePerIP,
						vipIncomePricePerIP: list[i].children[j].vipIncomePricePerIP
					});
				}
			}
			return arr;
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
			// var index = this.dataForm.children.indexOf(item);
			// if (index !== -1) {
			//   this.dataForm.children.splice(index, 1);
			// }
			if (this.dataForm.children.length <= 1) return;
			this.dataForm.children.pop();
		},

		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
				if (row.num && rowIndex % row.num === 0) {
					return {
						rowspan: row.num,
						colspan: 1
					};
				} else {
					return {
						rowspan: 0,
						colspan: 0
					};
				}
			}
		}
	}
};
</script>
<style scoped>
.handle-box {
	padding-bottom: 15px;
}
.handle-input {
	width: 230px;
	display: inline-block;
}
.mr10 {
	margin-right: 10px;
}
.el-input {
	width: 200px;
}
.form--wrap .line {
	text-align: center;
}
</style>
