<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					下载链接统计
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="tabName">
				<el-tab-pane label="下载页数据" name="downloadData">
					<div class="handle-box">
						<el-date-picker
							type="date"
							size="small"
							value-format="yyyy-MM-dd HH:mm:ss"
							format="yyyy-MM-dd"
							placeholder="开始时间"
							v-model="downStartDate"
							class="handle-label mr10"
							@change="startDateChange('download')"
						></el-date-picker>
						<i class="line mr10">-</i>
						<el-date-picker
							type="date"
							size="small"
							value-format="yyyy-MM-dd HH:mm:ss"
							format="yyyy-MM-dd"
							placeholder="结束时间"
							v-model="downEndDate"
							class="handle-label mr10"
							@change="endDateChange('download')"
						></el-date-picker>
						<el-input v-model.number="select_userId" placeholder="用户ID" class="handle-input mr10"></el-input>
						<el-button type="primary" @click="search('download')">搜索</el-button>
						<el-button type="primary" @click="exportExcel('download')">导出</el-button>
						<span class="font-class">默认展示近7天的数据</span>
					</div>
					<el-table v-loading="tableLoading_down" :data="downloadData" border class="table" ref="multipleTable">
						<el-table-column prop="url" label="下载页链接" align="center"></el-table-column>
						<el-table-column prop="sources" label="来源" :formatter="sourcesFormat" align="center"></el-table-column>
						<el-table-column prop="generateTime" label="生成时间" align="center" sortable></el-table-column>
						<el-table-column prop="failureTime" label="失效时间" align="center" sortable></el-table-column>
						<el-table-column prop="userId" label="转发者ID" align="center" sortable></el-table-column>
						<el-table-column prop="pvValue" label="下载页PV" align="center"></el-table-column>
						<el-table-column prop="ipValue" label="下载页IP" align="center"></el-table-column>
						<el-table-column prop="buttonCheckRatio" label="下载页按钮点击量" align="center" sortable></el-table-column>
						<el-table-column prop="checkRatio" label="点击转化率" align="center" sortable></el-table-column>
						<el-table-column prop="signInValue" label="注册量" align="center" sortable></el-table-column>
						<el-table-column prop="signInRatio" label="注册转化率" align="center" sortable></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination
							background
							@current-change="handleCurrentChange($event, 'download')"
							@size-change="handleSizeChange($event, 'download')"
							layout="total, sizes, prev, pager, next, jumper"
							:page-sizes="[10, 20, 50, 100]"
							:current-page.sync="download_page"
							:total="download_cur_total"
						></el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="返回页数据" name="backData">
					<div class="handle-box">
						<el-date-picker
							type="date"
							size="small"
							value-format="yyyy-MM-dd HH:mm:ss"
							format="yyyy-MM-dd"
							placeholder="开始时间"
							v-model="backStartDate"
							class="handle-label mr10"
							@change="startDateChange('back')"
						></el-date-picker>
						<i class="line mr10">-</i>
						<el-date-picker
							type="date"
							size="small"
							value-format="yyyy-MM-dd HH:mm:ss"
							format="yyyy-MM-dd"
							placeholder="结束时间"
							v-model="backEndDate"
							class="handle-label mr10"
							@change="endDateChange('back')"
						></el-date-picker>
						<el-button type="primary" @click="search('back')">搜索</el-button>
						<el-button type="primary" @click="exportExcel('back')">导出</el-button>
						<span class="font-class">默认展示近7天的数据</span>
					</div>
					<el-table v-loading="tableLoading_back" :data="backData" border class="table" ref="multipleTable">
						<el-table-column prop="userId" label="转发者ID" align="center"></el-table-column>
						<el-table-column prop="url" label="返回页链接" align="center"></el-table-column>
						<el-table-column prop="pvValue" label="返回页PV" align="center"></el-table-column>
						<el-table-column prop="ipValue" label="返回页IP" align="center"></el-table-column>
						<el-table-column prop="buttonCheckRatio" label="返回按钮点击量" align="center" sortable></el-table-column>
						<el-table-column prop="checkRatio" label="点击转化率" align="center" sortable></el-table-column>
						<el-table-column prop="signInValue" label="注册量" align="center" sortable></el-table-column>
						<el-table-column prop="signInRatio" label="注册转化率" align="center" sortable></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination
							background
							@current-change="handleCurrentChange($event, 'back')"
							@size-change="handleSizeChange($event, 'back')"
							layout="total, sizes, prev, pager, next, jumper"
							:page-sizes="[10, 20, 50, 100]"
							:current-page.sync="back_page"
							:total="download_cur_total"
						></el-pagination>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import { getPlusTime } from '@/utils/index.js'
