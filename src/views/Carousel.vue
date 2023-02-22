<template>
<div class="panel">

  <div class="heading">
    <h2>轮播列表</h2>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="#/app">后台首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="#/app/carousel">轮播管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>轮播列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="search">
    <div class="options">
      <el-button v-if="ids.length" type="danger" size="small" @click="batchDel">批量删除</el-button>

      <el-select v-model.number="state" placeholder="是否审核" size="small" clearable>
        <el-option label="未审核" :value="0" />
        <el-option label="已审核" :value="1" />
      </el-select>

      <el-input v-model.trim="keyword" placeholder="请输入标题" size="small" clearable />
    </div>
    <el-button type="danger" icon="el-icon-plus" size="small" @click="addItem">新增</el-button>
  </div>

  <div class="list">
    <el-table ref="table" :data="searchData" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" />
      <el-table-column label="排序" prop="order" width="60" />
      <el-table-column label="缩略图" width="200">
        <template v-slot="scope">
          <el-image
          style="width:150px height:100px"
          :src="scope.row.picurl"
          :preview-src-list="[scope.row.picurl]" />
        </template>
      </el-table-column>

      <el-table-column label="标题" prop="title" />
      <el-table-column label="链接" prop="url" />
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

  </div>

  <!-- 新增或修改窗口 -->
  <el-dialog
  :title="(form.id?'修改':'新增')+'图片'"
  :visible.sync="dialogVisible"
  width="400px"
  top="10vh"
  >

    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <el-form-item label="图片标题" prop="title">
        <el-input v-model="form.title"  />
      </el-form-item>

      <el-form-item label="上传图片" prop="picurl">
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

      <el-form-item label="图片链接" prop="url">
        <el-input v-model="form.url"  />
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
import { formatstamp, searchCd } from '../utils'
export default {
  data () {
    return {
      state: '',
      keyword: '',
      tableData: [],
      ids: [],
      dialogVisible: false,
      form: {},
      rules: {
        title: { required: true, message: '请输入标题' },
        picurl: { required: true, message: '请上传图片' }
      }
    }
  },
  created () {
    this.getList()
  },
  computed: {
    searchData () {
      return this.tableData.filter(item => {
        const cd1 = this.state !== '' ? (item.state === this.state) : true // 条件1
        const cd2 = this.keyword !== '' ? searchCd(this.keyword, item.title) : true // 条件2
        return cd1 && cd2
      })
    }
  },
  methods: {
    formatTime (row) {
      return formatstamp(row.addtime)
    },
    handelChange (state, id) {
      this.$http.post('carousel/state', { state, id }).then(res => {
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
    getList () {
      this.$http.get('carousel/list').then(res => {
        this.tableData = res.result
      })
    },
    addItem () {
      this.form = { id: 0, order: 1, state: 1 }
      this.dialogVisible = true
    },
    editItem (row) {
      this.form = { ...row }
      this.dialogVisible = true
    },
    delItem (id) {
      this.$confirm('您确定要删除此条记录吗？', '提示').then(() => {
        this.$http.post('carousel/remove', { id }).then(res => {
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
        this.$http.post('carousel/remove', { id: this.ids }).then(res => {
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
          this.$http.post('carousel/save', { ...this.form }).then(res => {
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
