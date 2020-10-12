<template>
	<div>
		<el-row :gutter="20">
			<el-card shadow="hover" class="mgb20">
				<div class="user-info">
					<img src="../../assets/img/img.jpg" class="user-avator" alt="" />
					<div class="user-info-cont">
						<div class="user-info-name">{{ name }}</div>
						<div>{{ role }}</div>
					</div>
				</div>
			</el-card>
		</el-row>
	</div>
</template>

<script>
export default {
	name: 'dashboard',
	data() {
		return {
			name: localStorage.getItem('ms_username')
		};
	},
	computed: {
		role() {
			return this.name === 'admin' ? '超级管理员' : '普通用户';
		}
	},
};
</script>

<style scoped>
.el-row {
	margin-bottom: 20px;
}

.user-info {
	display: flex;
	align-items: center;
}

.user-avator {
	width: 120px;
	height: 120px;
	border-radius: 50%;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 20px;
}

.chart-container {
	position: relative;
	width: 100%;
	height: calc(100vh - 100px);
}
</style>
