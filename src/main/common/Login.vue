<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">玉龙资讯后台管理系统</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
				<el-form-item prop="userName">
					<el-input v-model="ruleForm.userName" placeholder="userName" tabindex="1"><el-button slot="prepend" icon="el-icon-lx-people"></el-button></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input tabindex="2" type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
						<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
					</el-input>
				</el-form-item>
				<div class="login-btn"><el-button type="primary" @click="submitForm('ruleForm')">登录</el-button></div>
				<p class="login-tips">Tips : 用户名和密码</p>
			</el-form>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name:'Login',
	data: function() {
		return {
			ruleForm: {
				userName: null,
				password: null
			},
			rules: {
				userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
			}
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					axios.post(this.BASE_URL + 'admin/login/',this.ruleForm,
							{ emulateJSON: true }
						).then(res=>{
							if (res.data.code == '200') {
								localStorage.setItem('ms_username', this.ruleForm.userName);
								localStorage.setItem('token', res.data.data);
								this.$router.push('/');
							} else {
								this.$message.error(res.data.message);
							}
						})
				} else {
					return false;
				}
			});
		}
	}
};
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../../assets/img/login-bg.jpg);
	background-size: 100%;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #000000;
	font-weight: bold;
	border-bottom: 1px solid #ddd;
}
.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
