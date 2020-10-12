<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					首页弹窗
				</el-breadcrumb-item>
				<el-breadcrumb-item>
					新建弹窗
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form-box">
				<el-form :model="windowsForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="windowsForm">
					<el-form-item label="标题" prop="title">
						<el-input v-model="windowsForm.title"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-switch
						  v-model="windowsForm.status"
						  active-color="#13ce66"
						  inactive-color="#dddddd"
						  :active-value="true"
						  :inactive-value="false">
						</el-switch>
					</el-form-item>
					<el-form-item label="针对用户" prop="useType">
						<el-select v-model="windowsForm.useType">
							<el-option label="普通用户" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="图片" prop="imgurl">
						<div class="upload-box">
							<el-upload
								:action="uploadAction" 
								ref="upload" 
								list-type="picture-card" 
								:headers="tokenObj" 
								:data="uploadImgData" 
								:show-file-list="false" 
								:before-upload="onBeforeUploadImage" 
								:on-success="(res, file) => {return fileChange(res, file)}">
								<img v-if="windowsForm.imgurl" :src="windowsForm.imgurl">
								<i v-else slot="default" class="el-icon-plus"></i>
							</el-upload>
							<el-button class="upload-box-btn" @click="handleRemove">清空</el-button>
						</div>
					</el-form-item>
					<el-form-item label="是否有按钮" prop="isUseButton">
						<el-switch
						  v-model="windowsForm.isUseButton"
						  active-color="#13ce66"
						  inactive-color="#dddddd"
						  :active-value="true"
						  :inactive-value="false">
						</el-switch>
					</el-form-item>
					<el-form-item label="按钮名称" prop="buttonName">
						<el-input v-model="windowsForm.buttonName"></el-input>
					</el-form-item>
					<el-form-item label="按钮链接" prop="buttonUrl">
						<el-input v-model="windowsForm.buttonUrl"></el-input>
					</el-form-item>
					<el-form-item>
						<el-radio v-model="windowsForm.linkType" :label="1">跳转链接</el-radio>
						<el-radio v-model="windowsForm.linkType" :label="2">标签栏切换链接</el-radio>
					</el-form-item>
					<el-form-item label="文案" prop="paper">
						<tinymce ref="content" :height="300" :childHasChange="hasC" v-model="windowsForm.paper" />
					</el-form-item>
					<el-form-item>
						<el-button @click="reset">取 消</el-button>
						<el-button type="primary" @click="submitForm('windowsForm')">确 定</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>	
</template>

<script>
export default {
	name:'home_popup_windows_addWindows',
	data(){
		return{
			hasC: false,
			formLabelWidth:'150px',
			windowsForm:{
				title:'',
				status:true,
				useType:0,
				imgurl:'',
				paper:'',
				isUseButton:true,
				buttonName:'我知道了',
				buttonUrl:'',
				linkType:1
			},
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',
			tokenObj: { token: localStorage.getItem("token") },
			uploadImgData: { type: "4" },
			rules:{
				title:[{ required:true,message:'请输入标题',trigger:'blur' }],
				status:[{ required:true,message:'请选择状态',trigger:'change' }],
				sortNum:[{ required:true,message:'请输入排序',trigger:'blur' }],
				useType:[{ required:true,message:'请选择针对用户',trigger:'change' }],
				paper:[{ required:true,message:'请输入文案',trigger:'blur' }],
				isUseButton:[{ required:true,message:'请选择是否有按钮',trigger:'blur' }],
			}
		}
	},
	methods:{
		handleRemove(){
			this.windowsForm.imgurl = '';
		},
		onBeforeUploadImage(file) {
		  const isImg = this.isImage(file.name);
		  const isLit2M = this.isLit2M(file.size);
		  return isImg && isLit2M;
		},
		fileChange(res) {
		  this.windowsForm.imgurl = res.data;
		},
		reset(){
			this.$confirm('确定重置吗', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(()=>{
				this.$refs.windowsForm.resetFields();
				this.$refs.content.setContent('');
			}).catch(()=>{})
		},
		submitForm(formName){
			this.$refs[formName].validate(valid=>{
				if(valid){
					this.$confirm('确定提交吗', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(()=>{
						this.saveWindows();
					}).catch(()=>{})
				}else{
					return false;
				}
			});
		},
		async saveWindows(){
			let { data:{ code,message } } = await this.$axios.post(this.BASE_URL+'admin/system/popout/addPopout',this.windowsForm);
			if(code == '200'){
				this.$message.success(message);
				this.$refs.windowsForm.resetFields();
				this.$refs.content.setContent('');
				return;
			}
			this.$message.error(message);
		},
		isImage(fileName) {
		  // 判断是否是图片
		  var f = fileName;
		  if (f == null || f == undefined || f == "") {
		    return false;
		  }
		  if (!/\.(?:png|jpg|bmp|gif|PNG|JPG|BMP|GIF|jpeg)$/.test(f)) {
		    this.$message.error("类型必须是图片(.png|jpg|bmp|gif|PNG|JPG|BMP|GIF)");
		    return false;
		  }
		  return true;
		},
		isLit2M(size) {
		  if (size / 1024 / 1024 < 2) {
		    return true;
		  } else {
		    this.$message({
		      message: "图片大小不能超过 2MB!"
		    });
		    return false;
		  }
		},
	}
}
</script>
