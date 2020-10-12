<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					用户裂变留存
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="tabsName">
				<el-tab-pane label="用户裂变" name="user_fission">
					<div class="search">
						<el-date-picker
							type="date"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							placeholder="开始时间"
							v-model="fission_startDate"
							class="handle-label mr10"
							@change="startDateChange('user_fission')"
						></el-date-picker>
						<i class="line mr10">-</i>
						<el-date-picker
							type="date"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							placeholder="结束时间"
							v-model="fission_endDate"
							class="handle-label mr10"
							@change="endDateChange('user_fission')"
						></el-date-picker>
						<el-input v-model="fission_select_userId" clearable placeholder="用户ID" class="handle-input mr10"></el-input>
						<el-button type="primary" @click="search('user_fission')">搜索</el-button>
						<el-button type="primary" @click="exportExcel('user_fission')">导出</el-button>
						<span class="font-class">默认展示近7天的数据</span>
					</div>
					<el-table v-loading="tableLoading_fission" :data="fissionData" border class="table" ref="multipleTable">
						<el-table-column prop="userId" label="用户ID" align="center" sortable fixed></el-table-column>
						<el-table-column prop="state" label="用户状态" :formatter="stateFormat" align="center"></el-table-column>
						<el-table-column prop="prenticeNum" label="徒弟数量" align="center" sortable></el-table-column>
						<el-table-column prop="grandsonNum" label="徒孙数量" align="center" sortable></el-table-column>
						<el-table-column label="其他裂变" align="center" width="120">
							<template slot-scope="scope">
								<el-button type="primary" @click="lookDetail(scope.row)">查看详情</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="towFissionNum" label="二次裂变系数" align="center" sortable></el-table-column>
						<el-table-column prop="prenticBannedNum" label="徒弟封禁数" align="center" sortable></el-table-column>
						<el-table-column prop="grandsonBannedNum" label="徒孙封禁数" align="center" sortable></el-table-column>
						<el-table-column prop="prenticArticleIp" label="徒弟文章IP量" align="center" sortable></el-table-column>
						<el-table-column prop="prenticAdPv" label="徒弟广告PV量" align="center" sortable></el-table-column>
						<el-table-column prop="prenticAdPvRate" label="徒弟广告点击率" align="center" sortable></el-table-column>
						<el-table-column prop="grandsonArticleId" label="徒孙文章IP量" align="center" sortable></el-table-column>
						<el-table-column prop="grandsonAdPv" label="徒孙广告PV量" align="center" sortable></el-table-column>
						<el-table-column prop="grandsonAdPvRate" label="徒孙广告点击率" align="center" sortable></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination
							background
							@current-change="handleCurrentChange($event, 'user_fission')"
							@size-change="handleSizeChange($event, 'user_fission')"
							layout="total, sizes, prev, pager, next, jumper"
							:page-sizes="[10, 20, 50, 100]"
							:current-page.sync="fission_page"
							:total="fission_cur_total"
						></el-pagination>
					</div>
				</el-tab-pane>

				<el-tab-pane label="用户留存" name="user_keep">
					<div class="search">
						<el-date-picker
							type="date"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							placeholder="开始时间"
							v-model="keep_startDate"
							class="handle-label mr10"
							@change="startDateChange('user_keep')"
						></el-date-picker>
						<i class="line mr10">-</i>
						<el-date-picker
							type="date"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							placeholder="结束时间"
							v-model="keep_endDate"
							class="handle-label mr10"
							@change="endDateChange('user_keep')"
						></el-date-picker>
						<el-button type="primary" @click="search('user_keep')">搜索</el-button>
						<el-button type="primary" @click="exportExcel('user_keep')">导出</el-button>
						<span class="font-class">默认展示近7天的数据</span>
					</div>
					<el-table v-loading="tableLoading_keep" :data="keepData" border class="table" ref="multipleTable">
						<el-table-column prop="countDate" label="日期" align="center" sortable></el-table-column>
						<el-table-column prop="totalUserNum" label="用户量" align="center" sortable></el-table-column>
						<el-table-column prop="loginCount" label="登录人数" align="center" sortable></el-table-column>
						<el-table-column prop="userJobsNum" label="干活人数" align="center" sortable></el-table-column>
						<el-table-column prop="loginCountRate" label="干活登录比" align="center" sortable></el-table-column>
						<el-table-column prop="userNum" label="新增用户数" align="center" sortable></el-table-column>
						<el-table-column prop="newUserJobsNum" label="新增干活数" align="center" sortable></el-table-column>
						<el-table-column prop="oneDayUserRetention" label="1日后干活留存" align="center" sortable></el-table-column>
						<el-table-column prop="threeDayUserRetention" label="3日后干活留存" align="center" sortable></el-table-column>
						<el-table-column prop="sevenDayUserRetention" label="7日后干活留存" align="center" sortable></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination
							background
							@current-change="handleCurrentChange($event, 'user_keep')"
							@size-change="handleSizeChange($event, 'user_keep')"
							layout="total, sizes, prev, pager, next, jumper"
							:page-sizes="[10, 20, 50, 100]"
							:current-page.sync="keep_page"
							:total="keep_cur_total"
						></el-pagination>
					</div>
				</el-tab-pane>

				<el-tab-pane label="师徒关系查询" name="master_apprentice">
					<div class="search">
						<el-date-picker
							type="date"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							placeholder="开始时间"
							v-model="master_startDate"
							class="handle-label mr10"
							@change="startDateChange('master_apprentice')"
						></el-date-picker>
						<i class="line mr10">-</i>
						<el-date-picker
							type="date"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							placeholder="结束时间"
							v-model="master_endDate"
							class="handle-label mr10"
							@change="endDateChange('master_apprentice')"
						></el-date-picker>
						<el-select v-model="selectVal" placeholder="请选择" class="handle-input mr10 handle-select">
							<el-option label="师傅ID" :value="1"></el-option>
							<el-option label="徒弟ID" :value="2"></el-option>
							<el-option label="徒孙ID" :value="3"></el-option>
						</el-select>
						<el-input v-model.number="select_inputId" ref="select_inputId" clearable placeholder="输入ID" class="handle-input mr10"></el-input>
						<el-button type="primary" @click="search('master_apprentice')">搜索</el-button>
						<el-button type="primary" @click="exportExcel('master_apprentice')">导出</el-button>
					</div>
					<el-table v-loading="tableLoading_master" :data="masterData" border class="table" ref="multipleTable">
						<el-table-column prop="userId" label="ID" align="center" sortable fixed></el-table-column>
						<el-table-column prop="relationship" label="师徒关系" :formatter="relationShipFormat" align="center" sortable></el-table-column>
						<el-table-column prop="state" label="状态" :formatter="stateFormat" align="center"></el-table-column>
						<el-table-column prop="articleIp" label="总文章IP" align="center" sortable></el-table-column>
						<el-table-column prop="payIp" label="总支付IP" align="center" sortable></el-table-column>
						<el-table-column prop="adPv" label="总广告PV" align="center" sortable></el-table-column>
						<el-table-column prop="adIp" label="总广告IP" align="center" sortable></el-table-column>
						<el-table-column prop="adPvRate" label="广告点击率" align="center" sortable></el-table-column>
						<el-table-column prop="payMoney" label="支付金额" align="center" sortable></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination
							background
							@current-change="handleCurrentChange($event, 'master_apprentice')"
							@size-change="handleSizeChange($event, 'master_apprentice')"
							layout="total, sizes, prev, pager, next, jumper"
							:page-sizes="[10, 20, 50, 100]"
							:current-page.sync="master_page"
							:total="master_cur_total"
						></el-pagination>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>

		<!-- 详情列表 -->
		<el-dialog title="其他裂变" :validate-on-rule-change="false" :visible.sync="dialogVisible" width="70%">
			<el-table v-loading="tableLoading_other" :data="fissionDetailData" border class="table" ref="multipleTable">
				<el-table-column
					v-for="(value, key, index) in fissionDetailData[0]"
					:key="key"
					:prop="key"
					:label="index === 0 ? '用户ID' : index === 1 ? '徒弟（1级）' : index === 2 ? '徒孙（2级）' : index + '级'"
					align="center"
					sortable
					fixed
				></el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer"><el-button type="primary" @click="dialogVisible = false">确 定</el-button></span>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from '@/utils/index.js';
