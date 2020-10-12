<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					app版本管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="appVersionCon" placeholder="版本号" clearable class="handle-input mr10"></el-input>
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="addNewVersion" class="mr10">添加</el-button>
			</div>
			<el-table :data="tableData" v-loading="tableLoading" border class="table" @selection-change="handleSelectionChange">
				<!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
				<el-table-column prop="appVersion" label="app版本" width="100" align="center" sortable></el-table-column>
				<el-table-column prop="appType" label="app类型" width="80" align="center" :formatter="appTypeFormatter"></el-table-column>
				<el-table-column prop="updateContent" label="更新内容" align="center"></el-table-column>
				<el-table-column prop="updateType" label="更新类型" width="100" align="center" :formatter="updateTypeFormatter"></el-table-column>
				<el-table-column prop="downloadAddress" label="下载地址" align="center"></el-table-column>
				<el-table-column prop="createTime" label="发布时间" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					:current-page.sync="currentPage"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="50%">
			<el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="app类型">
					<el-select v-model="form.appType" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in appTypeOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="更新内容"><el-input v-model="form.updateContent" rows="3" type="textarea"></el-input></el-form-item>
				<el-form-item label="更新类型">
					<el-select v-model="form.updateType" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in updateTypeOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="app版本"><el-input v-model="form.appVersion"></el-input></el-form-item>
				<el-form-item label="下载地址"><el-input v-model="form.downloadAddress"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'basetable',
	data() {
		return {
			url: './vuetable.json',
			tableLoading: false,
			tableData: [],
			cur_page: 1,
			currentPage: 1,
			pageSize: 10,
			cur_total: 0,
			multipleSelection: [],
			appVersionCon: '',
			del_list: [],
			editVisible: false,
			form: {
				id: '',
				appType: 1,
				updateContent: '',
				updateType: 1,
				appVersion: '',
				downloadAddress: '',
				createTime: '',
				updateTime: ''
			},
			
			// 下拉框数据填充
			appTypeOptions: [
				//APP类型 1:android 2:ios
				{ value: 1, lable: 'android' },
				{ value: 2, lable: 'ios' }
			],
			updateTypeOptions: [
				//更新类型 1:更新 2:强制更新
				{ value: 1, lable: '更新' },
				{ value: 2, lable: '强制更新' }
			]
		};
	},
	created() {
		this.getData();
	},
	methods: {
		// 分页导航
		handleCurrentChange(val) {
			this.currentPage = val;
			this.cur_page = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.currentPage = 1;
			this.cur_page = 1;
			this.pageSize = val;
			this.getData();
		},
		async getData() {
			this.tableLoading = true;
			let postData = {
				page: this.cur_page,
				appVersion: this.appVersionCon,
				size: this.pageSize
			};
			let {
				data: {
					data: { list, total }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/system/list', postData);
			this.tableData = list;
			this.cur_total = total;
			this.tableLoading = false;
		},
		search() {
			this.cur_page = 1;
			this.currentPage = 1;
			this.getData();
		},
		appTypeFormatter(row, column) {
			return row.appType == 1 ? 'android' : 'ios';
		},
		updateTypeFormatter(row, column) {
			return row.updateType == 1 ? '更新' : '强制更新';
		},
		filterTag(value, row) {
			return row.tag === value;
		},
		addNewVersion(){
			this.$router.push('/app_version_management_add');
		},
		handleEdit(index, row) {
			this.form = {
				id: row.id,
				appType: row.appType,
				updateContent: row.updateContent,
				updateType: row.updateType,
				appVersion: row.appVersion,
				downloadAddress: row.downloadAddress
			};
			this.editVisible = true;
		},
		handleDelete(index, row) {
			this.form = {
				id: row.id
			};
			this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRow();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		// delAll() {
		//     const length = this.multipleSelection.length;
		//     let str = '';
		//     this.del_list = this.del_list.concat(this.multipleSelection);
		//     for (let i = 0; i < length; i++) {
		//         str += this.multipleSelection[i].name + ' ';
		//     }
		//     this.$message.error('删除了' + str);
		//     this.multipleSelection = [];
		// },
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 保存编辑
		async saveEdit() {
			this.$confirm('确定保存吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$axios.post(this.BASE_URL + 'admin/system/saveAppVersionInfo', this.form).then(res=>{
					if(res.data.code=='200'){
						this.editVisible = false;
						this.$message.success(res.data.message);
						this.getData();
						return;
					}
					this.$message.error(res.data.message);
				})
			}).catch(() => {});
		},
		// 确定删除
		deleteRow() {
			const formData = new FormData();
			formData.append('id', this.form.id);
			this.$axios.post(this.BASE_URL + 'admin/system/updateAppVersionInfoByDelete', formData).then(res => {
				this.getData();
				this.$message.success(res.data.message);
			});
		}
	}
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 15px;
}

.handle-input {
	width: 200px;
	display: inline-block;
}
.del-dialog-cnt {
	font-size: 16px;
	text-align: center;
}
.table {
	width: 100%;
	font-size: 14px;
}
.mr10 {
	margin-right: 10px;
}
</style>
