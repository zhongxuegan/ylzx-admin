<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>h5分类管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="search" @click="changeH5path">更换h5路径</el-button>
        <el-button type="primary" icon="el-icon-add" @click="upateH5Content">更新h5内容</el-button>
        <el-button type="primary" @click="clearOldPath">清空旧路径</el-button>
      </div>
      <div class="page--content">
        <div class="flex">
          <div class="flex--label">文章h5源内容路径:</div>
          <div class="flex--title">{{info.newsPathBase}}</div>
        </div>
        <div class="flex">
          <div class="flex--label">生成h5路径的数量:</div>
          <div class="flex--title">{{info.newsPathNum}}</div>
        </div>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>h5当前路径列表</span>
              </div>
              <div v-for="o in info.newsPathCur" :key="o" class="text item">
                {{'路径名称 ' + o }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>待上架的h5路径列表</span>
              </div>
              <div v-for="o in info.newsPathNew" :key="o" class="text item">
                {{'路径名称 ' + o }}
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12" style="margin-top:10px;">
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>待清空的h5路径列表</span>
              </div>
              <div v-for="o in info.newsPathWaitClear" :key="o" class="text item">
                {{'路径名称 ' + o }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>待更新的h5路径列表</span>
              </div>
              <div v-for="o in info.newsPathWaitUpdate" :key="o" class="text item">
                {{'路径名称 ' + o }}
              </div>
            </el-card>
          </el-col>
        </el-row>

      </div>

    </div>
  </div>
</template>
<script>
export default {
  name: "h5manager",
  data() {
    return {
      info: {},
      loading: false
    };
  },
  methods: {
    async getData() {
      let {
        data: { data, code }
      } = await this.$axios.post(this.BASE_URL + "admin/article/h5/path-info");
      if (+code === 200) {
        this.info = data;
      }
    },
    changeH5path() {
      this.$confirm("确认要修改路径", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.apiChangePath();
        })
        .catch(() => {});
    },
    upateH5Content() {
      this.$confirm("确认要更新H5内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.apiUpdataContent();
        })
        .catch(() => {});
    },
    clearOldPath() {
      this.$confirm("确认要清空旧路径", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.apiClearOldPath();
        })
        .catch(() => {});
    },
    async apiChangePath() {
      const temploading = this.$loading({
        lock: true,
        text: "loading",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)"
      });
      let {
        data: { code }
      } = await this.$axios.post(
        this.BASE_URL + "admin/article/h5/change-catalog"
      );
      if (+code === 200) {
        this.getData();
        temploading.close();
        this.$message({
          type: "success",
          message: "修改路径成功"
        });
      } else {
        temploading.close();
      }
    },
    async apiUpdataContent() {
      const temploading = this.$loading({
        lock: true,
        text: "loading",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)"
      });
      let {
        data: { code }
      } = await this.$axios.post(this.BASE_URL + "admin/article/h5/update");
      if (+code === 200) {
        this.getData();
        temploading.close();
        this.$message({
          type: "success",
          message: "更新内容成功"
        });
      } else {
        temploading.close();
      }
    },
    async apiClearOldPath() {
      const temploading = this.$loading({
        lock: true,
        text: "loading",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)"
      });
      let {
        data: { code }
      } = await this.$axios.post(this.BASE_URL + "admin/article/h5/clear-old");
      if (+code === 200) {
        this.getData();
        temploading.close();
        this.$message({
          type: "success",
          message: "清空旧路径成功"
        });
      } else {
        temploading.close();
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style  scoped>
.flex {
  display: flex;
  margin: 10px 0;
}
.content {
  margin-top: 20px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.flex--label {
  width: 160px;
  color: #999;
}
.flex--title {
  flex: 1;
}
</style>