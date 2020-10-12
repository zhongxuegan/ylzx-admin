<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					广告全天分时统计
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
					placeholder="统计日期"
					v-model="countDayCon"
					class="handle-label mr10"
					@change="countDayChange"
				></el-date-picker>
				<!-- <el-select v-model="backPage" placeholder="广告展示页面" class="mr10" @change="changeBackPage">
              <el-option v-for="item in backPageList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
				<el-select v-model="adposition" placeholder="广告展示位置" class="handle-select mr10" @change="changeAdPosition">
					<el-option v-for="item in adpositionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-input v-model="adGroupIdCon" placeholder="广告主ID" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
			</div>
			<div class="container--info">
				<p>
					文章点击PV：
					<span>{{ ipCountByDay }}</span>
					文章点击IP：
					<span>{{ clientIpCount }}</span>
					每PV单价：
					<span>{{ pvUnitPriceRate }}</span>
					每IP单价：
					<span>{{ ipUnitPriceRate }}</span>
					广告点击IP：
					<span>{{ countByDay }}</span>
					广告转化率：
					<span>{{ ipPercentRate }}%</span>
					广告点击率：
					<span>{{ clickCountByDay }}</span>
					干活人数：
					<span>{{ workingPeople }}</span>
				</p>
			</div>
			<el-table
				:data="tableData"
				height="600"
				border
				class="table"
				ref="multipleTable"
				:row-class-name="tableRowClassName"
				@selection-change="handleSelectionChange"
				style="font-size: 10px"
			>
				<el-table-column prop="adGroupName" label="广告主" align="center" fixed="left">
					<template slot-scope="scope">
						<div>{{ scope.row.adGroupId }}/{{ scope.row.adGroupName }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="singleRate" label="单品点击率" width="60" align="center" fixed="left"></el-table-column>
				<el-table-column prop="total" label="合计" width="50" align="center" fixed="left"></el-table-column>
				<!-- <el-table-column prop="adId" label="广告ID" align="center"></el-table-column> -->
				<template v-for="(item, index) in hoursArr">
					<el-table-column :prop="'countHour' + index" :label="'' + index + ''" :key="index" width="50" align="center"></el-table-column>
				</template>
			</el-table>
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
			ipCountByDay: 0,
			countByDay: 0,
			clickCountByDay: '0%',
			ipPercentRate: 0, // 广告转化率
			workingPeople: 0,
			pvUnitPriceRate: 0,
			clientIpCount: 0,
			ipUnitPriceRate: 0,
			adGroupIdCon: '',
			backPage: 1,
			adposition: 2,
			adTempPosition: 2,
			countDayCon: this.$moment().format('YYYY-MM-DD'),
			backPageList: [
				{
					value: 1,
					label: '正常广告位'
				},
				{
					value: 2,
					label: '后退页广告位'
				}
			],
			adpositionList: [
				{
					value: 2,
					label: '底部'
				},
				{
					value: 4,
					label: '后退页'
				},
				{
					value: 1,
					label: '顶部banner'
				},
				{
					value: 3,
					label: '文字链接'
				},
				{
					value: 5,
					label: '底部悬浮窗'
				}
			],
			userStatusOptions: [
				{
					//0:正常 1:封杀
					value: 0,
					label: '禁用'
				},
				{
					value: 1,
					label: '正常'
				}
			],
			hoursArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
		};
	},
	created() {
		this.findCountData();
	},
	methods: {
		tableRowClassName({ row, rowIndex }) {
			if (rowIndex === 1) {
				return 'warning-row';
			} else if (rowIndex === 3) {
				return 'success-row';
			} else if (rowIndex === 5) {
				return 'success-row';
			}
			return '';
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		changeBackPage() {
			this.search();
		},
		changeAdPosition(val) {
			if (val === 4) {
				this.backPage = 2;
			} else {
				this.backPage = 1;
			}
			this.search();
		},
		search() {
			this.findCountData();
		},
		enableBuckleAmount(index, row) {
			row.buckleAmount = '0%';
		},
		convertPercent(row, column, cellValue, index) {
			return (cellValue * 100).toFixed(2) + '%';
		},
		findCountData() {
			if (this.backPage === 2) {
				this.adTempPosition = 2;
			} else {
				this.adTempPosition = this.adposition;
			}
			this.$axios
				.get(
					this.BASE_URL +
						`admin/account/countAdByYearMonthDayHour?adGroupId=${this.adGroupIdCon}&countDay=${this.countDayCon}&backPage=${this.backPage}&adPosition=${
							this.adTempPosition
						}`,
					{}
				)
				.then(res => {
					let result = res.data.data;
					const adGroupIdList = this.operateList(result.adGroupIdList, result.clientIpCount);
					result.totalCountByHour.adGroupId = '广告点击IP';
					result.ipCountByHour.adGroupId = '文章点击PV';
					result.clickRadioCountByHour.adGroupId = '广告点击率';
					let accumalatePv = this.generateAccumaltePV(result.ipCountByHour);
					adGroupIdList.push(result.totalCountByHour);
					adGroupIdList.push(result.ipCountByHour);
					adGroupIdList.push(this.operateObject(result.clickRadioCountByHour));
					adGroupIdList.push(accumalatePv);
					this.clickCountByDay = result.clickRadioCountByHour.total;
					this.countByDay = result.totalCountByHour.total;
					this.ipCountByDay = result.ipCountByHour.total;

					this.tableData = adGroupIdList;
					this.clientIpCount = result.clientIpCount;
					this.pvUnitPriceRate = result.pvUnitPriceRate;
					this.ipUnitPriceRate = result.ipUnitPriceRate;
					this.countDayCon = result.countDay;
					this.workingPeople = result.workingPeople;
					this.ipPercentRate = result.ipPercentRate;
				});
		},
		operateObject(obj) {
			if (typeof obj !== 'object') return;
			for (const key in obj) {
				if (obj.hasOwnProperty(key) && typeof obj[key] !== 'string') {
					obj[key] = (obj[key] * 100).toFixed(2) + '%';
				}
			}
			return obj;
		},

		// 时段累积pv
		generateAccumaltePV(obj) {
			let newObj = {
				adId: null,
				adGroupId: '累积PV',
				adGroupName: null,
				countHour0: 0,
				countHour1: 0,
				countHour2: 0,
				countHour3: 0,
				countHour4: 0,
				countHour5: 0,
				countHour6: 0,
				countHour7: 0,
				countHour8: 0,
				countHour9: 0,
				countHour10: 0,
				countHour11: 0,
				countHour12: 0,
				countHour13: 0,
				countHour14: 0,
				countHour15: 0,
				countHour16: 0,
				countHour17: 0,
				countHour18: 0,
				countHour19: 0,
				countHour20: 0,
				countHour21: 0,
				countHour22: 0,
				countHour23: 0
			};
			let temp = 0;
			if (typeof obj !== 'object') return;
			for (const key in obj) {
				if (obj.hasOwnProperty(key) && typeof obj[key] !== 'string') {
					if (key.indexOf('countHour') > -1 && obj[key] > 0) {
						temp += obj[key];
						newObj[key] = temp;
					} else {
						newObj[key] = 0;
					}
				}
			}
			return newObj;
		},

		operateList(list, totalIpCount) {
			if (!Array.isArray(list)) return;
			list.map(item => {
				item.singleRate = ((parseInt(item.total) / parseInt(totalIpCount)) * 100).toFixed(2) + '%';
			});
			return list;
		},
		countDayChange() {
			this.findCountData();
		}
	}
};
</script>

<style scoped>
.table .cell {
	padding-left: 2px !important;
	padding-right: 2px !important;
}
.container {
	padding: 15px;
}
.container--info {
	margin-bottom: 10px;
	line-height: 1;
}
.container--info p {
	color: #999;
}
.container--info span {
	color: #333;
	display: inline-block;
	margin-right: 10px;
}
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
	font-size: 12px;
}
.red {
	color: #ff0000;
}
.mr10 {
	margin-right: 10px;
}
</style>
