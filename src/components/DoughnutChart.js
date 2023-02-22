import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: {
    datas: Object,
    options: Object
  },
  mounted () {
    this.renderChart(this.datas, this.options);
  }
}