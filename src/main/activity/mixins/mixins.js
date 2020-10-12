import {
	formatUnit
} from '@/utils/index.js'

// 日期验证
export const verifyDateMinxins = {
	methods: {
		startDateChange() {
			if (this.activityForm.config.startTime > this.activityForm.config.endTime) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.activityForm.config.startTime = this.activityForm.config.endTime;
			}
		},
		endDateChange() {
			if (this.activityForm.config.startTime > this.activityForm.config.endTime) {
				this.$message({
					message: '结束日期不得小于起始日期',
					type: 'warning'
				});
				this.activityForm.config.endTime = this.activityForm.config.startTime;
			}
		}
	}
}
// 新增活动/跳转页面
export const addActivityMinxins = {
	methods: {
		addActivity(path, flag) {
			let newNum;
			if (flag && flag === true) {
				if (this.tableData.length > 0) {
					let numList = this.tableData.map(item => item.num);
					newNum = Math.max.apply(null, numList) + 1;
				} else {
					newNum = 1;
				}
				path += '?num=' + newNum;
			}
			this.$router.push(path);
		},
	}
}
// 查询活动
export const editActivityMinxins = {
	methods: {
		async editActivity(row) {
			let {
				data: {
					code,
					data,
					message
				}
			} = await this.$axios.get(this.BASE_URL + `admin/activity/config/detail?id=${row.id}`);
			if (code === '200') {
				// 分 转 元
				this.activityForm = formatUnit(data, true);
				this.dialogFormVisible = true;
			}
			this.$nextTick(() => {
				this.$refs.content.setContent(data.config.scheme);
				this.$refs.activityForm.clearValidate();
			});
		},
	}
}


// 分页
export const handlePageMinxins = {
	methods: {
		handleCurrentChange(val) {
			this.tableLoading = true;
			this.page = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.tableLoading = true;
			this.size = val;
			this.getData();
		},
	}
}

export const pickerOptionsMinxins = {
	data() {
		return {
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
				}
			},
		}
	}
}

// 清空和提交表单
export const operateMinxins = {
	methods: {
		reset(formName) {
			this.$confirm('确定清空表单吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {
					this.$refs[formName].resetFields();
					this.$refs.content.setContent('');
				})
				.catch(() => {});
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确定添加吗', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.saveActivity();
					}).catch(() => {});
				} else {
					return false;
				}
			});
		},
	}
}
