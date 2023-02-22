<template>
<div class="panel">

  <div class="heading">
    <h2>菜单列表</h2>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="#/app">后台首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="#/app/menu">菜单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="search">
    <div class="options"></div>
    <el-button type="danger" icon="el-icon-plus" size="small" @click="addItem(0)">新增</el-button>
  </div>

  <div class="list">
    <el-table
    ref="table"
    :data="tableData"
    row-key="id"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
    >
      <el-table-column label="图标" width="80">
        <template v-slot="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="label" />
      <el-table-column label="链接" prop="path" />
      <el-table-column label="权限" prop="value" />
      <el-table-column label="类型" prop="type" :formatter="formatType" width="80" />
      <el-table-column label="排序" prop="order" width="80" />

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
      <el-table-column label="操作" width="220" align="right">
        <template v-slot="scope">
          <el-button size="mini" type="primary" @click="addItem(scope.row.id)">新增</el-button>
          <el-button size="mini" @click="editItem(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="delItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>

  <!-- 新增或修改窗口 -->
  <el-dialog
  :title="(form.id?'修改':'新增')+'菜单'"
  :visible.sync="dialogVisible"
  width="400px"
  top="10vh"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">

      <el-form-item label="菜单名称" prop="label">
        <el-input v-model="form.label"  />
      </el-form-item>

      <el-form-item label="菜单类型" prop="type">
        <el-radio v-model.number="form.type" :label="0">目录</el-radio>
        <el-radio v-model.number="form.type" :label="1">菜单</el-radio>
        <el-radio v-model.number="form.type" :label="2">按钮</el-radio>
      </el-form-item>

      <el-form-item v-if="form.type===0" label="菜单图标" prop="icon">
        <el-input v-model="form.icon" />
      </el-form-item>

      <el-form-item v-if="form.type===1" label="菜单链接" prop="path">
        <el-input v-model="form.path"  />
      </el-form-item>

      <el-form-item v-if="form.type===2" label="菜单权限" prop="value">
        <el-input v-model="form.value"  />
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
export default {
  data () {
    return {
      state: '',
      tableData: [],
      ids: [],
      dialogVisible: false,
      form: {},
      rules: {
        label: { required: true, message: '请输入菜单名称' },
        type: { required: true, message: '请输入菜单类型' }
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    formatType (row) {
      return ['目录', '菜单', '按钮'][row.type]
    },
    handelChange (state, id) {
      this.$http.post('menu/state', { state, id }).then(res => {
        if (res.result.err > 0) {
          this.$message.error(res.result.msg)
        } else {
          this.$message.success(res.result.msg)
        }
      })
    },
    getList () {
      this.$http.get('menu/list').then(res => {
        this.tableData = res.result
      })
    },
    addItem (pid = 0) {
      this.form = { id: 0, pid, order: 1, state: 1 }
      this.dialogVisible = true
    },
    editItem (row) {
      this.form = { ...row }
      this.dialogVisible = true
    },
    delItem (id) {
      this.$confirm('您确定要删除此条记录吗？', '提示').then(() => {
        this.$http.post('menu/remove', { id }).then(res => {
          if (res.result.err > 0) {
            this.$message.error(res.result.msg)
          } else {
            this.$message.success(res.result.msg)
            this.getList() // 刷新
          }
        })
      }).catch(() => {})
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { id, icon, pid, type, label, value, path, order, state } = this.form
          this.$http.post('menu/save', { id, icon, pid, type, label, value, path, order, state }).then(res => {
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
