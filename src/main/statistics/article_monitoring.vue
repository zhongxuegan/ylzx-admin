<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					文章点击监测
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
					placeholder="支付时间"
					v-model="startCountDate"
					class="handle-label mr10"
					@change="startCountDateChange"
				></el-date-picker>
				<i class="line mr10">-</i>
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					placeholder="支付时间"
					v-model="endCountDate"
					class="handle-label mr10"
					@change="endCountDateChange"
				></el-date-picker>
				<el-button type="primary" @click="search">搜索</el-button>
				<span class="font-class">默认展示近7天的数据</span>
			</div>
			<el-table :data="tableData" v-loading="tableLoading" border class="table" size="mini" style="font-size: 10px">
				<el-table-column prop="editorId" label="编辑ID" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
				<el-table-column prop="articleId" label="文章ID" width="100" align="center"></el-table-column>
				<el-table-column prop="title" label="文章标题" align="center"></el-table-column>
				<el-table-column prop="classifyName" label="栏目" align="center" sortable></el-table-column>
				<el-table-column prop="shareArticleCountIp" label="APP内分享用户数UV" align="center" sortable></el-table-column>
				<el-table-column prop="shareArticleCountPv" label="APP内分享次数" align="center" sortable></el-table-column>
				<el-table-column prop="articleUv" label="分享后阅读量UV" align="center" sortable></el-table-column>
				<el-table-column prop="shareArticleCountRate" label="分享次数IP比" align="center" sortable></el-table-column>
				<el-table-column prop="originUv" label="原文阅读量UV" align="center" sortable></el-table-column>
				<el-table-column prop="originRate" label="原文阅读率" align="center" sortable></el-table-column>
				<el-table-column prop="adUv" label="广告点击量UV" align="center" sortable></el-table-column>
				<el-table-column prop="adRate" label="广告点击率" align="center" sortable></el-table-column>
				<!-- <el-table-column prop="" label="二次转发量" align="center" sortable></el-table-column> -->
				<!-- <el-table-column prop="" label="三次转发量" align="center" sortable></el-table-column> -->
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					:current-page.sync="page"
					@size-change="handleSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="size"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'basetable',
	data() {
		return {
			tableLoading: true,
			tableData: [], // 表格数据
			page: 1, // 当前页号
			size: 10,
			cur_total: 0, // 总记录数
			startCountDate: this.$moment().subtract(7,'days').format('YYYY-MM-DD'),
			endCountDate: this.$moment().format('YYYY-MM-DD')
		};
	},
	methods: {
		startCountDateChange() {
			if (this.startCountDate > this.endCountDate) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
				this.startCountDate = this.endCountDate;
			}
		},
		endCountDateChange() {
			if (this.startCountDate > this.endCountDate) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.endCountDate = this.startCountDate;
			}
		},
		// 分页导航
		handleCurrentChange(val) {
			this.page = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.size = val;
			this.getData();
		},
		async getData() {
			let postData = {
				page: this.page,
				size: this.size,
				startDate: this.startCountDate,
				endDate: this.endCountDate 
			}
			let { data:{ code,data } } = await this.$axios.post(this.BASE_URL + 'admin/statistics/article_cheat', postData)
			if(code === '200'){
				this.tableData = data.list;
				this.cur_total = parseInt(data.totalCount);
				this.tableLoading = false;
			}
		},
		search() {
			this.page = 1;
			this.getData();
		},
	},
	created() {
		this.getData();
	}
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 15px;
}

.handle-select {
	width: 120px;
}

.handle-label {
	width: 140px;
}

.handle-input {
	width: 200px;
	display: inline-block;
}
.del-dialog-cnt {
	font-size: 16px;
	text-align: center;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #ff0000;
}
.mr10 {
	margin-right: 10px;
}
</style>
