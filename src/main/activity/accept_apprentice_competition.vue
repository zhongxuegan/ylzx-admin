<template>
	<div>
		<el-activity-page
			breadcrumbName="收徒大赛"
			:tableData="tableData"
			:tableConfig="tableConfig"
			:tableLoading="tableLoading"
			:page="page"
			:total="cur_total"
			@add="addActivity('/accept_apprentice_competition_add',true)"
			@lookDetail="lookDetail"
			@edit="editActivity"
			@pageChange="handleCurrentChange"
			@sizeChange="handleSizeChange"
		></el-activity-page>

		<!-- 编辑弹出框 -->
		<el-dialog title="新建活动" :validate-on-rule-change="false" width="70%" @closed="dialogClose" :visible.sync="dialogFormVisible">
			<el-form :model="activityForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="activityForm">
				<el-form-item label="期数" prop="config.num">
					<el-input-number class="inputNum" v-model="activityForm.config.num" :min="1" controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="活动名称" prop="config.title">
					<el-input v-model="activityForm.config.title"></el-input>
				</el-form-item>
				<el-form-item label="开始时间" prop="config.startTime">
					<el-date-picker
						type="datetime"
						:picker-options="pickerOptions"
						value-format="yyyy-MM-dd HH:mm:ss"
						placeholder="选择开始日期"
						@change="startDateChange"
						v-model="activityForm.config.startTime"
						:readonly="activityForm.config.status === '1' && activityForm.config.id !== ''"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="config.endTime">
					<el-date-picker
						type="datetime"
						:picker-options="pickerOptions"
						value-format="yyyy-MM-dd HH:mm:ss"
						placeholder="选择结束日期"
						@change="endDateChange"
						v-model="activityForm.config.endTime"
						:readonly="activityForm.config.status === '1' && activityForm.config.id !== ''"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch 
						v-model="activityForm.config.status" 
						active-color="#13ce66" 
						inactive-color="#dddddd" 
						active-value="1" 
						inactive-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="徒弟类型" prop="generalConfig.acceptDiscipleType">
					<el-select v-model="activityForm.generalConfig.acceptDiscipleType" placeholder="请选择徒弟类型">
						<el-option label="活动期内有提现行为的" :value="1"></el-option>
						<el-option label="活动期内新注册且有提现行为的" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="收徒奖励" style="font-weight: bold;font-size: 20px;"></el-form-item>
				<el-form-item
					v-for="(item, index) in activityForm.multiConfigs" v-if="item.type===1" :key="'acceptAward' + index" label-width="80px" >
					<el-form-item label="收徒满" 
						label-width="70px"
						class="form-item" 
						:prop="'multiConfigs.' + index + '.rankNum'" 
						:rules="[{ required: true, message: '请输入人数', trigger: 'blur' }]">
						<el-input class="input" v-model.number="item.rankNum">
							<template slot="append">人</template>
						</el-input>
					</el-form-item>
					<el-form-item 
						label="奖励" 
						label-width="60px" 
						class="form-item"
						:prop="'multiConfigs.' + index + '.awardAmt'"
						:rules="[{ required: true, message: '请输入奖励金额', trigger: 'blur' }]">
						<el-input class="input" v-model.number="item.awardAmt">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
				</el-form-item>
				<el-form-item label-width="150px">
					<el-button @click="add(1)">新增</el-button>
					<el-button @click.prevent="remove(1)">移除</el-button>
				</el-form-item>
				<el-form-item label="特别奖励" style="font-weight: bold;font-size: 20px;"></el-form-item>
				<el-form-item
					v-for="(item, index) in activityForm.multiConfigs"
					v-if="item.type===2"
					:key="'specialAward' + index"
					:label="`第${item.numberValue}名奖励金额`"
					:prop="'multiConfigs.' + index + '.awardAmt'"
					:rules="[{ required: true, message: `请输入第${item.numberValue}名奖励金额`, trigger: 'blur' }]">
					<el-input v-model.number="item.awardAmt">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="add(2)">新增</el-button>
					<el-button @click.prevent="remove(2)">移除</el-button>
				</el-form-item>
				<el-form-item label="排名" style="font-weight: bold;font-size: 20px;"></el-form-item>
				<el-form-item v-for="(item, index) in  activityForm.multiConfigs" v-if="item.type===3" :key="'ranking' + index">
					<el-form-item class="form-item" label="" :prop="'multiConfigs.' + index + '.from'">
						<el-input v-model.number="item.from" class="input inputWidth"></el-input>
					</el-form-item>
					<el-form-item label="至" :prop="'multiConfigs.' + index + '.to'" label-width="40px" class="form-item">
						<el-input v-model.number="item.to" class="input inputWidth"></el-input>
					</el-form-item>
					<el-form-item label="奖励" :prop="'multiConfigs.' + index + '.awardAmt'" label-width="50px" class="form-item">
						<el-input v-model.number="item.awardAmt" class="input">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
				</el-form-item>
				<el-form-item>
					<el-button @click="add(3)">新增</el-button>
					<el-button @click.prevent="remove(3)">移除</el-button>
				</el-form-item>
				<el-form-item label="规则" prop="config.scheme">
					<div class="edit_container">
						<tinymce ref="content" :height="300" :childHasChange="hasC" v-model="activityForm.config.scheme" />
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogClose">取 消</el-button>
				<el-button type="primary" @click="submitForm('activityForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { formatUnit } from '../../utils/index.js'
