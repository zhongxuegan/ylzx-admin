<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					首页弹窗
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="addWindows">新建弹窗</el-button></div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column prop="sortNum" label="排序" align="center" width="80" sortable></el-table-column>
				<el-table-column prop="title" align="center" label="标题"></el-table-column>
				<el-table-column prop="status" align="center" label="状态" :formatter="statusFormat"></el-table-column>
				<el-table-column prop="updateTime" align="center" label="更新时间" sortable></el-table-column>
				<el-table-column prop="useType" align="center" label="针对用户" :formatter="typeFormat"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="editActivity(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
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

		<!-- 编辑弹窗 -->
		<el-dialog title="编辑弹窗" :validate-on-rule-change="false" width="70%" @closed="dialogClose" :visible.sync="dialogFormVisible">
			<el-form :model="windowsForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="windowsForm">
				<el-form-item label="标题" prop="title"><el-input v-model="windowsForm.title"></el-input></el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch v-model="windowsForm.status" active-color="#13ce66" inactive-color="#dddddd" :active-value="true" :inactive-value="false"></el-switch>
				</el-form-item>
				<el-form-item label="排序" prop="sortNum">
					<el-input-number v-model="windowsForm.sortNum" controls-position="right"></el-input-number>
				</el-form-item>
				<el-form-item label="针对用户" prop="useType">
					<el-select v-model="windowsForm.useType"><el-option label="普通用户" :value="0"></el-option></el-select>
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
				<el-form-item label="按钮名称" prop="buttonName"><el-input v-model="windowsForm.buttonName"></el-input></el-form-item>
				<el-form-item label="按钮链接" prop="buttonUrl"><el-input v-model="windowsForm.buttonUrl"></el-input></el-form-item>
				<el-form-item>
					<el-radio v-model="windowsForm.linkType" :label="1">跳转链接</el-radio>
					<el-radio v-model="windowsForm.linkType" :label="2">标签栏切换链接</el-radio>
				</el-form-item>
				<el-form-item label="文案" prop="paper"><tinymce ref="content" :height="300" :childHasChange="hasC" v-model="windowsForm.paper" /></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogClose">取 消</el-button>
				<el-button type="primary" @click="submitForm('windowsForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'home_popup_windows',
	data() {
		return {
			hasC: false,
			tableLoading: true,
			dialogFormVisible: false,
			formLabelWidth: '150px',
			page: 1,
			cur_total: 0,
			size: 10,
			tableData: [],
			windowsForm: {
				title: '',
				status: '1',
				sortNum: 1,
				useType: 0,
				imgurl: '',
				paper: '',
				isUseButton: true,
				buttonName: '我知道了',
				buttonUrl: '',
				linkType:1
			},
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',
			tokenObj: { token: localStorage.getItem('token') },
			uploadImgData: { type: '4' },
			rules: {
				title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
				status: [{ required: true, message: '请选择状态', trigger: 'change' }],
				sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
				useType: [{ required: true, message: '请选择针对用户', trigger: 'change' }],
				paper: [{ required: true, message: '请输入文案', trigger: 'blur' }],
				isUseButton: [{ required: true, message: '请选择是否有按钮', trigger: 'blur' }]
			}
		};
	},
	methods: {
		addWindows() {
			this.$router.push('/home_popup_windows_addWindows');
		},
		editActivity(row) {
			this.windowsForm = Object.assign({}, row);
			this.$nextTick(() => {
				this.$refs.windowsForm.clearValidate();
				this.$refs.content.setContent(row.paper);
			});
			this.dialogFormVisible = true;
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.size = val;
			this.getData();
		},
		dialogClose() {
			this.dialogFormVisible = false;
		},
		onBeforeUploadImage(file) {
			const isImg = this.isImage(file.name);
			const isLit2M = this.isLit2M(file.size);
			return isImg && isLit2M;
		},
		fileChange(res, file) {
			this.windowsForm.imgurl = res.data;
		},
		handleRemove(){
			this.windowsForm.imgurl = '';
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确定提交吗', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.saveWindows();
					}).catch(() => {});
				} else {
					return false;
				}
			});
		},
		async saveWindows() {
			let {
				data: { code, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/system/popout/updatePopout', this.windowsForm);
			if (code == '200') {
				this.$message.success(message);
				this.getData();
				this.dialogClose();
				return;
			}
			this.$message.error(message);
		},
		statusFormat(row, column, cellValue, index) {
			return cellValue === true ? '上架' : '下架';
		},
		typeFormat(row, column, cellValue, index) {
			return cellValue === 0 ? '普通用户' : '其他';
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
		async getData() {
			let postData = {
				page: this.page,
				size: this.size
			};
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/system/popout/listPagePopout', postData);
			if (code == '200') {
				this.tableData = data.list;
				this.cur_total = parseInt(data.total);
				this.tableLoading = false;
				return;
			}
		}
	},
	created() {
		this.getData();
	}
};
</script>