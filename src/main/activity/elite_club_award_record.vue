<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					收徒精英会奖励记录
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<div class="box--item">
					<el-input v-model="periodsNum" placeholder="期数" type="number" class="handle-input mr10" clearable></el-input>
					<el-button type="primary" icon="add" @click="search">搜索</el-button>
				</div>
				<div class="box--item">
					<span class="color-gray">奖励人数：</span>
					{{ totalRewardCount }}
				</div>
				<div class="box--item">
					<span class="color-gray">奖励有效徒弟总数：</span>
					{{ totalEfficientDiscipleCount }}
				</div>
				<div class="box--item">
					<span class="color-gray">奖励金额：</span>
					{{ totalRewardAmount }}
				</div>
			</div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="rankingNum" label="排名" align="center" width="60"></el-table-column>
				<el-table-column prop="userId" align="center" label="用户ID"></el-table-column>
				<el-table-column prop="statusText" align="center" label="状态"></el-table-column>
				<el-table-column prop="efficientDiscipleCount" align="center" label="有效徒弟/人"></el-table-column>
				<el-table-column prop="rewardAmount" align="center" label="奖励金额／元"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:current-page.sync="page"
					:total="cur_total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			periodsNum: null,
			size: 10,
			page: 1,
			cur_total: 0,
			tableLoading: false,
			periodsNumTotal: 1,
			totalRewardAmount: 0,
			totalRewardCount: 0,
			totalEfficientDiscipleCount: 0,
			dataList: []
		};
	},
	created() {
		this.getData();
	},
	methods: {
		getData() {
			let { page, periodsNum, size } = this;
			this.tableLoading = true;
			this.$axios
				.post(this.BASE_URL + 'admin/activity/findAwardRecordByPage', {
					page,
					size,
					periodsNum
				})
				.then(res => {
					this.tableLoading = false;
					let result = res.data.data;
					this.dataList = result.list ? this.operateList(result.list) : [];
					this.cur_total = result.totalCount;
					this.totalRewardCount = result.totalRewardCount;
					this.totalRewardAmount = result.totalRewardAmount;
					this.periodsNum = result.activity.periodsNum;
					this.totalEfficientDiscipleCount = result.totalEfficientDiscipleCount;
				});
		},
		operateList(list) {
			if (list.length <= 0) return;
			list.map(item => {
				item.statusText = item.userStatus ? '正常' : '禁用';
			});
			return list;
		},
		search() {
			this.pageNum = 1;
			this.page = 1;
			this.getData();
		},
		handleCurrentChange(val) {
			this.pageNum = val;
			this.page = val;
			this.getData();
		},

		handleSizeChange(val) {
			this.pageNum = 1;
			this.page = 1;
			this.size = val;
			this.getData();
		}
	}
};
</script>

<style>
.handle-box {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 10px 0;
}
.handle-box .box--item {
	margin-right: 40px;
}
.handle-box .el-input {
	width: auto;
	margin-right: 5px;
}
.color-gray {
	color: #666;
}
</style>
