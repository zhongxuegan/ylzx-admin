<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					广告位管理
				</el-breadcrumb-item>
				<el-breadcrumb-item>新增广告位</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-form label-width="100px" :inline="true" ref="advertDto" :model="advertDto" :rules="rules" class="demo-form-inline">
				<el-col :span="12">
					<el-form-item label="广告主id" prop="groupId"><el-input v-model="advertDto.groupId" style="width: 192px;"></el-input></el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="广告主名称" prop="groupName"><el-input v-model="advertDto.groupName" style="width:192px;"></el-input></el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="广告增量比例" prop="incrementPercent">
						<el-input v-model="advertDto.incrementPercent" type="number" style="width:192px;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="广告投放量" prop="purchaseCount">
						<el-input v-model="advertDto.purchaseCount" type="number" min="0" style="width: 192px;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="跳转链接" prop="skipUrl"><el-input v-model="advertDto.skipUrl" style="width: 192px;"></el-input></el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="总状态" prop="advertStatus">
						<el-select v-model="advertDto.advertStatus" @change="changeAdvertStatus" placeholder="请选择" style="width: 192px;">
							<el-option v-for="op in advertStatusSelectOption" :key="op.dictName" :label="op.dictName" :value="op.dictValue"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="备用跳转链接" prop="prepareSkipUrl"><el-input v-model="advertDto.prepareSkipUrl" style="width: 192px;"></el-input></el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="广告金额" prop="advertAmount"><el-input v-model="advertDto.advertAmount" style="width: 192px;"></el-input></el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="广告读者" prop="readerType">
						<el-select v-model="advertDto.readerType" style="width: 192px;" placeholder="请选择">
							<el-option label="全部" :value="0"></el-option>
							<el-option label="转发者" :value="1"></el-option>
							<el-option label="阅读者" :value="2"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<section style="display:block;clear:both;">
					<el-divider></el-divider>
					<p class="section--title">底部广告位</p>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-select v-model="bottomAdvert.advertSpaceStatus" @change="bottomAdvStatusChange" clearable placeholder="请选择" style="width: 192px;">
								<el-option v-for="op in advertStatusSelectOption" :key="op.dictValue" :label="op.dictName" :value="op.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序" prop="advertSort">
							<el-input v-model="bottomAdvert.advertSort" :readonly="advertSortReadonly" style="width: 192px;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="横幅展示">
							<el-switch v-model="bottomAdvert.isBanner" active-color="#13ce66" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="后退页">
							<el-switch v-model="bottomAdvert.isBackPage" active-color="#13ce66" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否描红">
							<el-switch v-model="bottomAdvert.titleIsRed" active-color="#ff0000" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否加粗">
							<el-switch v-model="bottomAdvert.titleIsStrong" active-color="#000" inactive-color="#ccc" active-value="1" inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="标题"><el-input v-model="bottomAdvert.advertTitle" style="width: 552px;"></el-input></el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="广告封面图" prop="covertPicture">
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
												return fileChange(res, file, 0);
											}
										"
									>
										<img v-if="bottomAdvert.advertCoverPicture" :src="bottomAdvert.advertCoverPicture" class="avatar" />
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</div>
								<el-button class="upload-box-btn" @click="handleRemove(0)">清空</el-button>
								<div class="tip"><p>封面图规格180*180，横幅规格750*180，大小不超过2M</p></div>
							</div>
						</el-form-item>
					</el-col>
				</section>
				<section style="display:block;clear:both;">
					<el-divider></el-divider>
					<p class="section--title">顶部Banner广告位</p>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-select v-model="topAdvert.advertSpaceStatus" clearable placeholder="请选择" style="width: 100%;">
								<el-option v-for="op in advertStatusSelectOption" :key="op.dictValue" :label="op.dictName" :value="op.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="广告封面图" prop="covertPicture">
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
												return fileChange(res, file, 1);
											}
										"
									>
										<img v-if="topAdvert.advertCoverPicture" :src="topAdvert.advertCoverPicture" class="avatar" />
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</div>
								<el-button class="upload-box-btn" @click="handleRemove(1)">清空</el-button>
								<div class="tip">封面图规格750*100，大小不超过2M</div>
							</div>
						</el-form-item>
					</el-col>
				</section>

				<section style="display:block;clear:both;">
					<el-divider></el-divider>
					<p class="section--title">悬浮广告位</p>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-select v-model="bottomFixedAdvert.advertSpaceStatus" clearable placeholder="请选择" style="width: 100%;">
								<el-option v-for="op in advertStatusSelectOption" :key="op.dictValue" :label="op.dictName" :value="op.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="广告封面图" prop="covertPicture">
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
												return fileChange(res, file, 2);
											}
										"
									>
										<img v-if="bottomFixedAdvert.advertCoverPicture" :src="bottomFixedAdvert.advertCoverPicture" class="avatar" />
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</div>
								<el-button class="upload-box-btn" @click="handleRemove(2)">清空</el-button>
								<div class="tip">封面图规格750*100，大小不超过2M</div>
							</div>
						</el-form-item>
					</el-col>
				</section>

				<section style="display:block;clear:both;">
					<el-divider></el-divider>
					<p class="section--title">文字链接广告位</p>
					<el-col :span="12">
						<el-form-item label="状态" prop="advertSpaceStatus">
							<el-select v-model="wordAdvert.advertSpaceStatus" clearable placeholder="请选择" style="width: 100%;">
								<el-option v-for="op in advertStatusSelectOption" :key="op.dictValue" :label="op.dictName" :value="op.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标题" prop="advertTitle"><el-input v-model="wordAdvert.advertTitle" style="width: 100%;"></el-input></el-form-item>
					</el-col>
				</section>
				<section style="display:block;clear:both;">
					<el-divider></el-divider>
					<p class="section--title">文章内页广告位</p>
					<el-col :span="12">
						<el-form-item label="状态" prop="advertSpaceStatus">
							<el-select v-model="articleInteriorAdvert.advertSpaceStatus" clearable placeholder="请选择" style="width: 100%;">
								<el-option v-for="op in advertStatusSelectOption" :key="op.dictValue" :label="op.dictName" :value="op.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标题" prop="advertTitle"><el-input v-model="articleInteriorAdvert.advertTitle" style="width: 100%;"></el-input></el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="广告封面图" prop="covertPicture">
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
												return fileChange(res, file, 3);
											}
										"
									>
										<img v-if="articleInteriorAdvert.advertCoverPicture" :src="articleInteriorAdvert.advertCoverPicture" class="avatar" />
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</div>
								<el-button class="upload-box-btn" @click="handleRemove(3)">清空</el-button>
								<div class="tip">封面图规格750*100，大小不超过2M</div>
							</div>
						</el-form-item>
					</el-col>
				</section>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="reset">取 消</el-button>
				<el-button type="primary" @click="handleSumbit">保 存</el-button>
			</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'advertising_position_management_add',
	data() {
		return {
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',
			tokenObj: { token: localStorage.getItem('token') },
			uploadImgData: { type: '2' },
			advertSortReadonly: true,
			advertDto: {
				groupId: -1,
				groupName: '',
				maxAdvertSort: -1,
				advertId: '',
				skipUrl: '',
				advertStatus: 2,
				purchaseCount: null,
				prepareSkipUrl: null,
				advertAmount: '',
				readerType: 0,
				advertList: []
			},
			rules: {
				groupId: [{ required: true, message: '请输入广告主ID', trigger: 'blur' }],
				groupName: [{ required: true, message: '请输入广告名称', trigger: 'blur' }],
				skipUrl: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
				advertStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
				purchaseCount: [{ required: true, message: '请输入广告投放量', trigger: 'blur' }],
				advertAmount: [{ required: true, message: '请输入广告金额', trigger: 'blur' }],
				readerType: [{ required: true, message: '请选择广告读者', trigger: 'change' }]
			},
			makeData: [
				{
					formRef: 'form1',
					formModel: {},
					advertSortInputDisable: false,
					imgFileList: [],
					formShow: true,
					formName: '第1条广告'
				}
			], // 生成表单所使用的模板
			advertStatusSelectOption: [
				{
					dictValue: 2,
					dictName: '上架'
				},
				{
					dictValue: 3,
					dictName: '下架'
				}
			], // 广告信息操作表单广告状态下拉框
			bottomAdvert: {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 2,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			},
			topAdvert: {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 1,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			},
			wordAdvert: {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 3,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			},
			bottomFixedAdvert: {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 5,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			},
			articleInteriorAdvert: {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 6,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			},
			advertMaxDto:{
				maxAdvertSort:0,
				maxGroupId:0
			}
		};
	},
	methods: {
		// 如果主广告下架，那么其他的三个部位的广告（如果有广告选择状态的话）要将它进行下架
		changeAdvertStatus() {
			if (this.advertDto.advertStatus === 3) {
				this.bottomAdvert.advertSort = -1;
				this.advertSortReadonly = true;
				if (this.bottomAdvert.advertSpaceStatus) {
					this.bottomAdvert.advertSpaceStatus = 3;
				}
				if (this.topAdvert.advertSpaceStatus) {
					this.topAdvert.advertSpaceStatus = 3;
				}
				if (this.wordAdvert.advertSpaceStatus) {
					this.wordAdvert.advertSpaceStatus = 3;
				}
				if (this.bottomFixedAdvert.advertSpaceStatus) {
					this.bottomFixedAdvert.advertSpaceStatus = 3;
				}
				if (this.articleInteriorAdvert.advertSpaceStatus) {
					this.articleInteriorAdvert.advertSpaceStatus = 3;
				}
			}
			if (this.advertDto.advertStatus === 2 && this.bottomAdvert.advertSpaceStatus === 2) {
				this.bottomAdvert.advertSort = this.advertMaxDto.maxAdvertSort + 1;
				this.advertSortReadonly = false;
			}
		},
		onBeforeUploadImage(file) {
			const isImg = this.isImage(file.name);
			const isLit2M = this.isLit2M(file.size);
			return isImg && isLit2M;
		},
		fileChange(res, file, index) {
			// index: 指向所在那个广告表单
			if (index === 0) {
				this.bottomAdvert.advertCoverPicture = res.data;
			}
			if (index === 1) {
				this.topAdvert.advertCoverPicture = res.data;
			}
			if (index === 2) {
				this.bottomFixedAdvert.advertCoverPicture = res.data;
			}
			if (index === 3) {
				this.articleInteriorAdvert.advertCoverPicture = res.data;
			}
		},
		handleRemove(index) {
			if (index === 0) {
				this.bottomAdvert.advertCoverPicture = '';
			}
			if (index === 1) {
				this.topAdvert.advertCoverPicture = '';
			}
			if (index === 2) {
				this.bottomFixedAdvert.advertCoverPicture = '';
			}
			if (index === 3) {
				this.articleInteriorAdvert.advertCoverPicture = '';
			}
		},
		// 如果用户填写了三个广告位则加入到advertList传给后台
		pushAdvertIntoAdvertList() {
			let advertId = this.findChildAdvertId();
			let result = [];
			if (this.bottomAdvert.advertSpaceStatus) {
				this.bottomAdvert.advertId = advertId;
				// this.bottomAdvert.advertCoverPicture = this.joinArrayItem(this.fileList);
				result.push(this.bottomAdvert);
			}
			if (this.topAdvert.advertSpaceStatus) {
				this.topAdvert.advertId = advertId;
				result.push(this.topAdvert);
			}
			if (this.wordAdvert.advertSpaceStatus) {
				this.wordAdvert.advertId = advertId;
				result.push(this.wordAdvert);
			}
			if (this.bottomFixedAdvert.advertSpaceStatus) {
				this.bottomFixedAdvert.advertId = advertId;
				result.push(this.bottomFixedAdvert);
			}
			if (this.articleInteriorAdvert.advertSpaceStatus) {
				this.articleInteriorAdvert.advertId = advertId;
				result.push(this.articleInteriorAdvert);
			}
			return result;
		},
		findChildAdvertId() {
			let tempAdvertId;
			if (this.bottomAdvert.advertId) {
				tempAdvertId = this.bottomAdvert.advertId;
			}
			if (this.topAdvert.advertId) {
				tempAdvertId = this.topAdvert.advertId;
			}
			if (this.wordAdvert.advertId) {
				tempAdvertId = this.wordAdvert.advertId;
			}
			if (this.bottomFixedAdvert.advertId) {
				tempAdvertId = this.bottomFixedAdvert.advertId;
			}
			if (this.articleInteriorAdvert.advertId) {
				tempAdvertId = this.articleInteriorAdvert.advertId;
			}
			return tempAdvertId;
		},
		reset() {
			this.$refs.advertDto.resetFields();
			this.bottomAdvert = {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 2,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			};
			this.topAdvert = {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 1,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			};
			this.wordAdvert = {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 3,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			};
			this.bottomFixedAdvert = {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 5,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			};
			this.articleInteriorAdvert = {
				advertId: '',
				advertSpaceStatus: null,
				advertSpaceCode: 6,
				advertTitle: '',
				advertCoverPicture: '',
				advertSort: -1,
				isBackPage: '0',
				isBanner: '0',
				titleIsRed: '0',
				titleIsStrong: '0'
			};
		},
		// 新增保存
		handleSumbit() {
			// 保存
			this.$refs['advertDto'].validate(valid => {
				if (valid) {
					this.$confirm('确认以上信息无误？提交了不能更改', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
						.then(() => {
							if (this.checkAdvert()) {
								this.advertDto.advertList = this.pushAdvertIntoAdvertList();
								this.makeData.advertDto = this.advertDto;
								this.saveAdvertInfo();
							}
						})
						.catch(error => {});
				} else {
					return false;
				}
			});
		},
		async saveAdvertInfo() {
			this.makeData[0].advertDto = this.advertDto;
			let {
				data: { code, data, message }
			} = await this.$axios.post(this.BASE_URL + 'admin/advert/space/saveAdvertInfo', this.makeData);
			if (code == '200') {
				this.$message({
					message: '新增成功',
					type: 'success'
				});
				this.reset();
				this.getData();
			} else {
				this.$message({
					message: '新增失败',
					type: 'success'
				});
			}
		},
		// 校验各个部位广告的字段
		checkAdvert() {
			let result = [];
			// 1:未上架  2:上架  3:下架
			// 如果总状态为下架状态，三个广告位状态都为上架状态 则提示总状态改成上架状态
			if (this.advertDto.advertStatus !== 2) {
				if (
					this.bottomAdvert.advertSpaceStatus === 2 ||
					this.topAdvert.advertSpaceStatus === 2 ||
					this.wordAdvert.advertSpaceStatus === 2 ||
					this.bottomFixedAdvert.advertSpaceStatus === 2 ||
					this.articleInteriorAdvert.advertSpaceStatus === 2
				) {
					result.push('总广告位与子广告位状态不一样，请修改状态');
				}
			}
			if (this.advertDto.advertStatus === 2) {
				if (
					this.bottomAdvert.advertSpaceStatus !== 2 &&
					this.topAdvert.advertSpaceStatus !== 2 &&
					this.wordAdvert.advertSpaceStatus !== 2 &&
					this.bottomFixedAdvert.advertSpaceStatus !== 2 &&
					this.articleInteriorAdvert.advertSpaceStatus !== 2
				) {
					result.push('总广告位与子广告位状态不一样，请修改状态');
				}
			}
			// 1:未上架  2:上架  3:下架
			// 底部广告
			if (this.bottomAdvert.advertSpaceStatus) {
				// this.bottomAdvert.advertCoverPicture = this.joinArrayItem(this.fileList);
				if (this.bottomAdvert.isBanner === '0') {
					if (this.bottomAdvert.advertTitle.trim() === '' || this.bottomAdvert.advertTitle === null) {
						result.push('底部广告标题不能为空');
					}
				}
				if (this.bottomAdvert.advertCoverPicture.trim() === '' || this.bottomAdvert.advertCoverPicture === null) {
					result.push('底部广告封面图不能为空');
				}
				if (this.bottomAdvert.advertSort.toString().trim() === '' || this.bottomAdvert.advertSort === null) {
					result.push('底部排序不能为空');
				}
			}
			//顶部广告
			if (this.topAdvert.advertSpaceStatus) {
				if (this.topAdvert.advertCoverPicture.trim() === '' || this.topAdvert.advertCoverPicture === null) {
					result.push('顶部广告封面图不能为空');
				}
			}
			// 文字广告
			if (this.wordAdvert.advertSpaceStatus) {
				if (this.wordAdvert.advertTitle.trim() === '' || this.wordAdvert.advertTitle === null) {
					result.push('文字广告标题不能为空');
				}
			}
			let message = result.toString();
			if (message) {
				this.$message({
					message: message,
					type: 'error'
				});
			}
			return result.length <= 0;
		},
		// 以下是校验方法
		isImage(fileName) {
			// 判断是否是图片
			var f = fileName;
			if (f == null || f == undefined || f == '') {
				return false;
			}
			if (!/\.(?:png|jpg|bmp|gif|PNG|JPG|BMP|GIF|jpeg)$/.test(f)) {
				this.$message('类型必须是图片(.png|jpg|bmp|gif|PNG|JPG|BMP|GIF)');
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
		bottomAdvStatusChange(e){
			if(e === 2 && this.advertDto.advertStatus === 2){
				this.bottomAdvert.advertSort = this.advertMaxDto.maxAdvertSort + 1;
				this.advertSortReadonly = false;
			}else{
				this.bottomAdvert.advertSort = -1;
				this.advertSortReadonly = true;
			}
		},
		async getData() {
			let {
				data: { code, data }
			} = await this.$axios.post(this.BASE_URL + 'admin/advert/space/initAdvertFromData');
			this.advertDto.groupId = data.advertMaxDto.maxGroupId + 1;
			this.advertMaxDto = data.advertMaxDto;
			this.advertStatusSelectOption = data.dictionaryList.filter(item=>{
				item.dictValue = parseInt(item.dictValue)
				if(item.dictValue !== 1)return item;
			});
		}
	},
	created() {
		this.getData();
	}
};
</script>

<style scoped>
.section--title {
	color: #000;
	font-weight: 700;
	margin-bottom: 16px;
	margin-top: -6px;
}

.tip {
	padding-left: 10px;
	color: #c0c4cc;
}
</style>
