import Mock from 'mockjs'

import { uuid, orderBy, cascadeMenu } from '../utils'

const sysMenu = localStorage.getItem('sys_menu')
const menu = sysMenu ? JSON.parse(sysMenu) : [{"id":"5780196f-2b6b-4f0e-9ba1-61a03707a026","pid":"d1335557-93f3-4833-80c1-e5c8e78c1808","type":1,"label":"菜单列表","path":"/app/menu","order":1,"state":1,"addtime":1606699400460},{"id":"5f459b4c-ecf4-4c30-856c-ed3aa3ab688d","pid":"1ada9781-35ef-493a-bc2f-b1fb78877041","type":2,"label":"新增","value":"add","order":1,"state":1,"addtime":1606699152784},{"id":"1ada9781-35ef-493a-bc2f-b1fb78877041","pid":"b5bae229-17c1-413d-8f80-74964d08f15e","type":1,"label":"会员列表","path":"/app/user","order":1,"state":1,"addtime":1606699140500},{"id":"78d7fb90-d830-461a-93fa-708e5859a90c","pid":"c554723b-631b-47ec-b1e8-1e392daa2d98","type":2,"label":"查询","value":"view","order":1,"state":1,"addtime":1606698591540},{"id":"52a7b5dc-6c3a-42f9-936d-292c7bf503e7","pid":"10963fec-8eb5-4607-8d22-dad7336e1f57","type":1,"label":"轮播列表","path":"/app/carousel","order":1,"state":1,"addtime":1606698404355},{"id":"c6749123-aad6-4ee5-8717-4ad5d88a82b6","pid":"677eda54-5fc6-4125-abd9-dae3988076f1","type":1,"label":"角色列表","path":"/app/role","order":1,"state":1,"addtime":1606698353570},{"id":"c0fdc7a0-330a-4110-a9d5-4ec429bdfcf2","pid":"dd46bb59-46e8-4537-ad6f-fa36e0222273","type":1,"label":"用户列表","path":"/app/admin","order":1,"state":1,"addtime":1606698306785},{"id":"c554723b-631b-47ec-b1e8-1e392daa2d98","pid":"c5eaa8dc-fdda-41e2-ae2a-b4ceee89e75c","type":1,"label":"仪表盘","path":"/app/dashboard","order":1,"state":1,"addtime":1606698290194},{"id":"c5eaa8dc-fdda-41e2-ae2a-b4ceee89e75c","icon":"el-icon-monitor","pid":0,"type":0,"label":"控制面板","order":1,"state":1,"addtime":1606698204424},{"id":"55304771-45cc-43a0-8d6a-bb8f53d73e67","pid":"6852a563-ba10-405f-8a73-ec4678701e3d","type":1,"label":"分类列表","path":"/app/productcate","order":1,"state":1},{"id":"b84dd304-bf6a-4e40-987f-bb3e48a79fc5","pid":"1ada9781-35ef-493a-bc2f-b1fb78877041","type":2,"label":"查询","value":"view","order":2,"state":1,"addtime":1606699165686},{"id":"a8d5c1e1-e4d4-4155-850c-8b70b9e7c5d1","pid":"c554723b-631b-47ec-b1e8-1e392daa2d98","type":2,"label":"修改","value":"edit","order":2,"state":1,"addtime":1606699036757},{"id":"beabc967-468f-4337-ae36-7b5818dff9a1","pid":"6852a563-ba10-405f-8a73-ec4678701e3d","type":1,"label":"产品列表","path":"/app/product","order":2,"state":1,"addtime":1606698436948},{"id":"dd46bb59-46e8-4537-ad6f-fa36e0222273","icon":"el-icon-user","pid":0,"type":0,"label":"用户管理","order":2,"state":1,"addtime":1606698218244},{"id":"02a035ee-6b24-4522-8f88-d122a15c142f","pid":"c554723b-631b-47ec-b1e8-1e392daa2d98","type":2,"label":"新增","value":"add","order":3,"state":1,"addtime":1606699059893},{"id":"677eda54-5fc6-4125-abd9-dae3988076f1","icon":"el-icon-magic-stick","pid":0,"type":0,"label":"角色管理","order":3,"state":1,"addtime":1606698340510},{"id":"10963fec-8eb5-4607-8d22-dad7336e1f57","icon":"el-icon-picture-outline","pid":0,"type":0,"label":"轮播管理","order":4,"state":1},{"id":"6852a563-ba10-405f-8a73-ec4678701e3d","icon":"el-icon-shopping-bag-2","pid":0,"type":0,"label":"产品管理","order":5,"state":1},{"id":"b5bae229-17c1-413d-8f80-74964d08f15e","icon":"el-icon-user","pid":0,"type":0,"label":"会员管理","order":10,"state":1},{"id":"d1335557-93f3-4833-80c1-e5c8e78c1808","icon":"el-icon-user","pid":0,"type":0,"label":"菜单管理","order":11,"state":1,"addtime":1606699385103}]

// 菜单列表
Mock.mock('menu/list', 'get', () => ({ result: cascadeMenu(orderBy(menu)) }))

// 修改状态
Mock.mock('menu/state', 'post', options => {
  const { state, id } = JSON.parse(options.body)

  for (let i = 0; i < menu.length; i++) {
    if (menu[i].id === id) {
      menu[i].state = state
    }
  }

  // 本地保存
  localStorage.setItem('sys_menu', JSON.stringify(menu))

  return {
    result: {
      err: 0,
      msg: '状态修改成功'
    }
  }
})

// 删除（批量）记录
Mock.mock('menu/remove', 'post', options => {
  const { id } = JSON.parse(options.body)

  const ids = Array.isArray(id) ? id : [id]

  let err = 0

  for (let i = 0; i < ids.length; i++) {
    const index = menu.findIndex(item => item.id === ids[i])

    // 如果没有匹配到id，则报错
    if (index === -1) {
      err += 1
      continue
    }

    menu.splice(index, 1)
  }

  // 本地保存
  localStorage.setItem('sys_menu', JSON.stringify(menu))

  return {
    result: {
      err,
      msg: err ? '删除失败' : '删除成功!'
    }
  }
})

// 新增和修改接口
Mock.mock('menu/save', 'post', options => {
  const body = JSON.parse(options.body)

  if (body.id === 0) {
    menu.unshift({
      ...body,
      id: uuid(),
      addtime: new Date().getTime()
    })

    // 本地保存
    localStorage.setItem('sys_menu', JSON.stringify(menu))

    return {
      result: {
        err: 0,
        msg: '添加成功！'
      }
    }
  } else {
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].id === body.id) {
        menu[i] = body
        break
      }
    }

    // 本地保存
    localStorage.setItem('sys_menu', JSON.stringify(menu))

    return {
      result: {
        err: 0,
        msg: '修改成功！'
      }
    }
  }
})
