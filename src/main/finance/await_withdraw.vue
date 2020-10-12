<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					等待提现
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<div>
					<el-select v-model="payMode" placeholder="支付方式" class="handle-select mr10" @change="search">
						<el-option key="1" label="全部" value></el-option>
						<el-option key="2" label="微信" value="1"></el-option>
						<el-option key="3" label="支付宝" value="2"></el-option>
					</el-select>
					<el-select v-model="cheatStatus" placeholder="作弊状态" class="handle-select mr10" @change="search">
						<el-option key="1" label="全部" value></el-option>
						<el-option key="2" label="正常" value="0"></el-option>
						<el-option key="3" label="涉嫌作弊" value="1"></el-option>
					</el-select>
					<el-select v-model="userType" placeholder="用户类型" class="handle-select mr10" @change="search">
						<el-option v-for="item in userTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
					</el-select>
					<el-input v-model="select_word" placeholder="筛选收款人、用户ID" @keyup.enter.native="search" class="handle-input mr10"></el-input>
					<el-button type="primary" @click="search">搜索</el-button>
					<el-button type="primary" @click="checked">刷子检测</el-button>
					<el-button type="primary" @click="handlePayOnline">微信批量支付</el-button>
				</div>
				<div><el-button type="primary" @click="batchReject(2)">批量拒绝</el-button></div>
			</div>
			<div class="handle-text">
				<label class="red">&nbsp;&nbsp;&nbsp;待支付笔数:{{ totalAwaitPayNum }}&nbsp;&nbsp;待支付金额:{{ sumMoney }}</label>
			</div>
			<!-- <div class="handle-box">
        <el-button type="primary" icon="delete" class="mr10" @click="delAll">批量删除</el-button>
      </div>-->
			<el-table :data="tableData" v-loading="tableLoading" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" @sort-change="sortChange">
				<el-table-column type="selection" width="40" align="center"></el-table-column>
				<el-table-column prop="withdrawalDate" label="申请时间" align="center" sortable="custom" width="160"></el-table-column>
				<el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
				<el-table-column prop="parentId" label="师傅ID" align="center"></el-table-column>
				<el-table-column prop="userType" label="用户类型" align="center" :formatter="formaterUserType"></el-table-column>
				<el-table-column prop="payee" label="姓名" align="center"></el-table-column>
				<el-table-column prop="alipay" label="支付宝" align="center"></el-table-column>
				<el-table-column prop="withdrawalMoney" label="提现金额" width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="payModeName" label="支付方式" align="center"></el-table-column>
				<el-table-column prop="cheatStatusName" label="作弊检查" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handlePayStatus(scope.$index, scope.row, 1)">手动支付</el-button>
						<el-button type="text" icon="el-icon-edit" class="red" @click="handlePayStatus(scope.$index, scope.row, 2)">拒绝</el-button>
						<el-button type="text" icon="el-icon-edit" class="red" @click="handlePayMode(scope.$index, scope.row)">更改支付方式</el-button>
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
					:total="total"
					:page-size="size"
					:current-page.sync="currentPage"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="30%">
			<el-form ref="form" :model="form" label-width="50px">
				<el-form-item label="日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="form.aa" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="姓名"><el-input v-model="form.name"></el-input></el-form-item>
				<el-form-item label="地址"><el-input v-model="form.address"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
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

		<!-- 手动支付提示框 -->
		<el-dialog title="提示" :visible.sync="payStatusVisible" width="300px" center>
			<div class="del-dialog-cnt">支付状态不可恢复，是否确定{{ this.form.payStatusName }}？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="payStatusVisible = false">取 消</el-button>
				<el-button type="primary" @click="delPayRow">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 更改支付方式提示框 -->
		<el-dialog title="提示" :visible.sync="payModeVisible" width="300px" center>
			<div class="del-dialog-cnt">是否确定改成{{ this.form.payModeName }}支付？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="payModeVisible = false">取 消</el-button>
				<el-button type="primary" @click="payModeChange">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 微信在线批量支付提示框 -->
		<el-dialog title="提示" :visible.sync="payOnlineVisible" width="300px" center>
			<div class="del-dialog-cnt">在线支付是直接到账，不可退款，是否确定按当前查询条件批量在线支付？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="payOnlineVisible = false">取 消</el-button>
				<el-button type="primary" @click="payOnline">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 处理结果展示框 -->
		<el-dialog title="提示" :visible.sync="resultTipVisible" width="300px" center>
			<div class="del-dialog-cnt" v-html="this.resultTip"></div>
			<span slot="footer" class="dialog-footer"><el-button @click="resultTipVisible = false">确 定</el-button></span>
		</el-dialog>

		<!-- 处理中...提示框 -->
		<el-dialog title="提示" :visible.sync="loadingVisible" width="300px" center><div class="del-dialog-cnt">处理中...</div></el-dialog>
	</div>
