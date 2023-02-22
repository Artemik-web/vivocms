import Mock from 'mockjs'
import jwt from 'jsonwebtoken'
import { uuid, update } from '../utils'

const sysAdmin = localStorage.getItem('sys_admin')
const admin = sysAdmin ? JSON.parse(sysAdmin) : [
  {
    id: uuid(),
    username: 'admin',
    nickname: '胡佩',
    gender: 1,
    password: '670b14728ad9902aecba32e22fa4f6bd',
    avatar: require('../assets/images/girl.jpg'),
    mobile: '18579105168',
    rid: '8adc0fed-6bef-4a7a-8e50-915c867c244d',
    addtime: 1323232434,
    state: 1
  },
  {
    id: uuid(),
    username: 'test',
    nickname: '客服',
    gender: 1,
    password: '670b14728ad9902aecba32e22fa4f6bd',
    avatar: require('../assets/images/face.jpg'),
    mobile: '18579105168',
    rid: 'dbf92c8a-979d-4fdf-bbda-0f61e5468e6f',
    addtime: 1323232434,
    state: 1
  }
]

// 管理员列表
Mock.mock('admin/list', 'get', () => ({ result: admin }))

// 登录验证
Mock.mock('admin/login', 'post', options => {
  const { username, password } = JSON.parse(options.body)

  // 验证条件（通过用户和密码匹配）
  const condition = item => item.username === username && item.password === password

  // 判断是否登录成功
  const vaild = admin.some(condition)

  if (vaild) {
    const { state } = admin.find(condition)
    if (!state) {
      return {
        result: {
          err: 1002,
          msg: '您的账户已经被锁定，请联系管理员！'
        }
      }
    }

    // expiresIn 过去时间 1h表示1小时后，30表示30秒
    jwt.sign({ data: username }, '0513', { expiresIn: '1d' }, (err, token) => {
      if (!err) {
        localStorage.setItem('SC-Token', token)
      }
    })
  }

  return {
    result: {
      err: vaild ? 0 : 1001,
      msg: vaild ? '登录成功' : '用户名或密码错误'
    }
  }
})

// 查询当前登录信息
Mock.mock('admin/info', 'post', options => {
  const { username } = JSON.parse(options.body)
  return {
    result: admin.find(item => item.username === username)
  }
})

// 修改状态
Mock.mock('admin/state', 'post', options => {
  const { state, id } = JSON.parse(options.body)

  for (let i = 0; i < admin.length; i++) {
    if (admin[i].id === id) {
      admin[i].state = state
    }
  }

  // 本地保存
  localStorage.setItem('sys_admin', JSON.stringify(admin))

  return {
    result: {
      err: 0,
      msg: '状态修改成功'
    }
  }
})

// 删除（批量）记录
Mock.mock('admin/remove', 'post', options => {
  const { id } = JSON.parse(options.body)

  const ids = Array.isArray(id) ? id : [id]

  let err = 0

  for (let i = 0; i < ids.length; i++) {
    const index = admin.findIndex(item => item.id === ids[i])

    // 如果没有匹配到id，则报错
    if (index === -1) {
      err += 1
      continue
    }

    admin.splice(index, 1)
  }

  // 本地保存
  localStorage.setItem('sys_admin', JSON.stringify(admin))

  return {
    result: {
      err,
      msg: err ? '删除失败' : '删除成功!'
    }
  }
})

// 管理员注册
Mock.mock('admin/create', 'post', options => {
  const body = JSON.parse(options.body)

  // 存在相同的用户名
  const existUsername = admin.some(item => item.username === body.username)
  if (existUsername) {
    return {
      result: {
        err: 1001,
        msg: '该用户名已被注册！'
      }
    }
  }

  // 存在相同的手机
  const existMobile = admin.some(item => item.mobile === body.mobile)
  if (existMobile) {
    return {
      result: {
        err: 1002,
        msg: '该手机已被注册！'
      }
    }
  }

  admin.unshift({
    id: uuid(),
    username: body.username,
    nickname: '未知',
    gender: 0,
    password: body.password,
    avatar: require('../assets/images/nophoto.svg'),
    mobile: body.mobile,
    permission: [],
    addtime: new Date().getTime(),
    state: 1
  })

  // 保存到本地
  localStorage.setItem('sys_admin', JSON.stringify(admin))

  return {
    result: {
      err: 0,
      msg: '恭喜，注册成功！'
    }
  }
})

// 新增和修改接口
Mock.mock('admin/save', 'post', options => {
  const body = JSON.parse(options.body)

  if (body.id === 0) {
    admin.unshift({
      ...body,
      id: uuid(),
      addtime: new Date().getTime()
    })

    // 本地保存
    localStorage.setItem('sys_admin', JSON.stringify(admin))

    return {
      result: {
        err: 0,
        msg: '添加成功！'
      }
    }
  } else {
    // for (let i = 0; i < admin.length; i++) {
    //   if (admin[i].id === body.id) {
    //     admin[i] = body
    //     break
    //   }
    // }
    update(admin, body)

    // 本地保存
    localStorage.setItem('sys_admin', JSON.stringify(admin))

    return {
      result: {
        err: 0,
        msg: '修改成功！'
      }
    }
  }
})
