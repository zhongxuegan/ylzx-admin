<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					活动中心
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box"><el-button type="primary" icon="add" @click="handleAdd">新增</el-button></div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="id" label="ID" align="center" width="60"></el-table-column>
				<el-table-column prop="title" label="标题" align="center" width="60"></el-table-column>
				<el-table-column prop="coverPicture" align="center" label="活动封面图">
					<template slot-scope="scope">
						<img :src="scope.row.coverPicture" width="40" />
					</template>
				</el-table-column>
				<el-table-column prop="activityUrl" align="center" label="活动跳转链接"></el-table-column>
				<el-table-column prop="status" :formatter="formatStatus" align="center" label="状态"></el-table-column>
				<el-table-column prop="isTemplateActivity" label="是否为模板活动" align="center">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.isTemplateActivity" disabled active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#c1c1c1"></el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="startTime" align="center" label="活动开始时间"></el-table-column>
				<el-table-column prop="endTime" align="center" label="活动结束时间"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="edit(scope.row)">编辑</el-button>
						<!-- <el-button type="primary" @click="handleDelete(scope.row.id)">删除</el-button> -->
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
		<el-dialog title="新增/编辑" width="80%" :visible.sync="dialogFormVisible">
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
								:on-success="(res, file) => {return fileChange(res);}"
								:on-preview="handlePictureCardPreview">
								<img v-if="dataForm.coverPicture" :src="dataForm.coverPicture" class="avatar" />
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</div>
						<div class="tip">规格750*100，大小不超过2M</div>
					</div>
				</el-form-item>
				<el-form-item>
					<el-select v-model="dataForm.status" placeholder="活动状态" class="handle-select mr10">
						<el-option v-for="op in statusArr" :key="op.value" :label="op.name" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否为模板">
					<el-switch v-model="dataForm.isTemplateActivity" active-color="#13ce66" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="活动链接" prop="title"><el-input v-model="dataForm.activityUrl" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="期数" prop="periodsNum"><el-input v-model="dataForm.periodsNum" autocomplete="off"></el-input></el-form-item>
				<el-form-item prop="startTime" label="活动开始时间">
					<el-date-picker type="date" @change="startCountDateChange" value-format="yyyy-MM-dd" placeholder="选择开始日期" v-model="dataForm.startTime"></el-date-picker>
				</el-form-item>
				<el-form-item prop="endTime" label="活动结束时间">
					<el-date-picker type="date" @change="endCountDateChange" value-format="yyyy-MM-dd" placeholder="选择结束日期" v-model="dataForm.endTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="规则">
					<div class="edit_container"><tinymce :height="300" :childHasChange="hasC" v-model="dataForm.rule" /></div>
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
	name: 'activity_center',
	data() {
		return {
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',
			page: 1,
			size: 10,
			status: '',
			cur_total: 0,
			currentPage: 1,
			tableLoading: false,
			isDelete: 0,
			dialogFormVisible: false,
			hasC: false,
			dialogImageVisible: false,
			dialogImageUrl: '',
			dataList: [],
			formLabelWidth: '150px',
			tokenObj: { token: localStorage.getItem('token') },
			uploadImgData: { type: '2' },
			advertList: [],
			// pickerOptions: {
			//     disabledDate(time) {
			//       return (time.getTime() < (Date.now() - 24 *  60 * 60 * 1000));
			//     }
			// },
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
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogImageVisible = true;
		},

		handleAdd() {
			this.$router.push('/activity_center_add');
			return;
			if (this.dataForm.id) {
				this.dataForm = {
					id: '',
					title: '',
					coverPicture: null,
					status: null,
					isTemplateActivity: '0',
					activityUrl: 0,
					periodsNum: 1,
					startTime: this.dateFtt('yyyy-MM-dd', new Date(), 1),
					endTime: this.dateFtt('yyyy-MM-dd', new Date(), 1),
					rule: ''
				};
			}
			this.dialogFormVisible = true;
		},
		edit(data) {
			this.dialogFormVisible = true;
			this.dataForm = Object.assign(this.dataForm, data);
			this.dataForm.isTemplateActivity = this.dataForm.isTemplateActivity.toString();
		},
		operateList(list) {
			let that = this;
			if (!Array.isArray(list)) return;
			list.map(item => {
				item.isTemplateActivity = item.isTemplateActivity.toString();
			});
			return list;
		},
		handleDelete(id) {
			this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(async () => {
				let {
					data: { code, message }
				} = await this.$axios.post(this.BASE_URL + `admin/appAdvert/delete?id=${id}`);
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
			this.dataForm.startTime = this.dataForm.startTime + ' 00:00:00';
			this.dataForm.endTime = this.dataForm.endTime + ' 00:00:00';
			let postData = this.dataForm;

			this.$axios.post(this.BASE_URL + 'admin/activityCenter/saveActivityCenter', postData).then(res => {
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
			}).catch(console.error);
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
		startCountDateChange() {
			if (this.dataForm.startTime > this.dataForm.endTime) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
			}
		},
		endCountDateChange() {
			if (this.dataForm.startTime > this.dataForm.endTime) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
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

		async getData() {
			let { page, size, status, isDelete } = this;
			let postData = {
				page,
				size,
				status,
				isDelete
			};
			this.tableLoading = true;
			let {
				data: { data }
			} = await this.$axios.post(this.BASE_URL + 'admin/activityCenter/listPageActivityByCon', postData);
			this.dataList = this.operateList(data.list);
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
.form--wrap .line {
	text-align: center;
}
.avatar {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
