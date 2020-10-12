<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					用户数据全天分时段监测
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
			</div>
			<el-table :data="tableData" v-loading="tableLoading" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" style="font-size: 10px">
				<el-table-column prop="userId" label="用户ID" width="60" align="center"></el-table-column>
				<el-table-column prop="userType" align="center" :formatter="formaterUserType" label="用户类型" width="100"></el-table-column>
				<el-table-column prop="adConverRate" label="广告点击率" align="center" :formatter="addPercent"></el-table-column>
				<el-table-column prop="ipPercentRate" label="广告转化率" align="center" :formatter="addPercent"></el-table-column>
				<el-table-column prop="pvCount" label="文章点击" align="center"></el-table-column>
				<el-table-column prop="adCount" label="广告点击" align="center"></el-table-column>
				<el-table-column prop="originCount" label="原文阅读数" align="center"></el-table-column>
				<el-table-column prop="originRate" label="原文点击率" align="center" :formatter="addPercent"></el-table-column>
				<el-table-column v-for="(item, index) in hoursArr" :key="item.index" :label="'' + index + ''" :formatter="addPercent" width="90" align="center">
					<template scope="scope">
						<div style="color:#000;">{{ mergeHourCountData(scope.row, index) }}</div>
						<div>{{ mergeAdandIpData(scope.row, index) }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="yearMonthDay" label="统计时间" align="center"></el-table-column>
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
			userType: null,
			tableLoading: true,
			currentPage: 1,
			tableData: [], // 表格数据
			cur_page: 1, // 当前页号
			cur_size: 20,
			cur_total: 0, // 总记录数

			select_word: '',
			startCountDate: this.dateFtt('yyyy-MM-dd', new Date(), 1),
			endCountDate: this.dateFtt('yyyy-MM-dd', new Date(), 1),
			hoursArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
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
	created() {
		this.getData();
	},
	methods: {
		mergeHourCountData(obj, index) {
			return obj.hourCountDetail['hour' + index] + '%';
		},
		mergeAdandIpData(obj, index) {
			return obj.hourClientAdCountDetail['clientAdCountHour' + index] + '/' + obj.hourClientIpCountDetail['clientIpCountHour' + index];
		},
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
		changeStatus() {
			this.currentPage = 1;
			this.cur_page = 1;
			this.findCountData();
		},
		formaterUserType(row, column, cellValue, index) {
			return cellValue === 1 ? '普通用户' : cellValue === 2 ? 'vip用户' : 'svip用户';
		},
		getData() {
			this.findCountData();
		},
		search() {
			this.currentPage = 1;
			this.cur_page = 1;
			this.findCountData();
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
			} = await this.$axios.post(this.BASE_URL + 'admin/account/allDayTimeIntervalMonitoring', postData);
			this.cur_total = total;
			this.tableData = list;
			this.tableLoading = false;
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
