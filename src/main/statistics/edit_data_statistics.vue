<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					编辑数据统计
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
				<span class="font-class">默认展示近7天的数据</span>
			</div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column prop="editorId" label="编辑ID" align="center"></el-table-column>
				<el-table-column prop="totalArticleCount" label="总文章数量" align="center"></el-table-column>
				<el-table-column prop="shareArticleCountIp" label="APP内分享用户数UV" align="center" sortable></el-table-column>
				<el-table-column prop="shareArticleCountPv" label="APP内分享次数" align="center" sortable></el-table-column>
				<el-table-column prop="articleUv" label="分享后阅读总量UV" align="center" sortable></el-table-column>
				<el-table-column prop="shareArticleCountRate" label="分享次数IP比" align="center" sortable></el-table-column>
				<el-table-column prop="originUv" label="原文阅读总量UV" align="center" sortable></el-table-column>
				<el-table-column prop="originRate" label="原文阅读率" align="center" sortable></el-table-column>
				<el-table-column prop="adUv" label="广告点击总量UV" align="center" sortable></el-table-column>
				<el-table-column prop="adRate" label="广告点击率" align="center" sortable></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'edit_data_statistics',
	data() {
		return {
			tableLoading: false,
			startDate: this.$moment().subtract(7,'days').format('YYYY-MM-DD'),
			endDate: this.$moment().format('YYYY-MM-DD'),
			tableData: []
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
		async getData() {
			let postData = {
				startDate: this.startDate,
				endDate: this.endDate,
				page:this.page,
				size:this.size
			};
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/statistics/article_editor', postData);
			if(code === '200'){
				this.tableData = data;
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
