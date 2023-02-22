import Mock from 'mockjs'

// 权限列表
Mock.mock('permission/list', 'post', options => {
  // const { rid } = JSON.parse(options.body)
  return {
    result: [
      {
        id: 1,
        name: '控制面板',
        icon: 'el-icon-monitor',
        path: '',
        children: [
          { id: 11, name: '仪表盘', path: '/', btns: ['add', 'view', 'edit', 'del'] }
        ]
      },
      {
        id: 2,
        name: '轮播管理',
        icon: 'el-icon-user',
        children: [
          { id: 21, name: '轮播列表', path: '/', btns: ['add', 'view', 'edit', 'del'] }
        ]
      }
    ]
  }
})
