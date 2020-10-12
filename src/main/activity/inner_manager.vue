<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>内部收徒管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="page--content">
        <el-form ref="form" :model="form" :rules="rules"  label-width="100px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="多个徒弟用,分开"></el-input>
        </el-form-item>
        <el-form-item label="徒弟数" prop="userCount">
          <el-input v-model="form.userCount"></el-input>
        </el-form-item>
        <el-button class="" type="primary" @click="submitHandle">确定</el-button>
        <el-button class="" type="waring" @click="reset">重置</el-button>
      </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'inner_manager',
  data(){
    return {
      form:{
        userId:'',
        userCount:''
      },
      rules:{
        userId: [
            { required: true, message: '请输入用户ID', trigger: 'blur' },
          ],
          userCount:[
            {required: true, message: '请输入徒弟数', trigger: 'blur'}
          ]
      }
    }
  },
  methods:{

    submitHandle(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.apiSaveRanking()
          } else {
            
            return false;
          }
        });
    },
   async apiSaveRanking(){
      let postData = this.form
     let {data:{code}} = await this.$axios.post(this.BASE_URL + 'admin/activity/saveRanking',postData)
      if(+code===200){
        this.$message.success('新增成功')
      }
    },
    reset(){
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style>
  
</style>