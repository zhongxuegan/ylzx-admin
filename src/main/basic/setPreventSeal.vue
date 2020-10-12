<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					防刷参数设置
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="box">
				<div>
					<label class="label">初始文章IP数</label>
					<el-input class="input" :readonly="!isEdit" v-model.number="tableData.articleIpCount"></el-input>
					<el-button v-if="!isEdit" type="warning" :disabled="!tableData.articleIpCount" @click="isEdit = true">编辑</el-button>
					<el-button v-else type="primary" @click="saveEdit">保存</el-button>
				</div>
				<el-table class="table" :data="tableData.list" :cell-style="setRowBgColor" :show-header="false" v-loading="tableLoading">
					<el-table-column>
						<template slot-scope="scope">
							{{ scope.$index + 1 + '.' + dataText[scope.$index].name }}
							<template v-if="scope.row.one">
								{{ dataText[scope.$index].one }}
								<el-input class="setInput" :readonly="!scope.row.isEdit" v-model="scope.row.one"></el-input>
							</template>
							<template v-if="scope.row.two">
								{{ dataText[scope.$index].two }}
								<el-input class="setInput" :readonly="!scope.row.isEdit" v-model="scope.row.two"></el-input>
							</template>
							<span style="font-weight: bold;">异常，</span>
							<template v-if="scope.row.three">
								{{ dataText[scope.$index].three }}
								<el-input class="setInput" :readonly="!scope.row.isEdit" v-model="scope.row.three"></el-input>
							</template>
							<template v-if="scope.row.four">
								{{ dataText[scope.$index].four }}
								<el-input class="setInput" :readonly="!scope.row.isEdit" v-model="scope.row.four"></el-input>
							</template>
							<span style="font-weight: bold;">封禁</span>
						</template>
					</el-table-column>
					<el-table-column label="" width="150">
						<template slot-scope="scope">
							<el-button v-if="!scope.row.isEdit" :type="type" @click="scope.row.isEdit = true">编辑</el-button>
							<el-button v-else type="primary" @click="save(scope.row, scope.$index)">保存</el-button>
							<el-button :type="scope.row.status === 0 ? 'info' : 'primary'" @click="operate(scope.row)">{{ scope.row.status === 0 ? '关闭' : '开启' }}</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'setPreventSeal',
	data() {
		return {
			isEdit: false,
			tableData: {
				articleIpCount: 20,
				list: [
					{
						name: 'apprenticePer',
						target: '30|50',
						status: 1,
						one: '30%',
						two: null,
						three: '50%',
						four: null,
						isEdit: false
					},
					{
						name: 'adClickRatePer',
						target: '60=5|95=30',
						status: 1,
						one: '60%',
						two: '5%',
						three: '95%',
						four: '30%',
						isEdit: false
					},
					{
						name: 'jswxRatePer',
						target: '80=180|60',
						status: 1,
						one: '80%',
						two: '180%',
						three: '60%',
						four: null,
						isEdit: false
					},
					{
						name: 'originRatePer',
						target: '80=5|90=2',
						status: 1,
						one: '80%',
						two: '5%',
						three: '90%',
						four: '2%',
						isEdit: false
					},
					{
						name: 'readMinuteSub',
						target: '0|0',
						status: 1,
						one: '0%',
						two: null,
						three: '0%',
						four: null,
						isEdit: false
					},
					{
						name: 'resolutionPer',
						target: '5|90',
						status: 1,
						one: '5%',
						two: null,
						three: '90%',
						four: null,
						isEdit: false
					},
					{
						name: 'screensPer',
						target: '600=5|800=30',
						status: 1,
						one: '600%',
						two: '5%',
						three: '800%',
						four: '30%',
						isEdit: false
					},
					{
						name: 'batteryPer',
						target: '98|95',
						status: 1,
						one: '98%',
						two: null,
						three: '95%',
						four: null,
						isEdit: false
					},
					{
						name: 'wifiPer',
						target: '80|95',
						status: 1,
						one: '80%',
						two: null,
						three: '95%',
						four: null,
						isEdit: false
					},
					{
						name: 'iosPer',
						target: '20|50',
						status: 1,
						one: '20%',
						two: null,
						three: '50%',
						four: null,
						isEdit: false
					},
					{
						name: 'shakePer',
						target: '95|92',
						status: 1,
						one: '95%',
						two: null,
						three: '92%',
						four: null,
						isEdit: false
					},
					{
						name: 'pre3DayDidPer',
						target: '95|90',
						status: 1,
						one: '95%',
						two: null,
						three: '90%',
						four: null,
						isEdit: false
					}
				]
			},
			tableLoading: true,
			type: 'warning',
			list: [
				//记录排序方式
				'apprenticePer',
				'adClickRatePer',
				'jswxRatePer',
				'originRatePer',
				'readMinuteSub',
				'resolutionPer',
				'screensPer',
				'batteryPer',
				'wifiPer',
				'iosPer',
				'shakePer',
				'pre3DayDidPer'
			],
			dataText: [
				{ name: '徒弟封禁占比，', one: '大于等于', two: null, three: '大于等于', four: null },
				{ name: '广告点击率，', one: '大于等于', two: '或小于等于', three: '大于等于', four: '或小于等于' },
				{ name: '微信返回率，', one: '小于等于', two: '或大于等于', three: '小于等于', four: null },
				{ name: '首个原文点击率，', one: '大于等于', two: '或小于等于', three: '大于等于', four: '或小于等于' },
				{ name: 'M1-M2，', one: '小于等于', two: null, three: 'M1-M3小于等于', four: null },
				{ name: '手机分辨率相同数量/文章PV，', one: '大于等于', two: null, three: '大于等于', four: null },
				{ name: '滑屏数量/文章PV，', one: '大于等于', two: '或小于等于', three: '大于等于', four: '或小于等于' },
				{ name: '电池数量/文章PV，', one: '小于等于', two: null, three: '小于等于', four: null },
				{ name: 'WiFi连接数量/文章PV，', one: '大于等于', two: null, three: '大于等于', four: null },
				{ name: 'iPhone设备数量/文章PV，', one: '大于等于', two: null, three: '大于等于', four: null },
				{ name: '陀螺仪数量/文章PV，', one: '小于等于', two: null, three: '小于等于', four: null },
				{ name: '最大相同手机指纹数量/文章PV，', one: '小于等于', two: null, three: '小于等于', four: null }
			]
		};
	},
	methods: {
		setRowBgColor({ row, column, rowIndex, columnIndex }) {
			if (rowIndex % 2 === 0) {
				return 'background:rgb(242,242,242);';
			}
			return '';
		},
		saveEdit() {
			this.$confirm('确定保存吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.submitData();
				})
				.catch(() => {});
		},
		save(row, index) {
			this.$confirm('确定保存吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.submitData(row);
				})
				.catch(() => {});
		},
		operate(row) {
			let msg;
			row.status === 0 ? (msg = '关闭') : (msg = '开启');
			this.$confirm('确定' + msg + '吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.submitData(row, true);
				})
				.catch(() => {});
		},
		formatSubmitData() {
			let { articleIpCount, list } = this.tableData;
			let postData = {
				articleIpCount
			};
			list.forEach(item => {
				let { one, two, three, four } = item;
				let target = '';
				if (one !== null) target += one.substr(0, one.indexOf('%'));
				if (two !== null) target += '=' + two.substr(0, two.indexOf('%'));
				if (three !== null) target += '|' + three.substr(0, three.indexOf('%'));
				if (four !== null) target += '=' + four.substr(0, four.indexOf('%'));
				postData[item.name] = {
					status: item.status,
					target
				};
			});
			return postData;
		},
		async submitData(row, flag) {
			let postData = this.formatSubmitData();
			if (flag) {
				for (let key in postData) {
					if (key === row.name) {
						postData[key].status === 0 ? (postData[key].status = 1) : (postData[key].status = 0);
					}
				}
			}
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/ban/saveBanTargetParameter', postData);
			if (code === '200') {
				this.$message.success(message);
				this.getdata();
				this.isEdit = false;
			}
		},
		formatTarget(target) {
			let one, two, three, four; //四个输入框
			if (target.includes('|')) {
				let targetList = target.split('|');
				let unusual = targetList[0];
				let banned = targetList[1];
				if (unusual.includes('=')) {
					one = unusual.split('=')[0] + '%';
					two = unusual.split('=')[1] + '%';
				} else {
					one = unusual + '%';
					two = null;
				}
				if (banned.includes('=')) {
					three = banned.split('=')[0] + '%';
					four = banned.split('=')[1] + '%';
				} else {
					three = banned + '%';
					four = null;
				}
			}
			return {
				one,
				two,
				three,
				four
			};
		},
		formatData(obj) {
			if (obj === null) return [];
			let newObj = {
				articleIpCount: obj.articleIpCount,
				list: []
			};
			for (let key in obj) {
				let index = this.list.indexOf(key);
				if (index !== -1) {
					let { one, two, three, four } = this.formatTarget(obj[key].target);
					newObj.list[index] = {
						name: key,
						target: obj[key].target,
						status: obj[key].status,
						one,
						two,
						three,
						four,
						isEdit: false
					};
				}
			}

			return newObj;
		},
		async getdata() {
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/ban/getBanTargetParameter');
			if (code === '200') {
				if (data !== null) {
					this.tableData = this.formatData(data);
				}
				this.tableLoading = false;
			}
		}
	},
	created() {
		this.getdata();
	}
};
</script>

<style scoped>
.box {
	width: 900px;
	margin: auto;
}
.label {
	font-size: 14px;
	margin-right: 20px;
}
.input {
	width: 200px;
	margin-right: 20px;
}
.table {
	margin-top: 10px;
}
.el-table .rowBgColor {
	background: blue !important;
}
.setInput {
	width: 70px;
	margin: 0 5px;
}
.setInput input {
	text-align: center !important;
}
</style>
