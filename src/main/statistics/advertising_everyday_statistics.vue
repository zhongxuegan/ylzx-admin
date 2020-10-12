<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					广告每天统计
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
				<el-select class="handle_select mr10" v-model="status" placeholder="请选择" clearable>
					<el-option label="全部" :value="-1"></el-option>
					<el-option label="未上架" :value="1"></el-option>
					<el-option label="上架" :value="2"></el-option>
					<el-option label="下架" :value="3"></el-option>
				</el-select>
				<el-input v-model.number="select_advId" placeholder="广告组ID" class="handle-input mr10"></el-input>
				<el-input v-model="select_advName" placeholder="广告组名称" class="handle-input mr10"></el-input>
				<el-input v-model.number="select_businessId" placeholder="商务ID" class="handle-input mr10"></el-input>
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="exportExcel">导出</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column prop="channelId" label="商务ID" align="center" sortable></el-table-column>
				<el-table-column prop="advertId" label="广告ID" align="center" sortable></el-table-column>
				<el-table-column label="广告主" align="center">
					<template slot-scope="scope">
						{{ scope.row.advertGroupId }}/{{ scope.row.advertName }}
					</template>
				</el-table-column>
				<el-table-column prop="advertStatus" label="状态" :formatter="statusFormat" align="center"></el-table-column>
				<el-table-column prop="advertTitle" label="标题" align="center"></el-table-column>
				<el-table-column label="图片" align="center">
					<template slot-scope="scope">
						<img :src="scope.row.advertPic" width="100%" height="100%" />
					</template>
				</el-table-column>
				<el-table-column prop="advertUnit" label="广告单价" align="center" sortable></el-table-column>
				<el-table-column prop="advertCount" label="广告投放量" align="center" sortable></el-table-column>
				<el-table-column prop="advertUseCount" label="广告消耗量" align="center" sortable></el-table-column>
				<el-table-column label="广告剩余量" align="center" sortable>
					<template slot-scope="scope">
						{{ scope.row.advertCount - scope.row.advertUseCount }}
					</template>
				</el-table-column>
				<el-table-column prop="cost" label="广告成本" align="center" sortable></el-table-column>
				<el-table-column prop="advertUpTime" label="上架时间" align="center" sortable></el-table-column>
				<el-table-column prop="advertDownTime" label="下架时间" align="center" sortable></el-table-column>
				<el-table-column prop="createTime" label="统计时间" align="center" sortable></el-table-column>
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
import { getPlusTime } from '@/utils/index.js'
export default {
	name: 'advertising_everyday_statistics',
	data() {
		return {
			tableLoading: true,
			startDate: this.$moment().subtract(7,'days').format('YYYY-MM-DD 00:00:00'),
			endDate: this.$moment().format('YYYY-MM-DD 00:00:00'),
			status: null,
			select_advId: '',
			select_advName: '',
			select_businessId: '',
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
		exportExcel() {
			console.log('导出');
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.size = val;
			this.getData();
		},
		statusFormat(row, column, cellValue, index) {
			return cellValue === 1 ? '未上架' : cellValue === 2 ? '上架' : '下架';
		},
		async getData() {
			let postData = {
				advertUpStartTime: this.startDate,
				advertUpEndTime: this.endDate ? getPlusTime(this.endDate) : this.endDate,
				advertStatus: this.status !== -1 ? this.status : '',
				advertGroupId: this.select_advId,
				advertName: this.select_advName,
				channelId: this.select_businessId,
				page: this.page,
				size: this.size
			};
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/statistics/advert_everyday', postData);
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
.handle-label {
	width: 150px;
}
.handle-input {
	width: 150px;
}
.handle_select {
	width: 150px;
}
.mr10 {
	margin-right: 10px;
}
</style>
