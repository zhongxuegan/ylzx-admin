<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					用户数据监测
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
					v-model="startCountDate"
					class="handle-label mr10"
					@change="startCountDateChange"
				></el-date-picker>
				<i class="line mr10">-</i>
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					placeholder="支付时间"
					v-model="endCountDate"
					class="handle-label mr10"
					@change="endCountDateChange"
				></el-date-picker>
				<el-select v-model="userType" placeholder="用户类型" class="handle-select mr10" @change="changeStatus">
					<el-option v-for="item in userTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="用户ID" class="handle-input mr10"></el-input>
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="exportExcel">导出</el-button>
			</div>
			<el-table
				:data="tableData"
				v-loading="tableLoading"
				border
				class="table"
				ref="multipleTable"
				@selection-change="handleSelectionChange"
				size="mini"
				:cell-style="cellStyle"
				:row-style="rowStyle"
				style="font-size: 10px">
				<el-table-column prop="userId" label="用户ID" width="60" align="center"></el-table-column>
				<el-table-column prop="remark" align="center" label="备注">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="right">
							<div style="margin-bottom:5px;">
								<el-input type="textarea" v-model="scope.row.remark" :rows="3" v-if="scope.row.editing"></el-input>
								<p v-else>{{ scope.row.originRemark }}</p>
							</div>
							<el-button type="info" v-if="scope.row.editing" @click="cancelRemark(scope.row, scope.$index)">取消</el-button>
							<el-button type="info" v-else @click="editRemark(scope.row, scope.$index)">编辑</el-button>
							<el-button type="primary" @click="saveRemark(scope.row)">保存</el-button>
							<div slot="reference" class="name-wrapper">
								<p size="medium">{{ scope.row.originRemark ? scope.row.originRemark : '无' | formatString }}</p>
							</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="parentId" label="师傅ID" width="60" align="center"></el-table-column>
				<el-table-column prop="appSystemCode" label="设备类型" width="70" :formatter="formaterVersion" align="center"></el-table-column>
				<!-- <el-table-column prop="userType" align="center" :formatter="formaterUserType" label="用户类型"  width="100"></el-table-column> -->
				<el-table-column prop="userStatus" label="状态" width="100" align="center">
					<template scope="scope">
						<el-select v-model="scope.row.userStatus" placeholder="请选择" @change="userStatusChange(scope.$index, scope.row)">
							<el-option v-for="item in userStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="userId" label="扣量" align="center" width="100">
					<template scope="scope">
						<div v-if="scope.row.buckleAmount == 0"><el-button type="danger" @click="enableBuckleAmount(scope.$index, scope.row)">启用</el-button></div>
						<div v-if="scope.row.buckleAmount != 0">
							<el-input v-model="scope.row.buckleAmount" placeholder="请输入内容" width="56" @blur="buckleAmountBlur(scope.$index, scope.row)"></el-input>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="adConverRate" label="广告点击率" :formatter="addPercent" width="80" align="center"></el-table-column>
				<el-table-column prop="ipPercentRate" label="广告转化率" :formatter="addPercent" width="80" align="center"></el-table-column>
				<el-table-column prop="adCount" label="广告点击" width="80" align="center"></el-table-column>
				<el-table-column prop="pvCount" label="文章点击PV" width="100" align="center"></el-table-column>
				<el-table-column prop="clientIpCount" label="文章点击IP" width="100" align="center"></el-table-column>
				<el-table-column prop="pvIncome" label="支付点击" width="80" align="center"></el-table-column>
				<el-table-column prop="incomeClientRate" label="点击支付率" :formatter="addPercent" width="80" align="center"></el-table-column>
				<el-table-column prop="originCount" label="原文点击" width="80" align="center"></el-table-column>
				<el-table-column prop="originCountRate" label="原文点击率" :formatter="addPercent" width="80" align="center"></el-table-column>
				<el-table-column prop="m1Count" label="M1" width="60" align="center"></el-table-column>
				<el-table-column prop="m2Count" label="M2" width="60" align="center"></el-table-column>
				<el-table-column prop="m3Count" label="M3" width="60" align="center"></el-table-column>
				<el-table-column prop="wecharBackRate" label="返回微信率" :formatter="addPercent" width="80" align="center"></el-table-column>
				<!-- <el-table-column prop="shareCount" label="分享文章量" width="80" align="center"></el-table-column> -->

				<el-table-column prop="pvIncomeMoney" label="支付金额" width="80" align="center"></el-table-column>
				<el-table-column prop="yearMonthDay" :formatter="formatDate" label="统计时间" align="center"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					:current-page.sync="currentPage"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="cur_size"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'basetable',
	data() {
		return {
			tableLoading: false,
			userType: null,
			currentPage: 1,
			tableData: [], // 表格数据
			cur_page: 1, // 当前页号
			cur_size: 20,
			cur_total: 0, // 总记录数
			select_word: '',
			startCountDate: this.dateFtt('yyyy-MM-dd', new Date(), 1),
			endCountDate: this.dateFtt('yyyy-MM-dd', new Date(), 1),
			filename: '',
			ids: [],
			exportList: [],
			rowStyle: { height: '48px' },
			cellStyle: { padding: 0 },
			userStatusOptions: [
				{
					//0:正常 1:封杀
					value: 0,
					label: '禁用'
				},
				{
					value: 1,
					label: '正常'
				}
			],
			userTypeArr: [{ name: '全部', value: '' }, { name: '普通用户', value: 1 }, { name: 'vip用户', value: 2 }, { name: 'svip用户', value: 3 }]
		};
	},
	filters: {
		formatString: function(value) {
			if (value && value.length > 5) {
				return value.substring(0, 5) + '...';
			} else {
				return value;
			}
		}
	},
	created() {
		this.getData();
	},
	methods: {
		// 分页导航
		handleCurrentChange(val) {
			this.currentPage = val;
			this.cur_page = val;
			this.findCountData();
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleSizeChange(val) {
			this.cur_size = val;
			this.findCountData();
		},
		getData() {
			this.findCountData();
		},
		formaterVersion(row, column, cellValue, index) {
			return cellValue === 1 ? 'android' : cellValue === 2 ? 'ios' : '未知';
		},
		formatDate(row, column, cellValue, index) {
			return cellValue.substring(4, cellValue.length);
		},
		search() {
			this.currentPage = 1;
			this.cur_page = 1;
			this.findCountData();
		},
		changeStatus() {
			this.currentPage = 1;
			this.cur_page = 1;
			this.findCountData();
		},
		formaterUserType(row, column, cellValue, index) {
			return cellValue === 1 ? '普通用户' : cellValue === 2 ? 'vip用户' : 'svip用户';
		},
		buckleAmountBlur(index, row) {
			if (row.buckleAmount.indexOf('%') == -1) {
				row.buckleAmount = row.buckleAmount + '%';
			}
			this.$axios
				.post(this.BASE_URL + 'admin/account/saveBuckleAmount', {
					//保存扣量
					userId: row.userId,
					buckleAmount: row.buckleAmount
				})
				.then(res => {
					row.buckleAmount = res.data.data.buckleAmount;
				});
		},
		enableBuckleAmount(index, row) {
			row.buckleAmount = '0%';
		},
		addPercent(row, column, cellValue, index) {
			return cellValue + '%';
		},
		operateList(list) {
			if (!Array.isArray(list)) return;
			list.map(item => {
				item.editing = false;
				item.originRemark = item.remark;
			});
			return list;
		},
		async findCountData() {
			let postData = {
				page: this.cur_page,
				size: this.cur_size,
				startCountDate: this.startCountDate,
				endCountDate: this.endCountDate,
				selectWord: this.select_word,
				userType: this.userType
			};
			let {
				data: {
					data: { list, total }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/account/userDataMonitoring', postData);
			this.tableData = this.operateList(list);
			this.cur_total = total;
			this.tableLoading = false;
		},
		userStatusChange(index, row) {
			var msg = '';
			var confirmButtonText = '';
			var back = 0; //用户取消操作
			if (row.userStatus === '') {
				return;
			} else if (row.userStatus === 0) {
				msg = '封杀用户ID为：' + row.userId + ', 是否继续?';
				confirmButtonText = '封杀';
				back = 1;
			} else if (row.userStatus === 1) {
				msg = '恢复用户ID为：' + row.userId + ', 是否继续?';
				confirmButtonText = '启用';
				back = 0;
			}
			this.$confirm(msg, '提示', {
				confirmButtonText: confirmButtonText,
				cancelButtonText: '取消',
				type: 'warning',
				center: true
			}).then(() => {
				this.$axios
					.post(this.BASE_URL + 'admin/account/forceOutWecharUser', {
						//封杀微信用户
						userId: row.userId,
						status: row.userStatus
					})
					.then(res => {
						row.userStatus = res.data.data.status;
					});
				this.$message({
					type: 'success',
					message: confirmButtonText + '成功'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '取消' + confirmButtonText
				});
				row.userStatus = back;
			});
		},
		startCountDateChange() {
			if (this.startCountDate > this.endCountDate) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
				this.startCountDate = this.endCountDate;
			}
		},
		endCountDateChange() {
			if (this.startCountDate > this.endCountDate) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.endCountDate = this.startCountDate;
			}
		},
		// remark
		editRemark(row) {
			this.tableData.map(item => {
				item.editing = false;
			});
			row.editing = true;
		},
		// remark
		cancelRemark(row) {
			row.remark = row.originRemark;
			row.editing = false;
		},
		saveRemark(row) {
			this.$axios
				.post(this.BASE_URL + 'admin/account/forceOutWecharUser', {
					userId: row.userId,
					status: row.userStatus,
					remark: row.remark
				})
				.then(res => {
					if (+res.data.code === 200) {
						this.$message.success('保存成功');
						this.getData();
					}
				});
		},
		async exportExcel() {
			await this.getTop40Data();
			this.getDataByID(this.ids);
		},
		// 导出Excel
		async getTop40Data() {
			let exportIds = JSON.parse(localStorage.getItem('exportIds')) || [];
			var yesterDayTime = new Date(this.startCountDate).getTime() - 86400000;
			this.yesterDay = this.dateFtt('yyyy-MM-dd', new Date(yesterDayTime), 1);
			this.filename = this.dateFtt('yyyy-MM-dd', new Date(yesterDayTime), 1);
			let postData = {
				page: 1,
				size: 40,
				startCountDate: this.yesterDay,
				endCountDate: this.yesterDay,
				selectWord: ''
			};
			let {
				data: {
					data: { list }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/account/userDataMonitoring', postData);
			if (!Array.isArray(list)) return;
			for (let i = 0; i < list.length; i++) {
				this.ids.push(list[i].userId);
			}
			this.ids = Array.from(new Set([...exportIds, ...this.ids]));
			localStorage.setItem('exportIds', JSON.stringify(this.ids));
		},
		async getDataByID(ids) {
			let resultArr = [];
			// 并发读取远程URL
			const textPromises = ids.map(async id => {
				let postData = {
					page: 1,
					size: 1,
					startCountDate: this.yesterDay,
					endCountDate: this.yesterDay,
					selectWord: id
				};
				let {
					data: {
						data: { list }
					}
				} = await this.$axios.post(this.BASE_URL + 'admin/account/userDataMonitoring', postData);
				return list;
			});
			// 按次序输出
			for (const textPromise of textPromises) {
				let res = await textPromise;
				if (res) {
					resultArr.push(res);
				}
			}
		
			this.exportList = resultArr.flat();
			this.handleDownload();
		},
		handleDownload() {
			import('@/vendor/Export2Excel').then(excel => {
				const tHeader = ['userId', 'pvCount'];
				const filterVal = ['userId', 'pvCount'];
				const list = this.exportList;
				const data = this.formatJson(filterVal, list);
				console.log(data);return;
				excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: '玉龙资讯' + this.filename,
					autoWidth: true,
					bookType: 'xlsx'
				});
			});
		},
		formatJson(filterVal, jsonData) {
			return jsonData.map(v =>
				filterVal.map(j => {
					return v[j];
				})
			);
		},

		// 公用
		dateFtt(fmt, date, monthNum) {
			var o = {
				'M+': date.getMonth() + monthNum, //月份
				'd+': date.getDate(), //日
				'h+': date.getHours(), //小时
				'm+': date.getMinutes(), //分
				's+': date.getSeconds(), //秒
				'q+': Math.floor((date.getMonth() + 3) / 3), //季度
				S: date.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
			for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
			return fmt;
		}
	}
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 15px;
}

.handle-label {
	width: 140px;
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
