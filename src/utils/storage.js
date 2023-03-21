/* 封装本地存储内容 */

/* setItem存储数据 */
export const setItem = (name, value) => {
  // 将数组、对象类型的数据转换为JSON格式字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

/* 获取贝蒂存储数据 */
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data) // 直接转换JSON字符串
  } catch (err) {
    return data
  }
}

/* 删除数据 */
export const removeItem = name => {
  window.localStorage.removeItem(name)
}