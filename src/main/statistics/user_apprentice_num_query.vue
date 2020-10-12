
<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户徒弟数量查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <br />
      <el-form label-width="180px">
        <el-form-item label="师傅ID">
          <el-input v-model="parentIdCon" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="注册日期区间">
          <el-date-picker type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="开始日期" v-model="startRegisterCon" class="handle-label mr10"></el-date-picker>
          <i class="line mr10">-</i>
          <el-date-picker type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="结束日期" v-model="endRegisterCon" class="handle-label mr10"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-progress :percentage="percentage"></el-progress>
        <br />
        <el-form-item label="师傅ID">
          <el-input v-model="parentId" style="width: 50%" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="新注册用户数">
          <el-input v-model="apprenticeUserNum" style="width: 50%" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      parentIdCon: "",
      startRegisterCon: "",
      endRegisterCon: "",

      parentId: "",
      apprenticeUserNum: 0,

      percentage: 0
    };
  },
  methods: {
    search() {
      this.findCountData();
    },
    findCountData() {
      this.percentage = 0;
      if (this.parentIdCon == "") {
        this.$message({
          type: "info",
          message: "师傅ID不能为空"
        });
        return;
      }
      this.$axios
        .post(this.BASE_URL + "admin/account/userDataQuery", {
          parentId: this.parentIdCon,
          startRegister: this.startRegisterCon,
          endRegister: this.endRegisterCon
        })
        .then(res => {
          if (res.data.code === "200") {
            this.parentId = res.data.data.parentId;
            this.apprenticeUserNum = res.data.data.apprenticeUserNum;
            this.percentage = 100;
          } else {
            this.$message({
              type: "info",
              message: res.data.message
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 15px;
}

.handle-select {
  width: 120px;
}

.handle-label {
  width: 140px;
}

.handle-input {
  width: 200px;
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
</style>
