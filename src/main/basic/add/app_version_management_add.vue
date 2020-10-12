<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					app版本管理
				</el-breadcrumb-item>
				<el-breadcrumb-item>
					添加版本
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-form ref="form" :model="form" label-width="100px" :rules="rules">
				<el-form-item label="app类型" prop="appType">
					<el-select v-model="form.appType" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in appTypeOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="更新内容" prop="updateContent">
					<el-input v-model="form.updateContent" rows="3" type="textarea"></el-input>
				</el-form-item>
				<el-form-item label="更新类型" prop="updateType">
					<el-select v-model="form.updateType" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in updateTypeOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="app版本" prop="appVersion">
					<el-input v-model="form.appVersion"></el-input>
				</el-form-item>
				<el-form-item label="下载地址" prop="downloadAddress">
					<el-input v-model="form.downloadAddress"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="reset">取 消</el-button>
					<el-button type="primary" @click="save">确 定</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>	
</template>

<script>
export default {
	name:'app_version_management_add',
	data(){
		return{
			form: {
				id: '',
				appType: 1,
				updateContent: '',
				updateType: 1,
				appVersion: '',
				downloadAddress: '',
				createTime: '',
				updateTime: ''
			},
			rules:{
				appType:[{ required:true,message:'请选择app类型',trigger:'change' }],
				updateContent:[{ required:true,message:'请输入更新内容',trigger:'blur' }],
				updateType:[{ required:true,message:'请选择更新类型',trigger:'change' }],
				appVersion:[{ required:true,message:'请输入app版本',trigger:'blur' }],
				downloadAddress:[{ required:true,message:'请输入下载地址',trigger:'blur' }],
			},
			// 下拉框数据填充
			appTypeOptions: [
				//APP类型 1:android 2:ios
				{ value: 1, lable: 'android' },
				{ value: 2, lable: 'ios' }
			],
			updateTypeOptions: [
				//更新类型 1:更新 2:强制更新
				{ value: 1, lable: '更新' },
				{ value: 2, lable: '强制更新' }
			]
		}
	},
	methods:{
		reset(){
			this.$confirm('确定清空吗？','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(()=>{
				this.$refs.form.resetFields();
			}).catch(()=>{});
		},
		save(){
			this.$refs.form.validate((valid)=>{
				if(valid){
					this.$confirm('确定添加吗', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$axios.post(this.BASE_URL + 'admin/system/saveAppVersionInfo', this.form).then(res=>{
							if(res.data.code=='200')this.$refs.form.resetFields();
							this.$message.success(res.data.message);
						})
					}).catch(() => {});
				}else {
					return false;
				}
			});
		}
	},
}
</script>

<style scoped>

</style>
