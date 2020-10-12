<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					域名池管理/设置
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="tabName">
				<el-tab-pane label="域名池管理" name="manager">
					<div class="handle-box">
						<div class="row">
							<el-date-picker
								type="date"
								size="small"
								value-format="yyyy-MM-dd"
								format="yyyy-MM-dd"
								placeholder="添加开始日期"
								v-model="start_date"
								class="handle-label mr10"
							></el-date-picker>
							<i class="line mr10">-</i>
							<el-date-picker
								type="date"
								size="small"
								value-format="yyyy-MM-dd"
								format="yyyy-MM-dd"
								placeholder="添加结束日期"
								v-model="end_date"
								class="handle-label mr10"
							></el-date-picker>
							<el-date-picker
								type="date"
								size="small"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd"
								placeholder="冻结开始日期"
								v-model="startFreezeTime"
								class="handle-label mr10"
							></el-date-picker>
							<i class="line mr10">-</i>
							<el-date-picker
								type="date"
								size="small"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd"
								placeholder="冻结结束日期"
								v-model="endFreezeTime"
								class="handle-label mr10"
							></el-date-picker>
							<el-button type="primary" icon="search" @click="search">搜索</el-button>
							<el-button type="primary" icon="delete" class="handle-del mr10" @click="reset_condition">重置筛选</el-button>
						</div>
						<div class="row">
							<el-date-picker
								type="date"
								size="small"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd"
								placeholder="解冻开始日期"
								v-model="startRecoverTime"
								class="handle-label mr10"
							></el-date-picker>
							<i class="line mr10">-</i>
							<el-date-picker
								type="date"
								size="small"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd"
								placeholder="解冻结束日期"
								v-model="endRecoverTime"
								class="handle-label mr10"
							></el-date-picker>
							<el-input v-model="domain_input" placeholder="域名筛选" clearable class="handle-input mr10"></el-input>
							<el-input v-model="searchUserId" placeholder="用户ID" clearable class="handle-input mr10"></el-input>
						</div>
						<div class="row">
							<el-select v-model="classCode_select" clearable placeholder="所属分类" class="handle-select mr10" @change="search">
								<el-option v-for="item in classNameOption" :key="item.code" :label="item.className" :value="item.code">
									<span style="float: left">{{ item.className }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
							<el-select v-model="wxStatus_select" clearable placeholder="封杀状态" class="handle-select mr10" @change="search">
								<el-option v-for="item in wxStatusOptions" :key="item.value" :label="item.lable" :value="item.value">
									<span style="float: left">{{ item.lable }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
								</el-option>
							</el-select>
							<el-select v-model="beianStatus_select" clearable placeholder="备案状态" class="handle-select mr10" @change="search">
								<el-option v-for="item in beianStatusOptions" :key="item.value" :label="item.lable" :value="item.value">
									<span style="float: left">{{ item.lable }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
								</el-option>
							</el-select>
							<el-select v-model="enable_select" clearable placeholder="启用状态" class="handle-select mr10" @change="search">
								<el-option v-for="item in enableOptions" :key="item.value" :label="item.lable" :value="item.value">
									<span style="float: left">{{ item.lable }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
								</el-option>
							</el-select>
						</div>
					</div>
					<div class="handle-box">
						<el-button type="primary" @click="handleEdit('', '')">新增域名</el-button>
						<el-button type="primary" @click="showUpdateDialog">批量更新</el-button>
						<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
						<el-button type="primary" @click="showBatchVipDomain">批量删除大户域名</el-button>
					</div>

					<el-table :data="tableData" v-loading="tableLoading" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55" align="center"></el-table-column>
						<el-table-column prop="id" label="ID" align="center" width="80" fixed></el-table-column>
						<el-table-column prop="domain" label="域名" align="center" width="150" fixed></el-table-column>
						<el-table-column prop="userId" label="用户ID" align="center" width="150"></el-table-column>
						<el-table-column prop="className" label="域名分类" align="center" width="120"></el-table-column>
						<el-table-column prop="beianStatus" label="备案状态" align="center" :formatter="formatterBeianStatus"></el-table-column>
						<el-table-column prop="enable" label="启用状态" align="center" :formatter="formatterEnable"></el-table-column>
						<el-table-column prop="wxStatus" label="封杀状态" align="center" width="80" :formatter="formatterWxStatus"></el-table-column>
						<el-table-column prop="addDate" label="添加时间" width="120" align="center" :formatter="formatterAddDate"></el-table-column>
						<el-table-column prop="freezeTime" label="冻结时间" align="center"></el-table-column>
						<el-table-column prop="recoverTime" label="解冻时间" align="center"></el-table-column>
						<el-table-column prop="freezeCount" label="冻结次数" align="center">
							<template slot-scope="scope">
								<el-link type="primary" @click="lookBanTimes(scope.row)">{{ scope.row.freezeCount }}</el-link>
							</template>
						</el-table-column>
						<el-table-column prop="banDate" label="封杀时间" align="center" :formatter="formatterBanDate"></el-table-column>
						<el-table-column prop="pvCount" label="访问PV数" align="center"></el-table-column>
						<el-table-column prop="ipCount" label="访问IP数" align="center"></el-table-column>
						<el-table-column label="操作" width="180" align="center">
							<template slot-scope="scope">
								<el-button type="primary" v-bind:disabled="scope.row.rowEditEnable" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination
							background
							@current-change="handleCurrentChange"
							:page-sizes="[10, 20, 50, 100]"
							@size-change="handleSizeChange"
							:current-page.sync="currentPage"
							layout="total, sizes, prev, pager, next, jumper"
							:total="cur_total"
						></el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="域名池设置" name="set">
					<div class="domain-title">
						<div class="domain-title">域名防封策略设置</div>
						<div class="domain-body">
							<el-radio-group v-model="domainPattern">
								<span v-for="(item, index) in preventSealList" :key="index">
									<br v-if="index % 3 == 0" />
									<el-radio class="row" :label="item.val" border>{{ item.name }}</el-radio>
								</span>
							</el-radio-group>
							<div><el-button type="primary" @click="saveDomainPattern">保存</el-button></div>
						</div>
					</div>
					<div class="domain-title">
						<div class="domain-title">域名防封阈值设置</div>
						<div class="domain-body">
							<div class="bgDiv">
								<span>最近</span>
								<el-input class="handle-input-padding" value="24" readonly></el-input>
								<span>小时内，IP访问超</span>
								<el-input class="handle-input-padding" value="10000" readonly></el-input>
								<span>则域名冻结，</span>
								<el-input class="handle-input-padding" value="240" readonly></el-input>
								<span>小时后解除冻结，重新启用</span>
								<p>某个域名最近24小时内，有10000IP访问，则该域名冻结，240小时后解除冻结，重新启用。</p>
							</div>
							<el-form style="margin-top: 10px;" ref="domainForm" :model="domainForm">
								<el-form-item v-for="(item, index) in domainForm.domainFreezeConfig" :key="index + '0'">
									<span>最近</span>
									<el-form-item 
										class="handle-input-padding" 
										:prop="'domainFreezeConfig.'+index+'.checkTime'"
										:rules="[{ required:true,message:'请输入时间',trigger:'blur' }]">
										<el-input :readonly="item.isEdit" v-model.number="item.checkTime" placeholder="请输入时间"></el-input>
									</el-form-item>
									<span>小时内，IP访问超</span>
									<el-form-item 
										class="handle-input-padding" 
										:prop="'domainFreezeConfig.'+index+'.visitThreshold'"
										:rules="[{ required:true,message:'请输入IP量',trigger:'blur' }]">
										<el-input :readonly="item.isEdit" v-model.number="item.visitThreshold" placeholder="请输入IP量"></el-input>
									</el-form-item>
									<span>则域名冻结，</span>
									<el-form-item 
										class="handle-input-padding" 
										:prop="'domainFreezeConfig.'+index+'.recoverTime'"
										:rules="[{ required:true,message:'请输入时间',trigger:'blur' }]">
										<el-input :readonly="item.isEdit" v-model.number="item.recoverTime" placeholder="请输入时间"></el-input>
									</el-form-item>
									<span>小时后解除冻结，重新启用</span>
									<el-button class="ml10" v-if="item.isEdit" type="warning" @click="item.isEdit = false">编辑</el-button>
									<el-button class="ml10" v-else type="primary" @click="saveDomainFreezeConfig(item)">保存</el-button>
									<el-button type="info" @click="delDomainFreezeConfig(item.id)">删除</el-button>
								</el-form-item>
								<div style="margin-bottom: 10px;"><el-button type="primary" @click="addDomainFreezeConfig">添加</el-button></div>
							</el-form>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>

		<!-- 新增/编辑弹出框 -->
		<el-dialog title="域名信息" :visible.sync="editVisible" width="30%">
			<el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="用户ID"><el-input v-model="form.userId"></el-input></el-form-item>
				<el-form-item label="域名">
					<el-input v-model="form.domain" rows="3" type="textarea"></el-input>
					<!-- <el-input v-model="form.domain" @change="domainCheck"></el-input> -->
				</el-form-item>
				<el-form-item label="域名所属分类">
					<el-select v-model="form.classCode" placeholder="所属分类" class="mr10">
						<el-option v-for="item in classNameOption" :key="item.code" :label="item.className" :value="item.code">
							<span style="float: left">{{ item.className }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.domainPre }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="封杀状态">
					<el-select v-model="form.wxStatus" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in wxStatusOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备案状态">
					<el-select v-model="form.beianStatus" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in beianStatusOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启用状态">
					<el-select v-model="form.enable" placeholder="启用状态" class="handle-select mr10">
						<el-option v-for="item in updateEnableOptions" :key="item.value" :label="item.lable" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="域名排序"><el-input v-model="form.beianSort" @keyup.native="checkNumIsInt(index)"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 批量更新弹出框 -->
		<el-dialog title="域名信息" :visible.sync="updateVisible" width="30%">
			<el-form ref="form" :model="updateForm" label-width="80px">
				<el-form-item label="用户ID"><el-input v-model="updateForm.userId"></el-input></el-form-item>
				<el-form-item label="类别">
					<el-select v-model="updateForm.classCode" placeholder="所属分类" class="mr10">
						<el-option v-for="item in updateClassNameOption" :key="item.code" :label="item.className" :value="item.code">
							<span style="float: left">{{ item.className }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.domainPre }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="封杀状态">
					<el-select v-model="updateForm.wxStatus" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in updateWXStatusOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备案状态">
					<el-select v-model="updateForm.beianStatus" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in updateBeianStatusOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启用状态">
					<el-select v-model="updateForm.enable" placeholder="请选择" class="handle-select mr10">
						<el-option v-for="op in updateEnableOptions" :key="op.value" :label="op.lable" :value="op.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="updateVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleUpate">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 批量删除大户弹出框 -->
		<el-dialog title="域名信息" :visible.sync="showBatchVipDomainDialog" width="30%">
			<el-form ref="form" :model="userBatchDomainForm" label-width="80px">
				<el-form-item label="用户ID"><el-input v-model="userBatchDomainForm.userIds" placeholder="用户ID用户英文逗号隔开"></el-input></el-form-item>
				<el-form-item label="类别">
					<el-select v-model="userBatchDomainForm.classCode" placeholder="所属分类" class="mr10">
						<el-option v-for="item in updateClassNameOption" :key="item.code" :label="item.className" :value="item.code">
							<span style="float: left">{{ item.className }}</span>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showBatchVipDomainDialog = false">取 消</el-button>
				<el-button type="primary" @click="handleUsersDelete">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 冻结次数 -->
		<el-dialog title="冻结次数" :visible.sync="banTimesVisible" width="800px" center>
			<el-table :data="banTimesList" v-loading="tableLoading2" border class="table" ref="banTimesList">
				<el-table-column prop="id" label="序号" align="center" width="120" sortable></el-table-column>
				<el-table-column prop="freezeTime" label="冻结时间" align="center" sortable></el-table-column>
				<el-table-column prop="recoverTime" label="解冻时间" align="center" sortable></el-table-column>
				<el-table-column prop="coolingTime" label="冷却天数" align="center" width="120" sortable></el-table-column>
				<el-table-column prop="enableTime" label="启用时间" align="center" sortable></el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="banTimesVisible = false">关 闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'basetable',
	data() {
		return {
			tabName: 'manager',
			preventSealList: [
				{ name: '落地普通', val: '1' },
				{ name: '落地备案', val: '2' },
				{ name: '跳转落地普通', val: '3' },
				{ name: '跳转备案 落地普通', val: '4' },
				{ name: '跳转普通 落地备案', val: '5' },
				{ name: '跳转备案 落地备案', val: '6' }
			],

			domainPattern: 0, //域名防封策略设置
			domainForm:{
				domainFreezeConfig: [], // 域名防封阈值设置
			},
			isAdd: false, //判断 域名防封阈值设置 的保存按钮 功能是添加还是修改 false:修改;true:添加

			showBatchVipDomainDialog: false,
			userBatchDomainForm: {
				userIds: '',
				classCode: ''
			},
			tableLoading: true,
			tableData: [],
			currentPage: 1,
			cur_page: 1,
			pageSize: 10,
			cur_total: 0, // 总记录数
			multipleSelection: [],
			classCode_select: '',
			wxStatus_select: '',
			beianStatus_select: '',
			enable_select: '',

			// 筛选 字段
			start_date: null,
			end_date: null,
			startFreezeTime: null,
			endFreezeTime: null,
			startRecoverTime: null,
			endRecoverTime: null,
			domain_input: '',
			searchUserId: '',

			// 冻结次数dalog
			banTimesVisible: false,
			tableLoading2: true,
			banTimesList: [],

			del_list: [],
			ids: [], // 批量更新的ids
			is_search: false,
			editVisible: false,
			delVisible: false,
			updateVisible: false,
			updateForm: {
				userId: null,
				enable: null,
				wxStatus: null,
				beianStatus: null,
				classCode: null
			},
			form: {
				id: '',
				userId: '',
				beianSort: 1,
				beianStatus: 1,
				classCode: '',
				className: '',
				domain: '',
				domainPre: '',
				enable: 0,
				wxStatus: 0,
				rowEditEnable: false // 编辑按钮是否可用
			},

			// 下拉框数据填充
			beianStatusOptions: [
				{
					value: -1,
					lable: '全部'
				},
				{
					//0:未备案  1:已备案  2:掉备案
					value: 0,
					lable: '未备案'
				},
				{
					value: 1,
					lable: '已备案'
				},
				{
					value: 2,
					lable: '掉备案'
				}
			],
			updateBeianStatusOptions: [
				{
					//0:未备案  1:已备案  2:掉备案
					value: 0,
					lable: '未备案'
				},
				{
					value: 1,
					lable: '已备案'
				},
				{
					value: 2,
					lable: '掉备案'
				}
			],
			wxStatusOptions: [
				{
					value: -1,
					lable: '全部'
				},
				{
					//0:正常 1:封杀
					value: 0,
					lable: '正常'
				},
				{
					value: 1,
					lable: '封杀'
				}
			],
			updateWXStatusOptions: [
				{
					//0:正常 1:封杀
					value: 0,
					lable: '正常'
				},
				{
					value: 1,
					lable: '封杀'
				}
			],
			updateEnableOptions: [
				{
					//0:未启用  1:启用
					value: 0,
					lable: '未启用'
				},
				{
					value: 1,
					lable: '启用'
				},
				{
					value: 2,
					lable: '冻结'
				}
			],
			enableOptions: [	//0:未启用  1:启用
				{
					value: -1,
					lable: '全部'
				},
				{
					value: 0,
					lable: '未启用'
				},
				{
					value: 1,
					lable: '启用'
				},
				{
					value: 2,
					lable: '冻结'
				}
			],
			classNameOption: [],
			updateClassNameOption: [
				{ id: 1, className: '新闻跳转域名', code: '01' },
				{ id: 2, className: '新闻落地域名', code: '02' },
				{ id: 3, className: '下载跳转域名', code: '03' },
				{ id: 4, className: '下载落地域名', code: '04' }
			],

			delIds: [] // 待删除记录的id列表
		};
	},
	created() {
		this.getData();
		this.getDomainPattern();
		this.getDomainFreezeConfig();
	},
	methods: {
		showUpdateDialog() {
			this.ids = [];
			this.updateForm = {
				enable: null,
				wxStatus: null,
				beianStatus: null,
				classCode: null
			};
			const length = this.multipleSelection.length;
			if (length == 0) {
				this.$message.warning('无勾选项');
				return;
			} else {
				for (let i = 0; i < length; i++) {
					this.ids.push(this.multipleSelection[i].id);
				}
				this.updateVisible = true;
			}
		},
		// 分页导航
		handleCurrentChange(val) {
			this.cur_page = val;
			this.currentPage = val;
			this.getData();
		},
		handleSizeChange(cur_size) {
			this.pageSize = cur_size;
			this.currentPage = 1;
			this.cur_page = 1;
			this.getData();
		},

		// 批量更新
		handleUpate() {
			const { ids } = this;
			let postData = {
				ids,
				classCode: this.updateForm.classCode,
				wxStatus: this.updateForm.wxStatus,
				beianStatus: this.updateForm.beianStatus,
				enable: this.updateForm.enable,
				userId: this.updateForm.userId
			};
			this.$axios.post(this.BASE_URL + 'admin/domain/batchUpdate', postData).then(res => {
				this.updateVisible = false;
				if (+res.data.code === 200) {
					this.ids = [];
					this.multipleSelection = [];
					this.$message.success('更新成功');
					this.getData();
				}
			});
		},
		// 获取 easy-mock 的模拟数据
		getData() {
			// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
			if (process.env.NODE_ENV === 'development') {
				this.url = '/admin/domain/findDomainByPage';
			}
			this.findDomainByPage('');
			this.$axios.get(this.BASE_URL + 'admin/domain/initBaseInfo', {}).then(res => {
				res.data.data.classNameList.unshift({className: "全部",code: "-1",domainPre: ""});
				this.classNameOption = res.data.data.classNameList;
			});
			// const end = new Date();
			// const start = new Date();
			// start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
			// this.start_date = start;
			// this.end_date = end;
		},
		search() {
			if (this.classCode_select == -1) {
				this.classCode_select = '';
			}
			if (this.wxStatus_select == -1) {
				this.wxStatus_select = '';
			}
			if (this.beianStatus_select == -1) {
				this.beianStatus_select = '';
			}
			if (this.enable_select == -1) {
				this.enable_select = '';
			}

			this.findDomainByPage();
			// this.is_search = true;
		},
		// 格式化
		formatterWxStatus(row, column) {
			//0:正常 1:封杀
			return row.wxStatus == 0 ? '正常' : '封杀';
		},
		formatterBeianStatus(row, column) {
			//0:未备案  1:已备案  2:掉备案
			return row.beianStatus == 1 ? '已备案' : row.beianStatus == 2 ? '掉备案' : '未备案';
		},
		formatterEnable(row, column) {
			//0:未启用  1:启用 2:冻结
			if(row.enable==0)return '未启用';
			if(row.enable==1)return '启用';
			if(row.enable==2)return '冻结';
		},
		formatterAddDate(row, column) {
			return this.$moment(row.addDate).format('YYYY-MM-DD');
		},
		formatterBanDate(row, column) {
			if (row.banDate == null) {
				return '';
			}
			var date = new Date(row.banDate);
			return this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
		},
		filterTag(value, row) {
			return row.tag === value;
		},
		handleEdit(index, row) {
			if (row == '') {
				// 新增
				this.form = {
					id: '',
					beianSort: 1,
					beianStatus: 1,
					classCode: '01',
					domain: '',
					domainPre: '',
					enable: 1,
					wxStatus: 0
				};
			} else {
				// 编辑
				this.form = {
					id: row.id,
					userId: row.userId,
					beianSort: row.beianSort,
					beianStatus: row.beianStatus,
					classCode: row.classCode,
					domain: row.domain,
					enable: row.enable,
					wxStatus: row.wxStatus
				};
			}
			this.editVisible = true;
		},
		handleDelete(index, row) {
			this.delIds.push(row.id);
			this.delVisible = true;
		},
		delAll() {
			const length = this.multipleSelection.length;
			if (length == 0) {
				this.$message.warning('无勾选项');
				return;
			}
			this.del_list = this.del_list.concat(this.multipleSelection);
			for (let i = 0; i < length; i++) {
				this.delIds.push(this.multipleSelection[i].id);
			}
			this.delByIds();
			this.multipleSelection = [];
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 保存编辑
		saveEdit() {
			this.$axios.post(this.BASE_URL + 'admin/domain/saveDomainInfo', this.form).then(res => {
				if (res.data.code == 200) {
					this.$message.success(res.data.message);
					this.editVisible = false;

					this.findDomainByPage();
				} else {
					this.$message.error(res.data.message);
				}
			});
		},
		// 确定删除
		deleteRow() {
			this.delByIds();
			this.delVisible = false;
		},
		reset_condition() {
			//重置筛选条件
			this.domain_input = '';
			this.classCode_select = '';
			this.wxStatus_select = '';
			this.beianStatus_select = '';
			this.enable_select = '';
			this.start_date = '';
			this.end_date = '';
			this.startFreezeTime = '';
			this.endFreezeTime = '';
			this.startRecoverTime = '';
			this.endRecoverTime = '';
			this.findDomainByPage();
		},
		plusTime(date){
			return this.$moment(date).add(1,'days').format('YYYY-MM-DD');
		},
		findDomainByPage() {
			// 查询数据填充表格
			if (this.start_date > this.end_date) {
				this.$message.info('起始日期不得大于结束日期');
				this.start_date = '';
				this.end_date = '';
				return;
			}
			this.$axios
				.post(this.BASE_URL + 'admin/domain/findDomainByPage', {
					page: this.cur_page,
					size: this.pageSize,
					domain: this.domain_input,
					classCode: this.classCode_select,
					wxStatus: this.wxStatus_select,
					beianStatus: this.beianStatus_select,
					enable: this.enable_select,
					startDate: this.start_date,
					endDate: this.end_date?this.plusTime(this.end_date):this.end_date,
					startFreezeTime: this.startFreezeTime,
					endFreezeTime: this.endFreezeTime?this.plusTime(this.endFreezeTime):this.endFreezeTime,
					userId: this.searchUserId,
					// 新增
					startRecoverTime: this.startRecoverTime,
					endRecoverTime: this.endRecoverTime?this.plusTime(this.endRecoverTime):this.endRecoverTime
				})
				.then(res => {
					const list = res.data.data.list;
					// for(var i = 0; i < list.length; i++) {
					//   if (list[i].beianSort == 0) {
					//     list[i].rowEditEnable = true;
					//   } else {
					//     list[i].rowEditEnable = false;
					//   }
					// }
					this.tableData = list;
					this.tableLoading = false;
					this.cur_total = res.data.data.total;
				});
		},
		delByIds() {
			// 把记录标记为作废状态，支持批量删除
			if (this.delIds.length != 0) {
				this.$axios.post(this.BASE_URL + 'admin/domain/updateDelFlagById', this.delIds).then(res => {
					if (res.data.code == 200) {
						this.findDomainByPage();
						this.$message.success(res.data.message);
						this.delIds = [];
					} else {
						this.$message.error(res.data.message);
					}
				});
			}
		},
		// domainCheck() {
		//   var domain = this.form.domain;
		//   if(domain == '') {
		//     return;
		//   }
		//   this.$axios.get(this.BASE_URL + "admin/domain/domainCheck?domain=" + domain) .then(res => {
		//     var msg = "域名正常";
		//     if(res.data.code==200) { // 0为正常，1为被转码，2为被封，3查询失败，-1接口到期。注意：频率过高默认返回3状态
		//       if(res.data.data.status == '0') {
		//         this.$message.success("域名正常");
		//         this.form.wxStatus = 0;
		//       } else if(res.data.data.status == '2') {
		//         this.$message.error("域名被封");
		//         this.form.wxStatus = 1;
		//       }
		//     } else {
		//       this.$message.error(res.data.message);
		//     }
		//   });
		// },
		checkNumIsInt(index) {
			if (this.form.beianSort == '') {
				return false;
			}
			if (this.form.beianSort < 0) {
				this.$message('排序不能为负数或其他字符');
				return false;
			}
			return true;
		},

		// 大户域名管理
		showBatchVipDomain() {
			this.showBatchVipDomainDialog = true;
		},
		async handleUsersDelete() {
			let tempUserIds = '';
			if (this.userBatchDomainForm.userIds) {
				tempUserIds = this.userBatchDomainForm.userIds.split(',');
			}
			let postData = {
				userIds: tempUserIds,
				classCode: this.userBatchDomainForm.classCode
			};

			let {
				data: { code }
			} = await this.$axios.post(this.BASE_URL + 'admin/domain/deleteByUserIdsAndClassCode', postData);
			if (+code === 200) {
				this.$message.success('删除成功');
				this.showBatchVipDomainDialog = false;
			} else {
				this.$message('删除失败，请重试');
			}
		},
		async lookBanTimes(row) {
			this.banTimesVisible = true;
			let { data:{ code,message,data } } = await this.$axios.get(this.BASE_URL+`admin/domain/getDomainFreezeLogListByDomainId?domainId=${row.id}`)
			if(code == '200'){
				this.banTimesList=data;
				this.tableLoading2=false;
			}else{
				this.$message.error(message);
			}
		},
		saveDomainPattern() {
			this.$confirm('确定保存域名防封策略设置吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$axios.post(this.BASE_URL + 'admin/domain/updateDomainPattern?pattern=' + this.domainPattern).then(res => {
						if (res.data.code == '200') {
							this.$message.success(res.data.message);
							return;
						}
						this.$message.error(res.data.message);
					});
				})
				.catch(() => {});
		},
		async getDomainPattern() {
			let {
				data: { code, message, data }
			} = await this.$axios.get(this.BASE_URL + 'admin/domain/getDomainPattern');
			if (code == '200') {
				this.domainPattern = data;
			} else {
				this.$message.error(message);
			}
		},
		async getDomainFreezeConfig() {
			let {
				data: { code, message, data }
			} = await this.$axios.get(this.BASE_URL + 'admin/domain/getDomainFreezeConfigList');
			if (code == '200') {
				data.forEach(item => {
					item.isEdit = true;
				});
				this.domainForm.domainFreezeConfig = data;
			} else {
				this.$message.error(message);
			}
		},
		addDomainFreezeConfig() {
			this.domainForm.domainFreezeConfig.push({
				checkTime: null,
				visitThreshold: null,
				recoverTime: null
			});
		},
		removeDomainFreezeConfig() {
			if (this.domainForm.domainFreezeConfig.length <= 1) return;
			this.domainForm.domainFreezeConfig.pop();
		},
		delDomainFreezeConfig(id) {
			if (id === undefined) {
				this.domainForm.domainFreezeConfig.pop();
				return;
			}
			this.$confirm('确定删除吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$axios.post(this.BASE_URL + 'admin/domain/deleteDomainFreezeConfig?id=' + id).then(res => {
					if (res.data.code == '200') {
						this.getDomainFreezeConfig();
						this.$message.success(res.data.message);
						return;
					}
					this.$message.error(res.data.message);
				});
			}).catch(() => {});
		},
		saveDomainFreezeConfig(item) {
			this.$refs['domainForm'].validate(valid => {
				if (valid) {
					let postData = {
							checkTime: item.checkTime,
							visitThreshold: item.visitThreshold,
							recoverTime: item.recoverTime
						},
						url;
					if (item.id) {	//修改
						postData.id = item.id;
						url = this.BASE_URL + 'admin/domain/updateDomainFreezeConfig';
					} else {	//添加
						url = this.BASE_URL + 'admin/domain/insertDomainFreezeConfig';
					}
					this.$confirm('确定保存吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$axios.post(url, postData).then(res => {
							if (res.data.code == '200') {
								this.$message.success(res.data.message);
								this.getDomainFreezeConfig();
								return;
							}
							this.$message.error(res.data.message);
						});
					}).catch(() => {});
				}
			});
		},
		
	}
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 15px;
}

.handle-select {
	width: 180px;
}

.handle-label {
	width: 172px;
}
.handle-input {
	width: 180px;
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
.mr10 {
	margin-right: 10px;
}
.row {
	margin-bottom: 10px;
	margin-right: 10px;
}
.domain-title {
	margin-bottom: 20px;
}
.domain-body {
	color: #303133;
}
.handle-input-padding {
	display: inline-block;
	width: 100px;
	margin: 0 10px 0 10px;
}
.bgDiv {
	background-color: rgb(242, 242, 242);
	padding:10px;
}
.ml10 {
	margin-left: 10px;
}
</style>