import { verifyDateMinxins, addActivityMinxins, handlePageMinxins, pickerOptionsMinxins } from './mixins/mixins.js';
export default {
	name: 'accept_apprentice_competition',
	mixins: [verifyDateMinxins, addActivityMinxins, handlePageMinxins, pickerOptionsMinxins],
	data() {
		return {
			hasC: false,
			tableLoading: true,
			tableData: [],
			tableConfig: [
				{ label: '期数', prop: 'num', sortable: true, width: '100' },
				{ label: '开始时间', prop: 'startTime', sortable: true },
				{ label: '结束时间', prop: 'endTime', sortable: true },
				{ label: '状态', prop: 'status', sortable: false, formatter: this.statusFormat }
			],
			cur_total: 0,
			page: 1,
			size: 10,
			activityForm: {
				config:{
					id:null,
					num:1,
					title:'',
					startTime:null,
					endTime:null,
					status:'0',
					scheme:'',
					type:'4'
				},
				generalConfig:{
					acceptDiscipleType:1
				},
				multiConfigs:[
					{ type:1,rankNum:null,awardAmt:null },
					{ type:1,rankNum:null,awardAmt:null },
					{ type:2,numberValue:'1',awardAmt:null },
					{ type:2,numberValue:'2',awardAmt:null },
					{ type:3,numberValue:'',from:null,to:null,awardAmt:null },
					{ type:3,numberValue:'',from:null,to:null,awardAmt:null },
				],
			},
			rules: {
				'config.title': [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				'config.startTime': [{ required: true, message: '请选择开始时间', trigger: 'change' }],
				'config.endTime': [{ required: true, message: '请选择结束时间', trigger: 'change' }],
				'config.status': [{ required: true, message: '请选择状态', trigger: 'change' }],
				'generalConfig.acceptDiscipleType': [{ required: true, message: '请选择徒弟类型', trigger: 'change' }],
			},
			dialogFormVisible: false,
			formLabelWidth: '150px',
			isDisabled: false,
		};
	},
	methods: {
		// 查看详情
		lookDetail(row) {
			this.$router.push('/accept_apprentice_competition_detail?id='+row.id+'&num='+row.num);
		},
		async editActivity(row) {
			let {
				data: { code, data, message }
			} = await this.$axios.get(this.BASE_URL + `admin/activity/config/detail?id=${row.id}`);
			if (code == '200') {
				data.multiConfigs.forEach(item=>{
					if(item.numberValue !== null){
						let value = item.numberValue.split(',');
						if(value.length >=2 ){
							item.from = value[0]
							item.to = value[1]
						}
					}
				})
				// 分 转 元
				this.activityForm = formatUnit(data,true);
				this.dialogFormVisible = true;
			}
			this.$nextTick(() => {
				this.$refs.content.setContent(data.config.scheme);
				this.$refs.activityForm.clearValidate();
			});
		},
		dialogClose() {
			this.dialogFormVisible = false;
		},
		add(type) {
			if (type ===1) {
				this.activityForm.multiConfigs.push({
					type:1,rankNum:null,awardAmt:null
				});
			}
			if (type === 2) {
				this.activityForm.multiConfigs.push({
					type:2,numberValue:(this.getTypeLength(2)+1).toString(),awardAmt:null
				});
			}
			if (type === 3) {
				this.activityForm.multiConfigs.push({
					type:3,numberValue:'',from:null,to:null,awardAmt:null
				});
			}
		},
		getTypeIndex(type){
			let typeIndex = null;
			this.activityForm.multiConfigs.forEach((item,index) => {
				if(item.type === type)typeIndex = index;
			})
			return typeIndex;
		},
		getTypeLength(type){
			return this.activityForm.multiConfigs.filter(item => {
				if(item.type === type)return item;
			}).length
		},
		remove(type) {
			if (type === 1) {
				if(this.getTypeLength(1) <= 1)return;
				this.activityForm.multiConfigs.splice(this.getTypeIndex(1),1);
			}
			if (type === 2) {
				if(this.getTypeLength(2) <= 1)return;
				this.activityForm.multiConfigs.splice(this.getTypeIndex(2),1);
			}
			if (type === 3) {
				if(this.getTypeLength(3) <= 1)return;
				this.activityForm.multiConfigs.splice(this.getTypeIndex(3),1);
			}
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确定修改吗', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.saveActivity();
					}).catch(() => {});
				} else {
					return false;
				}
			});
		},
		async saveActivity(){
			let postData = JSON.parse(JSON.stringify(this.activityForm));
			let id = postData.config.id;
			postData.multiConfigs.forEach(item => {
				if(item.from && item.to){
					item.numberValue = item.from + ',' + item.to;
					delete item.from;
					delete item.to;
				}
				if(item.numberValue === 'null')item.numberValue = null;
			});
			postData = formatUnit(postData);
			let { data:{ code,message } } = await this.$axios.post(this.BASE_URL+`admin/activity/config/update?id=${id}`,postData);
			if(code == '200'){
				this.$message.success(message);
				this.dialogFormVisible = false;
				this.getData();
			}
		},
		statusFormat(row, column, cellValue, index) {
			return cellValue === '0' ? '下架' : '上架';
		},
		async getData() {
			let params = {
				page: this.page,
				size: this.size,
				type: '4'
			};
			let {
				data: { code, data, message }
			} = await this.$axios.get(this.BASE_URL + 'admin/activity/config', { params });
			if (code == '200') {
				this.tableData = data.list;
				this.cur_total = parseInt(data.totalCount);
				this.tableLoading = false;
			}
		}
	},
	created() {
		this.getData();
	},
	activated() {
		this.getData();
	},
	components: {
		elActivityPage: () => import('./components/elActivityPage.vue')
	}
};
</script>

<style scoped="scoped">
.input {
	width: 150px;
	margin-right: 10px;
}
.inputWidth{
	width: 100px;
}
.form-item{
	display: inline-block;
	margin-bottom: -5px;
}
</style>
