<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					用户管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
				<el-input v-model="userNameSelect" placeholder="用户名" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">新增用户</el-button>
				<el-button type="primary" icon="search" @click="handleMenuAdd()" class="mr10">新增菜单</el-button>
			</div>
			<el-table :data="tableData" v-loading="tableLoading" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
				<el-table-column prop="userName" label="用户名" sortable align="center">
					<template slot-scope="scope">
						<el-input v-model="scope.row.userName" placeholder="请输入内容" @change="handleUserNameChange(scope.$index, scope.row)"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="addDate" label="注册日期" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="handleMenu(scope.$index, scope.row)">授权菜单</el-button>
						<el-button type="primary" @click="handlePassword(scope.$index, scope.row)">修改密码</el-button>
						<el-button type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
					:total="cur_total"
					:current-page.sync="currentPage"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog v-dialogDrag title="编辑" :visible.sync="editVisible" width="30%">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="用户名"><el-input v-model="form.userName"></el-input></el-form-item>
				<el-form-item label="密码"><el-input v-model="form.password" type="password"></el-input></el-form-item>
				<el-form-item label="确认密码"><el-input v-model="form.againPassword" type="password"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog v-dialogDrag title="修改密码" :visible.sync="passwordVisible" width="30%">
			<el-form ref="passwordForm" :model="form" label-width="80px">
				<el-form-item label="用户名"><el-input placeholder="请输入内容" v-model="passwordForm.userName" :disabled="true"></el-input></el-form-item>
				<el-form-item label="原密码"><el-input v-model="passwordForm.oldPassword" type="password"></el-input></el-form-item>
				<el-form-item label="新密码"><el-input v-model="passwordForm.newPassword" type="password"></el-input></el-form-item>
				<el-form-item label="确认密码"><el-input v-model="passwordForm.againPassword" type="password"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="passwordVisible = false">取 消</el-button>
				<el-button type="primary" @click="changePassword">保 存</el-button>
			</span>
		</el-dialog>
		<el-dialog v-dialogDrag title="菜单授权" :visible.sync="authorizeVisible" width="50%">
			<el-tree 
				:data="authorizeData" 
				show-checkbox 
				node-key="menuId" 
				ref="authorzeTree" 
				highlight-current 
				:props="defaultProps">
			</el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="authorizeVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAuthorize">更 新</el-button>
			</span>
		</el-dialog>
		<el-dialog v-dialogDrag title="新增菜单" :visible.sync="menuEditVisible" width="50%">
			<el-form ref="form" :model="menuForm" label-width="80px">
				<el-form-item label="上级菜单">
					<el-cascader 
						v-model="menuForm.parentMenuId" 
						:options="parentMenuIdOptions" 
						:props="props">
					</el-cascader>
				</el-form-item>
				<el-form-item label="菜单名称"><el-input v-model="menuForm.menuName"></el-input></el-form-item>
				<el-form-item label="菜单路径"><el-input v-model="menuForm.menuUrl"></el-input></el-form-item>
				<el-form-item label="菜单状态">
					<el-select v-model="menuForm.menuStatus" placeholder="请选择">
						<el-option label="禁用" :value="0"></el-option>
						<el-option label="启动" :value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="menuEditVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveMenuEdit">保 存</el-button>
			</span>
		</el-dialog>

		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'basetable',
	data() {
		return {
			tableLoading: true,
			tableData: [],
			cur_page: 1,
			cur_total: 0,
			pageSize: 10,
			currentPage: 1,
			multipleSelection: [],
			userNameSelect: '',
			del_list: [],
			is_search: false,
			editVisible: false,
			delVisible: false,
			menuEditVisible: false,
			form: {
				userName: '',
				password: '',
				againPassword: ''
			},

			menuForm: {
				parentMenuId: [1],
				menuName: '',
				menuUrl: '',
				menuStatus: null
			},
			parentMenuIdOptions: [],
			props: {
				value: 'menuId',
				label: 'menuName',
				children: 'childs',
				checkStrictly:true
			},

			passwordVisible: false,
			passwordForm: {
				id: '',
				userName: '',
				oldPassword: '',
				newPassword: '',
				againPassword: ''
			},

			authorizeVisible: false,
			authorizeData: [],
			authorizeForm: {
				accountId: '',
				menuIds: []
			},
			defaultProps: {
				children: 'childs',
				value: 'menuId',
				label: 'menuName'
			},
			delId: -1
		};
	},
	created() {
		this.findAccountByPage();
		this.getData();
	},
	methods: {
		// 分页导航
		handleCurrentChange(val) {
			this.currentPage = val;
			this.cur_page = val;
			this.findAccountByPage();
		},
		handleSizeChange(val) {
			this.currentPage = 1;
			this.cur_page = 1;
			this.pageSize = val;
			this.findAccountByPage();
		},
		// 获取 easy-mock 的模拟数据
		getData() {
			this.$axios.get(this.BASE_URL + 'admin/account/findMenuByParentId?parentMenuId=').then(res => {
				var list = res.data.data;
				for (var i = 0; i < list.length; i++) {
					var childsTemp = '';
					if (res.data.data[i].childs != null && res.data.data[i].childs != 0) {
						childsTemp = res.data.data[i].childs;
					}
					this.authorizeData.push({
						menuId: res.data.data[i].menuId,
						menuName: res.data.data[i].menuName,
						childs: childsTemp
					});
				}
			});
		},
		search() {
			this.cur_page = 1;
			this.findAccountByPage();
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
		async findAccountByPage() {
			let postData = {
				page: this.cur_page,
				size: this.pageSize,
				userName: this.userNameSelect
			};
			let {
				data: {
					data: { content, total, list }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/account/findAccountByPage', postData);

			this.tableData = list;
			this.cur_total = total;
			this.tableLoading = false;
		},
		formatter(row, column) {
			return row.address;
		},

		filterTag(value, row) {
			return row.tag === value;
		},
		handleAdd() {
			this.editVisible = true;
		},
		handlePassword(index, row) {
			this.passwordVisible = true;
			this.passwordForm = {
				id: row.id,
				userName: row.userName,
				oldPassword: '',
				newPassword: '',
				againPassword: ''
			};
		},
		handleUserNameChange(index, row) {
			this.$axios
				.post(this.BASE_URL + 'admin/account/saveAccountInfo', {
					id: row.id,
					userName: row.userName,
					password: row.password
				})
				.then(res => {
					if (res.data.code == 200) {
						this.editVisible = false;
						this.$message.success('保存成功');
						this.findAccountByPage();
					} else {
						this.$message.error(res.data.message);
					}
				});
		},
		handleMenuAdd() {
			this.menuForm = {
				//重置
				parentMenuId: [],
				menuName: '',
				menuUrl: '',
				menuStatus: null
			};
			this.initFrom();
			this.menuEditVisible = true;
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
		handleMenu(index, row) {
			this.authorizeData = [];
			this.$axios.get(this.BASE_URL + 'admin/account/findMenuByParentId?parentMenuId=').then(res => {
				this.authorizeData = this.formatterMenu(res.data.data);
				const formData = new FormData();
				formData.append('accountId', row.id);
				this.$axios
					.post(this.BASE_URL + `admin/account/findAccountMenuByAccountId?accountId=${row.id}`)
					.then(res => {
						var list = res.data.data;
						this.$refs.authorzeTree.setCheckedKeys(list);
					});
			});

			this.authorizeForm.accountId = row.id;
			this.authorizeVisible = true;
		},
		handleEdit(index, row) {
			this.form = {
				userName: row.userName
			};
			this.editVisible = true;
		},
		handleDelete(index, row) {
			this.delId = row.id;
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
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		//修改密码
		changePassword() {
			const formData = new FormData();
			formData.append('id', this.passwordForm.id);
			formData.append('oldPassword', this.passwordForm.oldPassword);
			formData.append('newPassword', this.passwordForm.newPassword);
			this.$axios.post(this.BASE_URL + 'admin/account/changePassword', formData).then(res => {
				if (res.data.code == 200) {
					this.passwordVisible = false;
					this.$message.success('保存成功');
					this.findAccountByPage();
				} else {
					this.$message.error(res.data.message);
				}
			});
		},
		//新增菜单
		saveMenuEdit() {
			this.$axios
				.post(this.BASE_URL + 'admin/account/saveMenuInfo', {
					parentMenuId: this.menuForm.parentMenuId[this.menuForm.parentMenuId.length - 1],
					menuName: this.menuForm.menuName,
					menuUrl: this.menuForm.menuUrl,
					menuStatus: this.menuForm.menuStatus
				})
				.then(res => {
					if (res.data.code == '200') {
						this.$message.success('保存成功');
						this.menuEditVisible = false;
					}
				});
		},
		saveEdit() {
			// 保存编辑
			this.$axios
				.post(this.BASE_URL + 'admin/account/saveAccountInfo', {
					userName: this.form.userName,
					password: this.form.password
				})
				.then(res => {
					if (res.data.code == 200) {
						this.editVisible = false;
						this.$message.success('保存成功');
						this.findAccountByPage();
					} else {
						this.$message.error(res.data.message);
					}
				});
		},
		saveAuthorize() {
			//更新授权
			this.$axios
				.post(this.BASE_URL + 'admin/account/saveAccountMenuRelInfo', {
					accountId: this.authorizeForm.accountId,
					halfMenuIds: this.$refs.authorzeTree.getHalfCheckedKeys(),
					menuIds: this.$refs.authorzeTree.getCheckedKeys()
				})
				.then(res => {
					this.authorizeVisible = false;
					this.$message.success(res.data.message);
				});
		},
		// 确定删除
		deleteRow() {
			const formData = new FormData();
			formData.append('accountId', this.delId);
			this.$axios.post(this.BASE_URL + 'admin/account/delById', formData).then(res => {
				if (res.data.code == 200) {
					this.$message.success(res.data.message);
					this.findAccountByPage();
				} else {
					this.$message.error(res.data.message);
				}
			});
			this.delVisible = false;
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
