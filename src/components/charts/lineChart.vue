<template>
    <div style="height:100%">
        <el-date-picker type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="开始时间" v-model="startDay" class="handle-label mr10"></el-date-picker>
        <i class="line mr10">-</i>
        <el-date-picker type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="结束时间" v-model="endDay" class="handle-label mr10"></el-date-picker>
        <el-select v-model="adposition" placeholder="广告展示位置" class="handle-select mr10" @change="changeAdPosition">
              <el-option v-for="item in adpositionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
       <el-button type="primary"  @click="initChart">搜索</el-button>
        <div :id="id" :class="className"    :style="{height:height,width:width}"></div>
    </div>

</template>

<script>
  import echarts from 'echarts'
  import resize from '../mixins/resize'
  // pv #33b5e5 ip #ffbb33 ad #ff4444 adPercent #9933cc
  var colors = ['#92d0e6','#f3d395','#e09898','#a36dbd','#33b5e5', '#ffbb33', '#ff4444','#9933cc','#0784b3','#f3a307','#e00707','#69049c'];
  var day1 = new Date()
  var day2 = new Date()
  export default {
    mixins:[resize],
    props:{
      className:{
        type:String,
        default:'chart'
      },
      id:{
        type:String,
        default:'chart'
      },
      width:{
        type:String,
        default:'200px'
      },
      height:{
        type:String,
        default:'200px'
      }
    },
    data() {
      return {
        chart:null,
        startDay:null,
        endDay:null,
        backPage:1,
        adposition:2,
        adTempPosition:2,
        list:[],
        axiosData:[],
        adIpCountByHourList:[],
        clientIpCountList:[],
        pvCountByHourList:[],
        ipPercentRateList:[],
        // 昨天数据
        yesterDayadIpCountByHourList:[],
        yesterDayclientIpCountList:[],
        yesterDaypvCountByHourList:[],
        yesterDayipPercentRateList:[],
        yesterDay:'',
        // 前天数据
        theDayBeforeYesterDayadIpCountByHourList:[],
        theDayBeforeYesterDayclientIpCountList:[],
        theDayBeforeYesterDaypvCountByHourList:[],
        theDayBeforeYesteripPercentRateList:[],
        dayBeforeYesterDay:'',
        adpositionList:[
        {
          value:2,
          label:'底部'
        },
        {
          value:4,
          label:'后退页'
        },
        {
          value:1,
          label:'顶部banner'
        },
        {
          value:3,
          label:'文字链接'
        },
        {
          value:5,
          label:'底部悬浮窗'
        }
      ],
      }
    },
    mounted() {
      this.initChart()
    },
    created(){
      this.startDay = this.dateFtt("yyyy-MM-dd",day1, 1)
      this.endDay = this.dateFtt("yyyy-MM-dd", day1, 1)
    },
    beforeDestroy() {
      if(!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
    async getData() {
      if(this.backPage ===2){
        this.adTempPosition = 2
      }else{
        this.adTempPosition = this.adposition
      }
      let {data:{data,code}} = await this.$axios.get(this.BASE_URL + `admin/account/lineChartByDate?startDay=${this.startDay}&endDay=${this.endDay}&backPage=${this.backPage}&adPosition=${this.adTempPosition}`)
      if(+code ===200){
        this.list = data
        var yesterDayTime = new Date(this.startDay).getTime() - 86400000
        var dayBeforeYesterDayTime = new Date(this.startDay).getTime() - 86400000 * 2
        this.yesterDay= this.dateFtt('yyyy-MM-dd',new Date(yesterDayTime),1)
        this.dayBeforeYesterDay = this.dateFtt('yyyy-MM-dd',new Date(dayBeforeYesterDayTime),1)
        this.axiosData = this.generateAxios(data.adIpCountByHourList)
        // 今日数据
        var todayAdCountData = this.findDayfromList(data.adIpCountByHourList,this.startDay)
        var todayClientIpData = this.findDayfromList(data.clientIpCountList,this.startDay)
        var todaypvCountData = this.findDayfromList(data.pvCountByHourList,this.startDay)
        var todayipPercentData = this.findDayfromList(data.ipPercentRateList,this.startDay)
        this.adIpCountByHourList = this.generateyAxios(data.adIpCountByHourList,todayAdCountData)
        this.clientIpCountList = this.generateyAxios(data.clientIpCountList,todayClientIpData)
        this.pvCountByHourList = this.generateyAxios(data.pvCountByHourList,todaypvCountData)
        this.ipPercentRateList = this.addPercentForItem(this.generateyAxios(data.ipPercentRateList,todayipPercentData))
        
          // 昨日数据
        var yesterDayAdCountData = this.findDayfromList(data.adIpCountByHourList,this.yesterDay)
        var yesterDayClientIpData = this.findDayfromList(data.clientIpCountList,this.yesterDay)
        var yesterDaypvCountData = this.findDayfromList(data.pvCountByHourList,this.yesterDay)
        var yesterDayipPercentData = this.findDayfromList(data.ipPercentRateList,this.yesterDay)
        this.yesterDayadIpCountByHourList = this.generateyAxios(data.adIpCountByHourList,yesterDayAdCountData)
        this.yesterDayclientIpCountList = this.generateyAxios(data.clientIpCountList,yesterDayClientIpData)
        this.yesterDaypvCountByHourList = this.generateyAxios(data.pvCountByHourList,yesterDaypvCountData)
        this.yesterDayipPercentRateList = this.addPercentForItem(this.generateyAxios(data.ipPercentRateList,yesterDayipPercentData))

          // 前天数据
        var dayBeforeYesterDayAdCountData = this.findDayfromList(data.adIpCountByHourList,this.dayBeforeYesterDay)
        var dayBeforeYesterDayClientIpData = this.findDayfromList(data.clientIpCountList,this.dayBeforeYesterDay)
        var dayBeforeYesterDaypvCountData = this.findDayfromList(data.pvCountByHourList,this.dayBeforeYesterDay)
        var dayBeforeYesterDayipPercentData = this.findDayfromList(data.ipPercentRateList,this.dayBeforeYesterDay)
        this.theDayBeforeYesterDayadIpCountByHourList = this.generateyAxios(data.adIpCountByHourList,dayBeforeYesterDayAdCountData)
        this.theDayBeforeYesterDayclientIpCountList = this.generateyAxios(data.clientIpCountList,dayBeforeYesterDayClientIpData)
        this.theDayBeforeYesterDaypvCountByHourList = this.generateyAxios(data.pvCountByHourList,dayBeforeYesterDaypvCountData)
        this.theDayBeforeYesteripPercentRateList = this.addPercentForItem(this.generateyAxios(data.ipPercentRateList,dayBeforeYesterDayipPercentData))

      }
    },
    dateFtt(fmt, date, monthNum) {
      var o = {
        "M+": date.getMonth() + monthNum, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    changeAdPosition(val){
      if(val ===4) {
        this.backPage = 2;
        
      }else{
        this.backPage =1;
      }
    },
    generateAxios(arr){
      let result =[]
      if(this.startDay === this.endDay){
        result = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]

      }else {
        if(!Array.isArray(arr)) return
        for(let i =0;i<arr.length;i++){
          result.push(arr[i].date)
        }
      }
      return result
    },
    addPercentForItem(arr){
      let result = []
      if(!Array.isArray(arr)) return
      for(let i=0;i<arr.length;i++) {
        result.push((arr[i]*100).toFixed(2))
      }
      return result
    },
    findDayfromList(list,str){
      if(!Array.isArray(list)) return
        let result = list.find(item=>{
          return item.date === str
        })
      console.log(result)
        return result
    },
    generateyAxios(arr,obj){
      if(!Array.isArray(arr)) return
      let result = []
      if(this.startDay === this.endDay) {
        for(let item in obj){
          if(item.indexOf('countHour')>-1){
            if(obj[item] !==null){
              result.push(obj[item])
            }else {
              result.push(0)
            }
            }
          }
        }else {
            for(let i= 0; i<arr.length;i++){
              result.push(arr[i].total)
            }
          }
      return result
    },
     async initChart() {
        this.chart = echarts.init(document.getElementById(this.id))
        await this.getData()
        this.chart.setOption({
          title: {
            text:'玉龙资讯数据表',
            top:20
          },
          tooltip: {
            trigger:'axis',
            axisPointer: {
              type:'cross',
              lineStyle: {
                color:'#57167B'
              }
            }
          },
          color:colors,
          legend: {
            top:20,
            icon:'rect',
            data:[
              {name:'文章PV',textStyle:{color:colors[0]}},{name:'文章IP',textStyle:colors[1]},{name:'广告点击IP',textStyle:colors[2]},{name:'广告点击率',textStyle:colors[3]},
              {name:'昨天文章PV',textStyle:colors[0]},{name:'昨天文章IP',textStyle:colors[1]},{name:'昨天广告点击IP',textStyle:colors[2]},{name:'昨天广告点击率',textStyle:colors[3]},
              {name:'前天文章PV',textStyle:colors[0]},{name:'前天文章IP',textStyle:colors[1]},{name:'前天广告点击IP',textStyle:colors[2]},{name:'前天广告点击率',textStyle:colors[3]}
            ],
            // data:['文章PV','文章IP','广告点击IP','广告点击率','昨天文章PV','昨天文章IP','昨天广告点击IP','昨天广告点击率','前天文章PV','前天文章IP','前天广告点击IP','前天广告点击率'],
            selected:{
              '昨天文章PV':false,
              '昨天文章IP':false,
              '昨天广告点击IP':false,
              '昨天广告点击率':false,
              '前天文章PV':false,
              '前天文章IP':false,
              '前天广告点击IP':false,
              '前天广告点击率':false
            }
          },
          grid:{
            top:100,
            left: '2%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.axiosData
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          },
          {
            type: 'value',
            name: '广告点击率',
            min: 0,
            max: 30,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[1]
                }
            },
            axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
                name: '文章PV',
                type: 'line',
                symbol: 'circle',
                symbolSize: 5,
                smooth:true,
                showSymbol: false,
                data: this.pvCountByHourList,
                lineStyle:{
                  color:colors[0]
                }
            },
            {
              name: '文章IP',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              smooth:true,
              showSymbol: false,
              data: this.clientIpCountList,
              lineStyle:{
                color:colors[1]
              }
          },
            {
              name: '广告点击IP',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              smooth:true,
              showSymbol: false,
              data: this.adIpCountByHourList,
              lineStyle:{
                color:colors[2]
              }
          },
          {
              name: '广告点击率',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              smooth:true,
              yAxisIndex: 1,
              showSymbol: false,
              data: this.ipPercentRateList,
              lineStyle:{
                color:colors[3]
              }
          },
          {
                name: '昨天文章PV',
                type: 'line',
                symbol: 'circle',
                symbolSize: 5,
                smooth:true,
                showSymbol: false,
                data: this.yesterDaypvCountByHourList,
                lineStyle:{
                  color:colors[4]
                }
            },
            {
              name: '昨天文章IP',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              smooth:true,
              showSymbol: false,
              data: this.yesterDayclientIpCountList,
              lineStyle:{
                color:colors[5]
              }
          },
            {
              name: '昨天广告点击IP',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              smooth:true,
              showSymbol: false,
              data: this.yesterDayadIpCountByHourList,
              lineStyle:{
                color:colors[6]
              }
          },
          {
              name: '昨天广告点击率',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              yAxisIndex: 1,
              smooth:true,
              showSymbol: false,
              data: this.yesterDayipPercentRateList,
              lineStyle:{
                color:colors[7]
              }
          },
          {
                name: '前天文章PV',
                type: 'line',
                symbol: 'circle',
                symbolSize: 5,
                smooth:true,
                showSymbol: false,
                data: this.theDayBeforeYesterDaypvCountByHourList,
                lineStyle:{
                  color:colors[8]
              }
            },
            {
              name: '前天文章IP',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              smooth:true,
              showSymbol: false,
              data: this.theDayBeforeYesterDayclientIpCountList,
              lineStyle:{
                  color:colors[9]
              }
          },
            {
              name: '前天广告点击IP',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              smooth:true,
              showSymbol: false,
              data: this.theDayBeforeYesterDayadIpCountByHourList,
              lineStyle:{
                  color:colors[10]
              }
          },
          {
              name: '前天广告点击率',
              type: 'line',
              symbol: 'circle',
              symbolSize: 5,
              yAxisIndex: 1,
              smooth:true,
              showSymbol: false,
              data: this.theDayBeforeYesteripPercentRateList,
              lineStyle:{
                  color:colors[11]
              }
          }
          ]
        })
      }
    }
  }
</script>