<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					活动中心
				</el-breadcrumb-item>
				<el-breadcrumb-item>新增活动</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-form :model="dataForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="dataForm">
				<el-form-item label="标题" prop="title"><el-input v-model="dataForm.title" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="活动封面图" prop="coverPicture">
					<div class="flex--wrap">
						<div>
							<el-upload
								:action="uploadAction"
								ref="upload"
								list-type="picture-card"
								:headers="tokenObj"
								:data="uploadImgData"
								:show-file-list="false"
								:before-upload="onBeforeUploadImage"
								:on-success="(res, file) => {return fileChange(res);}">
								<img v-if="dataForm.coverPicture" :src="dataForm.coverPicture" class="avatar" />
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</div>
						<div class="tip">规格750*100，大小不超过2M</div>
					</div>
				</el-form-item>
				<el-form-item label="活动状态" prop="status">
					<el-select v-model="dataForm.status" placeholder="活动状态" class="handle-select mr10">
						<el-option v-for="op in statusArr" :key="op.value" :label="op.name" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否为模板" prop="isTemplateActivity">
					<el-switch v-model="dataForm.isTemplateActivity" active-color="#13ce66" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="活动链接" prop="activityUrl">
					<el-input v-model="dataForm.activityUrl" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="期数" prop="periodsNum">
					<el-input v-model="dataForm.periodsNum" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item prop="startTime" label="活动开始时间">
					<el-date-picker type="date" @change="startCountDateChange" value-format="yyyy-MM-dd" placeholder="选择开始日期" v-model="dataForm.startTime"></el-date-picker>
				</el-form-item>
				<el-form-item prop="endTime" label="活动结束时间">
					<el-date-picker type="date" @change="endCountDateChange" value-format="yyyy-MM-dd" placeholder="选择结束日期" v-model="dataForm.endTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="规则">
					<div class="edit_container">
						<tinymce ref="content" :height="300" :childHasChange="hasC" v-model="dataForm.rule" />
					</div>
				</el-form-item>
				<el-form-item>
					<el-button @click="reset('dataForm')">取 消</el-button>
					<el-button type="primary" @click="submitForm('dataForm')">确 定</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
	name: '',
	data() {
		return {
			hasC: false,
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',
			formLabelWidth: '150px',
			tokenObj: { token: localStorage.getItem('token') },
			uploadImgData: { type: '2' },
			dataForm: {
				id: '',
				title: '',
				coverPicture: null,
				activityUrl: '',
				rule: '',
				status: '',
				periodsNum: 1,
				isTemplateActivity: '0',
				startTime: this.dateFtt('yyyy-MM-dd', new Date(), 1),
				endTime: this.dateFtt('yyyy-MM-dd', new Date(), 1)
			},
			statusArr: [
				{ value: 1, name: '未上架' },
				{ value: 2, name: '上架' },
				{ value: 3, name: '下架' }
			],
			rules: {
				advertSpaceNo: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
				advertUrl: [{ required: true, message: '广告链接不能为空', trigger: 'blur' }],
				advertImgUrl: [{ required: true, message: '广告图片不能为空', trigger: 'blur' }]
			}
		};
	},
	methods: {
		startCountDateChange() {
			if (this.dataForm.startTime > this.dataForm.endTime) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
				this.dataForm.startTime = this.dataForm.endTime
			}
		},
		endCountDateChange() {
			if (this.dataForm.startTime > this.dataForm.endTime) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.dataForm.endTime = this.dataForm.startTime
			}
		},
		reset(formName){
			this.$confirm('确认清空吗？','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(res=>{
				this.$refs[formName].resetFields();
				this.$refs.content.setContent("");
			}).catch(()=>{})
		},
		submitForm(formName){
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确认保存吗？','提示',{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(res=>{
						this.save();
					}).catch(()=>{})
				}
			});
		},
		save() {
			this.dataForm.startTime = this.dataForm.startTime + ' 00:00:00';
			this.dataForm.endTime = this.dataForm.endTime + ' 00:00:00';
			let postData = this.dataForm;
			this.$axios.post(this.BASE_URL + 'admin/activityCenter/saveActivityCenter', postData).then(res => {
				if (res.data.code === '200') {
					this.$message({
						message: '保存成功',
						type: 'success'
					});
					this.$refs['dataForm'].resetFields();
					this.$refs.content.setContent('');
				} else {
					this.$message({
						message: '保存失败',
						type: 'error'
					});
				}
			}).catch(console.error);
		},
		fileChange(res) {
			// index: 指向所在那个广告表单
			this.dataForm.coverPicture = res.data;
		},
		onBeforeUploadImage(file) {
			const isImg = this.isImage(file.name);
			const isLit2M = this.isLit2M(file.size);
			return isImg && isLit2M;
		},
		isImage(fileName) {
			// 判断是否是图片
			var f = fileName;
			if (f == null || f == undefined || f == '') {
				return false;
			}
			if (!/\.(?:png|jpg|bmp|gif|PNG|JPG|BMP|GIF|jpeg)$/.test(f)) {
				this.$message.error('类型必须是图片(.png|jpg|bmp|gif|PNG|JPG|BMP|GIF)');
				return false;
			}
			return true;
		},
		isLit2M(size) {
			if (size / 1024 / 1024 < 2) {
				return true;
			} else {
				this.$message({
					message: '图片大小不能超过 2MB!'
				});
				return false;
			}
		},
		dateFtt(fmt, date, monthNum) {
			var o = {
				'M+': date.getMonth() + monthNum, //月份
				'd+': date.getDate(), //日
				'h+': date.getHours(), //小时
				'm+': date.getMinutes(), //分
				's+': date.getSeconds(), //秒
				'q+': Math.floor((date.getMonth() + 3) / 3), //季度
				S: date.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
			for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
			return fmt;
		},
	}
};
</script>

<style scoped>
.flex--wrap img{
	width: 100%;
	height: 100%;
}
</style>
