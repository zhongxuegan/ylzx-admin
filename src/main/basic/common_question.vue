<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					常见问题管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="handleAdd">新增</el-button></div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table">
				<el-table-column prop="id" label="编号" align="center" width="100" sortable></el-table-column>
				<el-table-column prop="classifyId" label="问题类别" :formatter="formatClassifyId" align="center"></el-table-column>
				<el-table-column prop="title" align="center" label="标题"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="edit(scope.row)">编辑</el-button>
						<el-button type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
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
					:total="cur_total">
				</el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="新增/编辑" width="70%" :visible.sync="dialogFormVisible">
			<el-form :model="dataForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="dataForm">
				<el-form-item label="分类ID" prop="classifyId" :label-width="formLabelWidth">
					<el-select v-model="dataForm.classifyId" placeholder="分类ID" class="handle-select mr10">
						<el-option v-for="op in classifyList" :key="op.id" :label="op.name" :value="op.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="标题" prop="title">
					<el-input v-model="dataForm.title" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="答案" prop="question">
					<tinymce ref="content" :height="300" :childHasChange="hasC" v-model="dataForm.question" />
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
			hasC: false,
			page: 1,
			size: 10,
			advertStatus: '',
			cur_total: 0,
			currentPage: 1,
			tableLoading: false,
			dialogFormVisible: false,
			dataList: [],
			formLabelWidth: '150px',
			classifyList: [],
			dataForm: {
				id: '',
				classifyId: '',
				title: '',
				question: ''
			},
			rules: {
				title: [{ required: true, message: '问题标题不能为空', trigger: 'blur' }],
				question: [{ required: true, message: '答案不能为空', trigger: 'blur' }],
				classifyId: [{ required: true, message: '问题类别不能为空', trigger: 'change' }]
			}
		};
	},
	created() {
		this.getClassifyList();
		this.getData();
	},
	methods: {
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
		formatClassifyId(row, column, cellValue, index) {
			let result = this.classifyList.find(item => item.id === cellValue);
			return result.name;
		},
		handleAdd() {
			this.dialogFormVisible = true;
			this.$nextTick(()=>{
				this.$refs.dataForm.resetFields();
				this.$refs.content.setContent('');
			})
		},
		edit(data) {
			this.dialogFormVisible = true;
			this.dataForm = Object.assign(this.dataForm, data);
			this.$nextTick(()=>{
				this.$refs.content.setContent(data.question);
			})
		},
		handleDelete(id) {
			this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(async () => {
				let {
					data: { code, message }
				} = await this.$axios.post(this.BASE_URL + `admin/commonQuestion/deleteCommonQuestion?id=${id}`);
				if (code === '200') {
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getData();
				}
			}).catch(e => { });
		},
		save() {
			let postData = this.dataForm;
			this.$axios.post(this.BASE_URL + 'admin/commonQuestion/saveCommonQuestion', postData).then(res => {
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
					this.save();
				}
			});
		},

		async getClassifyList() {
			let postData = {
				page: 1,
				size: 999
			};
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/commonQuestion/listPageCommonQuestionClassify', postData);
			this.classifyList = data.list;
		},

		async getData() {
			let { page, size } = this;
			let postData = {
				page,
				size
			};
			this.tableLoading = true;
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/commonQuestion/listPageCommonQuestion', postData);
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
.avatar {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
