// 用户信息
<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					用户留存分析
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
					placeholder="结束时间"
					v-model="endCountDate"
					class="handle-label mr10"
					@change="endCountDateChange"
				></el-date-picker>
				<el-button type="primary" @click="search">搜索</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="countDate" label="日期" align="center" width="100" sortable></el-table-column>
				<el-table-column prop="userNum" align="center" label="新注册用户数"></el-table-column>
				<el-table-column prop="newUserJobsNum" align="center" label="新注册干活数"></el-table-column>
				<el-table-column prop="newUserRetentionRate" align="center" label="新用户留存率"></el-table-column>
				<el-table-column prop="loginCount" align="center" label="登录数"></el-table-column>
				<el-table-column prop="userJobsNum" align="center" label="干活数"></el-table-column>
				<el-table-column prop="loginCountRate" align="center" label="干活登录比"></el-table-column>
				<el-table-column prop="jobsIncome" align="center" label="干活收益"></el-table-column>
				<el-table-column prop="perIncomeRate" label="人均收益" align="center"></el-table-column>
				<el-table-column prop="totalUserNum" label="总注册用户数" align="center"></el-table-column>
				<el-table-column prop="userRetentionRate" align="center" label="留存率"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:current-page.sync="cur_page"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			status: 1,
			userId: null,
			parentId: null,
			pageNum: 1,
			pageSize: 10,
			cur_page: 1,
			cur_size: 1,
			mobile: null,
			cur_total: 0,
			tableLoading: false,
			dataList: [],
			startCountDate: this.dateFtt('yyyy-MM-dd', new Date(), 1),
			endCountDate: this.dateFtt('yyyy-MM-dd', new Date(), 1)
		};
	},
	created() {
		this.getData();
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
		search() {
			this.pageNum = 1;
			this.cur_page = 1;
			this.getData();
		},
		handleCurrentChange(val) {
			this.pageNum = val;
			this.cur_page = val;
			this.getData();
		},

		handleSizeChange(val) {
			this.pageNum = 1;
			this.cur_page = 1;
			this.pageSize = val;
			this.getData();
		},

		operateList(list) {
			if (!Array.isArray(list)) return;
			list.map(item => {
				item.dateLocal = this.$moment(item.addDate).format('YYYY-MM-DD HH:mm:ss');
				item.newUserRetentionRate = item.newUserRetentionRate + '%';
				item.userRetentionRate = item.userRetentionRate + '%';
				item.loginCountRate = item.loginCountRate + '%';
			});
			return list;
		},
		async getData() {
			let { startCountDate, endCountDate, pageNum, pageSize } = this;
			this.tableLoading = true;
			let postData = {
				page: pageNum,
				size: pageSize,
				startCountDate,
				endCountDate
			};
			let {
				data: {
					data: { list, total }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/account/userRetentionAnalysis', postData);
			this.tableLoading = false;
			this.dataList = this.operateList(list);
			this.cur_total = total;
		},
		dateFtt(fmt, date, monthNum) {
			var o = {
				'M+': date.getMonth() + monthNum, //月份
				'd+': date.getDate(), //日
				'h+': date.getHours(), //小时
				'm+': date.getMinutes(), //分
				's+': date.getSeconds(), //秒
				'q+': Math.floor((date.getMonth() + 3) / 3), //季度
				S: date.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
			for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
			return fmt;
		}
	}
};
</script>
<style scoped>
.handle-box {
	padding-bottom: 15px;
}
.handle-label {
	width: 140px;
}
.handle-input {
	width: 200px;
	display: inline-block;
}
.mr10 {
	margin-right: 10px;
}
</style>
