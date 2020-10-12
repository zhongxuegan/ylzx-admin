<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					转发瓜分收入千元大奖详情
				</el-breadcrumb-item>
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
					v-model="startTime"
					class="handle-label mr10"
					@change="startTimeChange"
				></el-date-picker>
				<i class="line mr10">-</i>
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd"
					placeholder="结束时间"
					v-model="endTime"
					class="handle-label mr10"
					@change="endTimeChange"
				></el-date-picker>
				<el-input v-model="userId" placeholder="用户ID" class="handle-input mr10"></el-input>
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="exportExcel">导出</el-button>
			</div>
			<div class="allData">
				<p>用户总人数：{{ userSum }}</p>
				<p>瓜分实际总金额：{{ dbAwardAmtSum / 100 + ' 元' }}</p>
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
import { getPlusTime } from '@/utils/index.js'
import { handlePageMinxins } from '../mixins/mixins.js';
export default {
	name: 'forward_thousand_award_detail',
	mixins: [handlePageMinxins],
	data() {
		return {
			startTime: null,
			endTime: null,
			userId: '',
			dbAwardAmtSum: 0,
			userSum: 0,
			tableLoading: true,
			tableData: [],
			tableConfig: [
				{ label: '用户ID', prop: 'userId', sortable: true },
				{ label: '转发收益/元', prop: 'forwardAmt', sortable: true, formatter: this.unitFormat },
				{ label: '瓜分金额/元', prop: 'awardAmt', sortable: true, formatter: this.unitFormat },
				{ label: '结算状态', prop: 'isGet', sortable: false, formatter: this.statusFormat },
				{ label: '统计时间', prop: 'createTime', sortable: true }
			],
			page: 1,
			cur_total: 0,
			size: 10
		};
	},
	methods: {
		startTimeChange() {
			if (this.startTime > this.endTime) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
				this.startTime = this.endTime;
			}
		},
		endTimeChange() {
			if (this.startTime > this.endTime) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.endTime = this.startTime;
			}
		},
		search() {
			this.page = 1;
			this.getData();
		},
		exportExcel() {},
		statusFormat(row, column, cellValue, index) {
			return cellValue === 1 ? '已结算' : '待结算';
		},
		unitFormat(row, column, cellValue, index) {
			return cellValue / 100;
		},
		async getData() {
			let postData = {
				page: this.page,
				size: this.size,
				startTime: this.startTime,
				endTime: this.endTime?getPlusTime(this.endTime):this.endTime,
				userId: this.userId,
				configId: parseInt(this.$route.query.id)
			};
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/activity/forawrd/findDivideUpStatisticsByPage', postData);
			if (code == '200') {
				this.tableData = data.list;
				this.tableLoading = false;
				this.cur_total = parseInt(data.totalCount);
				this.dbAwardAmtSum = data.dbAwardAmtSum;
				this.userSum = data.userSum;
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
