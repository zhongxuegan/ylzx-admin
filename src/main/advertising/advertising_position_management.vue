<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					广告位管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="advertSpaceCode" placeholder="广告位" class="handle-select mr10" @change="changeAdvertSpaceStatus">
					<el-option v-for="op in advertSpaceCodeList" :key="op.value" :label="op.name" :value="op.value"></el-option>
				</el-select>
				<el-select v-model="advertSpaceStatus" placeholder="广告位状态" class="handle-select mr10" @change="changeStatus">
					<el-option v-for="op in advertStatusArr" :key="op.dictValue" :label="op.dictName" :value="op.dictValue"></el-option>
				</el-select>
				<el-input v-model="selectKey" clearable style="width:140px;margin-right:10px;" placeholder="广告主名称"></el-input>
				<el-input v-model="selectId" clearable style="width:140px;margin-right:10px;" placeholder="广告主ID"></el-input>
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					placeholder="开始日期"
					v-model="startTime"
					class="handle-label mr10"
					@change="startTimeChange"
				></el-date-picker>
				<i class="line mr10">-</i>
				<el-date-picker
					type="date"
					size="small"
					value-format="yyyy-MM-dd"
					format="yyyy-MM-dd"
					placeholder="结束日期"
					v-model="endTime"
					class="handle-label mr10"
					@change="endTimeChange"
				></el-date-picker>
				<el-button type="primary" @click="getData">搜索</el-button>
				<el-button type="primary" @click="handleRefresh">刷新</el-button>
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</div>
			<div class="handle-text">
				<div>总广告收入：{{ totalAdvertAmount }}</div>
				<div>总广告投放量：{{ totalPurchaseCount }}</div>
				<div>每广告点击收益：{{ totalAdvertIpAmountCount }}元</div>
			</div>
			<el-table :data="tableData" v-loading="tableLoading" border class="table" ref="multipleTable">
				<el-table-column prop="admin" label="商务ID" sortable align="center"></el-table-column>
				<el-table-column prop="advertId" label="广告ID" sortable align="center"></el-table-column>
				<el-table-column prop="groupName" label="广告主名称" align="center">
					<template slot-scope="scope">
						<div>{{ scope.row.groupId }}/{{ scope.row.groupName }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="advertTitle" label="标题" width="160" align="center">
					<template slot-scope="scope">
						<p v-bind:class="{ fontRed: scope.row.titleIsRed, fontBold: scope.row.titleIsStrong }">{{ scope.row.advertTitle }}</p>
					</template>
				</el-table-column>
				<el-table-column prop="advertCoverPicture" label="封面图" align="center">
					<template slot-scope="scope">
						<img v-for="(item, index) in scope.row.advertCoverPicture" :src="item" :key="index" width="40" />
					</template>
				</el-table-column>
				<el-table-column prop="advertSpaceCode" label="广告位置" :formatter="formaterAdvertSpaceCode" align="center"></el-table-column>
				<el-table-column prop="advertSpaceStatus" label="状态" :formatter="formaterAdvertStatus" align="center"></el-table-column>
				<el-table-column prop="isBanner" label="横幅展示" align="center">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.isBanner" disabled active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#c1c1c1"></el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="isBackPage" label="后退页" align="center">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.isBackPage" disabled active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#c1c1c1"></el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="purchaseCount" label="广告投放" align="center"></el-table-column>
				<el-table-column prop="remainPurchaseCount" label="广告剩余" align="center"></el-table-column>
				<!-- <el-table-column prop="advertStatus" label="广告状态" :formatter="formaterAdvertStatus"  align="center"> </el-table-column> -->
				<el-table-column prop="advertSort" label="排序" sortable align="center"></el-table-column>
				<el-table-column prop="eachAdvertisingCost" label="广告消耗量" align="center"></el-table-column>
				<el-table-column prop="surplusScale" label="剩余占比" align="center" :formatter="formaterPercentage"></el-table-column>
				<el-table-column prop="eachAdvertClickIncome" label="每广告点击收益" align="center"></el-table-column>
				<el-table-column prop="advertisingCost" label="广告成本" align="center"></el-table-column>
				<el-table-column prop="advertGrossProfit" label="广告毛利" align="center"></el-table-column>
				<el-table-column prop="advertClickScale" label="广告点击率" align="center" :formatter="formaterPercentage"></el-table-column>
				<el-table-column prop="skipUrl" label="跳转链接" width="160" align="center"></el-table-column>
				<el-table-column prop="prepareSkipUrl" label="备用跳转链接" width="160" align="center"></el-table-column>
				<el-table-column label="广告统计" width="180" align="center">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="handleAdvertCount(scope.$index, scope.row)">
							{{ adUrl }}?adGroupId={{ scope.row.groupId }}&purchaseCount={{ scope.row.purchaseCount }}
						</a>
					</template>
				</el-table-column>
				<el-table-column prop="readerType" label="广告读者" align="center" :formatter="formaterReader"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<!-- <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					:current-page.sync="currentPage"
					:page-size="size"
					:page-sizes="[10, 20, 50, 100]"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next, jumper"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>

		<!-- 新增弹出框 -->
		<el-dialog title="编辑" :visible.sync="addVisible" width="60%">
			<el-form label-width="100px" :inline="true" ref="advertDto" :model="advertDto" :rules="rules" class="demo-form-inline">
				<el-col :span="12">
					<el-form-item label="广告主id" prop="groupId"><el-input v-model.number="advertDto.groupId" style="width: 192px;"></el-input></el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="广告主名称" prop="groupName"><el-input v-model="advertDto.groupName" style="width:192px;"></el-input></el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="广告增量比例" prop="incrementPercent  ">
						<el-input v-model.number="advertDto.incrementPercent" type="number" style="width:192px;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="广告投放量" prop="purchaseCount">
						<el-input v-model.number="advertDto.purchaseCount" type="number" min="0" style="width: 192px;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="跳转链接" prop="skipUrl"><el-input v-model="advertDto.skipUrl" style="width: 192px;"></el-input></el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="总状态" prop="advertStatus">
						<el-select v-model="advertDto.advertStatus" @change="changeAdvertStatus" placeholder="请选择" style="width:192px;">
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
							<el-select v-model="bottomAdvert.advertSpaceStatus" placeholder="请选择" style="width: 192px;" @change="changeBottomAdvertStatus">
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
										:on-preview="handlePictureCardPreview"
									>
										<img v-if="bottomAdvert.advertCoverPicture" :src="bottomAdvert.advertCoverPicture" class="avatar" />
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</div>
								<el-button class="upload-box-btn" @click="handleRemoveImg(0)">清空</el-button>
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
							<el-select v-model="topAdvert.advertSpaceStatus" placeholder="请选择" style="width: 100%;">
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
										:on-preview="handlePictureCardPreview"
									>
										<img v-if="topAdvert.advertCoverPicture" :src="topAdvert.advertCoverPicture" class="avatar" />
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</div>
								<el-button class="upload-box-btn" @click="handleRemoveImg(1)">清空</el-button>
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
							<el-select v-model="bottomFixedAdvert.advertSpaceStatus" placeholder="请选择" style="width: 100%;">
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
										:on-preview="handlePictureCardPreview"
									>
										<img v-if="bottomFixedAdvert.advertCoverPicture" :src="bottomFixedAdvert.advertCoverPicture" class="avatar" />
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</div>
								<el-button class="upload-box-btn" @click="handleRemoveImg(2)">清空</el-button>
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
							<el-select v-model="wordAdvert.advertSpaceStatus" placeholder="请选择" style="width: 100%;">
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
							<el-select v-model="articleInteriorAdvert.advertSpaceStatus" placeholder="请选择" style="width: 100%;">
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
										:on-preview="handlePictureCardPreview"
									>
										<img v-if="articleInteriorAdvert.advertCoverPicture" :src="articleInteriorAdvert.advertCoverPicture" class="avatar" />
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</div>
								<el-button class="upload-box-btn" @click="handleRemoveImg(3)">清空</el-button>
								<div class="tip">封面图规格750*100，大小不超过2M</div>
							</div>
						</el-form-item>
					</el-col>
				</section>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSumbit">保 存</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="dialogImageVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
	</div>
</template>

<script>
export default {
	name: 'basetable',
	data() {
		return {
			// adUrl: 'http://wz.ad.dawenzz.com.cn/advert_count.html',
			adUrl: 'http://test.wz3.ad.sharing662.com/advert_count.html',
			uploadAction: this.BASE_URL + 'admin/upload/uploadImgByType',

			// 筛选字段
			advertSpaceCode: 2,
			advertSpaceStatus: 2, //广告位状态
			selectId: '', //广告主id
			selectKey: '', //广告主名称
			startTime: null,
			endTime: null,

			totalAdvertAmount: 0,
			totalAdvertIpAmountCount: 0,
			totalPurchaseCount: 0,

			advertSortReadonly: true,
			fileList: [],
			tableData: [], // 表格数据
			tableLoading: true,
			page: 1, // 当前页号
			currentPage: 1,
			cur_total: 0, // 总记录数
			page_size: 50,
			multipleSelection: [],
			tokenObj: { token: localStorage.getItem('token') },
			uploadImgData: { type: '2' },
			select_cate: '',
			select_word: '',
			del_list: [],
			editVisible: false, // 不显示编辑窗口
			delVisible: false,
			size: 10,
			advertStatus: null, //默认广告状态为上架
			isBackPage: '',
			adTempPosition: 2,
			advertId: null,
			addVisible: false, // 不显示广告信息操作表单
			dialogImageUrl: '',
			dialogImageVisible: false,
			advertStatusArr: [
				{
					dictValue: '',
					dictName: '全部'
				},
				{
					dictValue: 2,
					dictName: '上架'
				},
				{
					dictValue: 3,
					dictName: '下架'
				}
			],
			advertSpaceCodeList: [
				{ value: 1, name: '顶部banner' },
				{ value: 2, name: '底部' },
				{ value: 3, name: '文字链接' },
				{ value: 4, name: '后退页' },
				{ value: 5, name: '底部悬浮窗' },
				{ value: 6, name: '文章内页' }
			],
			backPageList: [{ value: '', name: '全部' }, { value: '1', name: '展示' }, { value: '0', name: '不展示' }],
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
				readerType: '',
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
					dictValue: 1,
					dictName: '未上架'
				},
				{
					dictValue: 2,
					dictName: '上架'
				},
				{
					dictValue: 3,
					dictName: '下架'
				}
			] // 广告信息操作表单广告状态下拉框
		};
	},
	created() {
		this.getData();
		this.getAdvertList();
	},
	activated() {
		this.getData();
	},
	methods: {
		startTimeChange() {
			if (this.startTime > this.endTime) {
				this.$message({
					message: '起始日期不得大于结束日期',
					type: 'warning'
				});
				this.startTime = this.endTime;
			}
		},
		endTimeChange() {
			if (this.startTime > this.endTime) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.endTime = this.startTime;
			}
		},
		// 分页导航
		handleCurrentChange(val) {
			this.currentPage = val;
			this.page = val;
			this.getData();
		},
		handleSizeChange(cur_size) {
			this.size = cur_size;
			this.currentPage = 1;
			this.page = 1;
			this.getData();
		},
		operateListToNumber(list) {
			if (!Array.isArray(list)) return;
			return list.filter(item => {
				item.dictValue = Number(item.dictValue);
				if (item.dictValue !== 1) return item;
			});
		},
		async handleRefresh() {
			let url = this.BASE_URL + `admin/advert/space/realTimeUpdateAdvertSpace`;
			this.$axios
				.post(url, {
					page: this.page,
					size: this.page_size,
					selectKey: this.selectKey,
					groupId: this.groupId,
					advertStatus: this.advertStatus === null ? 2 : this.advertStatus,
					advertSpaceStatus: this.advertSpaceStatus === null ? 2 : this.advertSpaceStatus,
					advertSpaceCode: this.advertSpaceCode ? this.advertSpaceCode : 2,
					isBackPage: this.isBackPage

					// advertSort: "2"
				})
				.then(res => {
					const list = res.data.data.list;
					this.tableData = this.operateList(list);
					this.cur_total = res.data.data.total;
				});
		},
		async getAdvertList() {
			let {
				data: {
					data: { dictionaryList }
				}
			} = await this.$axios.post(this.BASE_URL + 'admin/advert/space/initAdvertFromData', {});
			this.advertStatusSelectOption = this.operateListToNumber(dictionaryList);
		},

		// 如果底部的状态是上架状态，
		async changeBottomAdvertStatus(val) {
			if (val == 2) {
				let {
					data: {
						data: {
							advertMaxDto: { maxAdvertSort }
						}
					}
				} = await this.$axios.post(this.BASE_URL + 'admin/advert/space/initAdvertFromData', {});
				this.bottomAdvert.advertSort = maxAdvertSort + 1;
				this.advertSortReadonly = false;
			} else {
				this.bottomAdvert.advertSort = -1;
				this.advertSortReadonly = true;
			}
		},

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
		},
		operateList(list) {
			let that = this;
			if (!Array.isArray(list)) return;
			list.map(item => {
				item.isBanner = item.isBanner.toString();
				item.isBackPage = item.isBackPage.toString();
				item.advertCoverPicture = item.advertCoverPicture.split(',');
			});
			return list;
		},
		// 获取 easy-mock 的模拟数据
		async getData() {
			if (this.isBackPage === 1) {
				this.adTempPosition = 2;
			} else {
				this.adTempPosition = this.advertSpaceCode;
			}
			let postData = {
				page: this.page,
				size: this.size,
				selectKey: this.selectKey,
				groupId: this.selectId,
				startTime: this.startTime,
				endTime: this.endTime,
				advertStatus: this.advertStatus === null ? 2 : this.advertStatus,
				advertSpaceStatus: this.advertSpaceStatus === null ? 2 : this.advertSpaceStatus,
				advertSpaceCode: this.adTempPosition,
				isBackPage: this.isBackPage
			};
			this.url = this.BASE_URL + 'admin/advert/space/list';
			let {
				data: {
					data: {
						pageInfo: { list, total },
						totalAdvertAmount,
						totalAdvertIpAmountCount,
						totalPurchaseCount
					}
				}
			} = await this.$axios.post(this.url, postData);
			this.totalAdvertAmount = totalAdvertAmount;
			this.totalAdvertIpAmountCount = totalAdvertIpAmountCount;
			this.totalPurchaseCount = totalPurchaseCount;
			this.tableData = this.operateList(list);
			this.cur_total = total;
			this.tableLoading = false;
		},

		//根据ID获取广告所有数据
		async getAdvertById() {
			let url = this.BASE_URL + 'admin/advert/space/getAdvertById';
			let {
				data: { data }
			} = await this.$axios.post(url, { advertId: this.advertId });
			this.makeEditData(data);
		},

		// 根据广告位的code取到对应的对象
		findObjByCode(list, code) {
			let result = '';
			if (!Array.isArray(list)) return;
			result = list.find(item => {
				return item.advertSpaceCode === code;
			});
			return result;
		},
		// 编辑的时候生成相应的广告对象
		makeEditData(data) {
			let { advertStatus, purchaseCount, skipUrl, groupName, groupId, advertId, incrementPercent, prepareSkipUrl, advertList, readerType, advertAmount } = data;
			this.advertDto = {
				advertId,
				groupId,
				groupName,
				skipUrl,
				purchaseCount,
				incrementPercent,
				advertStatus,
				prepareSkipUrl,
				readerType,
				advertAmount
			};
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
			if (advertList && advertList.length > 0) {
				this.bottomAdvert = this.findObjByCode(advertList, 2) ? this.findObjByCode(advertList, 2) : this.bottomAdvert;
				this.changeadvertSortReadonly(this.bottomAdvert.advertSpaceStatus);
				this.bottomAdvert.isBackPage = this.bottomAdvert.isBackPage.toString();
				this.bottomAdvert.isBanner = this.bottomAdvert.isBanner.toString();
				this.bottomAdvert.titleIsStrong = this.bottomAdvert.titleIsStrong.toString();
				this.bottomAdvert.titleIsRed = this.bottomAdvert.titleIsRed.toString();
				// this.fileList = this.stringToArr(this.bottomAdvert.advertCoverPicture);
				this.topAdvert = this.findObjByCode(advertList, 1) ? this.findObjByCode(advertList, 1) : this.topAdvert;
				this.wordAdvert = this.findObjByCode(advertList, 3) ? this.findObjByCode(advertList, 3) : this.wordAdvert;
				this.bottomFixedAdvert = this.findObjByCode(advertList, 5) ? this.findObjByCode(advertList, 5) : this.bottomFixedAdvert;
				this.articleInteriorAdvert = this.findObjByCode(advertList, 6) ? this.findObjByCode(advertList, 6) : this.articleInteriorAdvert;
			}
		},

		changeadvertSortReadonly(status) {
			if (Number(status) === 2) {
				this.advertSortReadonly = false;
			} else {
				this.advertSortReadonly = true;
			}
		},

		// stringToArr(str) {
		// 	let result = [];
		// 	let tempArr = str.split(',');
		// 	for (let i = 0; i < tempArr.length; i++) {
		// 		result.push({
		// 			id: i,
		// 			url: tempArr[i]
		// 		});
		// 	}
		// 	return result;
		// },
		formaterAdvertSpaceCode(row, column, cellValue, index) {
			let result = '';
			if (Number(row.isBackPage) === 1) {
				result = '后退页';
			} else {
				result = cellValue === 1 ? '顶部banner' : cellValue === 2 ? '底部' : cellValue === 3 ? '文字链接' : cellValue === 6 ? '文章内页' : '底部悬浮窗';
			}
			return result;
			// return cellValue === 1 ? '顶部banner' : cellValue === 2 ? '底部' :'文字链接'
		},
		formaterAdvertStatus(row, column, cellValue, index) {
			return cellValue === 1 ? '未上架' : cellValue === 2 ? '上架' : '下架';
		},
		formaterPercentage(row, column, cellValue, index) {
			return cellValue * 100 + '%';
		},
		formaterReader(row, column, cellValue, index) {
			let result;
			if (cellValue === 0) result = '全部';
			if (cellValue === 1) result = '转发者';
			if (cellValue === 2) result = '阅读者';
			return result;
		},
		handleEdit(index, row) {
			this.advertId = row.advertId;
			this.getAdvertById();
			this.addVisible = true;
			this.$nextTick(() => {
				this.$refs['advertDto'].clearValidate();
			});
		},
		handleAdvertCount(index, row) {
			window.open(this.adUrl + '?adGroupId=' + row.groupId + '&purchaseCount=' + row.purchaseCount);
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

		// joinArrayItem(arr) {
		// 	let resultArr = [];
		// 	let str = '';
		// 	for (let i = 0; i < arr.length; i++) {
		// 		resultArr.push(arr[i].url);
		// 	}
		// 	str = resultArr.join(',');
		// 	return str;
		// },

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

		// 校验各个部位广告的字段
		checkAdvert() {
			let result = [];
			// 1:未上架  2:上架  3:下架
			// 如果总状态为下架状态，三个广告位状态都为下架状态 则提示总状态改成上架状态
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
					this.articleInteriorAdvert.advertSpaceStatus === 2
				) {
					result.push('总广告位与子广告位状态不一样，请修改状态');
				}
			}

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

		handleAdd() {
			this.$router.push('/advertising_position_management_add');
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
			await this.$axios.post(this.BASE_URL + 'admin/advert/space/saveAdvertInfo', this.makeData);
			this.addVisible = false;
			this.getData();
			this.$message({
				message: '新增成功',
				type: 'success'
			});
		},
		// changeBannerStatus(id, isBanner) {
		// 	const formData = new FormData();
		// 	formData.append('id', id);
		// 	formData.append('isBanner', isBanner == true ? 1 : 0);
		// 	this.$axios.post(this.BASE_URL + 'admin/advert/space/updateBannerStatus', formData).then(res => {
		// 		if (res.data.code == 200) {
		// 			for (var i = 0; i < this.tableData.length; i++) {
		// 				if (this.tableData[i].id == id) {
		// 					this.tableData[i].isBanner = isBanner.toString();
		// 				}
		// 			}
		// 			this.$message(res.data.message);
		// 		} else {
		// 			this.$message(res.data.message);
		// 		}
		// 	});
		// },
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogImageVisible = true;
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
		handleRemoveImg(index) {
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
		onBeforeUploadImage(file) {
			const isImg = this.isImage(file.name);
			const isLit2M = this.isLit2M(file.size);
			return isImg && isLit2M;
		},
		// handleSuccess(file, fileList) {
		// 	this.fileList.push({
		// 		id: fileList.uid,
		// 		url: file.data
		// 	});
		// },
		// handleRemove(file) {
		// 	const index = this.fileList.findIndex(item => item.id === file.id);
		// 	this.fileList.splice(index, 1);
		// },
		changeAdvertSpaceStatus(val) {
			this.page = 1;
			if (val === 4) {
				this.isBackPage = 1;
			} else {
				this.isBackPage = 0;
			}
			if (val == 2) {
				this.isBackPage = '';
			}
			this.getData();
		},

		changeStatus(val) {
			this.advertStatus = val;
			this.page = 1;
			this.getData();
		},

		// changeAllAdvertStatus(val) {
		// 	this.page = 1;
		// 	this.advertSpaceStatus = val;
		// 	this.getData();
		// },

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
		}
	}
};
</script>

<style scoped>
.fontRed {
	color: #ff0000;
}
.fontBold {
	font-weight: bold;
}
.handle-box {
	margin-bottom: 20px;
}
.handle-label {
	width: 150px;
}
.handle-select {
	width: 120px;
}
.handle-text {
	display: flex;
	margin-bottom: 20px;
}
.handle-text > div {
	margin-right: 40px;
}
.handle-input {
	width: 300px;
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
