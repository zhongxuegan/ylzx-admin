<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					svip管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="addActivity">新增</el-button></div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="userId" label="ID" align="center" width="60"></el-table-column>
				<el-table-column prop="vipName" align="center" label="名称"></el-table-column>
				<el-table-column prop="userName" align="center" label="姓名"></el-table-column>
				<el-table-column prop="mobile" align="center" label="手机号"></el-table-column>
				<el-table-column prop="alipay" align="center" label="支付宝"></el-table-column>
				<el-table-column prop="downloadLink" align="center" label="下载链接"></el-table-column>
				<el-table-column prop="divideRate" :formatter="addPercent" align="center" label="分成比例"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="editActivity(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="reportLink" align="center" label="报表链接">
					<template slot-scope="scope">
						<a :href="scope.row.reportLink" target="_blank">{{ scope.row.reportLink }}</a>
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
		<el-dialog title="新增/编辑" width="40%" :visible.sync="dialogFormVisible">
			<el-form :model="dataForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="dataForm">
				<el-form-item label="ID" prop="userId" :label-width="formLabelWidth">
					<el-input v-model.number="dataForm.userId" type="number" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="vipName"><el-input v-model="dataForm.vipName" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="姓名" prop="userName"><el-input v-model="dataForm.userName" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="手机号" prop="mobile"><el-input v-model="dataForm.mobile" type="tel" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="支付宝" prop="alipay"><el-input v-model="dataForm.alipay" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="分成比例" prop="divideRate"><el-input v-model="dataForm.divideRate" type="number" autocomplete="off"></el-input></el-form-item>
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
			pageNum: 1,
			pageSize: 10,
			cur_total: 0,
			currentPage: 1,
			tableLoading: false,
			dialogFormVisible: false,
			dataList: [],
			rule: '',
			formLabelWidth: '150px',
			dataForm: {
				id: '',
				userId: null,
				vipName: '',
				alipay: '',
				mobile: '',
				userName: '',
				divideRate: ''
			},
			rules: {
				userId: [{ required: true, message: 'ID不能为空', trigger: 'blur' }],
				vipName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
				alipay: [{ required: true, message: '支付宝不能为空', trigger: 'blur' }],
				mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
				userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
				divideRate: [{ required: true, message: '分成比例不能为空', trigger: 'blur' }]
			}
		};
	},
	created() {
		this.getData();
	},
	methods: {
		handleCurrentChange(val) {
			this.pageNum = val;
			this.currentPage = val;
			this.getData();
		},

		handleSizeChange(val) {
			this.pageNum = 1;
			this.currentPage = 1;
			this.pageSize = val;
			this.getData();
		},

		addPercent(row, column, cellValue, index) {
			return cellValue * 100 + '%';
		},

		addActivity() {
			if (this.dataForm.id) {
				this.dataForm = {
					id: '',
					userId: null,
					vipName: '',
					userName: '',
					mobile: '',
					alipay: '',
					divideRate: ''
				};
			}
			this.dialogFormVisible = true;
		},
		editActivity(data) {
			this.$nextTick(()=>{
				this.$refs.dataForm.clearValidate();
			})
			this.dialogFormVisible = true;
			this.dataForm = Object.assign(this.dataForm, data);
		},
		saveAward() {
			let postData = this.dataForm;
			this.$axios.post(this.BASE_URL + 'admin/user/saveSvip', postData).then(res => {
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
		lessOne() {
			return Number(this.dataForm.divideRate) <= 1 ? true : false;
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.lessOne()) {
						this.saveAward();
					} else {
						this.$message({
							message: '分成比例不能大于1',
							type: 'error'
						});
					}
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
		async getData() {
			let { pageNum, pageSize } = this;
			let postData = {
				pageNum,
				pageSize
			};
			this.tableLoading = true;
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/user/listSVipUserByCon', postData);
			this.dataList = data.list;
			this.tableLoading = false;
			this.cur_total = data.total;
		}
	}
};
</script>
<style scoped>
.handle-box {
	padding-bottom: 15px;
}
.handle-input {
	width: 200px;
	display: inline-block;
}
.mr10 {
	margin-right: 10px;
}
.el-input {
	width: 70%;
}
.form--wrap .line {
	text-align: center;
}
</style>
