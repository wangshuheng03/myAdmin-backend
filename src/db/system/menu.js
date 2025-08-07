import { connection } from '../sql.js'

function buildTree(items, parentId = null) {
  return items
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      ...item,
      children: buildTree(items, item.id)
    }))
}
/**
 * 递归函数来加载路由
 * @param {string} 获取菜单信息的SQL语句
 * @returns {Array} - 菜单数组
 */
export async function getSystemenuAll(data, callback) {
  const dataObj = data
  console.log('获取菜单数据:', dataObj, Object.keys(dataObj).length)
  if (dataObj && Object.keys(dataObj).length !== 0) {
    try {
      /* 1. 拼模糊条件 */
      let whereStr = ''
      const params = []
      for (const key in dataObj) {
        if (dataObj[key] !== undefined && dataObj[key] !== null) {
          whereStr += ` AND ${key} LIKE ?`
          params.push(`%${dataObj[key]}%`)
        }
      }
      if (whereStr) {
        whereStr = `WHERE 1=1 ${whereStr}`
      }

      /* 2. 查所有菜单（扁平数组），并按照 menu_index 排序 */
      const [allRows] = await connection.promise().query(
        `SELECT * FROM sys_menu ${whereStr} ORDER BY menu_index ASC, parent_id ASC, order_num ASC, id ASC`,
        params
      )
      const hitNodes = allRows.filter(r =>
        Object.keys(dataObj).every(k =>
          String(r[k]).toLowerCase().includes(String(dataObj[k]).toLowerCase())
        )
      )
      const id = hitNodes[0].id
      if (!hitNodes.length) return callback(null, [])

      const children = buildTree(allRows, id)
      hitNodes[0].children = children
      const result = hitNodes
      console.log('结果:', result)

      return callback(null, result)
    } catch (err) {
      console.error('查询菜单失败:', err)
      callback(err)
    }
  } else {
    connection.query(
      "SELECT * FROM sys_menu ORDER BY menu_index ASC, parent_id IS NULL DESC, parent_id ASC, order_num ASC, id ASC",
      function (err, results) {
        if (err) {
          console.error('获取菜单失败:', err)
          return callback(err)
        } else {
          console.log('获取菜单成功')
          return callback(null, buildTree(results))
        }
      }
    )
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 新增菜单信息的SQL语句
 * @returns {Array} - 结果信息
 */
export function addSystemenuAll(data, callback) {
  const dataObj = data
  const ALLOWED_FIELDS = [
    'title', 'menu_index', 'path', 'parent_id',
    'order_num', 'icon', 'is_visible', 'menu_type',
    'permisson', 'component_name', 'component_path', 'level', 'menu_show'
  ]
  const filteredData = {}
  ALLOWED_FIELDS.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      filteredData[field] = dataObj[field]
    }
  })
  const columns = Object.keys(filteredData).join(', ')
  const placeholders = Object.keys(filteredData).map(() => '?').join(', ')
  const values = Object.values(filteredData)
  connection.query(
    `INSERT INTO sys_menu (${columns}) VALUES (${placeholders})`,
    values,
    (err, results) => {
      if (err) {
        console.error('插入数据失败:', err)
        callback(err, null)
      } else {
        console.log('数据插入成功, ID:', results.insertId)
        callback(null, {
          id: results.insertId,
          affectedRows: results.affectedRows
        })
      }
    }
  )
}

/**
 * 递归函数来加载路由
 * @param {string} 编辑菜单信息的SQL语句
 * @returns {Array} - 结果信息
 */
export function editSystemenuAll(data, callback) {
  const dataObj = data
  const ALLOWED_FIELDS = [
    'id', 'title', 'menu_index', 'path', 'parent_id',
    'order_num', 'icon', 'is_visible', 'menu_type',
    'permisson', 'component_name', 'component_path', 'level', 'menu_show'
  ]
  const filteredData = {}
  ALLOWED_FIELDS.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      filteredData[field] = dataObj[field]
    }
  })
  const setters = Object.keys(filteredData).map(field => `${field} = ?`).join(', ')
  const values = Object.values(filteredData).concat([dataObj.id])
  connection.query(
    `UPDATE sys_menu SET ${setters} WHERE id = ?`,
    values,
    (err, results) => {
      if (err) {
        console.error('更新数据失败:', err)
        callback(err, null)
      } else {
        console.log('数据更新成功, ID:', dataObj.id)
        callback(null, {
          id: dataObj.id,
          affectedRows: results.affectedRows
        })
      }
    }
  )
}

/**
 * 递归函数来加载路由
 * @param {string} 删除菜单信息的SQL语句
 * @returns {Array} - 结果信息
 */
export function deleteSystemenuAll(id, callback) {
  connection.query(
    `DELETE FROM sys_menu WHERE id = ?`,
    [id],
    (err, results) => {
      if (err) {
        console.error('删除数据失败:', err)
        callback(err, null)
      } else {
        console.log('数据删除成功, ID:', id)
        callback(null, {
          id: id,
          affectedRows: results.affectedRows
        })
      }
    }
  )
}
