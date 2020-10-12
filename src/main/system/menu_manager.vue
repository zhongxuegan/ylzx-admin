<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					菜单管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="search" @click="handleAdd()" class="mr10">新增菜单</el-button>
			</div>
			<el-table :data="tableData" style="width: 100%" 
				v-loading="tableLoading"
				row-key="nodeUrl" 
				border lazy 
				:indent="30" 	
				:tree-props="treeProps">
				<el-table-column prop="nodeName" label="菜单名称"></el-table-column>
				<el-table-column prop="nodeUrl" label="菜单路径"></el-table-column>
				<el-table-column prop="delFlag" label="菜单状态" align="center" :formatter="statusFormat"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<!-- <el-button type="primary">编辑</el-button> -->
						<el-button :type="scope.row.delFlag===0?'info':'primary'" :disabled="scope.row.delFlag===1" @click="delMenu(scope.row)">{{scope.row.delFlag===0?'禁用':'启用'}}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <div class="pagination">
				<el-pagination 
					background 
					@current-change="handleCurrentChange" 
					layout="prev, pager, next" 
					:total="cur_total">
				</el-pagination>
			</div> -->
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="新增菜单" :visible.sync="editVisible" width="50%">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="上级菜单" prop="parentMenuId">
					<el-cascader v-model="form.parentMenuId" :options="parentMenuIdOptions" :props="props" change-on-select></el-cascader>
				</el-form-item>
				<el-form-item label="菜单名称" prop="menuName">
					<el-input v-model="form.menuName"></el-input>
				</el-form-item>
				<el-form-item label="菜单路径" prop="menuUrl">
					<el-input v-model="form.menuUrl"></el-input>
				</el-form-item>
				<el-form-item label="菜单状态" prop="menuStatus">
					<el-select v-model="form.menuStatus" placeholder="请选择">
						<el-option label="禁用" :value="0"></el-option>
						<el-option label="启动" :value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">保 存</el-button>
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
			tableData: [],
			tableLoading:true,
			cur_page: 1,
			cur_total: 1000,
			multipleSelection: [],
			select_cate: '',
			select_word: '',
			del_list: [],
			is_search: false,
			editVisible: false,
			delVisible: false,
			treeProps: {
				hasChildren: 'hasChildren',
				children: 'childrens'
			},
			form: {
				parentMenuId: [1],
				menuName: '',
				menuUrl: '',
				menuStatus: ''
			},
			parentMenuIdOptions: [],
			props: {
				value: 'menuId',
				label: 'menuName',
				children: 'childs'
			}
		};
	},
	created() {
		this.getData();
	},
	computed: {
		data() {
			return this.tableData.filter(d => {
				return d;
			});
		}
	},
	methods: {
		// 分页导航
		handleCurrentChange(val) {
			this.cur_page = val;
			this.getData();
		},
		statusFormat(row, column, cellValue, index){
			return cellValue === 0 ?'已启用':'已禁用';
		},
		getData() {
			this.$axios
				.get(this.BASE_URL + 'admin/account/findMenuByParentId?parentMenuId=', {
					page: this.cur_page,
					size: 10,
					userName: ''
				})
				.then(res => {
					this.tableData = res.data.data;
					this.tableLoading = false;
				});
		},
		delMenu(row){
			if(row.delFlag === 1){};
			if(row.delFlag === 0){
				this.$confirm('确定禁用吗', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(()=>{
					this.$axios.get(this.BASE_URL+`admin/account/deleteByMenuId?menuId=${row.nodeId}`).then(res=>{
						if(res.data.code == '200'){
							this.$message.success(res.data.message);
							this.getData();
							return;
						}
						this.$message.error(res.data.message);
					})
				}).catch(()=>{})
			};
		},
		initFrom() {
			//初始表单数据
			this.parentMenuIdOptions = [];
			this.$axios.get(this.BASE_URL + 'admin/account/findMenuByParentId?parentMenuId=').then(res => {
				this.parentMenuIdOptions = this.formatterMenu(res.data.data);
			});
		},
		// 格式化菜单数据
		formatterMenu(arr) {
			let newArr = [];
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].childrens && arr[i].childrens.length > 0) {
					newArr.push({
						menuId: arr[i].nodeId,
						menuName: arr[i].nodeName,
						childs: this.formatterMenu(arr[i].childrens)
					});
				} else {
					newArr.push({
						menuId: arr[i].nodeId,
						menuName: arr[i].nodeName
					});
				}
			}
			return newArr;
		},
		formatter(row, column) {
			return row.address;
		},
		filterTag(value, row) {
			return row.tag === value;
		},
		handleItemChange(val) {
			setTimeout(_ => {
				this.$axios.get(this.BASE_URL + 'admin/account/findMenuByParentId?parentMenuId=' + this.parentMenuIdOptions[val[0]].value).then(res => {
					var list = res.data.data;
					if (list.length == 0) {
						this.parentMenuIdOptions[val[0]].childs = '';
						return;
					}
					for (var i = 0; i < list.length; i++) {
						this.parentMenuIdOptions[val[0]].childs.push({
							value: res.data.data[i].menuId,
							label: res.data.data[i].menuName,
							childs: []
						});
					}
				});
			}, 300);
		},
		handleAdd() {
			this.form = {
				//重置
				parentMenuId: [],
				menuName: '',
				menuUrl: '',
				menuStatus: ''
			};
			this.initFrom();
			this.editVisible = true;
		},
		handleEdit(index, row) {
			this.idx = index;
			const item = this.tableData[index];
			this.form = {
				name: item.name,
				date: item.date,
				address: item.address
			};
			this.editVisible = true;
		},
		handleDelete(index, row) {
			this.idx = index;
			this.delVisible = true;
		},
		delAll() {
			const length = this.multipleSelection.length;
			let str = '';
			this.del_list = this.del_list.concat(this.multipleSelection);
			for (let i = 0; i < length; i++) {
				str += this.multipleSelection[i].name + ' ';
			}
			this.$message.error('删除了' + str);
			this.multipleSelection = [];
		},
		// handleSelectionChange(val) {
		//     this.multipleSelection = val;
		// },
		// 保存编辑
		saveEdit() {
			this.$axios
				.post(this.BASE_URL + 'admin/account/saveMenuInfo', {
					parentMenuId: this.form.parentMenuId[this.form.parentMenuId.length - 1],
					menuName: this.form.menuName,
					menuUrl: this.form.menuUrl,
					menuStatus: this.form.menuStatus
				})
				.then(res => {
					if (res.data.code == '200') {
						this.$message.success('保存成功');
						this.editVisible = false;
					}
				});
		},
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
