<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					常见问题分类管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="handleAdd">新增</el-button></div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="id" label="ID" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="edit(scope.row)">编辑</el-button>
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
		<!-- 编辑弹出框 -->
		<el-dialog title="新增/编辑" width="40%" :visible.sync="dialogFormVisible">
			<el-form :model="dataForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="dataForm">
				<el-form-item label="名称" prop="name"><el-input v-model="dataForm.name" autocomplete="off"></el-input></el-form-item>
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
			tableLoading: false,
			dialogFormVisible: false,
			dataList: [],
			formLabelWidth: '150px',
			dataForm: {
				id: '',
				name: ''
			},
			rules: {
				name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
			}
		};
	},
	created() {
		this.getData();
	},
	methods: {
		handleCurrentChange(val) {
			this.page = val;
			this.getData();
		},

		handleSizeChange(val) {
			this.page = 1;
			this.size = val;
			this.getData();
		},
		handleAdd() {
			if (this.dataForm.id) {
				this.dataForm = {
					id: '',
					name: ''
				};
			}
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate();
			});
		},
		edit(data) {
			this.dialogFormVisible = true;
			this.dataForm = Object.assign(this.dataForm, data);
			this.$nextTick(() => {
				this.$refs.dataForm.clearValidate();
			});
		},
		save() {
			let postData = this.dataForm;
			this.$axios.post(this.BASE_URL + 'admin/commonQuestion/saveCommonQuestionClassify', postData).then(res => {
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
				}
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.save();
				}
			});
		},

		async getData() {
			this.tableLoading = true;
			let { page, size } = this;
			let postData = {
				page,
				size
			};
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/commonQuestion/listPageCommonQuestionClassify', postData);
			if(code == '200'){
				this.dataList = data.list;
				this.tableLoading = false;
				this.cur_total = data.total;
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
.avatar {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
