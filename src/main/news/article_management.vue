<template>
	<div class="">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					文章管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="select_start" placeholder="状态" class="handle-select mr10" @change="sortChange">
					<el-option key="0" label="全部" value></el-option>
					<el-option key="1" label="上架" value="0"></el-option>
					<!-- <el-option key="2" label="未上架" value="1"></el-option> -->
					<el-option key="3" label="下架" value="2"></el-option>
				</el-select>
				<el-select v-model="select_classify" placeholder="分类" class="handle-select mr10" @change="sortChange">
					<el-option key="0" label="全部" value=""></el-option>
					<el-option v-for="item in classifyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<el-select v-model="addMode" placeholder="上传类型" class="handle-select mr10" @change="sortChange">
					<el-option key="" label="全部" value></el-option>
					<el-option key="0" label="后台发布" value="0"></el-option>
					<el-option key="1" label="用户上传" value="1"></el-option>
				</el-select>
				<el-input v-model="select_title" clearable placeholder="文章标题/ID" class="handle-input mr10"></el-input>
				<!-- <el-input v-model="userId" placeholder="用户ID" clearable class="handle-input mr10"></el-input> -->
				<el-button type="primary" @click="search">搜索</el-button>
				<el-button type="primary" @click="handleAdd">新增</el-button>
				
				<!-- <el-button type="primary" @click="asyncHandle">同步</el-button> -->
			</div>
			<div class="handle-box">
				<el-button type="primary" @click="inc">文章导入</el-button>
				<el-button type="primary" @click="handleUpdateAll">批量操作</el-button>
				<el-button type="primary" @click="addTimeTaskArticleList">添加定时</el-button>
				<el-button type="primary" @click="handleCancel">取消定时</el-button>
				<el-button type="primary" @click="handleTopData">批量置顶</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
				<el-table-column prop="title" label="标题" align="center"></el-table-column>
				<el-table-column prop="coverUrl" label="封面图" width="80" align="center">
					<template slot-scope="scope">
						<img :src="scope.row.coverUrl" width="40" />
					</template>
				</el-table-column>
				<el-table-column prop="classify" label="分类" align="center"></el-table-column>
				<el-table-column prop="soldOutText" label="状态" align="center"></el-table-column>
				<el-table-column prop="fixState" :formatter="formatState" label="定时状态" align="center"></el-table-column>
				<el-table-column prop="addMode" :formatter="formatMode" label="添加方式" align="center"></el-table-column>
				<el-table-column prop="userId" label="用户ID" sortable align="center"></el-table-column>
				<el-table-column prop="regionLabel" label="地址标签" :formatter="formatRegion" align="center"></el-table-column>
				<el-table-column prop="customLabel" label="自定义标签" align="center"></el-table-column>
				<el-table-column prop="articlePv" label="文章pv" align="center"></el-table-column>
				<el-table-column prop="labelTime" label="标签时间" align="center" width="180"></el-table-column>
				<el-table-column prop="isTop" label="是否置顶" :formatter="formatTop" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" sortable width="180" align="center"></el-table-column>
				<el-table-column prop="fixTime" label="定时时间" sortable width="180" align="center">
					<template slot-scope="scope">
						<span width="40" v-if="scope.row.fixState === 1">{{ scope.row.fixTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					:current-page.sync="currentPage"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="sizes"
					:page-size="size"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" @close="dialogClose" :visible.sync="dialogVisible" width="80%">
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
								:on-success="(res, file) => {return fileChange(res);}"
								:on-preview="handlePictureCardPreview">
								<img v-if="form.coverUrl" :src="form.coverUrl" />
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
					<el-select v-model="form.soldOut" style="width: 100%;">
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
				<el-form-item label="自定义标签"><el-input type="text" v-model="form.customLabel"></el-input></el-form-item>
				<el-form-item label="是否置顶">
					<el-switch v-model="form.isTop" active-color="#ff0000" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="内容">
					<div class="edit_container"><tinymce :height="300" :childHasChange="hasC" v-model="form.content" /></div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 批量操作提示框 -->
		<el-dialog title="批量操作" :visible.sync="delVisible" width="300px" center>
			<el-form ref="form" :model="update_list" label-width="50px">
				<el-form-item label="状态">
					<el-select v-model="update_list.soldOut" style="width: 100%;">
						<!-- <el-option key="2" label="未上架" value="1"></el-option> -->
						<el-option key="1" label="上架" value="0"></el-option>
						<el-option key="3" label="下架" value="2"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateList">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 批量置顶 -->
		<el-dialog title="批量置顶" :visible.sync="topDialog" width="300px" center>
			<el-form ref="form" :model="topArticleForm" label-width="120px">
				<el-form-item label="置顶状态开/关">
					<el-switch v-model="topArticleForm.isTop" active-color="#ff0000" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="topDialog = false">取 消</el-button>
				<el-button type="primary" @click="setTopArticleList">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 微信导入 -->
		<el-dialog title="文章导入" :visible.sync="updatetVisible" width="80%" center>
			<el-form ref="form" :model="edit" label-width="100px">
				<el-form-item label="类型">
					<el-select v-model="edit.importType">
						<el-option value="1" label="微信公众号"></el-option>
						<el-option value="2" label="梨视频"></el-option>
						<el-option value="3" label="好看视频"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="url"><el-input v-model="edit.weChatArticleUrl" style="width: 100%;"></el-input></el-form-item>
				<el-form-item label="分类">
					<el-checkbox-group v-model="edit.classifyIds">
						<el-checkbox v-for="item in classifyList" name="wexinClassify" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="edit.soldOut" style="width: 100%;">
						<!-- <el-option key="2" label="未上架" value="1"></el-option> -->
						<el-option key="1" label="上架" value="0"></el-option>
						<el-option key="3" label="下架" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地区标签">
					<el-checkbox-group v-model="editCheckedCities">
						<el-checkbox v-for="city in provinces" :label="city.value" :key="city.value">{{ city.value }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="自定义标签"><el-input type="text" v-model="edit.customLabel"></el-input></el-form-item>
				<el-form-item label="是否置顶">
					<el-switch v-model="edit.isTop" active-color="#ff0000" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
				</el-form-item>
				<div class="" v-if="showError" style="color:red;">错误链接个数：{{ failUrlSize }}</div>
				<template v-if="failUrlList.length > 0">
					<div style="color:red;" v-for="item in failUrlList" :key="item.id">{{ item }}</div>
				</template>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="updatetVisible = false">取 消</el-button>
				<el-button @click="editWeChart">执行</el-button>
				<el-button type="primary" @click="updatetVisible = false">关闭</el-button>
			</span>
		</el-dialog>

		<el-dialog title="添加定时任务" :visible.sync="timeTaskDialog" width="30%" center="">
			<el-form ref="form" :model="timeTaskForm" label-width="100px">
				<el-form-item label="定时时间">
					<el-date-picker
						:picker-options="pickerOptions"
						v-model="timeTaskForm.fixTime"
						value-format="yyyy-MM-dd HH:mm:ss"
						type="datetime"
						placeholder="请选择日期时间"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="timeTaskDialog = false">取 消</el-button>
				<el-button type="primary" @click="addTimeTask">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="同步" :visible.sync="asyncDialog" width="50%" center>
			<el-form ref="asyncForm" :model="asyncForm" label-width="140px">
				<template v-for="item in PlatformClassifyAndPlatformId">
					<el-form-item :label="item.platformName + '文章分类'" :key="item.id">
						<el-checkbox-group v-model="item.classifyId" class="checkboxGroup">
							<el-checkbox v-for="childItem in item.list" name="wechat" :label="childItem.id" :key="childItem.id">{{ childItem.name }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</template>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="asyncDialog = false">取 消</el-button>
				<el-button type="primary" @click="asyncTask">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="dialogImageVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
	</div>
</template>

<script>
import { provinces } from './data';
export default {
	name: 'basetable',
	data() {
		return {
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',
			tokenObj: { token: localStorage.getItem('token') },
			uploadImgData: { type: '1' },
			dialogImageUrl: '',
			dialogImageVisible: false,
			hasC: false, // 富文本在编辑切换的时候不会改变，利用这个变量来控制他的改变
			url: this.BASE_URL + 'admin/article/list',
			tableData: [],
			tableLoading:true,
			currentPage: 1,
			page: 1,
			size: 10,
			sizes: [10, 20, 50, 100],
			select_start: null,
			select_title: '',
			select_classify: null,
			dialogVisible: false, //文章编辑/新增弹窗
			updatetVisible: false,
			delVisible: false,
			failUrlList: [], // 批量更新失败的集合
			failUrlSize: 0, //错误链接个数
			showError: false,
			addMode: null,
			// userId: null,
			checkedCities: [],
			editCheckedCities: [],
			topDialog: false,
			topArticleForm: {
				ids: [],
				isTop: '1'
			},
			update_list: {
				ids: [],
				soldOut: '0'
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
			edit: {
				classifyIds: [],
				soldOut: '',
				weChatArticleUrl: '',
				importType: ''
			},
			multipleSelection: [],
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
			soldObj: {
				0: '上架',
				1: '未上架',
				2: '下架'
			},
			classifyList: [],
			total: 1,
			editorOption: {
				placeholder: ''
			},
			timeTaskDialog: false,
			asyncForm: {},
			provinces: [],

			timeTaskForm: {
				ids: [],
				fixTime: '',
				fixState: 1,
				soldOut: '0'
			},
			asyncDialog: false,
			asyncList: [],
			cancelList: [],
			weChatUrlList: ['http://ky.api.zhuanfa666.com/'],
			multiPlatFormWechatUrl: [{ name: '赚元宝', url: 'http://wz.api.zhuanyuanbao.com/' }, { name: '彩虹快阅', url: 'http://ky.api.zhuanfa666.com/' }],
			platformIds: [1],
			multiPlatFormAsync: [],
			multiBatchList: ['http://ky.api.zhuanfa666.com/'],
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
				}
			},
			PlatformClassifyAndPlatformId: [],
			//所有平台的分类ID
			classifyAllArr: []
		};
	},
	created() {
		this.provinces = provinces;
		this.getData();
		this.getClassifyList();
	},
	methods: {
		// 对话框关闭的回调
		formatState(row, column, cellValue, index) {
			return cellValue === 1 ? '已启用' : cellValue === 2 ? '已取消' : '未启用';
		},
		formatTop(row, column, cellValue, index) {
			return cellValue === 1 ? '是' : '否';
		},
		formatRegion(row, column, cellValue, index) {
			return cellValue === 'false' || cellValue === 'true' ? '' : cellValue;
		},
		formatMode(row, column, cellValue, index) {
			return cellValue === 0 ? '后台发布' : cellValue === 1 ? '用户上传' : '后台发布';
		},
		dialogClose() {
			this.hasC = true;
			this.$refs['form'].resetFields();
		},

		fileChange(res) {
			// index: 指向所在那个广告表单
			this.form.coverUrl = res.data;
		},
		handleRemove(){
			this.form.coverUrl = '';
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

		// 批量置顶
		async setTopArticleList() {
			let postData = this.topArticleForm;
			let {
				data: { code }
			} = await this.$axios.post(this.BASE_URL + 'admin/article/batch/setTopArticleByIds', postData);
			if (+code === 200) {
				this.$message({
					type: 'success',
					message: '批量置顶/取消置顶成功'
				});
				this.topArticleForm.ids = [];
				this.topDialog = false;
				this.getData();
			}
		},

		// 获取批量置顶的数据
		handleTopData() {
			const length = this.multipleSelection.length;
			if (!length > 0) {
				this.$message('请先勾选要置顶的文章');
				return;
			}
			for (let i = 0; i < length; i++) {
				this.topArticleForm.ids.push(this.multipleSelection[i].id);
			}
			this.topArticleForm.isTop = '1';
			this.topDialog = true;
		},

		async getPlatformClassifyData({ platformUrl, id, platformName }) {
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
			} = await this.$axios.get(platformUrl + 'admin/article/classify/list', postData);
			this.classifyAllArr.push(data.list);
			this.PlatformClassifyAndPlatformId.push({
				list: data.list,
				platformId: id,
				platformName: platformName,
				classifyId: []
			});
		},

		async getPlatformData() {
			let postData = {
				page: 1,
				platformName: this.platformName,
				size: 100
			};
			let {
				data: {
					data: { list }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/system/listPlatformPage', postData);
			this.multiPlatFormAsync = this.filterPlatform(list);

			for (let i = 0; i < this.multiPlatFormAsync.length; i++) {
				this.getPlatformClassifyData(this.multiPlatFormAsync[i]);
			}
		},

		filterPlatform(arr) {
			let result = [];
			result = arr.filter(item => {
				return item.id !== 2;
			});
			return result;
		},

		mergePlatformClassifyAndPlatformId(platformIds, platformClassify) {
			let tempArr = [];
			for (let i = 0; i < platformIds.length; i++) {
				tempArr.push({
					list: platformClassify[i],
					platformId: platformIds[i].id,
					platformName: platformIds[i].platformName
				});
			}
			return tempArr;
		},
		generatePostData(arr) {
			let result = [];
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].classifyId.length > 0) {
					result.push({
						platformId: arr[i].platformId,
						classifyId: arr[i].classifyId
					});
				}
			}
			return result;
		},

		// 同步
		asyncHandle() {
			const length = this.multipleSelection.length;
			if (!length > 0) {
				this.$message('请先勾选要修改的文章');
				return;
			} else {
				this.asyncDialog = true;
				for (let i = 0; i < length; i++) {
					this.asyncList.push(this.multipleSelection[i].id);
				}
			}
		},
		async asyncTask() {
			let postData = this.generatePostData(this.PlatformClassifyAndPlatformId);
			// let postData = [{platformId:1,classifyId:[1,2,3]},{platformId:2,classifyId:[3,4,5]}]
			let {
				data: { code }
			} = await this.$axios.post(this.BASE_URL + `admin/skip/syncArticle?ids=${this.asyncList.join(',')}`, postData);
			if (+code === 200) {
				this.asyncDialog = false;
				this.asyncList = [];
				this.getData();
				this.$message({
					type: 'success',
					message: '同步成功'
				});
			}
		},

		handleCancel() {
			const length = this.multipleSelection.length;
			if (!length > 0) {
				this.$message('请先勾选要修改的文章');
				return;
			}
			this.$confirm('确认取消', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					for (let i = 0; i < length; i++) {
						this.cancelList.push(parseInt(this.multipleSelection[i].id));
					}

					this.cancelTask();
				})
				.catch(() => {
					this.cancelList = [];
				});
		},
		// 取消定时
		async cancelTask() {
			let postData = {
				ids: this.cancelList,
				soldOut: '1',
				fixState: '0'
			};

			let { code } = await this.$axios.post(this.BASE_URL + 'admin/article/batch/update', JSON.stringify(postData), { headers: { 'Content-Type': 'application/json' } });
			this.getData();
		},
		handleUpdateAll() {
			const length = this.multipleSelection.length;
			if (!length > 0) {
				this.$message('请先勾选要修改的文章');
				return;
			}
			for (let i = 0; i < length; i++) {
				this.update_list.ids.push(parseInt(this.multipleSelection[i].id));
			}
			this.delVisible = true;
		},
		addTimeTaskArticleList() {
			const length = this.multipleSelection.length;
			if (!length > 0) {
				this.$message('请先勾选要修改的文章');
				return;
			}
			for (let i = 0; i < length; i++) {
				this.timeTaskForm.ids.push(parseInt(this.multipleSelection[i].id));
			}
			this.timeTaskDialog = true;
		},
		updateList() {
			if (!this.update_list.ids.length > 0) {
				this.$message('文章不存在');
				return;
			}
			this.updateBatch();
		},
		// 批量更新
		async updateBatch() {
			let { code } = await this.$axios.post(this.BASE_URL + 'admin/article/batch/update', JSON.stringify(this.update_list), {
				headers: { 'Content-Type': 'application/json' }
			});
			this.getData();
			this.update_list.ids = [];
			this.delVisible = false;
		},

		//添加定时任务
		async addTimeTask() {
			try{
				let { code } = await this.$axios.post(this.BASE_URL + 'admin/article/batch/update', JSON.stringify(this.timeTaskForm), {
					headers: { 'Content-Type': 'application/json' }
				});
				this.getData();
				this.timeTaskForm.ids = [];
				this.timeTaskDialog = false;
			}catch(e){
				this.timeTaskForm.ids = [];
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		onEditorChange({ editor, html, text }) {
			this.form.content = html;
		},
		handleSizeChange(cur_size) {
			this.size = cur_size;
			this.currentPage = 1;
			this.page = 1;
			this.getData();
		},
		handleCurrentChange(cur_page) {
			this.page = cur_page;
			this.currentPage = cur_page;
			this.getData();
		},
		sortChange() {
			this.page = 1;
			this.currentPage = 1;
			this.tableLoading=true;
			this.getData();
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

		// 先从classifyList中找出含有classifyIds的数组对象
		compareList(arr) {
			let tempArr = [];
			for (let i = 0; i < arr.length; i++) {
				for (let j = 0; j < this.classifyList.length; j++) {
					if (arr[i] === this.classifyList[j].id) {
						tempArr.push(this.classifyList[j]);
					}
				}
				// let result = this.classifyList.find((item)=>{
				//    return item.sort === arr[i];
				// });
				// if(result){
				//     tempArr[i] = result;
				// }
			}
			return tempArr;
		},

		// 将找出来含有classifyIds的数组对象中的名称提取出来到一个数组
		pushNameToList(list) {
			let tempArr = [];
			if (!Array.isArray(list)) return;
			for (let i = 0; i < list.length; i++) {
				tempArr.push(list[i].name);
			}
			return tempArr;
		},

		operateList(arr) {
			if (!Array.isArray(arr)) return;
			arr.map(item => {
				item.classify = this.pushNameToList(this.compareList(item.classifyIds)).toString();
				item.soldOutText = this.soldObj[item.soldOut];
			});
			return arr;
		},
		async getData() {
			let postData = {
				params: {
					page: this.page,
					size: this.size,
					soldOut: this.select_start,
					title: this.select_title,
					classifyId: this.select_classify,
					addMode: this.addMode,
					// userId: this.userId
				}
			};
			let {
				data: {
					data: { list, total }
				}
			} = await this.$axios.get(this.url, postData);
			this.tableLoading=false;
			this.tableData = this.operateList(list);
			this.total = total;
		},
		search() {
			this.currentPage = 1;
			this.page = 1;
			this.tableLoading=true;
			this.getData();
		},
		//获取文章的富文本
		async getArticle(id) {
			let {
				data: {
					data: { content }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/article/detail/' + id, {});
			this.form.content = content;
			this.hasC = false;
		},
		handleEdit(index, row) {
			this.form = Object.assign(this.form, row);
			this.form.soldOut = this.form.soldOut.toString();
			this.form.isTop = this.form.isTop.toString();
			this.checkedCities = row.regionLabel ? row.regionLabel.split(',') : [];
			this.getArticle(row.id);
			setTimeout(() => {
				this.dialogVisible = true;
			}, 20);
		},
		handleAdd() {
			this.$router.push('/article_management_add');
		},

		inc() {
			this.edit = {
				soldOut: '上架',
				classifyIds: []
			};
			this.failUrlSize = 0;
			this.failUrlList = [];
			this.updatetVisible = true;
			this.showError = false;
		},

		editWeChart() {
			if (this.edit.weChatArticleUrl == '' || this.edit.weChatArticleUrl == null) {
				this.$message('微信地址没有填写');
				return;
			}
			if (this.edit.soldOut == '上架') {
				this.edit.soldOut = 0;
			} else if (this.edit.soldOut == '未上架') {
				this.edit.soldOut = 1;
			} else if (this.edit.soldOut == '下架') {
				this.edit.soldOut = 2;
			}
			this.edit.regionLabel = this.editCheckedCities.join(',');
			this.$axios.post(this.BASE_URL + 'admin/article/add/weChatUrl', this.edit).then(res => {
				this.showError = true;
				if (+res.data.code == 200 && +res.data.data.failUrlSize === 0) {
					this.updatetVisible = false;
					this.$message.success(`添加成功`);
					this.getData();
				} else {
					this.failUrlSize = res.data.data.failUrlSize;
					this.failUrlList = res.data.data.failUrlList;
				}
			});
		},
		formatContent(content){
			return content.replace(/广告区域/g,'<h1>广告区域</h1>');
		},
		async upadateArticle() {
			this.form.regionLabel = this.checkedCities.length > 0 && this.checkedCities.join(',');
			let postData = JSON.parse(JSON.stringify(this.form));
			postData.content = this.formatContent(postData.content);
			let {
				data: { code }
			} = await this.$axios.post(this.BASE_URL + 'admin/article/update', postData);
			this.$message.success('修改文章成功');
			this.getData();
			this.dialogVisible = false;
		},
		submitForm() {
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.upadateArticle();
				}
			});
		},
		async handleTop(data) {
			let { id, isTop } = data;
			isTop = isTop ? 0 : 1;
			let url = this.BASE_URL + `admin/article/setTopArticleById/${id}/${isTop}`;
			let {
				data: { code, message }
			} = await this.$axios.post(url, {});
			if (+code === 200) {
				this.getData();
				this.$message.success('置顶成功');
			}
		}
	}
};
</script>

<style scoped>
img {
	object-fit: contain;
}
.crop-input {
	position: absolute;
	width: 100px;
	height: 40px;
	left: 0;
	top: 0;
	opacity: 0;
	cursor: pointer;
}
.handle-box {
	margin-bottom: 15px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 200px;
	display: inline-block;
}
.del-dialog-cnt {
	font-size: 16px;
	text-align: center;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #ff0000;
}
.mr10 {
	margin-right: 10px;
}
.checkboxGroup:not(:last-child) {
	border-bottom: 1px solid #ccc;
}
.flex--wrap {
	display: flex;
	align-items: flex-end;
}
.avatar {
	width: 100%;
	height: 100%;
	display: block;
}
.avatar-uploader-icon {
	font-size: 28px;
}
</style>
