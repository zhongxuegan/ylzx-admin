<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					分类管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="select_flag" placeholder="状态" class="handle-select mr10" @change="changeFlag">
					<el-option key="0" label="全部" value=""></el-option>
					<el-option key="1" label="启用" value="0"></el-option>
					<el-option key="2" label="停用" value="1"></el-option>
				</el-select>
				<el-input v-model="select_name" placeholder="分类名称" clearable class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="el-icon-add" @click="handleAdd">新增</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column prop="id" label="id" sortable align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center"></el-table-column>
				<el-table-column prop="money" label="价格" align="center"></el-table-column>
				<el-table-column prop="vipMoney" label="VIP价格" align="center"></el-table-column>
				<el-table-column prop="sort" label="排序" sortable align="center"></el-table-column>
				<el-table-column prop="status" label="状态" align="center"></el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[10, 20, 50, 100]"
					:current-page.sync="page"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="30%">
			<el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="排序"><el-input v-model="form.sort" :readonly="sortEditReadonly" type="number" min="1" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="名称"><el-input v-model="form.name" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="价格"><el-input v-model="form.money" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="VIP价格"><el-input v-model="form.vipMoney" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="状态">
					<el-select v-model="form.deleteFlag" style="width: 100%;" @change="changeEditStatus">
						<el-option key="1" label="启用" value="0"></el-option>
						<el-option key="2" label="停用" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-input v-model="form.id" type="hidden"></el-input>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 新增弹出框 -->
		<el-dialog title="新增" :visible.sync="addVisible" width="30%">
			<el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="排序"><el-input v-model="form.sort" :readonly="sortReadonly" type="number" min="1" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="名称"><el-input v-model="form.name" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="价格"><el-input v-model="form.money" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="VIP价格"><el-input v-model="form.vipMoney" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="状态">
					<el-select v-model="form.deleteFlag" style="width: 100%;" @change="changeStatus">
						<el-option key="1" label="启用" value="0"></el-option>
						<el-option key="2" label="停用" value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAdd">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'basetable',
	data() {
		return {
			tableLoading:true,
			sortReadonly: false,
			copySort: 0,
			copyEditSort: 0,
			sortEditReadonly: false,
			url: this.BASE_URL + 'admin/article/classify/list',
			tableData: [],
			page: 1,
			size: 10,
			select_flag: '0',
			select_name: '',
			editVisible: false,
			addVisible: false,
			form: {
				name: '',
				sort: '',
				money: '',
				id: '',
				deleteFlag: null,
				vipMoney: ''
			},
			total: 0
		};
	},
	created() {
		this.getData();
	},
	methods: {
		changeStatus(val) {
			if (val === '1') {
				this.sortReadonly = true;
				this.copySort = this.form.sort;
			} else {
				this.sortReadonly = false;
				this.form.sort = this.copySort;
			}
		},
		changeEditStatus(val) {
			if (val === '1') {
				this.sortEditReadonly = true;
				this.copyEditSort = this.form.sort;
			} else {
				this.sortEditReadonly = false;
				this.form.sort = this.copyEditSort;
			}
		},
		changeFlag(){
			this.page = 1;
			this.getData();
		},
		handleSizeChange(cur_size) {
			this.size = cur_size;
			this.getData();
		},
		handleCurrentChange(cur_page) {
			this.page = cur_page;
			this.getData();
		},
		operateList(list) {
			if (!Array.isArray(list)) return;
			list.map(item => {
				item.status = item.deleteFlag ? '停用' : '启用';
			});
			return list;
		},
		async getData() {
			let postData = {
				params: {
					page: this.page,
					size: this.size,
					deleteFlag: this.select_flag,
					name: this.select_name
				}
			};
			let {
				data: {
					data: { list, total }
				}
			} = await this.$axios.get(this.url, postData);
			this.tableData = this.operateList(list);
			this.total = total;
			this.tableLoading = false;
		},
		search() {
			this.page = 1;
			this.getData();
		},
		handleEdit(index, row) {
			let { sort, money, id, deleteFlag, name, vipMoney } = row;
			this.form = {
				sort,
				money,
				id,
				deleteFlag: deleteFlag.toString(),
				name,
				vipMoney
			};
			if (Number(sort) === 0) {
				this.sortEditReadonly = true;
			} else {
				this.sortEditReadonly = false;
			}
			this.editVisible = true;
		},
		async handleAdd() {
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/article/classify/findMaxSortNum');
			this.form = {
				sort: data,
				money: '',
				deleteFlag: '0',
				name: '',
				vipMoney: ''
			};

			this.addVisible = true;
		},
		async saveAdd() {
			if (this.form.deleteFlag === '0') {
				if (this.form.sort < 1) {
					this.$message('排序值不能小于1');
					return;
				}
			}
			if (this.form.name == '' || this.form.name == null) {
				this.$message('名称没有填写');
				return;
			}
			let {
				data: { code }
			} = await this.$axios.post(this.BASE_URL + 'admin/article/classify/add', this.form);
			this.addVisible = false;
			this.$message.success(`添加成功`);
			this.getData();
		},
		async saveEdit() {
			if (this.form.name !== '底部视频') {
				if (this.form.deleteFlag === '0') {
					if (this.form.sort < 1) {
						this.$message('排序值不能小于1');
						return;
					}
				}
			}
			if (this.form.name == '' || this.form.name == null) {
				this.$message('名称没有填写');
				return;
			}
			let {
				data: { code }
			} = await this.$axios.post(this.BASE_URL + 'admin/article/classify/update', this.form);
			this.editVisible = false;
			this.$message.success(`修改成功`);
			this.getData();
		}
	}
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 15px;
}

.handle-select {
	width: 120px;
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
.red {
	color: #ff0000;
}
.mr10 {
	margin-right: 10px;
}
</style>
