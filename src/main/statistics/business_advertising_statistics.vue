<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					商务广告统计
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
				<el-button type="primary" @click="search">搜索</el-button>
				<span class="font-class">默认展示近7天的数据</span>
			</div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column prop="channelId" label="商务ID" align="center"></el-table-column>
				<el-table-column prop="advertSize" label="广告数量" align="center"></el-table-column>
				<el-table-column prop="advertCount" label="广告投放" align="center"></el-table-column>
				<el-table-column label="广告剩余" align="center" sortable>
					<template slot-scope="scope">
						{{ scope.row.advertCount - scope.row.advertUseCount }}
					</template>
				</el-table-column>
				<el-table-column prop="advertUseCount" label="广告消耗量" align="center" sortable></el-table-column>
				<el-table-column label="剩余占比" align="center" sortable>
					<template slot-scope="scope">
						{{ (((scope.row.advertCount - scope.row.advertUseCount) / (scope.row.advertCount === 0 ? 1 : scope.row.advertCount)) * 100).toFixed(0) + '%' }}
					</template>
				</el-table-column>
				<el-table-column prop="cost" label="广告成本" align="center" sortable></el-table-column>
				<el-table-column prop="earnings" label="广告收益" align="center" sortable></el-table-column>
				<el-table-column label="广告毛利" align="center" sortable>
					<template slot-scope="scope">
						{{ scope.row.earnings - scope.row.cost }}
					</template>
				</el-table-column>
				<el-table-column prop="checkRatio" label="广告点击率" :formatter="percentFormat" align="center" sortable></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:current-page.sync="page"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import { getPlusTime } from '@/utils/index.js';
export default {
	name: 'business_advertising_statistics',
	data() {
		return {
			tableLoading: true,
			startDate: this.$moment()
				.subtract(7, 'days')
				.format('YYYY-MM-DD 00:00:00'),
			endDate: this.$moment().format('YYYY-MM-DD 00:00:00'),
			tableData: [],
			page: 1,
			size: 10,
			cur_total: 0
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
		handleCurrentChange(val) {
			this.page = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.size = val;
			this.getData();
		},
		percentFormat(row, column, cellValue, index) {
			return cellValue ? cellValue * 100 + '%' : 0 + '%';
		},
		async getData() {
			let postData = {
				startTime: this.startDate,
				endTime: this.endDate ? getPlusTime(this.endDate) : this.endDate,
				page: this.page,
				size: this.size
			};
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/statistics/advert_channel', postData);
			if (code === '200') {
				this.tableData = data.list;
				this.cur_total = parseInt(data.totalCount);
				this.tableLoading = false;
			}
		}
	},
	created() {
		this.getData();
	}
};
</script>

<style scoped>
.mr10 {
	margin-right: 10px;
}
</style>
