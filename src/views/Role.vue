<template>
<div class="panel">

  <div class="heading">
    <h2>角色列表</h2>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="#/app">后台首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="#/app/role">角色管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="search">
    <div class="options">
      <el-button v-if="ids.length" type="danger" size="small" @click="batchDel">批量删除</el-button>

      <el-select v-model.number="state" placeholder="是否审核" size="small" clearable>
        <el-option label="未审核" :value="0" />
        <el-option label="已审核" :value="1" />
      </el-select>

      <el-input v-model.trim="keyword" placeholder="请输入名称" size="small" clearable />
    </div>
    <el-button type="danger" icon="el-icon-plus" size="small" @click="addItem">新增</el-button>

  </div>

  <div class="list">
    <el-table ref="table" :data="searchData" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" />
      <el-table-column label="排序" prop="order" width="60" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="描述" prop="desc" />
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
  :title="(form.id?'修改':'新增')+'角色'"
  :visible.sync="dialogVisible"
  width="400px"
  top="10vh"
  :close-on-click-modal="false"
  >

    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"  />
      </el-form-item>

      <el-form-item label="角色描述" prop="desc">
        <el-input v-model="form.desc"  />
      </el-form-item>

      <el-form-item label="角色功能" prop="content">

        <el-tree
        default-expand-all
        ref="tree"
        node-key="id"
        :data="menus"
        show-checkbox
        />

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
import { searchCd, getLeafIds, cascadeMenu } from '../utils'
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
        name: { required: true, message: '请输入角色名称' }
      },
      menus: []
    }
  },
  created () {
    this.getList()
    this.getMenu()
  },
  computed: {
    searchData () {
      return this.tableData.filter(item => {
        const cd1 = this.state !== '' ? (item.state === this.state) : true // 条件1
        const cd2 = this.keyword !== '' ? searchCd(this.keyword, item.name) : true // 条件2
        return cd1 && cd2
      })
    }
  },
  methods: {
    handelChange (state, id) {
      this.$http.post('role/state', { state, id }).then(res => {
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
    getList () {
      this.$http.get('role/list').then(res => {
        this.tableData = res.result
      })
    },
    getMenu () {
      this.$http.get('menu/list').then(res => {
        this.menus = res.result
      })
    },
    addItem () {
      this.form = { id: 0, order: 1, state: 1 }
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.tree.setCheckedKeys([]))
    },
    editItem (row) {
      this.form = { ...row }
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.tree.setCheckedKeys(getLeafIds(row.content)))
    },
    delItem (id) {
      this.$confirm('您确定要删除此条记录吗？', '提示').then(() => {
        this.$http.post('role/remove', { id }).then(res => {
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
        this.$http.post('role/remove', { id: this.ids }).then(res => {
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
          const content = cascadeMenu(this.$refs.tree.getCheckedNodes(false, true))
          this.$http.post('role/save', { ...this.form, content }).then(res => {
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
.el-tree-node__content{
  height: 34px;
}
</style>