</template>

<script>
import moment from 'moment';
export default {
	name: 'basetable',
	data() {
		return {
			userType: null,
			url: this.BASE_URL + 'admin/user/withdrawal/list',
			payUrl: this.BASE_URL + 'admin/user/withdrawal/pay-online',
			tableData: [],
			tableLoading: true,
			currentPage: 1,
			cur_page: 1,
			size: 20,
			total: 0,
			totalAwaitPayNum: 0,
			multipleSelection: [],
			payMode: null,
			cheatStatus: null,
			select_word: '',
			del_list: [],
			is_search: false,
			editVisible: false,
			delVisible: false,
			payStatusVisible: false,
			payOnlineVisible: false,
			payModeVisible: false,
			loadingVisible: false,
			resultTipVisible: false,
			resultTip: '',
			orderBy: '',
			sumMoney: 0.0,
			userTypeArr: [{ name: '全部', value: 0 }, { name: '普通用户', value: 1 }, { name: 'vip用户', value: 2 }, { name: 'svip用户', value: 3 }],
			form: {
				id: '',
				withdrawalDate: '',
				userId: '',
				parentId: '',
				payee: '',
				withdrawalMoney: '',
				payMode: '',
				cheatStatus: '',
				payStatus: '',
				payModeName: '',
				cheatStatusName: '',
				payStatusName: '',
				updateDate: '',
				payDate: ''
			},
			idx: -1
		};
	},
	created() {
		this.getData();
		this.getCount();
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
			this.size = val;
			this.cur_page = 1;
			this.getData();
		},
		getData() {
			this.$axios
				.post(
					this.url + '?page=' + this.cur_page + '&size=' + this.size,
					{
						payMode: this.payMode,
						cheatStatus: this.cheatStatus,
						payee: this.select_word,
						payStatus: 0,
						userType: this.userType ? this.userType : 0,
						orderBy: this.orderBy
					},
					{ emulateJSON: true }
				)
				.then(res => {
					if (res.data.code == 200) {
						this.tableData = res.data.data.list;
						for (let i = 0; i < this.tableData.length; i++) {
							this.tableData[i].payModeName = this.tableData[i].payMode == 2 ? '支付宝' : this.tableData[i].payMode == 1 ? '微信' : '微信';
							this.tableData[i].cheatStatusName = this.tableData[i].cheatStatus == 1 ? '涉嫌作弊' : this.tableData[i].cheatStatus == 0 ? '正常' : '正常';
							let date = this.tableData[i].withdrawalDate;
							this.tableData[i].withdrawalDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
						}
						this.total = res.data.data.total;
						this.tableLoading = false;
					} else {
						this.$message(res.data.message);
					}
				});
		},
		formaterUserType(row, column, cellValue, index) {
			return cellValue === 1 ? '普通用户' : cellValue === 2 ? 'vip用户' : 'svip用户';
		},
		// 获取 easy-mock 的模拟数据
		getCount() {
			this.$axios
				.post(
					this.url + '?requestType=2', //接口拿的是所有待提现
					{
						payMode: this.payMode,
						cheatStatus: this.cheatStatus,
						payee: this.select_word,
						payStatus: 0
						// orderBy: this.orderBy
					},
					{ emulateJSON: true }
				)
				.then(res => {
					if (res.data.code == 200) {
						this.totalAwaitPayNum = res.data.data.total;
						this.sumMoney = res.data.data.sumWithdrawalMoney?res.data.data.sumWithdrawalMoney:'0 元';
					} 
				});
		},
		// 微信在线 批量支付，按当前查询条件，今天15点以前的待支付记录
		payOnline() {
			this.payOnlineVisible = false;
			this.loadingVisible = true;
			this.$axios
				.post(
					this.payUrl,
					{
						payMode: this.payMode,
						cheatStatus: this.cheatStatus,
						payee: this.select_word,
						payStatus: 0
					},
					{ emulateJSON: true }
				)
				.then(res => {
					let reg = new RegExp('\n', 'g');
					let str = '';
					if (res.data.code == 200) {
						str = res.data.data;
					} else {
						str = '接口异常:' + res.data.message;
						// this.$message(res.data.message);
					}
					this.resultTip = str.replace(reg, '<br>');
					this.loadingVisible = false;
					this.resultTipVisible = true;
					this.getData();
				});
		},
		search() {
			this.currentPage = 1;
			this.cur_page = 1;
			this.getData();
		},
		formatter(row, column) {
			return row.address;
		},
		filterTag(value, row) {
			return row.tag === value;
		},
		sortChange(column, prop, order) {
			if (column.prop != null) {
				if (column.order === 'descending') {
					this.orderBy = column.prop + ' desc';
				} else {
					this.orderBy = column.prop + ' asc';
				}
			} else {
				this.orderBy = '';
			}
			this.getData();
		},
		handleEdit(index, row) {
			this.idx = index;
			this.editVisible = true;
		},
		handlePayStatus(index, row, status) {
			this.idx = index;
			this.form = {
				id: row.id,
				payStatus: status,
				payStatusName: status == 1 ? '支付' : '拒绝支付'
			};
			this.payStatusVisible = true;
		},
		handlePayMode(index, row) {
			this.idx = index;
			const item = this.tableData[index];
			this.form = {
				id: row.id,
				payMode: item.payMode == 2 ? 1 : 2,
				payModeName: item.payMode == 2 ? '微信' : '支付宝',
				userId: item.userId
			};
			this.payModeVisible = true;
		},
		handlePayOnline() {
			this.payOnlineVisible = true;
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
		// 保存编辑
		saveEdit() {
			this.$set(this.tableData, this.idx, this.form);
			this.editVisible = false;
			this.$message.success(`修改第 ${this.idx + 1} 行成功`);
		},
		// 确定删除
		deleteRow() {
			this.tableData.splice(this.idx, 1);
			this.$message.success('删除成功');
			this.delVisible = false;
		},
		// 确定更改支付状态
		delPayRow() {
			this.toPay([this.form.id],this.form.payStatus);
			// this.$axios
			// 	.post(this.BASE_URL + 'admin/user/withdrawal/pay', {
			// 		// id: this.form.id,
			// 		payStatus: this.form.payStatus,
			// 		idArray: [this.form.id]
			// 	})
			// 	.then(res => {
			// 		if (res.data.code == 200) {
			// 			this.tableData.splice(this.idx, 1);
			// 			this.$message.success(this.form.payStatusName + '成功');
			// 		} else {
			// 			this.$message.success(this.form.payStatusName + '失败 :' + res.data.message);
			// 			// this.$message(res.data.message);
			// 		}
			// 	});
			// this.payStatusVisible = false;
		},
		// 确定更改支付方式
		payModeChange() {
			this.$axios
				.post(this.BASE_URL + 'admin/user/withdrawal/pay-mode-change', {
					id: this.form.id,
					payMode: this.form.payMode,
					userId: this.form.userId
				})
				.then(res => {
					if (res.data.code == 200) {
						this.tableData.splice(this.idx, 1);
						this.$message.success('已更改为' + this.form.payModeName + '支付');
					} else {
						if (res.data.code == 10009) {
							this.$message('更改失败 :用户未绑定支付宝');
						} else {
							this.$message(this.form.payModeName + '支付更改失败 :' + res.data.message);
						}
					}
					this.getData();
				});
			this.payModeVisible = false;
		},
		// 批量拒绝
		batchReject(type) {
			if (this.multipleSelection.length <= 0) {
				this.$confirm('请先选择要拒绝支付的用户', '提示', {
					confirmButtonText: '我知道了',
					type: 'warning'
				}).then(() => {
					
				}).catch(() => {});
				return;
			}
			this.sureRejectPay(type);
		},
		sureRejectPay(type) {
			this.$confirm('是否确定拒绝支付？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let payIds = this.multipleSelection.map(item => item.id);
				this.toPay(payIds,2)
			}).catch(() => {});
		},
		toPay(ids,type){
			this.$axios.post(this.BASE_URL + 'admin/user/withdrawal/pay', {
				idArray: ids,
				payStatus: type
			}).then(res => {
				if (res.data.code == 200) {
					this.getData();
					this.getCount();
					this.$message.success(res.data.message);
				} else {
					this.$message.error(res.data.message);
				}
				this.payStatusVisible = false;
			});
		},
		async checked(){
			let { data:{ code,message } } = await this.$axios.post(this.BASE_URL+'admin/user/withdrawal/checkBanUser');
			if(code === '200'){
				this.getData();
				this.getCount();
				this.$message.success(message);
			}
		}
	}
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
}
.handle-text {
	margin-bottom: 10px;
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
