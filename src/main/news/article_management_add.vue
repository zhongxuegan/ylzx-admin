<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					文章管理
				</el-breadcrumb-item>
				<el-breadcrumb-item>
					新增文章
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="标题" prop="title"><el-input v-model="form.title" style="width: 100%;" clearable></el-input></el-form-item>
				<el-form-item label="封面" prop="coverUrl">
					<div class="upload-box">
						<div>
							<el-upload
								:action="uploadAction"
								ref="upload"
								:data="uploadImgData"
								list-type="picture-card"
								:headers="tokenObj"
								:show-file-list="false"
								:before-upload="onBeforeUploadImage"
								:on-success="(res, file) => {return fileChange(res);}">
								<img v-if="form.coverUrl" :src="form.coverUrl" class="avatar" />
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</div>
						<el-button class="upload-box-btn" @click="handleRemove">清空</el-button>
						<div class="tip">大小不超过1M</div>
					</div>
				</el-form-item>
				<el-form-item label="分类" prop="classifyIds">
					<el-checkbox-group v-model="form.classifyIds">
						<el-checkbox v-for="item in classifyList" name="classifyIds" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="form.soldOut">
						<!-- <el-option key="2" label="未上架" value="1"></el-option> -->
						<el-option key="1" label="上架" value="0"></el-option>
						<el-option key="3" label="下架" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地区标签">
					<el-checkbox-group v-model="checkedCities">
						<el-checkbox v-for="city in provinces" :label="city.name" :key="city.value">{{ city.value }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="自定义标签" prop="customLabel">
					<el-input type="text" v-model="form.customLabel"></el-input>
				</el-form-item>
				<el-form-item label="是否置顶" prop="isTop">
					<el-switch v-model="form.isTop" active-color="#ff0000" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="内容">
					<div class="edit_container">
						<tinymce ref="content" :height="300" :childHasChange="hasC" v-model="form.content" />
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="reset">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</div>
		</div>
	</div>	
</template>

<script>
import { provinces } from './data';
export default {
	name:'article_management_add',
	data(){
		return{
			hasC: false, // 富文本在编辑切换的时候不会改变，利用这个变量来控制他的改变
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',
			tokenObj: { token: localStorage.getItem('token') },
			uploadImgData: { type: '1' },
			form: {
				title: '',
				soldOut: '0',
				coverUrl: '',
				content: '',
				id: '',
				updateTime: '',
				customLabel: '',
				isTop: '0',
				classifyIds: []
			},
			rules: {
				title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
				classifyIds: [
					{
						type: 'array',
						required: true,
						message: '请至少选择一个分类',
						trigger: 'change'
					}
				]
			},
			checkedCities: [],
			classifyList: [],
			provinces: [],
		}
	},
	methods:{
		onBeforeUploadImage(file) {
			const isImg = this.isImage(file.name);
			const isLit2M = this.isLit2M(file.size);
			return isImg && isLit2M;
		},
		fileChange(res) {
			// index: 指向所在那个广告表单
			this.form.coverUrl = res.data;
		},
		handleRemove(){
			this.form.coverUrl = '';
		},
		reset(){
			this.$confirm('确定清空吗？','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(()=>{
				this.checkedCities=[];
				this.$refs.form.resetFields();
				this.$refs.content.setContent('');
			}).catch(()=>{});
		},
		submitForm() {
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$confirm('确定添加吗？','提示',{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(()=>{
						this.addArticle();
					}).catch(()=>{});
				}
			});
		},
		formatContent(content){
			return content.replace(/广告区域/g,'<h1>广告区域</h1>');
		},
		async addArticle() {
			this.form.regionLabel = this.checkedCities.length > 0 && this.checkedCities.join(',');
			let postData = JSON.parse(JSON.stringify(this.form));
			postData.content = this.formatContent(postData.content);
			let {
				data: { code }
			} = await this.$axios.post(this.BASE_URL + 'admin/article/add', postData);
			// 清空
			this.checkedCities=[];
			this.$refs.form.resetFields();
			this.$refs.content.setContent('');
			this.$message.success('添加文章成功');
		},
		async getClassifyList() {
			let postData = {
				params: {
					page: 1,
					size: 100,
					deleteFlag: '0',
					name: ''
				}
			};
			let {
				data: { code, msg, data }
			} = await this.$axios.get(this.BASE_URL + 'admin/article/classify/list', postData);
			this.classifyList = data.list;
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
	},
	created() {
		this.provinces = provinces;
		this.getClassifyList();
	},
}
</script>
