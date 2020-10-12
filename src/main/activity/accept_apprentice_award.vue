<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					收徒阶梯奖励
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<div>
					<el-date-picker
						type="date"
						value-format="yyyy-MM-dd HH:mm:ss"
						placeholder="开始时间"
						v-model="startTime"
						class="handle-label mr10"
						@change="startTimeChange"
					></el-date-picker>
					<i class="line mr10">-</i>
					<el-date-picker
						type="date"
						value-format="yyyy-MM-dd HH:mm:ss"
						placeholder="结束时间"
						v-model="endTime"
						class="handle-label mr10"
						@change="endTimeChange"
					></el-date-picker>
					<el-input v-model.number="select_userId" placeholder="用户ID" class="handle-input mr10"></el-input>
					<el-input v-model.number="select_prenticeId" placeholder="徒弟ID" class="handle-input mr10"></el-input>
					<el-button type="primary" @click="search">搜索</el-button>
					<el-button type="primary" @click="exportExcel">导出</el-button>
				</div>
				<div><el-button type="primary" @click="addActivity('/set_accept_award')">收徒阶梯奖励设置</el-button></div>
			</div>
			<div class="allData">
				<p>获得奖励师傅数量：{{ geimCount }}</p>
				<p>有效徒弟数量：{{ discipleCount }}</p>
				<p>奖励总金额：{{ awartTotle / 100 + ' 元' }}</p>
			</div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column prop="userId" label="用户ID" align="center" sortable fixed></el-table-column>
				<el-table-column prop="discipleId" label="徒弟ID" align="center" sortable></el-table-column>
				<el-table-column prop="discipleSignInTime" label="徒弟注册时间" align="center" sortable></el-table-column>
				<el-table-column prop="totle" label="奖励总额/元" :formatter="unitFormat" align="center" sortable>
					<template slot-scope="scope">
						<el-link type="primary" @click="lookDetail(scope.row)">{{ scope.row.totle / 100 }}</el-link>
					</template>
				</el-table-column>
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
		<!-- 详情弹出框 -->
		<el-dialog title="奖励总额明细" :validate-on-rule-change="false" width="45%" @closed="dialogClose" :visible.sync="dialogFormVisible">
			<el-table v-loading="tableLoading2" :data="tableData2" border class="table" ref="awardTotalData">
				<el-table-column prop="awardName" label="奖励名称" align="center" width="120"></el-table-column>
				<el-table-column prop="award" label="奖励金额/元" :formatter="unitFormat" align="center" sortable width="150"></el-table-column>
				<el-table-column prop="awardTime" label="奖励时间" align="center" sortable></el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer"><el-button type="primary" @click="dialogFormVisible = false">确 定</el-button></div>
		</el-dialog>
	</div>
</template>

<script>
import { getPlusTime } from '@/utils/index.js';
import { addActivityMinxins, handlePageMinxins } from './mixins/mixins.js';
export default {
	name: 'accept_apprentice_award',
	mixins: [addActivityMinxins, handlePageMinxins],
	data() {
		return {
			startTime: null,
			endTime: null,
			select_userId: '',
			select_prenticeId: '',

			tableLoading: true,
			tableData: [],
			awartTotle: 0,
			discipleCount: 0,
			geimCount: 0,

			page: 1,
			cur_total: 0,
			size: 10,

			dialogFormVisible: false,
			tableLoading2: true,
			tableData2: []
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
		exportExcel() {
			console.log('导出');
		},
		async lookDetail(row) {
			let url = this.BASE_URL + `admin/activity/effective/statistics/detail?user_id=${row.userId}`;
			let {
				data: { code, data, message }
			} = await this.$axios.post(url);
			if (code == '200') {
				this.tableData2 = data;
				this.tableLoading2 = false;
			}
			this.dialogFormVisible = true;
		},
		dialogClose() {
			this.dialogFormVisible = false;
		},
		unitFormat(row, column, cellValue, index) {
			return cellValue / 100;
		},
		async getData() {
			let postData = {
				page: this.page,
				size: this.size,
				startTime: this.startTime,
				endTime: this.endTime ? getPlusTime(this.endTime) : this.endTime,
				userId: this.select_userId,
				discipleId: this.select_prenticeId
			};
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/activity/effective/statistics', postData);
			if (code == '200') {
				this.tableData = data.list;
				this.cur_total = parseInt(data.totalCount);
				this.geimCount = data.geimCount;
				this.discipleCount = data.discipleCount;
				this.awartTotle = data.awartTotle;
				this.tableLoading = false;
			}
		}
	},
	created() {
		this.getData();
	},
	activated() {
		this.getData();
	}
};
</script>

<style scoped lang="scss">
.container{
	.handle-box {
		margin-bottom: 15px;
		display: flex;
		justify-content: space-between;
		.handle-input {
			width: 150px;
			display: inline-block;
		}
		.mr10 {
			margin-right: 10px;
		}
	}
	.allData {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 15px;
		color: #999999;
		& > p {
			margin-right: 25px;
		}
	}
}
</style>
