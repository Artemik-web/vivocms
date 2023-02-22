export const uuid = () => {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  return uuid
}

export const formatstamp = stamp => {
  let result = ''
  if (/^\d{10,}$/.test(stamp.toString())) {
    const date = new Date(stamp)
    const y = date.getFullYear()
    const m = '0' + (date.getMonth() + 1)
    const d = '0' + date.getDate()
    result = y + '-' + m.slice(-2) + '-' + d.slice(-2)
  }
  return result
}

export const orderBy = data => {
  if (!data.every(item => item.order)) return data
  return data.sort((prev, next) => prev.order - next.order)
}

export const searchCd = (...args) => {
  const keyword = args.shift()
  const result = []
  for (let i = 0; i < args.length; i++) {
    result.push(new RegExp(keyword, 'ig').test(args[i]))
  }
  return result.some(val => val)
}

export const update = (data, form, cases = ['password']) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === form.id) {
      for (const key in form) {
        // const exist = key in data[i]
        const equal = form[key] === data[i][key]
        if (cases.includes(key) && !form[key]) continue
        if (equal) continue
        data[i][key] = form[key]
      }
      continue
    }
  }
}

export const getLeafIds = data => {
  const result = []
  const loop = data => {
    data.forEach(item => {
      if (item.children && item.children.length) {
        loop(item.children)
      } else {
        result.push(item.id)
      }
    })
  }
  loop(data)
  return result
}

export const cascadeMenu = (data, id = 0) => {
  const result = []
  deepClone(data).forEach(item => {
    if (item.pid === id) {
      result.push(item)
      const children = cascadeMenu(data, item.id)
      children.length && (item.children = children)
    }
  })
  return result
}

export const deepClone = target => {
  let result
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = []
      for (const i in target) {
        result.push(deepClone(target[i]))
      }
    } else {
      result = {}
      for (const i in target) {
        result[i] = deepClone(target[i])
      }
    }
  } else {
    result = target
  }
  return result
}

export const checkPermission = (menus, path, flag) => {
  return getPermission(menus, path).includes(flag)
}

export const getPermission = (menus, path) => {
  let result = []
  const loop = (menus, path) => {
    for (let i = 0; i < menus.length; i++) {
      const children = menus[i].children
      if (children && children.length) loop(children, path)
      if (menus[i].path === path) {
        result = children.map(item => item.value)
        break
      }
    }
  }
  loop(menus, path)
  return result
}
