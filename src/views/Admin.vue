<template>
<div class="panel">

  <div class="heading">
    <h2>用户列表</h2>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="#/app">后台首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="#/app/admin">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="search">
    <div class="options">
      <el-button v-if="ids.length" type="danger" size="small" @click="batchDel">批量删除</el-button>

      <el-select v-model.number="state" placeholder="是否审核" size="small" clearable>
        <el-option label="未审核" :value="0" />
        <el-option label="已审核" :value="1" />
      </el-select>

      <el-input v-model.trim="keyword" placeholder="请输入账号/昵称/手机" size="small" clearable />
    </div>
    <el-button type="danger" icon="el-icon-plus" size="small" @click="addItem">新增</el-button>
  </div>

  <div class="list">
    <el-table ref="table" :data="searchData" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" />

      <el-table-column label="头像" width="120">
        <template v-slot="scope">
          <el-avatar :size="40" :src="scope.row.avatar" />
        </template>
      </el-table-column>

      <el-table-column label="账号" prop="username" />
      <el-table-column label="角色" :formatter="formatRole" width="120" />
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="手机" prop="mobile" width="120" />
      <el-table-column label="注册日期" prop="addtime" :formatter="formatTime" width="100" />
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
  @opened="handleDialogOpen"
  :title="(form.id?'修改':'新增')+'用户'"
  :visible.sync="dialogVisible"
  width="400px"
  top="10vh"
  >

    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <el-form-item label="账号" prop="username">
        <el-input v-model.trim="form.username"  />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model.trim="form.password" show-password />
        <span class="help-info" v-if="form.id">不修改密码则保持为空！</span>
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model.trim="form.nickname" />
      </el-form-item>

      <el-form-item label="手机" prop="mobile">
        <el-input v-model.trim="form.mobile" />
      </el-form-item>

      <el-form-item label="上传头像" prop="avatar">
        <el-tooltip class="item" effect="dark" content="请上传100x100的图片尺寸！" placement="right-start">
          <el-upload
          class="pic-upload size100x100"
          action="http://cloud.scnew.com.cn/api/user/upload"
          :before-upload="handleBeforeUpload"
          :on-success="handlePicSuccess"
          :show-file-list="false"
          >
            <img v-if="form.avatar" :src="form.avatar">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-tooltip>

      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio v-model.number="form.gender" :label="1">男</el-radio>
        <el-radio v-model.number="form.gender" :label="0">女</el-radio>
      </el-form-item>

      <el-form-item label="所属角色" prop="rid">
        <el-select v-model="form.rid" clearable>

          <el-option
          v-for="item in roleOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否审核" prop="state">
          <el-switch
          v-model.number="form.state"
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
import md5 from 'js-md5'
import { formatstamp, searchCd } from '../utils'
export default {
  data () {
    const checkPassword = (rule, value, callback) => {
      if (!value && !this.form.id) {
        return callback(new Error('请输入密码'))
      }
      callback()
    }

    return {
      state: '',
      keyword: '',
      tableData: [],
      roleOptions: [],
      ids: [],
      dialogVisible: false,
      form: {},
      rules: {
        username: { required: true, message: '请输入账号' },
        password: { validator: checkPassword }
      }
    }
  },
  created () {
    this.getRole()
    this.getList()
  },
  computed: {
    searchData () {
      return this.tableData.filter(item => {
        const { username, nickname, mobile } = item
        const cd1 = this.state !== '' ? (item.state === this.state) : true // 条件1
        const cd2 = this.keyword !== '' ? searchCd(this.keyword, username, nickname, mobile) : true // 条件2
        return cd1 && cd2
      })
    }
  },
  methods: {
    formatGender (row) {
      return ['女', '男'][row.gender]
    },
    formatRole (row) {
      const info = this.roleOptions.find(item => item.id === row.rid)
      return info ? info.name : '无'
    },
    formatTime (row) {
      return formatstamp(row.addtime)
    },
    handleDialogOpen () {
      this.$refs.form.clearValidate()
    },
    handelChange (state, id) {
      this.$http.post('admin/state', { state, id }).then(res => {
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
        this.$message.error('上传头像只能是 ' + isPic + ' 格式!')
      }

      if (!isLt2M) {
        this.$message.error('上传头像大小不能超过 2MB!')
      }

      return isPic && isLt2M
    },
    handlePicSuccess (res) {
      if (res.err > 0) {
        this.$message.error(res.desc)
      } else {
        this.$message.success(res.desc)
        this.$set(this.form, 'avatar', res.result)
      }
    },
    getRole () {
      this.$http.get('role/list').then(res => {
        this.roleOptions = res.result
      })
    },
    getList () {
      this.$http.get('admin/list').then(res => {
        this.tableData = res.result
      })
    },
    addItem () {
      this.form = { id: 0, order: 1, state: 1 }
      this.dialogVisible = true
    },
    editItem (row) {
      this.form = { ...row, password: '' }
      this.dialogVisible = true
    },
    delItem (id) {
      this.$confirm('您确定要删除此条记录吗？', '提示').then(() => {
        this.$http.post('admin/remove', { id }).then(res => {
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
        this.$http.post('admin/remove', { id: this.ids }).then(res => {
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
          this.$http.post('admin/save', {
            ...this.form,
            password: this.form.password && md5(this.form.password)
          }).then(res => {
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
.size100x100 .el-upload{
  width: 100px;
  height: 100px;
}
</style>
