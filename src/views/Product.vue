<template>
<div class="panel">

  <div class="heading">
    <h2>产品列表</h2>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="#/app">后台首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="#/app/product">产品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>产品列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="search">
    <div class="options">
      <el-button v-if="ids.length" type="danger" size="small" @click="batchDel">批量删除</el-button>

      <el-select v-model.number="state" placeholder="是否审核" size="small" clearable>
        <el-option label="未审核" :value="0" />
        <el-option label="已审核" :value="1" />
      </el-select>

      <el-select v-model="pid" placeholder="所属分类" size="small" clearable>
        <el-option
        v-for="item in cateOptions"
        :key="item.id"
        :label="item.title"
        :value="item.id" />
      </el-select>

      <el-select v-model="price" placeholder="价格范围" size="small" clearable>
        <el-option label="0~99元" value="0-99" />
        <el-option label="100~999元" value="100-999" />
        <el-option label="1000~9999元" value="1000-9999" />
      </el-select>

      <el-input v-model.trim="keyword" placeholder="请输入标题" size="small" clearable />

    </div>
    <el-button type="danger" icon="el-icon-plus" size="small" @click="addItem">新增</el-button>
  </div>

  <div class="list">
    <el-table ref="table" :data="pageData" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" />
      <el-table-column label="排序" prop="order" width="60" />
      <el-table-column label="分类" :formatter="formatPid" width="120" />
      <el-table-column label="缩略图" width="200">
        <template v-slot="scope">
          <el-image
          style="width:150px height:100px"
          :src="scope.row.picurl"
          :preview-src-list="[scope.row.picurl]" />
        </template>
      </el-table-column>

      <el-table-column label="标题" prop="title" />
      <el-table-column label="单价" prop="price" />
      <el-table-column label="发布日期" prop="addtime" :formatter="formatTime" width="120" />
      <el-table-column label="审核" width="80">
        <template v-slot="scope">
          <el-switch
          v-model="scope.row.state"
          :active-value="1"
          :inactive-value="0"
          @change="handelChange($event,scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="right">
        <template v-slot="scope">
          <el-button size="mini" @click="editItem(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="delItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
    background
    layout="prev, pager, next"
    :current-page.sync="page"
    :page-size="perpage"
    :total="searchData.length"
    />

  </div>

  <!-- 新增或修改窗口 -->
  <el-dialog
  :title="(form.id?'修改':'新增')+'产品'"
  :visible.sync="dialogVisible"
  width="800px"
  top="10vh"
  >

    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <el-form-item label="所属分类" prop="pid">
        <el-select v-model="form.pid" clearable>
          <el-option
          v-for="item in cateOptions"
          :key="item.id"
          :label="item.title"
          :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="产品标题" prop="title">
        <el-input v-model.trim="form.title"  />
      </el-form-item>

      <el-form-item label="产品摘要" prop="summary">
        <el-input v-model.trim="form.summary"  />
      </el-form-item>

      <el-form-item label="产品单价" prop="price">
        <el-input-number :min="1" v-model="form.price"  />
      </el-form-item>

      <el-form-item label="产品缩略图" prop="picurl">
        <el-tooltip class="item" effect="dark" content="请上传150x100的图片尺寸！" placement="right-start">
          <el-upload
          class="pic-upload size150x100"
          action="http://cloud.scnew.com.cn/api/user/upload"
          :before-upload="handleBeforeUpload"
          :on-success="handlePicSuccess"
          :show-file-list="false"
          >
            <img v-if="form.picurl" :src="form.picurl">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-tooltip>

      </el-form-item>

      <el-form-item label="产品预览图" prop="viewurl">
        <el-input v-model.trim="form.viewurl"  />
      </el-form-item>

      <el-form-item label="产品库存" prop="total">
        <el-input-number :min="1" v-model="form.total"  />
      </el-form-item>

      <el-form-item label="产品内容" prop="content">
        <mavon-editor v-model="form.content"/>
      </el-form-item>

      <el-form-item label="排序号码" prop="order">
        <el-input-number :min="1" v-model="form.order"  />
      </el-form-item>

      <el-form-item label="是否审核" prop="state">
          <el-switch
          v-model="form.state"
          :active-value="1"
          :inactive-value="0"
          />
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save" >确 定</el-button>
    </span>

  </el-dialog>

