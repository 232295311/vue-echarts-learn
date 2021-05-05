<!-- 热销商品图表 -->
<template>
  <div class='com-container'>
    <div class='com-chart'
         ref='hot_ref'></div>
    <span class="iconfont arr-left"
          @click="toLeft"
          :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right"
          @click="toRight"
          :style="comStyle">&#xe6ed;</span>
    <span class="cat-name">{{catName}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0, //当前所展示出的一级数据
      titleFontSize: 0
    }
  },
  computed: {
    catName() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  created() {
    //进行回调函数的注册，当拿到数据后，进行getData
    this.$socket.registerCallBack('hotproductData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    // 发送json数据给服务器，告诉服务器我需要数据
    this.$socket.send({
      action: 'getData',
      socketType: 'hotproductData',
      charName: 'hotproduct',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotproductData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        title: {
          text: '▍热销商品的占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            // console.log(arg)
            const thirdCategory = arg.data.children
            // 计算出所有三级分类的数值总和
            let total = 0
            thirdCategory.forEach((item) => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach((item) => {
              retStr += `
                ${item.name}:${parseInt((item.value / total) * 100)} %
                <br/>
                `
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData(ret) {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      //   const { data: ret } = await this.$http.get('hotproduct')
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
    },
    updateChart() {
      // 处理图表需要的数据
      const lengendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name
        }
      )
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children
          }
        }
      )
      const dataOption = {
        legend: {
          data: lengendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight() {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  }
}
</script>

<style lang='less' scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>
