<template>
  <div class="chart-container">
    <chart height="100%" width="100%"></chart>
  </div>
</template>

<script>
import Chart from "@/components/charts/lineChart.vue";
export default {
  name: "lineChart",
  data() {
    return {};
  },
  components: {
    Chart
  },
  mounted() {},
  created() {
    // this.handleListener()
  },
  activated() {},
  methods: {}
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
}
</style>
