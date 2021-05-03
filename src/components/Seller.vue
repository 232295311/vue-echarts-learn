<!-- 
    商家销量统计的横向柱状图
-->
<template>
  <div class="com-container">
    <div class="com-chart"
         ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
      currentPage: 1, //当前显示的页数
      totalPage: 0, //一共有多少页
      timerId: null //定时器的标识
    }
  },
  methods: {
    //   初始化echartInstance对象
    initChar() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      //   配置项之一 对图表初始化配置的控制
      const initOption = {
        title: {
          text: '▍商家销售统计',
          textStyle: {
          },
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              //   指明颜色渐变的方向
              // 指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      //对图表对象进行鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    //   获取服务器的数据
    async getData() {
      // http://127.0.0.1:8888/api/seller
      const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      //   对数据排序
      this.allData.sort((a, b) => {
        return a.value - b.value //从小到大的排序
      })
      //每5个元素显示一页
      this.totalPage = Math.ceil(this.allData.length / 5)
      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5 //0
      const end = this.currentPage * 5 //5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
    //   配置项之二，专门用来给图表添加数据
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    //设定动态刷新的定时器
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 当浏览器大小发生变化时，完成页面的适配
    screenAdapter() {
      var titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6
    //   配置项之三，根据窗口变化改变柱和标题的宽度等
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      //手动地调用图表对象的resize 这样才会修改整个图表的大小
      this.chartInstance.resize()
    }
  },
  mounted() {
    this.initChar()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style lang="less" scoped>
</style>