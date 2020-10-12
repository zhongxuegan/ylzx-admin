<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					营收记录
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
					placeholder="开始时间"
					v-model="startDate"
					class="handle-label mr10"
					@change="startDateChange"
				></el-date-picker>
				<i class="line mr10">-</i>
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					placeholder="结束时间"
					v-model="endDate"
					class="handle-label mr10"
					@change="endDateChange"
				></el-date-picker>
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="exportExcel">导出</el-button>
				<span class="font-class">默认展示近7天的数据</span>
			</div>

			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column prop="userSum" label="总用户量" align="center" sortable></el-table-column>
				<el-table-column prop="userActiveSum" label="总活跃用户" align="center" sortable></el-table-column>
				<el-table-column prop="userWorkSum" label="总干活人数" align="center" sortable></el-table-column>
				<el-table-column prop="userBannedSum" label="总封禁人数" align="center" sortable></el-table-column>
				<el-table-column prop="articlePvSum" label="总文章PV" align="center" sortable></el-table-column>
				<el-table-column prop="articleIpSum" label="总文章IP" align="center" sortable></el-table-column>
				<el-table-column prop="adPvSum" label="总广告PV" align="center" sortable></el-table-column>
				<el-table-column prop="adIpSum" label="总广告IP" align="center" sortable></el-table-column>
				<el-table-column prop="payIpSum" label="总支付IP" align="center" sortable></el-table-column>
				<el-table-column prop="everyIpCost" label="每IP成本" align="center" sortable></el-table-column>
				<el-table-column prop="everyAdPvSum" label="每PV广告收入" align="center" sortable></el-table-column>
				<el-table-column prop="paySum" label="总支付金额" align="center" sortable></el-table-column>
				<el-table-column prop="forwardIncomeSum" label="转发支付金额" align="center" sortable></el-table-column>
				<el-table-column prop="activitySum" label="活动支付金额" align="center" sortable></el-table-column>
				<el-table-column prop="masterDivideSum" label="师傅分成金额" align="center" sortable></el-table-column>
				<el-table-column prop="withdrawalSum" label="提现金额" align="center" sortable></el-table-column>
				<el-table-column prop="zfbPaySum" label="支付宝支付金额" align="center" sortable></el-table-column>
				<el-table-column prop="wxPaySum" label="微信支付金额" align="center" sortable></el-table-column>
				<el-table-column prop="incomeSum" label="收益金额" align="center" sortable></el-table-column>
			</el-table>

			<!-- <div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:current-page.sync="page"
					:total="cur_total"
				></el-pagination>
			</div> -->
		</div>
	</div>
</template>

<script>
export default {
	name: 'finance_statistics',
	data() {
		return {
			tableLoading: true,
			startDate: this.$moment()
				.subtract(7, 'days')
				.format('YYYY-MM-DD'),
			endDate: this.$moment().format('YYYY-MM-DD'),
			tableData: []
			// page: 1,
			// size: 10,
			// cur_total: 0
		};
	},
	methods: {
		startDateChange() {
			if (this.startDate > this.endDate) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
				this.startDate = this.endDate;
			}
		},
		endDateChange() {
			if (this.startDate > this.endDate) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.endDate = this.startDate;
			}
		},
		search() {
			// this.page = 1;
			this.getDate();
		},
		exportExcel() {},
		// handleCurrentChange(val) {
		// 	this.page = val;
		// 	this.getDate();
		// },
		// handleSizeChange(val) {
		// 	this.size = val;
		// 	this.getDate();
		// },
		async getDate() {
			this.tableLoading = true;
			let postData = {
				startDate: this.startDate,
				endDate: this.endDate
				// page: this.page,
				// size: this.size
			};
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/user/getRevenueSum', postData);
			if (code == '200') {
				for (let key in data) {
					if (data[key] === null) {
						data[key] = 0;
					}
				}
				this.tableData = [data];
				// this.cur_total = parseInt(data.totalCount);
				this.tableLoading = false;
			}
		}
	},
	created() {
		this.getDate();
	}
};
</script>

<style scoped="scoped">
.mr10 {
	margin-right: 10px;
}
.font-class {
	font-size: 14px;
	color: #999;
	margin-left: 10px;
}
</style>
