<template>
  <div class="login">
      <h2>用户注册</h2>
      <el-form ref="form" :model="form" :rules="rules" status-icon="" label-width="60px">
        <el-form-item label="账号" prop="username">
            <el-input v-model.trim="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model.trim="form.password" show-password />
        </el-form-item>
        <el-form-item label="重复" prop="chkpassword">
            <el-input type="password" v-model.trim="form.chkpassword" show-password />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
            <el-input v-model.trim="form.mobile" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">注册</el-button>
          <el-button type="danger" @click="$router.push('/login')">返回</el-button>
        </el-form-item>
      </el-form>
  </div>

</template>

<script>
import md5 from 'js-md5'
export default {
  data () {
    // 验证用户名
    const checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'))
      } else if (!/^[a-zA-Z]\w{3,15}$/.test(value)) {
        return callback(new Error('请输入有效的用户名'))
      }
      // 没有参数表示，没有错误
      callback()
    }

    // 验证密码
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      } else if (!/^\w{6,}$/.test(value)) {
        return callback(new Error('密码至少6位数'))
      }
      // 没有参数表示，没有错误
      callback()
    }

    // 验证重复密码
    const checkChkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入重复密码'))
      } else if (value !== this.form.password) {
        return callback(new Error('两次密码输入不一致'))
      }
      // 没有参数表示，没有错误
      callback()
    }

    // 验证手机
    const checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机'))
      } else if (!/^1\d{10}$/.test(value)) {
        return callback(new Error('请输入有效的手机'))
      }
      // 没有参数表示，没有错误
      callback()
    }

    return {
      form: {},
      rules: {
        username: { validator: checkUsername },
        password: { validator: checkPassword },
        chkpassword: { validator: checkChkPassword },
        mobile: { validator: checkMobile }
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http.post('admin/create', {
            username: this.form.username,
            password: md5(this.form.password),
            mobile: this.form.mobile
          }).then(res => {
            if (res.result.err > 0) {
              this.$message.error(res.result.msg)
            } else {
              this.$message.success(res.result.msg)
              setTimeout(() => this.$router.push('/login'), 100)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.login{
  position: fixed;
  width: 320px;
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(0, 0, 0, .3);
  padding: 20px;
  left: 50%;
  top: 15%;
  margin-left: -150px;
  h2{
    padding: 20px 0;
    font-size: 24px;
    text-align: center;
  }
}
</style>
