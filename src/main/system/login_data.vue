<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					登录信息
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
					placeholder="登录开始时间"
					v-model="startLoginDate"
					class="handle-label mr10"
					@change="startLoginDateChange"
				></el-date-picker>
				<i class="line mr10">-</i>
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					placeholder="登录结束时间"
					v-model="endLoginDate"
					class="handle-label mr10"
					@change="endLoginDateChange"
				></el-date-picker>
				<el-select v-model="loginMode" placeholder="登录方式" class="handle-select mr10" @change="changeStatus">
					<el-option v-for="item in loginModeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
				</el-select>
				<el-select v-model="appSystemCode" placeholder="设备类型" class="handle-select mr10" @change="changeStatus">
					<el-option v-for="item in appSystemCodeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
				</el-select>
				<el-input class="handle-input mr10" v-model="userId" placeholder="用户ID" clearable></el-input>
				<el-button type="primary" icon="add" @click="search">搜索</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="userId" label="用户ID" align="center" width="60"></el-table-column>
				<el-table-column prop="loginMode" align="center" :formatter="formatLoginMode" label="登录方式"></el-table-column>
				<el-table-column prop="loginCount" align="center" label=" 登录次数"></el-table-column>
				<el-table-column prop="appSystemCode" align="center" :formatter="formatSystemCode" label="设备类型"></el-table-column>
				<el-table-column prop="loginDate" align="center" label="登录时间"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:current-page.sync="currentPage"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'login_data',
	data() {
		return {
			pageNum: 1,
			pageSize: 10,
			cur_total: 0,
			currentPage: 1,
			tableLoading: false,
			dataList: [],
			formLabelWidth: '150px',
			startLoginDate: this.$moment().format('YYYY-MM-DD'),
			endLoginDate: this.$moment().format('YYYY-MM-DD'),
			userId: null,
			appSystemCode: null,
			loginMode: null,
			loginModeArr: [{ name: '全部', value: null }, { name: '微信', value: 1 }, { name: 'h5', value: 2 }],
			appSystemCodeArr: [{ name: '全部', value: null }, { name: '未知', value: 0 }, { name: '安卓', value: 1 }, { name: 'ios', value: 2 }]
		};
	},
	created() {
		this.getData();
	},
	methods: {
		handleCurrentChange(val) {
			this.pageNum = val;
			this.currentPage = val;
			this.getData();
		},

		handleSizeChange(val) {
			this.pageNum = 1;
			this.currentPage = 1;
			this.pageSize = val;
			this.getData();
		},
		changeStatus() {
			this.currentPage = 1;
			this.pageNum = 1;
			this.getData();
		},
		search() {
			this.getData();
		},
		formatLoginMode(row, column, cellValue, index) {
			return cellValue === 1 ? '微信' : 'h5';
		},
		formatSystemCode(row, column, cellValue, index) {
			return cellValue === 0 ? '未知' : cellValue === 1 ? '安卓' : 'ios';
		},
		startLoginDateChange() {
			if (this.startLoginDate > this.endLoginDate) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
				this.startLoginDate = this.endLoginDate;
			}
		},
		endLoginDateChange() {
			if (this.startLoginDate > this.endLoginDate) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.endLoginDate = this.startLoginDate;
			}
		},

		async getData() {
			let { pageNum, pageSize, userId, loginMode, appSystemCode, startLoginDate, endLoginDate } = this;
			let postData = {
				size: pageSize,
				page: pageNum,
				userId,
				loginMode,
				appSystemCode,
				startLoginDate,
				endLoginDate
			};
			this.tableLoading = true;
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/userLoginRecord/listByCon', postData);
			this.dataList = data.list;
			this.tableLoading = false;
			this.cur_total = data.total;
		}
	}
};
</script>
<style scoped>
.handle-box {
	padding-bottom: 15px;
}
.handle-label{
	width: 160px;
}
.handle-input {
	width: 180px;
}
.handle-select {
	width: 120px;
}
.mr10 {
	margin-right: 10px;
}
</style>
