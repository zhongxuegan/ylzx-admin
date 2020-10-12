<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					用户数据监测
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="tabName" @tab-click="tabChange">
				<el-tab-pane label="全部用户" name="-1"></el-tab-pane>
				<el-tab-pane label="正常用户" name="1"></el-tab-pane>
				<el-tab-pane label="异常用户" name="2"></el-tab-pane>
				<el-tab-pane label="封禁用户" name="0"></el-tab-pane>
			</el-tabs>
			<div class="handle-box">
				<div>
					<span>文章IP小于等于</span>
					<el-input v-model="articleIpLt" class="handle-input mr10"></el-input>
					<span>文章IP大于等于</span>
					<el-input v-model="articleIpGt" class="handle-input mr10"></el-input>
				</div>
				<div>
					<span>广告PV小于等于</span>
					<el-input v-model="adPvLt" class="handle-input mr10"></el-input>
					<span>广告PV大于等于</span>
					<el-input v-model="adPvGt" class="handle-input mr10"></el-input>
				</div>
				<div>
					<span>广告点击率小于等于</span>
					<el-input v-model="adPvRateLt" class="handle-input mr10"></el-input>
					<span>广告点击率大于等于</span>
					<el-input v-model="adPvRateGt" class="handle-input mr10"></el-input>
				</div>
				<div>
					<span>首个原文点击率小于等于</span>
					<el-input v-model="originPvRateLt" class="handle-input mr10"></el-input>
					<span>首个原文点击率大于等于</span>
					<el-input v-model="originPvRateGt" class="handle-input mr10"></el-input>
				</div>
				<div>
					<el-date-picker
						type="date"
						size="small"
						value-format="yyyy-MM-dd"
						format="yyyy-MM-dd"
						placeholder="支付时间"
						v-model="startCountDate"
						class="handle-label mr10"
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
					></el-date-picker>
					<el-input v-model="userId" placeholder="用户ID" class="handle-input mr10"></el-input>
					<el-button type="primary" @click="search">搜索</el-button>
					<el-button type="primary" @click="exportExcel">导出</el-button>
					<span class="font-class">默认展示近7天的数据</span>
				</div>
			</div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column prop="userId" label="用户ID" align="center" sortable fixed>
					<template slot-scope="scope">
						<el-link type="primary" @click="idClick(scope.row)">{{ scope.row.userId }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" align="center">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="right">
							<div style="margin-bottom:5px;">
								<el-input type="textarea" v-model="scope.row.remark" :rows="3" v-if="scope.row.remarkEdit"></el-input>
								<p v-else>{{ scope.row.originRemark }}</p>
							</div>
							<el-button type="info" v-if="scope.row.remarkEdit" @click="cancelRemark(scope.row, scope.$index)">取消</el-button>
							<el-button type="info" v-else @click="editRemark(scope.row, scope.$index)">编辑</el-button>
							<el-button type="primary" @click="saveRemark(scope.row)">保存</el-button>
							<div slot="reference" class="name-wrapper">
								<p size="medium">{{ scope.row.originRemark ? scope.row.originRemark : '无' | formatString }}</p>
							</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="userStatus" label="状态" align="center" width="100">
					<template slot-scope="scope">
						<el-select :ref="'status' + scope.$index" v-model="scope.row.status" @change="statusChange($event, scope.$index, scope.row)">
							<el-option label="禁用" :value="0"></el-option>
							<el-option label="正常" :value="1"></el-option>
							<el-option label="异常" :value="2"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="turnMakeRatio" label="预期收益比" align="center" width="120" sortable>
					<template slot-scope="scope">
						<el-link @click="turnMakeRatioClick(scope.row)">
							{{ scope.row.turnMakeRatio + '%' }}&nbsp;&nbsp;
							<i class="el-icon-edit"></i>
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="articleIpCount" label="文章IP" align="center"></el-table-column>
				<el-table-column prop="pvCount" label="文章PV" align="center" sortable></el-table-column>
				<el-table-column prop="adCount" label="广告PV" align="center" sortable></el-table-column>
				<el-table-column prop="adConverRate" label="广告PV点击率" :formatter="addPercent" align="center" sortable></el-table-column>
				<el-table-column prop="adIpCount" label="广告IP" align="center"></el-table-column>
				<el-table-column prop="ipPercentRate" label="广告IP点击率" :formatter="addPercent" align="center" sortable></el-table-column>
				<el-table-column prop="originCount" label="首个原文查看PV" align="center" sortable></el-table-column>
				<el-table-column prop="originRate" label="首个原文PV点击率" :formatter="addPercent" align="center" sortable></el-table-column>
				<el-table-column prop="secondOriginCount" label="第二个原文查看PV" align="center" sortable></el-table-column>
				<el-table-column prop="secondOriginRate" label="第二个原文PV点击率" :formatter="addPercent" align="center" sortable></el-table-column>
				<el-table-column prop="originIpCount" label="首个原文查看IP" align="center"></el-table-column>
				<el-table-column prop="originIpRate" label="首个原文IP点击率" :formatter="addPercent" align="center" sortable></el-table-column>
				<el-table-column prop="secondOriginIpCount" label="第二个原文查看IP" align="center"></el-table-column>
				<el-table-column prop="secondOriginIpRate" label="第二个原文IP点击率" :formatter="addPercent" align="center" sortable></el-table-column>
				<el-table-column prop="jswxCount" label="微信返回按钮PV" align="center" sortable></el-table-column>
				<el-table-column prop="jswxIpCount" label="微信返回按钮IP" align="center"></el-table-column>
				<el-table-column prop="wecharBackRate" label="微信返回率" :formatter="addPercent" align="center" sortable></el-table-column>
				<el-table-column prop="userForwardValue" label="转发价值" :formatter="format" align="center" sortable></el-table-column>
				<el-table-column prop="everyIpRate" label="每IP成本" align="center" sortable></el-table-column>
				<el-table-column prop="pvIncome" label="支付IP" align="center" sortable></el-table-column>
				<el-table-column prop="pvIncomeMoney" label="支付金额" align="center" sortable></el-table-column>
				<el-table-column prop="incomeClientRate" label="支付率" :formatter="addPercent" align="center" sortable></el-table-column>
				<el-table-column prop="screensAvg" label="滑屏平均次数" align="center" sortable></el-table-column>
				<el-table-column prop="invalidCount" label="无效浏览" align="center" sortable></el-table-column>
				<el-table-column prop="m1Count" label="停留时长1分钟内" align="center" sortable></el-table-column>
				<el-table-column prop="m2Count" label="停留时长1~2分钟内" align="center" sortable></el-table-column>
				<el-table-column prop="m3Count" label="停留时长2~3分钟内" align="center" sortable></el-table-column>
				<el-table-column prop="m4Count" label="停留时长3分钟以上" align="center" sortable></el-table-column>
				<el-table-column prop="appSystemCode" label="设备类型" align="center" :formatter="formaterVersion"></el-table-column>
				<el-table-column prop="androidIosRate" label="安卓IOS打开比例" :formatter="formatNull" align="center" sortable></el-table-column>
				<el-table-column prop="netTypeRate" label="网络类型占比" :formatter="formatNull" align="center" sortable></el-table-column>
				<el-table-column prop="shakeRate" label="陀螺仪占比" align="center" sortable></el-table-column>
				<el-table-column prop="batteryRate" label="电池状态" align="center" sortable></el-table-column>
				<el-table-column prop="shareCount" label="分享文章数" :formatter="format" align="center" sortable></el-table-column>
				<el-table-column prop="maxDpiRate" label="屏幕分辨率相似比" align="center" sortable></el-table-column>
				<el-table-column prop="fingerprintsRate" label="浏览器指纹去重比例" align="center" sortable></el-table-column>
				<el-table-column prop="yearMonthDayHour" label="统计时间" align="center" sortable></el-table-column>
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

		<el-dialog title="预期收益比" :validate-on-rule-change="false" width="70%" @closed="dialogClose" :visible.sync="dialogFormVisible">
			<div style="width: 30%;margin: 0 auto 10px;">
				<el-input v-model="turnMakeRatio" @change="checked"></el-input>
			</div>
			<el-table :data="tableData2" border :show-header="false">
				<el-table-column v-for="(value, key) in tableData2[0]" :key="key + '1'" :prop="key" :width="key !== 'name' ? '58' : ''" align="center"></el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">修 改</el-button>
			</div>
		</el-dialog>

		<!-- 右侧侧滑菜单 -->
		<el-drawer :visible.sync="isShowDrawer" direction="rtl" :before-close="handleClose">
			<div class="div-scroll">
				<el-form :model="userDataForm" class="userDataForm" ref="userDataForm">
					<el-form-item label="用户ID:" prop="userId">
						<p>{{ userDataForm.userId }}</p>
					</el-form-item>
					<el-form-item label="微信昵称:" prop="nickname">
						<p>{{ userDataForm.nickname }}</p>
					</el-form-item>
					<el-form-item label="微信头像:" prop="headimgurl"><el-avatar :src="userDataForm.headimgurl" shape="square" :size="50"></el-avatar></el-form-item>
					<el-form-item label="微信所在城市:" prop="city">
						<p>{{ userDataForm.city }}</p>
					</el-form-item>
					<el-form-item label="openID:" prop="openid">
						<p>{{ userDataForm.openid }}</p>
					</el-form-item>
					<el-form-item label="手机号:" prop="mobile">
						<p>{{ userDataForm.mobile }}</p>
					</el-form-item>
					<el-form-item label="支付宝账号:" prop="alipay">
						<p>{{ userDataForm.alipay ? userDataForm.alipay : '未绑定' }}</p>
					</el-form-item>
					<el-form-item label="注册时间:" prop="addDate">
						<p>{{ userDataForm.addDate }}</p>
					</el-form-item>
					<el-form-item label="最近登录时间:" prop="maxNearLongin">
						<p>{{ userDataForm.maxNearLongin }}</p>
					</el-form-item>
					<el-form-item label="师傅ID:" prop="parentId">
						<p>{{ userDataForm.parentId }}</p>
					</el-form-item>
					<el-form-item label="徒弟数量:" prop="discipleCount">
						<p>{{ userDataForm.discipleCount }}</p>
					</el-form-item>
					<el-form-item label="徒孙数量:" prop="apprenticeCount">
						<p>{{ userDataForm.apprenticeCount }}</p>
					</el-form-item>
					<el-form-item label="总收入:" prop="totalIncome">
						<p>{{ userDataForm.totalIncome + ' 元' }}</p>
					</el-form-item>
					<el-form-item label="转发收入:" prop="totalForwardIncome">
						<p>{{ userDataForm.totalForwardIncome + ' 元' }}</p>
					</el-form-item>
					<el-form-item label="活动收入:" prop="activityAwardIncome">
						<p>{{ userDataForm.activityAwardIncome + ' 元' }}</p>
					</el-form-item>
					<el-form-item label="分成收入:" prop="totalSubDivide">
						<p>{{ userDataForm.totalSubDivide + ' 元' }}</p>
					</el-form-item>
					<el-form-item label="提现金额:" prop="withdrawable">
						<p>{{ userDataForm.withdrawable + ' 元' }}</p>
					</el-form-item>
					<el-form-item label="账户余额:" prop="balance">
						<p>{{ userDataForm.balance + ' 元' }}</p>
					</el-form-item>
					<el-form-item label="提现次数:" prop="withdrawalNum">
						<p>{{ userDataForm.withdrawalNum }}</p>
					</el-form-item>
					<el-form-item label="用户转发价值:" prop="userForwardValue">
						<p>{{ userDataForm.userForwardValue }}</p>
					</el-form-item>
					<el-form-item label="封禁总次数:" prop="bannedNum">
						<p>{{ userDataForm.bannedNum }}</p>
					</el-form-item>
					<el-form-item label="解封总次数:" prop="deblockingNum">
						<p>{{ userDataForm.deblockingNum }}</p>
					</el-form-item>
					<el-table :data="userDataForm.banUserRecordList" border class="table">
						<el-table-column label="封禁记录" align="center">
							<template slot-scope="scope">
								{{ scope.row.status !== 1 ? scope.row.banReason : '——' }}
							</template>
						</el-table-column>
						<el-table-column align="center" label="解封记录">
							<template slot-scope="scope">
								{{ scope.row.status === 1 ? scope.row.banReason : '——' }}
							</template>
						</el-table-column>
						<el-table-column prop="banTime" align="center" :formatter="dateFormat" label="日期" sortable></el-table-column>
					</el-table>
				</el-form>
			</div>
		</el-drawer>
	</div>
</template>

<script>
export default {
	name: 'user_data_monitor',
	data() {
		return {
			tableLoading: true,
			tabName: '-1',

			articleIpLt: '',
			articleIpGt: '',
			adPvLt: '',
			adPvGt: '',
			adPvRateLt: '',
			adPvRateGt: '',
			originPvRateLt: '',
			originPvRateGt: '',
			startCountDate: this.$moment()
				.subtract(7, 'days')
				.format('YYYY-MM-DD'),
			endCountDate: this.$moment().format('YYYY-MM-DD'),
			userId: null,

			tableData: [],
			page: 1,
			cur_total: 0,
			size: 10,

			// 预期收益比 弹框
			dialogFormVisible: false,
			turnMakeRatio: null,
			editUserId: null,
			id: null,
			checkData: {},
			tableData2: [],

			isShowDrawer: false,
			userDataForm: {}
		};
	},
	methods: {
		tabChange(tab) {
			this.page = 1;
			this.getData();
		},
		search() {
			this.page = 1;
			this.getData();
		},
		exportExcel() {},
		// 点击 显示 右侧抽屉
		async idClick(row) {
			let {
				data: { code, data, message }
			} = await this.$axios.get(this.BASE_URL + 'admin/user/getUserStatisticsById', { params: { userId: row.userId } });
			if (code === '200') {
				this.userDataForm = data;
				this.userDataForm.userForwardValue = row.userForwardValue;
			} else {
				this.userDataForm = {};
			}
			this.isShowDrawer = true;
		},
		editRemark(row, index) {
			this.tableData.forEach(item => {
				item.remarkEdit = false;
			});
			row.remarkEdit = true;
		},
		cancelRemark(row) {
			row.remark = row.originRemark;
			row.remarkEdit = false;
		},
		async saveRemark(row) {
			if (!row.remarkEdit) return;
			let postData = {
				userId: row.userId,
				remark: row.remark
			};
			let {
				data: { code, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/account/forceOutWecharUser', postData);
			if (code === '200') {
				row.remarkEdit = false;
				this.$message.success('保存成功');
				this.getData();
			}
		},
		async statusChange(e, index, row) {
			// 修改后的值
			let postData = {
				userId: row.userId,
				status: row.status
			};
			let {
				data: { code, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/account/forceOutWecharUser', postData);
			if (code === '200') {
				this.$message.success(message);
				this.getData();
			}
		},
		turnMakeRatioClick(row) {
			if (row.turnMakeRatio !== null || turnMakeRatio !== '') {
				this.turnMakeRatio = JSON.parse(JSON.stringify(row.turnMakeRatio));
				this.editUserId = row.userId;
				this.id = row.abatementConfigId;
				this.checked();
			}
			this.$nextTick(() => {
				this.dialogFormVisible = true;
			});
		},
		dialogClose() {
			this.dialogFormVisible = false;
		},
		foramatCheck(data) {
			const isExist = ['advertIncome', 'articleIncome'];
			const isExistText = ['广告收益', '转发支付'];
			let list = [];
			let obj = {};
			for (let key in data) {
				obj = {};
				if (isExist.includes(key)) {
					obj.name = isExistText[isExist.indexOf(key)];
					let arr = data[key].split(',');
					arr.forEach((item, index) => {
						obj['advArt' + (index + 1)] = item;
					});
					list.unshift(obj);
				}
			}
			return list;
		},
		async checked() {
			const rational = this.turnMakeRatio;
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + `admin/system/abatement/generateAbatementConfig?rational=${rational}`);
			if (code === '200') {
				this.checkData = data;
				this.tableData2 = this.foramatCheck(data);
			}
		},
		submitForm() {
			let { tableData2, checkData } = this;
			this.$confirm('确定保存吗', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					let postData = {
						userId: this.editUserId,
						id: this.id,
						turnMakeRatio: this.turnMakeRatio * 1,
						advertIncome: checkData.advertIncome,
						articleIncome: checkData.articleIncome
					};
					let {
						data: { code, message }
					} = await this.$axios.post(this.BASE_URL + 'admin/system/abatement/updateTurnMakeTatioByUId', postData);
					if (code === '200') {
						this.$message.success(message);
						this.getData();
						this.dialogFormVisible = false;
					}
				})
				.catch(() => {});
		},
		handleClose(e) {
			this.isShowDrawer = false;
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.size = val;
			this.getData();
		},
		formaterVersion(row, column, cellValue, index) {
			return cellValue === 1 ? 'android' : cellValue === 2 ? 'ios' : '未知';
		},
		// formatDate(row, column, cellValue, index) {
		// 	const yy = cellValue.substr(0, 4);
		// 	const MM = cellValue.substr(4, 2);
		// 	const dd = cellValue.substr(6, 2);
		// 	return `${yy}-${MM}-${dd}`;
		// },
		format(row, column, cellValue, index) {
			if (cellValue === null || cellValue === '') return 0;
			return cellValue;
		},
		addPercent(row, column, cellValue, index) {
			return cellValue + '%';
		},
		formatNull(row, column, cellValue, index) {
			return cellValue.replace(/null/g,0);
		},
		dateFormat(row, column, cellValue, index) {
			const yy = cellValue.substr(0, 4);
			const MM = cellValue.substr(4, 2);
			const dd = cellValue.substr(6, 2);
			const hh = cellValue.substr(8, 2);
			const mm = cellValue.substr(10, 2);
			const ss = cellValue.substr(12, 2);
			return `${yy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
		},
		async getData() {
			this.tableLoading = true;
			let {
				tabName,
				articleIpLt,
				articleIpGt,
				adPvLt,
				adPvGt,
				adPvRateLt,
				adPvRateGt,
				originPvRateLt,
				originPvRateGt,
				page,
				size,
				startCountDate,
				endCountDate,
				userId
			} = this;
			let postData = {
				status: parseInt(tabName) === -1 ? '' : parseInt(tabName),
				articleIpLt,
				articleIpGt,
				adPvLt,
				adPvGt,
				adPvRateLt,
				adPvRateGt,
				originPvRateLt,
				originPvRateGt,
				page,
				size,
				startCountDate,
				endCountDate,
				userId,
				userType: ''
			};
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/statistics/findUserDataMonitoring', postData);
			if (code == '200') {
				if (data.list !== null) {
					data.list.forEach(item => {
						item.remarkEdit = false;
						item.originRemark = item.remark;
					});
				}
				this.tableData = data.list;
				this.cur_total = data.total;
				this.tableLoading = false;
			}
		}
	},
	filters: {
		formatString: function(value) {
			if (value && value.length > 5) {
				return value.substring(0, 5) + '...';
			} else {
				return value;
			}
		}
	},
	created() {
		this.getData();
	}
};
</script>

<style scoped>
.handle-input {
	width: 150px;
}
.handle-box {
	font-size: 14px;
}
.handle-box > div {
	margin-bottom: 10px;
	font-size: 14px;
}
.handle-box span {
	display: inline-block;
	width: 180px;
	color: #333333;
}
.handle-box > div span:nth-child(3) {
	margin-left: 50px;
}
.mr10 {
	margin-right: 10px;
}
.div-scroll {
	height: 90vh;
	overflow: auto;
	padding-bottom: 10vh;
	padding-right: 15px;
}
.userDataForm {
	padding-left: 20px;
}
.hideInput {
	width: 100%;
	text-align: center;
	border: 1px solid #d9d9d9;
	outline: none;
	height: 25px;
	border-radius: 7px;
}
.hideInput:focus {
	border-color: #479ef8;
}
i {
	color: #479ef8;
}
.handle-label {
	width: 180px;
}
</style>