export default {
	name: 'user_fission_keep',
	data() {
		return {
			dialogVisible: false,
			tabsName: 'user_fission',

			tableLoading_fission: true,
			tableLoading_keep: true,
			tableLoading_master: false,
			tableLoading_other: true,

			fission_startDate: this.$moment().subtract(7,'days').format('YYYY-MM-DD'),
			fission_endDate: this.$moment().format('YYYY-MM-DD'),
			fission_select_userId: '',
			fission_page: 1,
			fission_size: 10,
			fissionData: [],
			fission_cur_total: 0,
			fissionDetailData: [],

			keep_startDate: this.$moment().subtract(7,'days').format('YYYY-MM-DD'),
			keep_endDate: this.$moment().format('YYYY-MM-DD'),
			keep_page: 1,
			keep_size: 10,
			keepData: [],
			keep_cur_total: 0,

			master_startDate: null,
			master_endDate: null,
			selectVal: 1,
			select_inputId: '',
			master_page: 1,
			master_size: 10,
			masterData: [],
			master_cur_total: 0
		};
	},
	methods: {
		showMsg(msg) {
			this.$message({ message: msg, type: 'warning' });
		},
		startDateChange(name) {
			if (name === 'user_fission') {
				if (this.fission_startDate > this.fission_endDate) {
					this.showMsg('起始日期不得大于结束日期');
					this.fission_startDate = this.fission_endDate;
				}
			}
			if (name === 'user_keep') {
				if (this.keep_startDate > this.keep_endDate) {
					this.showMsg('起始日期不得大于结束日期');
					this.keep_startDate = this.keep_endDate;
				}
			}
			if (name === 'master_apprentice') {
				if (this.master_startDate > this.master_endDate) {
					this.showMsg('起始日期不得大于结束日期');
					this.master_startDate = this.master_endDate;
				}
			}
		},
		endDateChange(name) {
			if (name === 'user_fission') {
				if (this.fission_startDate > this.fission_endDate) {
					this.showMsg('结束日期不得小于起始日期');
					this.fission_endDate = this.fission_startDate;
				}
			}
			if (name === 'user_keep') {
				if (this.keep_startDate > this.keep_endDate) {
					this.showMsg('结束日期不得小于起始日期');
					this.keep_endDate = this.keep_startDate;
				}
			}
			if (name === 'master_apprentice') {
				if (this.master_startDate > this.master_endDate) {
					this.showMsg('结束日期不得小于起始日期');
					this.master_endDate = this.master_startDate;
				}
			}
		},
		search(tabName) {
			if (tabName === 'user_fission') {
				this.fission_page = 1;
				this.getUserFission();
			}
			if (tabName === 'user_keep') {
				this.keep_page = 1;
				this.getUserKeep();
			}
			if (tabName === 'master_apprentice') {
				if (this.select_inputId === '' || this.select_inputId === null) {
					this.$message.error('请输入ID');
					this.$refs['select_inputId'].focus();
					return;
				}
				this.master_page = 1;
				this.getMasterApprentice();
			}
		},
		exportExcel(tabName) {
			// let header = [],
			// 	filterVal = [],
			// 	data = [];
			// if (tabName === 'user_fission') {
			// 	filterVal = [
			// 		'userId', 'state', 'prenticeNum', 'grandsonNum',
			// 		'towFissionNum', 'prenticBannedNum', 'grandsonBannedNum',
			// 		'prenticArticleIp', 'prenticAdPv', 'prenticAdPvRate',
			// 		'grandsonArticleId', 'grandsonAdPv', 'grandsonAdPvRate'
			// 	];
			// 	header = [
			// 		'用户ID', '用户状态', '徒弟数量', '徒孙数量', '二次裂变系数',
			// 		'徒弟封禁数', '徒孙封禁数', '徒弟文章IP量', '徒弟广告PV量',
			// 		'徒弟广告点击率', '徒孙文章IP量', '徒孙广告PV量', '徒弟广告点击率'
			// 	];
			// 	data = this.fissionData;
			// }
			// if (tabName === 'user_keep') { return; }
			// if (tabName === 'master_apprentice') { return; }
			// exportExcel({
			// 	header,
			// 	data,
			// 	filterVal,
			// 	filename: '玉龙资讯'
			// });
		},
		lookDetail(row) {
			this.tableLoading_other = true;
			this.getfissionDetail(row.userId);
		},
		formatDetailData(userId, oldData) {
			if (oldData.length <= 0) return oldData;
			let newData = [];
			let obj = { other0: userId };
			oldData.forEach((item, index) => {
				obj['other' + (index + 1)] = item;
			});
			newData.push(obj);
			return newData;
		},
		async getfissionDetail(userId) {
			let postData = { userId };
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/user/otherFissionDetails', postData);
			if (code == '200') {
				this.fissionDetailData = this.formatDetailData(userId, data);
				this.tableLoading_other = false;
			}
			this.$nextTick(() => {
				this.dialogVisible = true;
			});
		},
		//  当前页
		handleCurrentChange(val, tabName) {
			if (tabName === 'user_fission') {
				this.fission_page = val;
				this.getUserFission();
			}
			if (tabName === 'user_keep') {
				this.keep_page = val;
				this.getUserKeep();
			}
			if (tabName === 'master_apprentice') {
				this.master_page = val;
				this.getMasterApprentice();
			}
		},
		// 每页条数
		handleSizeChange(val, tabName) {
			if (tabName === 'user_fission') {
				this.fission_size = val;
				this.getUserFission();
			}
			if (tabName === 'user_keep') {
				this.keep_size = val;
				this.getUserKeep();
			}
			if (tabName === 'master_apprentice') {
				this.master_size = val;
				this.getMasterApprentice();
			}
		},
		stateFormat(row, column, cellValue, index) {
			const list = ['禁用', '正常', '异常'];
			return list[cellValue];
		},
		relationShipFormat(row, column, cellValue, index) {
			if (cellValue === null) return '——';
			const list = ['徒孙...', '徒孙', '徒弟', '师父', '师爷', '师爷...'];
			return list[cellValue - 1];
		},
		async getUserFission() {
			this.tableLoading_fission = true;
			let postData = {
				startDate: this.fission_startDate,
				endDate: this.fission_endDate,
				userId: this.fission_select_userId,
				page: this.fission_page,
				size: this.fission_size
			};
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/user/fissionStatistics', postData);
			if (code == '200') {
				this.fissionData = data.list;
				this.fission_cur_total = data.total;
				this.tableLoading_fission = false;
			}
		},
		async getUserKeep() {
			this.tableLoading_keep = true;
			let postData = {
				startDate: this.keep_startDate,
				endDate: this.keep_endDate,
				page: this.keep_page,
				size: this.keep_size
			};
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/statistics/userRetentionAnalysis', postData);
			if (code == '200') {
				this.keepData = data.list;
				this.keep_cur_total = data.total;
				this.tableLoading_keep = false;
			}
		},
		async getMasterApprentice() {
			this.tableLoading_master = true;
			let postData = {
				startDate: this.master_startDate,
				endDate: this.master_endDate,
				parentUserIdType: this.selectVal,
				userId: this.select_inputId,
				page: this.master_page,
				size: this.master_size
			};
			try {
				// 查询 如果 用户不存在 返回的是400  try catch 捕获promise.reject()
				let {
					data: { code, data }
				} = await this.$axios.post(this.BASE_URL + 'admin/user/relationshipStatistics', postData);
				if (code === '200') {
					this.masterData = data.list;
					this.master_cur_total = data.total;
					this.tableLoading_master = false;
				}
			} catch (e) {
				// 清空数据 关闭加载动画
				this.masterData = [];
				this.master_cur_total = 0;
				this.tableLoading_master = false;
			}
		}
	},
	created() {
		this.getUserFission();
		this.getUserKeep();
	}
};
</script>

<style scoped="scoped">
.tabs {
	margin-top: 10px;
}
.handle-input {
	width: 200px;
	display: inline-block;
}
.handle-select {
	width: 100px;
}
.search {
	margin-top: 10px;
	margin-bottom: 10px;
}
.mr10 {
	margin-right: 10px;
}
</style>
