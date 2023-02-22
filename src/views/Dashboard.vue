<template>
<div>
  <h2>仪表盘页面</h2>
  <line-chart :datas="datas1" :options="options" />
  <br>
  <br>
  <pie-chart :datas="datas2" :options="options" />
  <br>
  <br>
  <doughnut-chart :datas="datas2" :options="options" />
</div>
</template>

<script>
import LineChart from '../components/LineChart'
import PieChart from '../components/PieChart'
import DoughnutChart from '../components/DoughnutChart'
export default {
  components: {
    LineChart,
    PieChart,
    DoughnutChart
  },
  data(){
    return {
      datas1: {
        labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
        datasets: [
          {
            label: '销售额度表',
            backgroundColor: 'transparent',
            borderColor: 'red',
            borderWidth: 2,
            data: [40, 39, 10, 40, 39, 80, 40]
          },
          {
            label: '订单总数表',
            backgroundColor: '#ff6600',
            data: [30, 19, 20,60, 29, 10,30]
          }
        ]
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false
      },
      datas2: {
        labels: ['红','绿','蓝'],
        datasets: [
          { 
            backgroundColor: ['red','green','blue'],
            data: [30, 10, 25] 
          }
        ],
      },
    }
  }
}
</script>

<style>

</style>