export default {
	name: 'download_link_statistics',
	data() {
		return {
			tabName: 'downloadData',
			downStartDate: this.$moment().subtract(7,'days').format('YYYY-MM-DD 00:00:00'),
			downEndDate: this.$moment().format('YYYY-MM-DD 00:00:00'),
			select_userId: '',
			downloadData: [],
			download_page: 1,
			download_size: 10,
			download_cur_total: 0,
			tableLoading_down: true,

			backStartDate: this.$moment().subtract(7,'days').format('YYYY-MM-DD 00:00:00'),
			backEndDate: this.$moment().format('YYYY-MM-DD 00:00:00'),
			backData: [],
			back_page: 1,
			back_size: 10,
			back_cur_total: 0,
			tableLoading_back: true
		};
	},
	methods: {
		showMsg(message) {
			this.$message({
				message,
				type: 'warning'
			});
		},
		startDateChange(name) {
			if (name === 'download') {
				if (this.downStartDate > this.downEndDate) {
					this.showMsg('起始日期不得大于结束日期');
					this.downStartDate = this.downEndDate;
				}
			}
			if (name === 'back') {
				if (this.backStartDate > this.backEndDate) {
					this.showMsg('起始日期不得大于结束日期');
					this.backStartDate = this.backEndDate;
				}
			}
		},
		endDateChange(name) {
			if (name === 'download') {
				if (this.downStartDate > this.downEndDate) {
					this.showMsg('结束日期不得小于起始日期');
					this.downEndDate = this.downStartDate;
				}
			}
			if (name === 'back') {
				if (this.backStartDate > this.backEndDate) {
					this.showMsg('结束日期不得小于起始日期');
					this.backEndDate = this.backStartDate;
				}
			}
		},
		search(tabName) {
			if (tabName === 'download') {
				this.download_page = 1;
				this.getDownloadDate();
			}
			if (tabName === 'back') {
				this.back_page = 1;
				this.getBackDate();
			}
		},
		exportExcel(tabName) {
			if (tabName === 'download') { }
			if (tabName === 'back') { }
		},
		//  当前页
		handleCurrentChange(val, tabName) {
			if (tabName === 'download') {
				this.download_page = val;
				this.getDownloadDate();
			}
			if (tabName === 'back') {
				this.back_page = val;
				this.getBackDate();
			}
		},
		// 每页条数
		handleSizeChange(val, tabName) {
			if (tabName === 'download') {
				this.download_size = val;
				this.getDownloadDate();
			}
			if (tabName === 'back') {
				this.back_size = val;
				this.getBackDate();
			}
		},
		sourcesFormat(row, column, cellValue, index) {
			const list = ['微信', '朋友圈', '海报', '面对面', '收徒分享二维码'];
			return list[cellValue - 1];
		},
		async getDownloadDate() {
			this.tableLoading_down = true;
			let postData = {
				startTime: this.downStartDate,
				endTime: this.downEndDate ? getPlusTime(this.downEndDate) : this.downEndDate,
				userId: this.select_userId,
				page: this.download_page,
				size: this.download_size,
				type: 1
			};
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/statistics/download_link', postData);
			if (code === '200') {
				this.downloadData = data.list;
				this.download_cur_total = parseInt(data.totalCount);
				this.tableLoading_down = false;
			}
		},
		async getBackDate() {
			this.tableLoading_back = true;
			let postData = {
				startTime: this.backStartDate,
				endTime: this.backEndDate ? getPlusTime(this.backEndDate) : this.backEndDate,
				page: this.back_page,
				size: this.back_size,
				type: 2
			};
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/statistics/download_link', postData);
			if (code === '200') {
				this.backData = data.list;
				this.back_cur_total = parseInt(data.totalCount);
				this.tableLoading_back = false;
			}
		}
	},
	created() {
		this.getDownloadDate();
		this.getBackDate();
	}
};
</script>

<style scoped>
.handle-input {
	width: 200px;
	display: inline-block;
}
.mr10 {
	margin-right: 10px;
}
</style>
