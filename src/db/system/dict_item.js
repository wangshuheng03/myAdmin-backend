import { connection } from '../sql.js'

/**
 * 递归函数来加载路由
 * @param {string} 获取字典项表的sql语句
 * @returns {Array} - 字典项数组
 */
export async function getDictItems(data, callback) {
  const dataObj = data;
  let sql = 'SELECT * FROM system_dict_item WHERE 1=1';
  let values = [];

  // 遍历 dataObj 中的每个键值对
  for (const [key, value] of Object.entries(dataObj)) {
    // 忽略 page 和 pageSize 字段，因为它们不需要作为查询条件
    if (key !== 'currentPage' && key !== 'pageSize') {
      sql += ` AND ${key} = ?`;
      values.push(value);
    }
  }

  // 获取 page 和 pageSize 参数
  const page = +dataObj.currentPage || 1; // 默认页码为 1
  const pageSize = +dataObj.pageSize || 10; // 默认每页记录数为 10

  // 计算 OFFSET
  const offset = (page - 1) * pageSize;

  // 添加 LIMIT 和 OFFSET 子句
  sql += ` LIMIT ? OFFSET ?`;
  values.push(pageSize, offset);

  try {
    const [rows] = await connection.promise().query(sql, values);
    callback(null, rows);
  } catch (err) {
    console.error('获取字典项失败:', err);
    callback(err);
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 新增字典项表的sql语句
 * @returns {Array} - 结果信息
 */
export async function addDictItem(data, callback) {
  // 提取字段名和值
  const keys = Object.keys(data);
  const values = Object.values(data);

  // 构建字段列表和占位符列表
  const fields = keys.join(', ');
  const placeholders = keys.map(() => '?').join(', ');

  // 构建完整的 SQL 插入语句
  const sql = `INSERT INTO system_dict_item (${fields}) VALUES (${placeholders})`;

  try {
    const [result] = await connection.promise().execute(sql, values);
    callback(null, result);
  } catch (err) {
    console.error('新增字典项失败:', err);
    callback(err);
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 修改字典项表的sql语句
 * @returns {Array} - 结果信息
 */
export async function updateDictItem(data, callback) {
  // 提取字段名和值
  const keys = Object.keys(data);
  const values = Object.values(data);
  //去掉key为id的键和值
  keys.splice(keys.indexOf('id'), 1);
  values.splice(values.indexOf(data.id), 1);

  // 构建字段列表和占位符列表
  const setFields = keys.map((key) => `${key} = ?`).join(', ');

  const sql = `UPDATE system_dict_item SET ${setFields} WHERE parent_id = ?`;
  const parentId = data.id;
  const allValues = [...values, parentId];

  try {
    const [result] = await connection.promise().execute(sql, allValues);
    callback(null, result);
  } catch (err) {
    console.error('修改字典项失败:', err);
    callback(err);
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 删除字典项表的sql语句
 * @returns {Array} - 结果信息
 */
export async function deleteDictItem(id, callback) {
  const sql = `DELETE FROM system_dict_item WHERE id = ?`;
  const values = [id];

  try {
    const [result] = await connection.promise().execute(sql, values);
    callback(null, result);
  } catch (err) {
    console.error('删除字典项失败:', err);
    callback(err);
  } 
}