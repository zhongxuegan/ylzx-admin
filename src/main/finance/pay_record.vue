<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					支付记录
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					placeholder="支付时间"
					v-model="payDateStart"
					class="handle-label mr10"
				></el-date-picker>
				<i class="line mr10">-</i>
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					placeholder="支付时间"
					v-model="payDateEnd"
					class="handle-label mr10"
				></el-date-picker>
				<el-select v-model="payStatus" placeholder="支付状态" class="handle-select mr10" @change="search">
					<el-option key="1" label="全部" value="-1"></el-option>
					<el-option key="2" label="支付中" value="0"></el-option>
					<el-option key="3" label="支付成功" value="1"></el-option>
					<el-option key="4" label="拒绝支付" value="2"></el-option>
					<el-option key="5" label="支付失败" value="3"></el-option>
				</el-select>
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
				<el-input v-model="select_word" placeholder="筛选收款人、用户ID" @keyup.enter.native="search" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" @click="exportRecord">导出</el-button>
			</div>
			<!-- <div class="handle-box">
        <el-button type="primary" icon="delete" class="mr10" @click="delAll">批量删除</el-button>
      </div>-->
			<el-table :data="tableData" v-loading="tableLoading" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="payDate" label="支付时间" width="170" align="center"></el-table-column>
				<el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
				<el-table-column prop="parentId" label="师傅ID" align="center"></el-table-column>
				<el-table-column prop="userType" label="用户类型" align="center" :formatter="formaterUserType"></el-table-column>
				<el-table-column prop="payee" label="姓名" align="center"></el-table-column>
				<el-table-column prop="alipay" label="支付宝" align="center"></el-table-column>
				<el-table-column prop="withdrawalMoney" label="提现金额" align="center"></el-table-column>
				<el-table-column prop="payModeName" label="支付方式" align="center"></el-table-column>
				<el-table-column prop="cheatStatusName" label="作弊检查" align="center"></el-table-column>
				<el-table-column prop="payStatusName" label="支付状态" align="center"></el-table-column>
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
					:current-page.sync="cur_page"
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
		<!-- <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog> -->

		<!-- 手动支付提示框 -->
		<!-- <el-dialog title="提示" :visible.sync="payStatusVisible" width="300px" center>
      <div class="del-dialog-cnt">支付状态不可恢复，是否确定{{this.form.payStatusName}}？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payStatusVisible = false">取 消</el-button>
        <el-button type="primary" @click="delPayRow">确 定</el-button>
      </span>
    </el-dialog> -->

		<!-- 微信在线批量支付提示框 -->
		<!-- <el-dialog title="提示" :visible.sync="payOnlineVisible" width="300px" center>
      <div class="del-dialog-cnt">在线支付是直接到账，不可退款，是否确定按当前查询条件批量在线支付？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payOnlineVisible = false">取 消</el-button>
        <el-button type="primary" @click="payOnline">确 定</el-button>
      </span>
    </el-dialog> -->
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
import { getPlusTime } from '@/utils/index.js'
export default {
	name: 'basetable',
	data() {
		return {
			url: this.BASE_URL + 'admin/user/withdrawal/list',
			tableData: [],
			tableLoading: true,
			userType: null,
			cur_page: 1,
			size: 20,
			total: 0,
			multipleSelection: [],
			// withdrawalDateStart: this.$moment().format('YYYY-MM-DD'))).setHours(-24)).format("YYYY-MM-DD"),
			// withdrawalDateStartHour: "15",
			// withdrawalDateEnd: this.$moment().format('YYYY-MM-DD'),
			// withdrawalDateEndHour: "15",
			payDateStart: this.$moment().format('YYYY-MM-DD'),
			payDateEnd: this.$moment().format('YYYY-MM-DD'),
			payMode: null,
			cheatStatus: null,
			payStatus: null,
			select_word: '',
			del_list: [],
			editVisible: false,
			delVisible: false,
			payStatusVisible: false,
			payOnlineVisible: false,
			loadingVisible: false,
			resultTipVisible: false,
			resultTip: '',
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
	},
	methods: {
		// 分页导航
		handleCurrentChange(val) {
			this.cur_page = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.size = val;
			this.cur_page = 1;
			this.getData();
		},
		formaterUserType(row, column, cellValue, index) {
			return cellValue === 1 ? '普通用户' : cellValue === 2 ? 'vip用户' : 'svip用户';
		},
		// 获取 easy-mock 的模拟数据
		getData() {
			let payDateStartPost = this.payDateStart + ' 00:00:00';
			let payDateEndPost = this.payDateEnd + ' 00:00:00';
			let payStatusPost = -1;
			if (this.payDateStart == null) {
				payDateStartPost = '';
			}
			if (this.payDateEnd == null) {
				payDateEndPost = '';
			}
			if (this.payStatus == null) {
				payStatusPost = -1;
			} else {
				payStatusPost = this.payStatus;
			}
			this.$axios
				.post(
					this.url + '?requestType=3&page=' + this.cur_page + '&size=' + this.size,
					{
						payDateStart: payDateStartPost,
						payDateEnd: payDateEndPost ? getPlusTime(payDateEndPost) : payDateEndPost,
						payMode: this.payMode,
						cheatStatus: this.cheatStatus,
						payee: this.select_word,
						payStatus: payStatusPost,
						userType: this.userType ? this.userType : 0
					},
					{ emulateJSON: true }
				)
				.then(res => {
					if (res.data.code == 200) {
						this.tableLoading = false;
						this.tableData = res.data.data.list;
						for (let i = 0; i < this.tableData.length; i++) {
							this.tableData[i].payModeName = this.tableData[i].payMode == 2 ? '支付宝' : this.tableData[i].payMode == 1 ? '微信' : '微信';

							this.tableData[i].cheatStatusName = this.tableData[i].cheatStatus == 1 ? '涉嫌作弊' : this.tableData[i].cheatStatus == 0 ? '正常' : '正常';

							this.tableData[i].payStatusName =
								this.tableData[i].payStatus == 1
									? '支付成功'
									: this.tableData[i].payStatus == 2
									? '拒绝支付'
									: this.tableData[i].payStatus == 3
									? '支付失败'
									: '支付中';

							let date = this.tableData[i].payDate;
							if (date == null) {
								//   this.tableData[i].payDate ="";
							} else {
								this.tableData[i].payDate = this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
							}
						}
						this.total = res.data.data.total;
					} else {
						this.$message(res.data.message);
					}
				});
		},
		search() {
			this.cur_page = 1;
			this.getData();
		},
		formatter(row, column) {
			return row.address;
		},
		filterTag(value, row) {
			return row.tag === value;
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
		async exportRecord() {
			let payDateStartPost = this.payDateStart + ' 00:00:00';
			let payDateEndPost = this.payDateEnd + ' 00:00:00';
			let payStatusPost = -1;
			if (this.payDateStart == null) {
				payDateStartPost = '';
			}
			if (this.payDateEnd == null) {
				payDateEndPost = '';
			}
			if (this.payStatus == null) {
				payStatusPost = -1;
			} else {
				payStatusPost = this.payStatus;
			}
			let res = await this.$axios({
				method: 'post',
				url: this.BASE_URL + 'admin/user/withdrawal/exportPayRecord',
				responseType: 'blob',
				data: {
					requestType: 3,
					payDateStart: payDateStartPost,
					payDateEnd: payDateEndPost,
					payMode: this.payMode,
					cheatStatus: this.cheatStatus,
					payee: this.select_word,
					payStatus: payStatusPost
				}
			});
			const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
			let filename = 'test.xls';
			// 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
			const elink = document.createElement('a');
			elink.download = res.headers.filename;
			elink.style.display = 'none';
			elink.href = URL.createObjectURL(blob);
			document.body.appendChild(elink);
			elink.click();
			URL.revokeObjectURL(elink.href); // 释放URL 对象
			document.body.removeChild(elink);
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

.handle-label {
	width: 140px;
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
