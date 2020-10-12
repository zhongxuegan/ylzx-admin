<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					督促徒弟干活奖励
				</el-breadcrumb-item>
				<el-breadcrumb-item>督促徒弟干活奖励详情</el-breadcrumb-item>
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
				<el-input v-model.number="select_userId" placeholder="用户ID" class="handle-input mr10"></el-input>
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="exportExcel">导出</el-button>
			</div>
			<div class="allData">
				<p>达标总人数：{{ peopleCount }}</p>
				<p>连续达标10天人数：{{ continuousPeopleCount }}</p>
				<p>奖励总金额：{{ totleAmt / 100 + ' 元' }}</p>
				<p>领取总金额：{{ getTotleAmt / 100 + ' 元' }}</p>
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
	name: 'push_prentice_work_detail',
	mixins: [handlePageMinxins],
	data() {
		return {
			startTime: null,
			endTime: null,
			select_userId: '',

			totleAmt: 0,
			peopleCount: 0,
			getTotleAmt: 0,
			continuousPeopleCount: 0,

			tableLoading: true,
			tableData: [],
			tableConfig: [
				{ label: '用户ID', prop: 'userId', sortable: true, fixed: true },
				{ label: '分成收入/元', prop: 'forwardAmt', sortable: true, formatter: this.unitFormat },
				{ label: '达标门槛', prop: 'multiConfigId', sortable: true },
				{ label: '奖励金额/元', prop: 'awardAmt', sortable: true, formatter: this.unitFormat },
				{ label: '连续达标天数/天', prop: 'reachDays', sortable: true },
				{ label: '是否领取', prop: 'isGet', formatter: this.getFormat },
				{ label: '达标日期', prop: 'reachTime', sortable: true }
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
		// 当前页
		unitFormat(row, column, cellValue, index) {
			return cellValue / 100;
		},
		getFormat(row, column, cellValue, index) {
			return cellValue == 0 ? '待领取' : '已领取';
		},
		async getData() {
			let postData = {
				page: this.page,
				size: this.size,
				signInStartTime: this.startTime,
				signInEndTime: this.endTime ? getPlusTime(this.endTime) : this.endTime,
				userId: this.select_userId,
				configId: parseInt(this.$route.query.id)
			};
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/activity/supervise/statistics', postData);
			if (code == '200') {
				this.tableData = data.list;
				this.cur_total = parseInt(data.totalCount);
				this.totleAmt = data.totleAmt;
				this.peopleCount = data.peopleCount;
				this.getTotleAmt = data.getTotleAmt;
				this.continuousPeopleCount = data.continuousPeopleCount;
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