</div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { formatstamp, searchCd } from '../utils'

export default {
  components: { mavonEditor },
  data () {
    return {
      state: '',
      pid: '',
      keyword: '',
      price: '',
      page: 1,
      perpage: 1,
      tableData: [],
      cateOptions: [],
      ids: [],
      dialogVisible: false,
      form: {},
      rules: {
        pid: { required: true, message: '请选择所属分类' },
        title: { required: true, message: '请输入标题' },
        picurl: { required: true, message: '请上传图片' },
        price: { required: true, message: '请输入单价' },
        total: { required: true, message: '请输入库存数量' }
      }
    }
  },
  created () {
    this.getCate()
    this.getList()
  },
  computed: {
    searchData () {
      return this.tableData.filter(item => {
        const price = this.price.split('-')
        const cd1 = this.state !== '' ? (item.state === this.state) : true // 条件1
        const cd2 = this.pid !== '' ? (item.pid === this.pid) : true // 条件2
        const cd3 = this.price !== '' ? (item.price >= +price[0] && item.price <= +price[1]) : true // 条件3
        const cd4 = this.keyword !== '' ? searchCd(this.keyword, item.title) : true // 条件4
        return cd1 && cd2 && cd3 && cd4
      })
    },
    pageData(){
      let start = (this.page - 1) * this.perpage;
      let end = start + this.perpage;
      return this.searchData.slice(start, end);
    }
  },
  methods: {
    formatTime (row) {
      return formatstamp(row.addtime)
    },
    formatPid (row) {
      const info = this.cateOptions.find(item => item.id === row.pid)
      return info ? info.title : '无'
    },
    handelChange (state, id) {
      this.$http.post('product/state', { state, id }).then(res => {
        if (res.result.err > 0) {
          this.$message.error(res.result.msg)
        } else {
          this.$message.success(res.result.msg)
        }
      })
    },
    handleSelectionChange (ids) {
      this.ids = ids.map(item => item.id)
    },
    handleBeforeUpload (file) {
      const type = file.type.split('/')[1].toLowerCase()
      const isPic = ['jpeg', 'png', 'gif', 'jpg', 'webp']
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPic.includes(type)) {
        this.$message.error('上传图片只能是 ' + isPic + ' 格式!')
      }

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return isPic && isLt2M
    },
    handlePicSuccess (res) {
      if (res.err > 0) {
        this.$message.error(res.desc)
      } else {
        this.$message.success(res.desc)
        this.$set(this.form, 'picurl', res.result)
      }
    },
    getCate () {
      this.$http.get('productcate/list').then(res => {
        this.cateOptions = res.result
      })
    },
    getList () {
      this.$http.get('product/list').then(res => {
        this.tableData = res.result
      })
    },
    addItem () {
      this.form = { id: 0, total: 999, order: 1, state: 1 }
      this.dialogVisible = true
    },
    editItem (row) {
      this.form = { ...row }
      this.dialogVisible = true
    },
    delItem (id) {
      this.$confirm('您确定要删除此条记录吗？', '提示').then(() => {
        this.$http.post('product/remove', { id }).then(res => {
          if (res.result.err > 0) {
            this.$message.error(res.result.msg)
          } else {
            this.$message.success(res.result.msg)
            this.getList() // 刷新
          }
        })
      }).catch(() => {})
    },
    batchDel () {
      this.$confirm('您确定要删除所选的记录吗？', '提示').then(() => {
        // 发送删除请求
        this.$http.post('product/remove', { id: this.ids }).then(res => {
          if (res.result.err > 0) {
            this.$message.error(res.result.msg)
          } else {
            this.$message.success(res.result.msg)
            this.getList() // 刷新
          }
        })
      }).catch(() => {
        this.$refs.table.clearSelection()
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http.post('product/save', { ...this.form }).then(res => {
            if (res.result.err > 0) {
              this.$message.error(res.result.msg)
            } else {
              this.$message.success(res.result.msg)
              this.getList() // 刷新
              this.dialogVisible = false
            }
          })
        }
      })
    }

  }

}
</script>

<style>
.size150x100 .el-upload{
  width: 150px;
  height: 100px;
}
</style>
