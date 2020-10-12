<template>
	<div>
		<div class="crumbs">
		  <el-breadcrumb separator="/">
		    <el-breadcrumb-item>
				<i class="el-icon-lx-cascades"></i> 
				重置转发扣量
			</el-breadcrumb-item>
		  </el-breadcrumb>
		</div>
		<div class="container">
			<el-form ref="formData" :model="formData" label-width="180px" :rules="rules">
				<el-row>
					<el-col :span="10">
						<el-form-item label="用户ID" prop="userId">
							<el-input v-model="formData.userId"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-form-item label="重置某个用户的平台扣量标准" label-width="250px"></el-form-item>
					</el-col>
				</el-row>
				
				<el-form-item label="选择日期">
					<el-row>
						<el-col :span="8">
							<el-form-item prop="starDate">
								<el-date-picker
								  type="date"
								  value-format="yyyy-MM-dd"
								  format="yyyy-MM-dd"
								  placeholder="开始时间"
								  v-model="formData.starDate"
								  class="handle-label mr10"
								  @change="startDateChange"
								></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="2">至</el-col>
						<el-col :span="14">
							<el-form-item prop="endDate">
								<el-date-picker
								  type="date"
								  value-format="yyyy-MM-dd"
								  format="yyyy-MM-dd"
								  placeholder="结束时间"
								  v-model="formData.endDate"
								  class="handle-label mr10"
								  @change="endDateChange"
								></el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="reset('formData')">确定重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>	
</template>

<script>
export default {
	name:'reset_forward_kouliang',
	data(){
		return{
			formData:{
				userId:'',
				starDate:null,
				endDate:null
			},
			rules:{
				userId:[{required:true,message:'请输入用户ID',trigger:'blur'}],
				starDate:[{required:true,message:'请选择日期',trigger:'change'}],
				endDate:[{required:true,message:'请选择日期',trigger:'change'}],
			}
		}
	},
	methods:{
		startDateChange(name){
			if (this.formData.starDate > this.formData.endDate) {
			  this.$message({
			    message: '起始日期不得大于结束日期',
			    type: 'warning',
			  })
			  this.formData.starDate = this.formData.endDate
			}
		},
		endDateChange(name){
			if (this.formData.starDate > this.formData.endDate) {
			  this.$message({
			    message: '起始日期不得大于结束日期',
			    type: 'warning',
			  })
			  this.formData.endDate = this.formData.starDate
			}
		},
		reset(formName){
			this.$refs[formName].validate(valid=>{
				if(valid){
					this.$confirm('确定重置吗？','提示',{
						confirmButtonText:"确定",
						cancelButtonText:"取消",
						type:"warning"
					}).then(()=>{
						console.log(this.formData);
					}).catch(()=>{})
				}else{
					return false;
				}
			});
		},
	},
}
</script>

<style scoped>

</style>
