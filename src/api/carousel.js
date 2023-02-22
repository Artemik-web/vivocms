import Mock from 'mockjs'

import { uuid, orderBy } from '../utils'

const sysCarousel = localStorage.getItem('sys_carousel')
const carousel = sysCarousel ? JSON.parse(sysCarousel) : []

// 轮播列表
Mock.mock('carousel/list', 'get', () => ({ result: orderBy(carousel) }))

// 修改状态
Mock.mock('carousel/state', 'post', options => {
  const { state, id } = JSON.parse(options.body)

  for (let i = 0; i < carousel.length; i++) {
    if (carousel[i].id === id) {
      carousel[i].state = state
    }
  }

  // 本地保存
  localStorage.setItem('sys_carousel', JSON.stringify(carousel))

  return {
    result: {
      err: 0,
      msg: '状态修改成功'
    }
  }
})

// 删除（批量）记录
Mock.mock('carousel/remove', 'post', options => {
  const { id } = JSON.parse(options.body)

  const ids = Array.isArray(id) ? id : [id]

  let err = 0

  for (let i = 0; i < ids.length; i++) {
    const index = carousel.findIndex(item => item.id === ids[i])

    // 如果没有匹配到id，则报错
    if (index === -1) {
      err += 1
      continue
    }

    carousel.splice(index, 1)
  }

  // 本地保存
  localStorage.setItem('sys_carousel', JSON.stringify(carousel))

  return {
    result: {
      err,
      msg: err ? '删除失败' : '删除成功!'
    }
  }
})

// 新增和修改接口
Mock.mock('carousel/save', 'post', options => {
  const body = JSON.parse(options.body)

  if (body.id === 0) {
    carousel.unshift({
      ...body,
      id: uuid(),
      addtime: new Date().getTime()
    })

    // 本地保存
    localStorage.setItem('sys_carousel', JSON.stringify(carousel))

    return {
      result: {
        err: 0,
        msg: '添加成功！'
      }
    }
  } else {
    for (let i = 0; i < carousel.length; i++) {
      if (carousel[i].id === body.id) {
        carousel[i] = body
        break
      }
    }

    // 本地保存
    localStorage.setItem('sys_carousel', JSON.stringify(carousel))

    return {
      result: {
        err: 0,
        msg: '修改成功！'
      }
    }
  }
})
