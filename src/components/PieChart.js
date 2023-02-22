import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    datas: Object,
    options: Object
  },
  mounted () {
    this.renderChart(this.datas, this.options);
  }
}