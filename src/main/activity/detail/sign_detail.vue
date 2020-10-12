<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					签到活动
				</el-breadcrumb-item>
				<el-breadcrumb-item>第{{ num }}期数据</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd HH:mm:ss"
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
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd"
					placeholder="结束时间"
					v-model="endDate"
					class="handle-label mr10"
					@change="endDateChange"
				></el-date-picker>
				<el-input v-model.number="select_word" placeholder="用户ID" class="handle-input mr10"></el-input>
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="exportExcel">导出</el-button>
			</div>
			<div class="allData">
				<p>签到总人数：{{ peopleCount }}</p>
				<p>签到总金额：{{ totleAmt / 100 + ' 元' }}</p>
				<p>人均签到金额：{{ isNaN(totleAmt / 100 / peopleCount) ? 0 : totleAmt / 100 / peopleCount + ' 元' }}</p>
			</div>
			<el-table-page
				:tableLoading="tableLoading"
				:tableData="tableData"
				:tableConfig="tableConfig"
				:page="page"
				:total="cur_total"
				@pageChange="handleCurrentChange"
				@sizeChange="handleSizeChange"
			></el-table-page>
		</div>
	</div>
</template>

<script>
import { exportExcel,getPlusTime } from '@/utils/index.js';
import { handlePageMinxins } from '../mixins/mixins.js';
export default {
	name: 'sign_detail_data',
	mixins: [handlePageMinxins],
	data() {
		return {
			num: this.$route.query.num,
			tableLoading: true,
			tableData: [],
			tableConfig: [
				{ label: '日期', prop: 'signInTime', sortable: true },
				{ label: '签到用户ID', prop: 'userId', sortable: true },
				{ label: '连续签到天数', prop: 'signInDays', sortable: true },
				{ label: '签到金额/元', prop: 'signInAward', sortable: true, formatter: this.unitFormat },
				{ label: '累计签到金额/元', prop: 'signInTotalAward', sortable: true, formatter: this.unitFormat },
				{ label: '签到时间', prop: 'signInTime', sortable: true },
				{ label: '转发收入/元', prop: 'forwardAmt', sortable: true, formatter: this.unitFormat }
			],
			peopleCount: 0,
			totleAmt: 0,
			perCapitaSignAmt: 0,

			cur_total: 0,
			page: 1,
			size: 10,

			startDate: null,
			endDate: null,
			select_word: null
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
			this.page = 1;
			this.getData();
		},
		exportExcel() {
			const header = ['日期', '签到用户ID', '连续签到天数/天', '签到金额/元', '累计签到金额/元', '签到时间', '转发收入/元'];
			const filterVal = ['signInTime', 'userId', 'signInDays', 'signInAward', 'signInTotalAward', 'signInTime', 'forwardAmt'];
			exportExcel({
				header,
				filterVal,
				data: this.tableData,
				filename: '微转3'
			});
		},
		unitFormat(row, column, cellValue, index) {
			return cellValue / 100;
		},
		async getData() {
			let { page, size, startDate, endDate, select_word } = this;
			let postData = {
				configId: parseInt(this.$route.query.id),
				page,
				size,
				signInStartTime: startDate,
				signInEndTime: endDate ? getPlusTime(endDate) : endDate,
				userId: select_word
			};
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/activity/signin/statistics', postData);
			if (code == '200') {
				this.tableData = data.list;
				this.cur_total = parseInt(data.totalCount);
				this.peopleCount = data.peopleCount;
				this.totleAmt = data.totleAmt;
				this.tableLoading = false;
			}
		}
	},
	created() {
		this.getData();
	},
	components: {
		elTablePage: () => import('../components/elTablePage.vue')
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
.allData {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 15px;
	color: #999999;
}
.allData > p {
	margin-right: 15px;
}
.mr10 {
	margin-right: 10px;
}
</style>
