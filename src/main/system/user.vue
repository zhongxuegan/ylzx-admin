<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					用户信息
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="status" placeholder="状态" class="handle-select mr10" @change="changeStatus">
					<el-option v-for="item in userStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-select v-model="userType" placeholder="用户类型" class="handle-select mr10" @change="changeStatus">
					<el-option v-for="item in userTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
				</el-select>
				<el-select v-model="appSystemCode" placeholder="设备类型" class="handle-select mr10" @change="changeStatus">
					<el-option v-for="item in appSystemArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
				</el-select>
			</div>
			<div class="handle-box">
				<el-input placeholder="用户ID" class="handle-input mr10" v-model="userId" type="number" clearable></el-input>
				<el-input v-model="parentId" placeholder="师傅ID" type="number" class="handle-input mr10" clearable></el-input>
				<el-input v-model="mobile" placeholder="手机号" class="handle-input mr10" clearable></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="dataList" border class="table" ref="multipleTable">
				<el-table-column prop="userId" label="用户ID" align="center" width="60" sortable></el-table-column>
				<el-table-column prop="remark" align="center" label="备注">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="right">
							<div style="margin-bottom:5px;">
								<el-input type="textarea" v-model="scope.row.remark" :rows="3" v-if="scope.row.editR"></el-input>
								<p v-else>{{ scope.row.originRemark }}</p>
							</div>
							<el-button type="info" v-if="scope.row.editR" @click="cancelRemark(scope.row, scope.$index)">取消</el-button>
							<el-button type="info" v-else @click="editRemark(scope.row, scope.$index)">编辑</el-button>
							<el-button type="primary" @click="confirmEdit(scope.row)">保存</el-button>
							<div slot="reference" class="name-wrapper">
								<p size="medium">{{ scope.row.originRemark ? scope.row.originRemark : '无' | formatString }}</p>
							</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="appSystemCode" label="设备类型" :formatter="formatVersion" align="center" width="60" sortable></el-table-column>
				<el-table-column prop="statusLabel" align="center" label="状态" width="120">
					<template slot-scope="scope">
						<!-- <template v-if="scope.row.edit">
							<el-select v-model="scope.row.status" placeholder="请选择" class="mr10">
								<el-option v-for="item,index in userStatusOptions" v-if="index !== 0" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
						<span v-else>{{ scope.row.statusLabel }}</span> -->
						<!-- <span>{{ scope.row.statusLabel }}</span> -->
						<template>
							<el-select v-model="scope.row.status" placeholder="请选择" @change="statusChange($event,scope.row)">
								<el-option v-for="(item,index) in userStatusOptions" v-if="index !== 0" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
					</template>
				</el-table-column>
				<el-table-column prop="nickname" align="center" label="昵称" width="100">
					<template slot-scope="scope">
						<template v-if="scope.row.edit">
							<el-input v-model="scope.row.nickname" class="edit-input" size="small" />
						</template>
						<span v-else>{{ scope.row.nickname }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="userType" align="center" :formatter="formatUserType" label="用户类型" width="100"></el-table-column>
				<el-table-column prop="name" align="center" label="收款人姓名" width="60">
					<template slot-scope="scope">
						<template v-if="scope.row.edit">
							<el-input v-model="scope.row.name" class="edit-input" size="small" />
						</template>
						<span v-else>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="wechat" align="center" label="微信号" width="100">
					<template slot-scope="scope">
						<template v-if="scope.row.edit">
							<el-input v-model="scope.row.wechat" class="edit-input" size="small" />
						</template>
						<span v-else>{{ scope.row.wechat }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="alipay" align="center" label="支付宝账号" width="100">
					<template slot-scope="scope">
						<template v-if="scope.row.edit">
							<el-input v-model="scope.row.alipay" class="edit-input" size="small" />
						</template>
						<span v-else>{{ scope.row.alipay }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="parentId" align="center" label="师傅ID" width="60">
					<template slot-scope="scope">
						<template v-if="scope.row.edit">
							<el-input v-model="scope.row.parentId" class="edit-input" size="small" />
						</template>
						<span v-else>{{ scope.row.parentId }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="mobile" label="手机号" align="center" width="100">
					<template slot-scope="scope">
						<template v-if="scope.row.edit">
							<el-input v-model="scope.row.mobile" class="edit-input" size="small" />
						</template>
						<span v-else>{{ scope.row.mobile }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="totalIncome" align="center" label="总收入" width="80"></el-table-column>
				<el-table-column prop="balance" label="账户余额" width="80" align="center"></el-table-column>
				<el-table-column label="徒弟数" align="center" width="50">
					<template slot-scope="scope">
						<el-link type="primary" @click="showChild(scope.$index, scope.row)">{{ scope.row.discipleCount }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="efficientDiscipleCount" align="center" label="有效徒弟" width="50"></el-table-column>
				<el-table-column prop="dateLocal" label="注册时间" width="95" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<template v-if="scope.row.edit">
							<el-button style="margin-left:8px;margin-bottom:5px;" type="success" size="small" @click="confirmEdit(scope.row)">确认</el-button>
							<el-button type="info" size="small" @click="cancelEdit(scope.row)">取消</el-button>
						</template>
						<el-button v-else type="primary" size="small" @click="scope.row.edit = !scope.row.edit">编辑</el-button>
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
					:current-page.sync="cur_page"
					:total="cur_total"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="徒弟数" width="100%" :visible.sync="dialogTableVisible">
			<el-table v-loading="tableChildLoading" :data="dataChildList" border class="table" ref="multipleTable">
				<el-table-column prop="userId" label="用户ID" align="center" sortable></el-table-column>
				<el-table-column prop="statusLabel" label="状态" align="center"></el-table-column>
				<el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
				<el-table-column prop="payee" label="收款人姓名" align="center"></el-table-column>
				<el-table-column prop="wechat" label="微信号" align="center"></el-table-column>
				<el-table-column prop="alipay" label="支付宝账号" align="center"></el-table-column>
				<el-table-column prop="parentId" label="师傅ID" align="center"></el-table-column>
				<el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
				<el-table-column prop="totalIncome" label="总收入" align="center"></el-table-column>
				<el-table-column prop="balance" label="账户余额" align="center"></el-table-column>
				<el-table-column label="徒弟数" prop="discipleCount" align="center"></el-table-column>
				<el-table-column prop="efficientDiscipleCount" label="有效徒弟" align="center"></el-table-column>
				<el-table-column prop="dateLocal" label="注册时间" align="center"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleChildCurrentChange"
					@size-change="handleChildSizeChange"
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100]"
					:current-page.sync="childCurrentPage"
					:total="curChild_total"
				></el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			userType: null, // 默认用户为普通用户
			status: null,
			appSystemCode: null,
			userId: null,
			parentId: null,
			pageNum: 1,
			pageSize: 10,
			cur_page: 1,
			cur_size: 1,
			childPageSize: 10,
			childPageNum: 1,
			childCurrentPage: 1,
			mobile: null,
			cur_total: 0,
			curChild_total: 0,
			childParentId: null,
			tableLoading: false,
			tableChildLoading: false,
			dialogTableVisible: false,
			userStatusOptions: [{ label: '全部', value: '' }, { label: '封禁', value: 0 }, { label: '正常', value: 1 }, { label: '异常', value: 2 }],
			dataList: [],
			dataChildList: [],
			userTypeArr: [{ name: '全部', value: '' }, { name: '普通用户', value: 1 }, { name: 'vip用户', value: 2 }, { name: 'svip用户', value: 3 }],
			appSystemArr: [{ name: '全部', value: '' }, { name: '未知', value: 0 }, { name: 'android', value: 1 }, { name: 'ios', value: 2 }]
		};
	},
	filters: {
		formatString: function(value) {
			if (value && value.length > 5) {
				return value.substring(0, 5) + '...';
			} else {
				return value;
			}
		}
	},
	created() {
		this.tableLoading = true;
		this.getData();
	},
	methods: {
		search() {
			this.tableLoading = true;
			this.pageNum = 1;
			this.cur_page = 1;
			this.getData();
		},
		formatUserType(row, column, cellValue, index) {
			return cellValue === 1 ? '普通用户' : cellValue === 2 ? 'vip用户' : 'svip用户';
		},
		formatVersion(row, column, cellValue, index) {
			return cellValue === 1 ? 'android' : cellValue === 2 ? 'ios' : '未知';
		},
		handleCurrentChange(val) {
			this.pageNum = val;
			this.cur_page = val;
			this.getData();
		},

		handleSizeChange(val) {
			this.pageNum = 1;
			this.cur_page = 1;
			this.pageSize = val;
			this.getData();
		},

		// 徒弟数处理函数
		handleChildCurrentChange(val) {
			this.childPageNum = val;
			this.childCurrentPage = val;
			this.getChildData();
		},

		handleChildSizeChange(val) {
			this.childPageNum = 1;
			this.childCurrentPage = 1;
			this.childPageSize = val;
			this.getChildData();
		},
		showChild(index, data) {
			this.dialogTableVisible = true;
			this.childParentId = data.userId;
			this.getChildData();
		},
		changeStatus() {
			this.cur_page = 1;
			this.pageNum = 1;
			this.getData();
		},

		cancelRemark(row) {
			row.remark = row.originRemark;
			row.editR = false;
		},

		editRemark(row) {
			this.dataList.map(item => {
				item.editR = false;
			});
			row.editR = true;
		},

		cancelEdit(row) {
			row.edit = false;
			row.nickname = row.originalNickName;
			row.name = row.originalName;
			row.wechat = row.originalWechat;
			row.status = row.originalStatus;
			row.alipay = row.originalAlipay;
			row.mobile = row.orginalMobile;
			row.parentId = row.orginalParentId;
		},

		confirmEdit(row) {
			const { userId, mobile, nickname, name, wechat, alipay, parentId, remark } = row;
			this.$axios
				.post(this.BASE_URL + 'admin/user/updateUserByCon', {
					userId,
					// status, // statusChange 方法改变状态
					mobile,
					nickname,
					name,
					wechat,
					alipay,
					parentId,
					remark
				})
				.then(res => {
					if (res) {
						this.$message({
							message: '更新用户信息成功',
							type: 'success'
						});
						this.getData();
					}
				});
		},
		async statusChange(e,row){
			// this.tableLoading = true;
			let postData = {
				userId: row.userId,
				status: e
			};
			try{
				let {
					data: { code, message }
				} = await this.$axios.post(this.BASE_URL + 'admin/account/forceOutWecharUser', postData);
				if (code === '200') {
					this.$message.success(message);
				}
			}catch(e){
				this.getData();
			}
			
		},
		operateList(list) {
			if (!Array.isArray(list)) return;
			list.map(item => {
				item.statusLabel = item.status === 0 ? '封禁' : item.status === 1 ? '正常' : '异常';
				item.originalStatus = item.status;
				item.orginalMobile = item.mobile;
				item.originalNickName = item.nickname;
				item.originalName = item.name;
				item.originalWechat = item.wechat;
				item.originalAlipay = item.alipay;
				item.orginalParentId = item.parentId;
				item.dateLocal = this.$moment(item.addDate).format('YYYY-MM-DD HH:mm:ss');
				item.edit = false;
				item.originRemark = item.remark;
				item.editR = false;
			});
			return list;
		},
		getData() {
			let { pageNum, status, pageSize, userId, parentId, mobile, userType, appSystemCode } = this;

			this.$axios
				.post(this.BASE_URL + 'admin/user/listUserPageByCon', {
					page: pageNum,
					size: pageSize,
					status,
					userId,
					parentId,
					mobile,
					userType,
					appSystemCode
				})
				.then(res => {
					this.tableLoading = false;
					this.dataList = this.operateList(res.data.data.list);
					this.cur_total = res.data.data.total;
				});
		},
		getChildData() {
			this.tableChildLoading = true;
			let { childPageNum, childPageSize, childParentId } = this;
			this.$axios
				.post(this.BASE_URL + 'admin/user/listUserPageByCon', {
					pageNum: childPageNum,
					pageSize: childPageSize,
					parentId: childParentId
				})
				.then(res => {
					this.tableChildLoading = false;
					this.dataChildList = this.operateList(res.data.data.list);
					this.curChild_total = res.data.data.total;
				});
		}
	}
};
</script>
<style scoped>
.handle-box {
	padding-bottom: 15px;
}
.handle-select {
	width: 120px;
}
.handle-input {
	width: 200px;
	display: inline-block;
}
.mr10 {
	margin-right: 10px;
}
</style>
