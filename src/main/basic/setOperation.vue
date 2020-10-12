<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-calendar"></i>
					基本设置
				</el-breadcrumb-item>
				<el-breadcrumb-item>运营设置</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form ref="form" :inline="true" :model="form" label-width="200px">
					<el-form-item label="注册用户赠送">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.register"></el-input>
						</template>
						<template v-else>
							<span>{{ form.register + ' 元' }}</span>
						</template>
					</el-form-item>
					<!-- <el-form-item label="注册徒弟师傅奖励">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.apprenticeRegister"></el-input>
						</template>
						<template v-else>
							<span>{{ form.apprenticeRegister + ' 元' }}</span>
						</template>
					</el-form-item> -->
					<!-- <el-form-item label="每日登陆赠送">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.dailyLogIn"></el-input>
						</template>
						<template v-else>
							<span>{{ form.dailyLogIn + ' 元' }}</span>
						</template>
					</el-form-item> -->
					<el-form-item label="一级下线提成">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.stairCommission"></el-input>
						</template>
						<template v-else>
							<span>{{ (form.stairCommission * 100).toFixed(2) + ' %' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="二级下线提成">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.accessCommission"></el-input>
						</template>
						<template v-else>
							<span>{{ (form.accessCommission * 100).toFixed(2) + ' %' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="注册几天后开始扣量">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.severalDaysDeductNum"></el-input>
						</template>
						<template v-else>
							<span>{{ form.severalDaysDeductNum + ' 天' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="第一次最低提现金额">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.firstTimeCommission"></el-input>
						</template>
						<template v-else>
							<span>{{ form.firstTimeCommission + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="后续最低提现金额">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.secondlyCommission"></el-input>
						</template>
						<template v-else>
							<span>{{ form.secondlyCommission + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="广告转化率">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.advertPercentConversion"></el-input>
						</template>
						<template v-else>
							<span>{{ (form.advertPercentConversion * 100).toFixed(2) + ' %' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="广告运营扣量">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.advertDeductNum"></el-input>
						</template>
						<template v-else>
							<span>{{ (form.advertDeductNum * 100).toFixed(2) + ' %' }}</span>
						</template>
					</el-form-item>
					<!-- <el-form-item label="每阅读实际支付成本">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.averagePricePerRead"></el-input>
						</template>
						<template v-else>
							<span>{{ form.averagePricePerRead + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="VIP每阅读实际支付成本">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.vipAveragePricePerRead"></el-input>
						</template>
						<template v-else>
							<span>{{ form.vipAveragePricePerRead + ' 元' }}</span>
						</template>
					</el-form-item> -->
					<el-form-item label="提现小时">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.withdrawalHour"></el-input>
						</template>
						<template v-else>
							<span>{{ form.withdrawalHour + '小时' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="提现分钟">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.withdrawalMinute"></el-input>
						</template>
						<template v-else>
							<span>{{ form.withdrawalMinute + '分钟' }}</span>
						</template>
					</el-form-item>
					<!-- <el-form-item label="首次分享文章奖励金额">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.firstArticle"></el-input>
						</template>
						<template v-else>
							<span>{{ form.firstArticle + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="首次分享视频奖励金额">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.firstVideo"></el-input>
						</template>
						<template v-else>
							<span>{{ form.firstVideo + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="首次邀请好友奖励">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.firstApprentice"></el-input>
						</template>
						<template v-else>
							<span>{{ form.firstApprentice + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="分享文章累计阶梯1">
						<template v-if="isEdit">
							<el-input v-model="form.articleSharing1"></el-input>
						</template>
						<template v-else>
							<span>{{ form.articleSharing1 + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="分享文章累计阶梯2">
						<template v-if="isEdit">
							<el-input v-model="form.articleSharing2"></el-input>
						</template>
						<template v-else>
							<span>{{ form.articleSharing2 + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="分享文章累计阶梯3">
						<template v-if="isEdit">
							<el-input v-model="form.articleSharing3"></el-input>
						</template>
						<template v-else>
							<span>{{ form.articleSharing3 + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="分享文章累计阶梯4">
						<template v-if="isEdit">
							<el-input v-model="form.articleSharing4"></el-input>
						</template>
						<template v-else>
							<span>{{ form.articleSharing4 + ' 元' }}</span>
						</template>
					</el-form-item> -->
					<el-form-item label="每广告点击单价">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.advertPrice"></el-input>
						</template>
						<template v-else>
							<span>{{ form.advertPrice + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="每日提现次数">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.dailyWithdrawNum"></el-input>
						</template>
						<template v-else>
							<span>{{ form.dailyWithdrawNum + ' 次' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="徒弟转发分成扣量">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.prenticeForwardDivideNum"></el-input>
						</template>
						<template v-else>
							<span>{{ (form.prenticeForwardDivideNum * 100).toFixed(2) + ' %' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="徒孙转发分成扣量">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.grandsonForwardDivideNum"></el-input>
						</template>
						<template v-else>
							<span>{{ (form.grandsonForwardDivideNum * 100).toFixed(2) + ' %' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="注册刷子预期收益比">
						<template v-if="isEdit">
							<el-input class="mr10" type="number" v-model="form.registerBrushExpectRatio" @change="checked(form.registerBrushExpectRatio, 1)"></el-input>
						</template>
						<template v-else>
							<span>{{ (form.registerBrushExpectRatio * 100).toFixed(2) + ' %' }}</span>
						</template>
					</el-form-item>
					<el-form-item v-if="isEdit" style="display:block;padding-left: 200px;">
						<el-table :data="tableData1" border :show-header="false">
							<el-table-column
								v-for="(value, key) in tableData1[0]"
								:key="key + '1'"
								:width="key !== 'name' ? '50' : ''"
								:prop="key"
								align="center"
							></el-table-column>
						</el-table>
					</el-form-item>
					<el-form-item label="转赚比">
						<template v-if="isEdit">
							<el-input class="mr10" type="number" v-model="form.turnMakeRatio" @change="checked(form.turnMakeRatio, 2)"></el-input>
							<p style="color: #333333;">转赚比=收益/文章IP*支付比*单价*（1+徒弟分成+徒孙分成）</p>
						</template>
						<template v-else>
							<span>{{ (form.turnMakeRatio * 100).toFixed(2) + ' %' }}</span>
						</template>
					</el-form-item>
					<el-form-item v-if="isEdit" style="display:block;padding-left: 200px;">
						<el-table :data="tableData2" border :show-header="false">
							<el-table-column
								v-for="(value, key) in tableData2[0]"
								:key="key + '2'"
								:width="key !== 'name' ? '50' : ''"
								:prop="key"
								align="center"
							></el-table-column>
						</el-table>
					</el-form-item>
					<el-form-item label="文章单价">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.articlePrice"></el-input>
						</template>
						<template v-else>
							<span>{{ form.articlePrice + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="卡量开始金额">
						<template v-if="isEdit">
							<el-input type="number" v-model="form.frozenCapitalStart"></el-input>
						</template>
						<template v-else>
							<span>{{ form.frozenCapitalStart + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item label="卡量金额">
						<template v-if="isEdit">
							<el-input type="number" class="mr10" v-model="form.frozenCapitalSize"></el-input>
							<p style="color: #333333;">卡量开始金额4，卡量金额2，意思是从4元开始卡量，卡2元，到6元时更新收益金额。</p>
							<p style="color: #333333;">卡量开始金额与卡量金额必须一一对应</p>
						</template>
						<template v-else>
							<span>{{ form.frozenCapitalSize + ' 元' }}</span>
						</template>
					</el-form-item>
					<el-form-item style="display:block;text-align:center;">
						<el-button v-if="!isEdit" type="primary" @click="edit">修改</el-button>
						<template v-else>
							<el-button type="default" @click="reset">取消</el-button>
							<el-button type="primary" @click="confirm">确认</el-button>
						</template>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'baseform',
	data: function() {
		return {
			isEdit: false,
			originForm: {},
			form: {
				register: '',
				apprenticeRegister: '',
				dailyLogIn: '',
				stairCommission: '',
				accessCommission: '',
				firstTimeCommission: '',
				secondlyCommission: '',
				id: null,
				severalDaysDeductNum: '',
				advertPercentConversion: '',
				advertDeductNum: '',
				vipAveragePricePerRead: '',
				averagePricePerRead: '',
				withdrawalHour: '',
				withdrawalMinute: '',
				articleSharing4: '',
				articleSharing3: '',
				articleSharing2: '',
				articleSharing1: '',
				firstArticle: '',
				firstVideo: '',
				firstApprentice: '',
				advertPrice: '',
				dailyWithdrawNum: '',
				prenticeForwardDivideNum: '',
				grandsonForwardDivideNum: '',
				turnMakeRatio: '',
				registerBrushExpectRatio: '',
				// 新增
				advertPrice: '',
				frozenCapitalStart:'',
				frozenCapitalSize:''
			},
			tableData1: [],
			tableData2: []
		};
	},
	created() {
		this.getData();
	},
	methods: {
		edit() {
			let { registerBrushExpectRatio, turnMakeRatio } = this.form;
			this.checked(registerBrushExpectRatio, 1);
			this.checked(turnMakeRatio, 2);
			this.isEdit = true;
		},
		reset() {
			this.form = Object.assign({}, this.originForm);
			this.isEdit = false;
		},
		async getData() {
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/system/basic');
			this.form = Object.assign({}, data);
			this.originForm = Object.assign({}, data);
		},

		async confirm() {
			this.$confirm('此操作将更新记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					let { code, message } = await this.$axios.post(this.BASE_URL + 'admin/system/basic/update', this.form);
					this.isEdit = false;
					this.getData();
					this.$message.success(`修改成功`);
				})
				.catch(() => {});
		},
		foramatCheck(data) {
			let isExist = ['advertIncome', 'articleIncome'];
			let isExistText = ['广告收益', '转发支付'];
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
		async checked(val, type) {
			let rational = parseInt(val * 100);
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + `admin/system/abatement/generateAbatementConfig?rational=${rational}`);
			if (code === '200') {
				if (type === 1) { //转赚比
					this.tableData1 = this.foramatCheck(data);
				}
				if (type === 2) { //转赚比
					this.tableData2 = this.foramatCheck(data);
				}
			}
		}
	}
};
</script>
<style scoped>
.el-form-item__content span {
	width: 180px;
	display: inline-block;
}
.mr10 {
	margin-right: 10px;
	width: 200px;
}
</style>
