<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					APP广告管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="addAdvert">新增</el-button></div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="advertSpaceNo" label="编号" align="center" width="60"></el-table-column>
				<!-- <el-table-column prop="advertSpaceNo" :formatter="formatAdvertSpaceNo" label="广告位置" align="center" width="60"> -->
				<el-table-column prop="advertSpaceNo" label="广告位置" align="center" width="60"></el-table-column>
				<el-table-column prop="advertUrl" align="center" label="广告链接"></el-table-column>
				<el-table-column prop="advertImgUrl" align="center" label="广告图片">
					<template slot-scope="scope">
						<img :src="scope.row.advertImgUrl" width="40%">
					</template>
				</el-table-column>
				<el-table-column prop="advertStatus" :formatter="formatStatus" align="center" label="状态"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="edit(scope.row)">编辑</el-button>
						<el-button type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20]"
					:current-page.sync="currentPage"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="新增/编辑" width="40%" :visible.sync="dialogFormVisible">
			<el-form :model="dataForm" :label-width="formLabelWidth" :rules="rules" class="form--wrap" ref="dataForm">
				<el-form-item label="编号" prop="advertSpaceNo" :label-width="formLabelWidth">
					<el-select v-model="dataForm.advertSpaceNo" placeholder="广告编号" class="handle-select mr10">
						<el-option v-for="op in advertList" :key="op.id" :label="op.advertSpaceName" :value="op.advertSpaceNo"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="广告链接" prop="advertUrl"><el-input v-model="dataForm.advertUrl" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="广告图片链接" prop="advertImgUrl">
					<div class="upload-box">
						<div>
							<el-upload
								:action="uploadAction"
								ref="upload"
								list-type="picture-card"
								:headers="tokenObj"
								:data="uploadImgData"
								:show-file-list="false"
								:before-upload="onBeforeUploadImage"
								:on-success="
									(res, file) => {
										return fileChange(res);
									}
								"
								:on-preview="handlePictureCardPreview"
							>
								<img v-if="dataForm.advertImgUrl" :src="dataForm.advertImgUrl" class="avatar" />
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</div>
						<el-button class="upload-box-btn" @click="handleRemove">清空</el-button>
						<br>
						<div class="tip">规格750*100，大小不超过2M</div>
					</div>
				</el-form-item>
				<el-form-item>
					<el-select v-model="dataForm.advertStatus" placeholder="广告状态" class="handle-select mr10">
						<el-option v-for="op in advertStatusArr" :key="op.value" :label="op.name" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm('dataForm')">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="dialogImageVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
	</div>
</template>

<script>
export default {
	name: 'elite_club',
	data() {
		return {
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',
			page: 1,
			size: 10,
			advertStatus: '',
			cur_total: 0,
			currentPage: 1,
			tableLoading: false,
			dialogFormVisible: false,
			dialogImageVisible: false,
			dialogImageUrl: '',
			dataList: [],
			formLabelWidth: '150px',
			tokenObj: { token: localStorage.getItem('token') },
			uploadImgData: { type: '3' },
			advertList: [],
			dataForm: {
				id: '',
				advertSpaceNo: '',
				advertImgUrl: null,
				advertUrl: '',
				isCarousel: 0,
				advertStatus: ''
			},
			advertStatusArr: [
				{
					value: 1,
					name: '未上架'
				},
				{
					value: 2,
					name: '上架'
				},
				{
					value: 3,
					name: '下架'
				}
			],
			rules: {
				advertSpaceNo: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
				advertUrl: [{ required: false, message: '广告链接不能为空', trigger: 'blur' }],
				advertImgUrl: [{ required: true, message: '广告图片不能为空', trigger: 'blur' }]
			}
		};
	},
	created() {
		this.getData();
		this.getAdvertList();
	},
	methods: {
		handleCurrentChange(val) {
			this.pageNum = val;
			this.currentPage = val;
			this.getData();
		},

		handleSizeChange(val) {
			this.pageNum = 1;
			this.currentPage = 1;
			this.pageSize = val;
			this.getData();
		},

		formartCarousel(row, column, cellValue, index) {
			return cellValue === 0 ? '是' : '否';
		},
		formatStatus(row, column, cellValue, index) {
			return cellValue === 1 ? '未上架' : cellValue === 2 ? '上架' : '下架';
		},
		formatAdvertSpaceNo(row, column, cellValue, index) {
			let result = this.advertList.find(item => item.advertSpaceNo === cellValue);
			return result.advertSpaceName;
		},
		fileChange(res) {
			// index: 指向所在那个广告表单
			this.dataForm.advertImgUrl = res.data;
		},
		handleRemove(){
			this.dataForm.advertImgUrl = '';
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
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogImageVisible = true;
		},

		addAdvert() {
			if (this.dataForm.id) {
				this.dataForm = {
					id: '',
					advertSpaceNo: null,
					advertImgUrl: null,
					advertUrl: '',
					isCarousel: 0,
					advertStatus: ''
				};
			}
			this.dialogFormVisible = true;
		},
		edit(data) {
			this.dialogFormVisible = true;
			this.dataForm = Object.assign(this.dataForm, data);
		},
		handleDelete(id) {
			this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					let {
						data: { code, message }
					} = await this.$axios.post(this.BASE_URL + `admin/appAdvert/delete?id=${id}`);
					// debugger;
					if (+code === 200) {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getData();
					}
				})
				.catch(e => {});
		},
		save() {
			let postData = this.dataForm;
			this.$axios.post(this.BASE_URL + 'admin/appAdvert/saveAdvertInfo', postData).then(res => {
				if (res.data.code === '200') {
					this.$message({
						message: '保存成功',
						type: 'success'
					});
					this.getData();
					this.$refs['dataForm'].resetFields();
					setTimeout(() => {
						this.dialogFormVisible = false;
					}, 1000);
				} else {
					this.$message({
						message: '保存失败',
						type: 'error'
					});
				}
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.save();
				}
			});
		},

		async getAdvertList() {
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/appAdvert/listAllAppAdvertSpace');
			this.advertList = data;
		},

		async getData() {
			let { page, size, advertStatus, advertSpaceNo } = this;
			let postData = {
				page,
				size,
				advertStatus,
				advertSpaceNo
			};
			this.tableLoading = true;
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/appAdvert/listPageAppAdvertByCon', postData);
			this.dataList = data.list;
			this.tableLoading = false;
			this.cur_total = data.total;
		}
	}
};
</script>
<style scoped>
.handle-box {
	padding-bottom: 15px;
}
.handle-input {
	width: 200px;
	display: inline-block;
}
.mr10 {
	margin-right: 10px;
}
.el-input {
	width: 70%;
}
</style>
