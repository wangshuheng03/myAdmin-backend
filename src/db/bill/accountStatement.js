import { connection } from '../sql.js'


/**
 * 递归函数来加载路由
 * @param {string} 获取流水信息的SQL语句
 * @returns {Array} - 菜单数组
 */
export async function getAccountStatement(data, callback) {
  const dataObj = data
  console.log('获取账单信息:', dataObj)

  // 1. 处理时间段
  let startTime = null
  let endTime   = null
  if (dataObj.expenseTime) {
    // 按 + 拆成两段
    [startTime, endTime] = dataObj.expenseTime.split('+').map(t => t.trim())
  }

  // 2. 分页
  const currentPage = +dataObj.currentPage || 1
  const pageSize    = +dataObj.pageSize || 10
  const offset      = (currentPage - 1) * pageSize

  // 3. 构建 SQL
  const fields   = ['id', 'title', 'type', 'amount', 'useType', 'remark', 'expense_time']
  const fieldStr = fields.join(', ')
  let whereStr   = 'WHERE 1=1'
  const params   = []

  // 3-1 时间段
  if (startTime && endTime) {
    whereStr += ' AND expense_time BETWEEN ? AND ?'
    params.push(startTime, endTime)
  }

  // 3-2 其他模糊条件
  for (const key in dataObj) {
    if (fields.includes(key) && key !== 'expense_time' && dataObj[key] != null) {
      whereStr += ` AND ${key} LIKE ?`
      params.push(`%${dataObj[key]}%`)
    }
  }

  try {
    // 查询列表
    const [rows] = await connection.promise().query(
      `SELECT ${fieldStr} FROM account_statement ${whereStr} ORDER BY expense_time DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    )

    // 统计总数
    const [totalRows] = await connection.promise().query(
      `SELECT COUNT(*) AS total FROM account_statement ${whereStr}`,
      params
    )

    callback(null, { data: rows, total: totalRows[0].total })
  } catch (err) {
    console.error('查询账单失败:', err)
    callback(err)
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 插入流水信息的SQL语句
 * @returns {Array} - 菜单数组
 */
export async function insertAccountStatement(data, callback) {
  const dataObj = data
  console.log('插入账单信息:', dataObj)

  // 定义插入字段
  const fields = ['title', 'type', 'amount', 'expense_time', 'useType', 'remark']
  // 构建插入字段字符串
  const fieldStr = fields.join(', ')
  // 构建插入值字符串
  const valueStr = fields.map(() => '?').join(', ')

  try {
    const [result] = await connection.promise().query(
      `INSERT INTO account_statement (${fieldStr}) VALUES (${valueStr})`,
      [dataObj.title, dataObj.type, dataObj.amount, dataObj.expense_time, dataObj.useType, dataObj.remark]
    )

    console.log('插入账单成功:', result)
    return callback(null, result)
  } catch (err) {
    console.error('插入账单失败:', err)
    callback(err)
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 编辑流水信息的SQL语句
 * @returns {Array} - 菜单数组
 */

export async function updateAccountStatement(data, callback) {
  const dataObj = data
  console.log('编辑账单信息:', dataObj)

  // 定义更新字段
  const fields = ['title', 'type', 'amount', 'expense_time', 'useType', 'remark']
  // 构建更新字段字符串
  const setStr = fields.map(key => `${key} = ?`).join(', ')
  try {
    const [result] = await connection.promise().query(
      `UPDATE account_statement SET ${setStr} WHERE id = ?`,
      [dataObj.title, dataObj.type, dataObj.amount, dataObj.expense_time, data.useType, dataObj.remark,dataObj.id]
    )

    console.log('编辑账单成功:', result)
    return callback(null, result)
  } catch (err) {
    console.error('编辑账单失败:', err)
    callback(err)
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 删除流水信息的SQL语句
 * @returns {Array} - 菜单数组
 */

export async function deleteAccountStatement(data, callback) {
  const dataObj = data
  console.log('删除账单信息:', dataObj)

  try {
    const [result] = await connection.promise().query(
      `DELETE FROM account_statement WHERE id = ?`,
      [dataObj.id]
    )

    console.log('删除账单成功:', result)
    return callback(null, result)
  } catch (err) {
    console.error('删除账单失败:', err)
    callback(err)
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 获取所有流水信息的SQL语句
 * @returns {Array} - 菜单数组
 */
export async function getAccountStatementALl(data, callback) {
  try {
    const [result] = await connection.promise().query('SELECT * FROM account_statement')
    console.log('获取所有账单信息:', result)
    return callback(null, result)
  }catch (err) {
    console.error('获取所有账单失败:', err)
    callback(err)
  }
}