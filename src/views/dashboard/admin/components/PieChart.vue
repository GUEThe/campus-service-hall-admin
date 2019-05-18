<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import echarts from 'echarts'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

@Component
export default class PieChart extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '300px' }) private height!: string

  mounted() {
    this.initChart()
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['学生工作处', '人事处', '财务处', '校办', '国资处']
      },
      series: [
        {
          name: '每周办事统计',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '38%'],
          data: [
            { value: 320, name: '学生工作处' },
            { value: 240, name: '人事处' },
            { value: 149, name: '财务处' },
            { value: 100, name: '校办' },
            { value: 59, name: '国资处' }
          ],
          animationEasing: 'cubicInOut',
          animationDuration: 2600
        }
      ]
    })
  }
}
</script>
