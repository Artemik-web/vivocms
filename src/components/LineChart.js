import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    datas: Object,
    options: Object
  },
  mounted () {
    this.renderChart(this.datas, this.options);
  }
}