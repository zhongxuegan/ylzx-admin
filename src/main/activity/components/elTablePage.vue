<template>
	<div>
		<el-table v-loading="tableLoading" :data="tableData" border>
			<el-table-column
				v-for="(item, index) in tableConfig"
				:key="index"
				align="center"
				:prop="item.prop"
				:label="item.label?item.label:index.toString()"
				:width="item.width?item.width:''"
				:formatter="item.formatter?item.formatter:undefined"
				:sortable="item.sortable?item.sortable:false"
				:fixed="item.fixed?item.fixed:false"
			></el-table-column>
			<el-table-column v-if="detail" label="数据" align="center">
				<template slot-scope="scope">
					<el-button type="primary" @click="lookDetail(scope.row)">{{ detailText }}</el-button>
				</template>
			</el-table-column>
			<el-table-column v-if="operate" label="操作" align="center">
				<template slot-scope="scope">
					<el-button v-if="editOperate" type="primary" @click="edit(scope.row)">{{ editText }}</el-button>
					<el-button v-if="delOperate" type="primary" @click="del(scope.row)">{{ delText }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination" v-if="pagination">
			<el-pagination
				background
				@current-change="pageChange"
				@size-change="sizeChange"
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="[10, 20, 50, 100]"
				:current-page.sync="pageNum"
				:total="total"
			></el-pagination>
		</div>
	</div>
</template>

<!-- 
prop:													
	属性				说明					类型			默认值
	tableData:   	展示数据				Array 		无	
	tableConfig: 	table配置			Array 		无	
	tableLoading:	加载动画				Boolean 	false
	detail:			是否显示详情			Boolean 	false
	operate:		是否显示操作			Boolean 	true
	editOperate:	是否显示编辑按钮		Boolean 	true
	delOperate:		是否显示删除按钮		Boolean  	true
	detailText:		详情按钮文本			String  	查看详情
	editText:		编辑按钮文本			String 		编辑
	delText:		删除按钮文本			String 		删除
	pagination:		是否显示分页			Boolean     true
	page:			页码					Number      1
	total:			总页码				Number      0
	
tableConfig 配置:
	object[]:
		label 		el-table的label值		String
		prop 		el-table的prop值			String
		sortable 	el-table的sortable值		Boolean
		width 		el-table的width值		String
		formatter 	el-table的formatter值	Function
		
event:	
	@lookDetail:	查看详情按钮事件
	@edit:			编辑按钮事件
	@del:			删除按钮事件
	@pageChange:	el-pagination的current-change事件
	@sizeChange:	el-pagination的size-change事件
	
 -->

<script>
export default {
	name: 'elTablePage',
	props: {
		tableLoading: { type: Boolean, default: false },
		tableData: { type: Array, required: true },
		tableConfig: { type: Array, required: true },
		detail: { type: Boolean, default: false },
		operate: { type: Boolean, default: false },
		editOperate: { type: Boolean, default: true },
		delOperate: { type: Boolean, default: true },
		detailText: { type: String, default: '查看详情' },
		editText: { type: String, default: '编辑' },
		delText: { type: String, default: '删除' },
		pagination: { type: Boolean, default: true },
		page:{ type:Number, default:1 },
		total:{ type:Number, default:0 }
	},
	data() {
		return {
			pageNum:JSON.parse(this.page)
		};
	},
	methods: {
		lookDetail(row) {
			this.$emit('lookDetail',row)
		},
		edit(row) {
			this.$emit('edit',row)
		},
		del(row) {
			this.$emit('del',row)
		},
		pageChange(e){
			this.$emit('pageChange',e)
		},
		sizeChange(e){
			this.$emit('sizeChange',e)
		},
		noFormat(row, column, cellValue, index){
			return cellValue;
		}
	}
};
</script>