<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					收徒大赛活动
				</el-breadcrumb-item>
				<el-breadcrumb-item>第{{ num }}期数据</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="select_userId" placeholder="用户ID" class="handle-input mr10"></el-input>
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="exportExcel">导出</el-button>
			</div>
			<div class="allData">
				<p>奖励人数：{{ peopleCount }}</p>
				<p>有效徒弟数：{{ effDiscipleCount }}</p>
				<p>收徒奖励金额：{{ acceptDiscipleAmt / 100 + ' 元' }}</p>
				<p>特别奖励金额：{{ specialAmt / 100 + ' 元' }}</p>
				<p>奖励合计：{{ totleAmt / 100 + ' 元' }}</p>
			</div>
			<el-table-page 
				:tableLoading="tableLoading" 
				:tableData="tableData" 
				:tableConfig="tableConfig" 
				:page="page" 
				:total="cur_total"
				@pageChange="handleCurrentChange"
				@sizeChange="handleSizeChange">
			</el-table-page>
		</div>
	</div>
</template>

<script>
import { handlePageMinxins } from '../mixins/mixins.js'
export default {
	name: 'accept_apprentice_competition_detail',
	mixins:[handlePageMinxins],
	data() {
		return {
			num: this.$route.query.num ? this.$route.query.num : 0,
			select_userId: null,
			tableLoading: true,
			tableData: [],
			tableConfig: [
				{ label: '排名', prop: 'rankNumber', sortable: true },
				{ label: '用户ID', prop: 'userId', sortable: true },
				{ label: '状态', prop: 'status', formatter: this.statusFormat },
				{ label: '有效徒弟/人', prop: 'discipleNumber', sortable: true },
				{ label: '收徒奖励/元', prop: 'awardAmt', sortable: true, formatter: this.unitFormat },
				{ label: '特别奖励/元', prop: 'superAwardAmt', sortable: true, formatter: this.unitFormat },
				{ label: '小计/元', prop: 'sum', sortable: true, formatter: this.unitFormat },
				{ label: '领取状态', prop: 'isGet', formatter: this.getFormat }
			],
			page: 1,
			cur_total: 0,
			size: 10,
			peopleCount: 0,
			effDiscipleCount: 0,
			acceptDiscipleAmt: 0,
			specialAmt: 0,
			totleAmt: 0
		};
	},
	methods: {
		search() {
			this.page = 1;
			this.getData();
		},
		exportExcel() {},
		unitFormat(row, column, cellValue, index) {
			return cellValue / 100;
		},
		statusFormat(row, column, cellValue, index) {
			return cellValue === 0 ? '禁用' : '正常';
		},
		getFormat(row, column, cellValue, index) {
			return cellValue === 0 ? '待领取' : '已领取';
		},
		async getData() {
			let { page, size, select_userId } = this;
			let postData = {
				configId: parseInt(this.$route.query.id),
				page,
				size,
				userId: select_userId
			};
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/activity/accept/statistics', postData);
			if (code == '200') {
				data.list.forEach(item => {
					item.sum = parseInt(item.awardAmt) + parseInt(item.superAwardAmt);
				});
				this.tableData = data.list;
				this.cur_total = parseInt(data.totalCount);
				this.peopleCount = data.peopleCount;
				this.effDiscipleCount = data.effDiscipleCount;
				this.acceptDiscipleAmt = data.acceptDiscipleAmt;
				this.specialAmt = data.specialAmt;
				this.totleAmt = data.totleAmt;
				this.cur_total = parseInt(data.totalCount);
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
