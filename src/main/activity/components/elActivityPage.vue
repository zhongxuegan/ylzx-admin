<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					{{ breadcrumbName }}
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box" v-if="isShowBtn">
				<el-button type="primary" @click="add">{{ btnName }}</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="tableData" border class="table">
				<el-table-column
					v-for="(item, index) in tableConfig"
					:key="index"
					align="center"
					:prop="item.prop"
					:label="item.label ? item.label : index.toString()"
					:width="item.width ? item.width : ''"
					:formatter="item.formatter ? item.formatter : undefined"
					:sortable="item.sortable ? item.sortable : false"
					:fixed="item.fixed ? item.fixed : false"
				></el-table-column>
				<el-table-column v-if="isShowLook" label="数据" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="lookDetail(scope.row)">查看详情</el-button>
					</template>
				</el-table-column>
				<el-table-column v-if="isShowOperate" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" @click="editActivity(scope.row)">编辑</el-button>
						<el-button v-if="isShowDel" type="primary" @click="del(scope.row)">删除</el-button>
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
					:current-page.sync="pageNum"
					:total="total"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<!-- 
prop:
	breadcrumbName:	面包屑名称				String 		
	isShowBtn:		是否显示 添加 按钮		Boolean
	btnName:		按钮名称					String
	tableData:   	展示数据					Array
	tableConfig: 	table配置				Array
	tableLoading:	加载动画					Boolean
	page:			页码					Number
	total:			总页码					Number
	isShowLook:		是否显示详情				Boolean
	isShowOperate:	是否显示操作				Boolean
	isShowDel:		是否显示删除按钮			Boolean
	
tableConfig 配置:
	object[]:
		label 		el-table的label值		String
		prop 		el-table的prop值		String
		sortable 	el-table的sortable值	Boolean
		width 		el-table的width值		String
		formatter 	el-table的formatter值	Function
		
event:	
	@add:  			添加按钮事件				
	@lookDetail:	查看详情按钮事件
	@edit:			编辑按钮事件
	@del:			删除按钮事件
	@pageChange:	el-pagination的current-change事件
	@sizeChange:	el-pagination的size-change事件
	
 -->

<script>
export default {
	name: 'elActivityPage',
	props: {
		breadcrumbName: {
			type: String,
			default: '活动'
		},
		isShowBtn: {
			type: Boolean,
			default: true
		},
		btnName: {
			type: String,
			default: '新建活动'
		},
		tableData: {
			type: Array,
			required: true
		},
		tableConfig: {
			type: Array,
			required: true
		},
		tableLoading: {
			type: Boolean,
			default: false
		},
		page: {
			type: Number,
			default: 1
		},
		total: {
			type: Number,
			default: 0
		},
		isShowLook: {
			type: Boolean,
			default: true
		},
		isShowOperate: {
			type: Boolean,
			default: true
		},
		isShowDel: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			pageNum: JSON.parse(this.page)
		};
	},
	methods: {
		add() {
			this.$emit('add');
		},
		lookDetail(row) {
			this.$emit('lookDetail', row);
		},
		editActivity(row) {
			this.$emit('edit', row);
		},
		del(row) {
			this.$emit('del', row);
		},
		handleCurrentChange(val) {
			this.$emit('pageChange', val);
		},
		handleSizeChange(val) {
			this.$emit('sizeChange', val);
		}
	}
};
</script>
