import { connection } from '../sql.js'

/**
 * 递归函数来加载路由
 * @param {string} 获取字典和字典项表的sql语句
 * @returns {Array} - 字典数组
 */
export async function getUserPassword(data, callback) {
  const dataObj = data;
  console.log(dataObj, '11111111111111111111');

  // 当存在查询条件时，id不模糊查询，其他字段查询时模糊查询
  let whereStr = '';
  const params = [];
  for (const key in dataObj) {
    if (dataObj[key] !== undefined && dataObj[key] !== null && key !== 'currentPage' && key !== 'pageSize') {
      if (key === 'id') {
        whereStr += ` AND ${key} = ?`;
        params.push(dataObj[key]);
      } else {
        whereStr += ` AND ${key} LIKE ?`;
        params.push(`%${dataObj[key]}%`);
      }
    }
  }

  if (whereStr) {
    whereStr = `WHERE 1=1 ${whereStr}`;
  }

  // 获取分页参数
  const page = +dataObj.currentPage || 1;
  const pageSize = +dataObj.pageSize || 10000;
  const offset = (page - 1) * pageSize;

  try {
    // 获取分页数据
    const [allRows] = await connection.promise().query(
      `SELECT * FROM system_dict_type ${whereStr} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    // 获取总条数
    const [totalRows] = await connection.promise().query(
      `SELECT COUNT(*) AS total_count FROM system_dict_type ${whereStr}`,
      params
    );

    const result = {
      data: allRows,
      total: totalRows[0].total_count
    };

    console.log('获取用户信息成功:', result);
    return callback(null, result);
  } catch (err) {
    console.error('获取用户信息失败:', err);
    return callback(err);
  }
}

/**
 * 递归函数来加载路由
 * @param {string} 新增字典sql语句
 * @returns {Array} - 字典数组
 */
export async function addDictType(data, callback) {
  const { dict_name, dict_code, remark, created_at } = data;

  connection.query(
    `INSERT INTO system_dict_type (dict_name, dict_code, remark, created_at) VALUES ( ?, ?, ?, ?)`,
    [dict_name, dict_code, remark, created_at],
    function (err, results) {
      if (err) {
        console.error('新增字典失败:', err);
        return callback(err);
      } else {
        console.log('新增字典成功:', results);
        return callback(null, results);
      }
    }
  );
}

/**
 * 递归函数来加载路由
 * @param {string} 编辑字典sql语句
 * @returns {Array} - 字典数组
 */
export async function editDictType(data, callback) {
  const dataObj = data
  console.log(data, 'AAAAAAAAAAAAAAAAAAAAAAAAAA');

  const ALLOWED_FIELDS = ['id', 'dict_name', 'dict_code', 'remark', 'updated_at']
  const filteredData = {}
  ALLOWED_FIELDS.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      filteredData[field] = dataObj[field]
    }
  })
  const setters = Object.keys(filteredData).map(field => `${field} = ?`).join(', ')
  const values = Object.values(filteredData).concat([dataObj.id])

  connection.query(`UPDATE system_dict_type SET ${setters} WHERE id = ?`, values, function (err, results) {
    if (err) {
      console.error('编辑字典失败:', err);
      return callback(err);
    } else {
      console.log('编辑字典成功:', results);
      return callback(null, results);
    }
  });

}

/**
 * 递归函数来加载路由
 * @param {string} 删除字典sql语句
 * @returns {Array} - 结果信息
 */
export async function deleteDictType(data, callback) {
  const id = data;

  connection.query(
    `DELETE FROM system_dict_type WHERE id = ?`,
    [id],
    function (err, results) {
      if (err) {
        console.error('删除字典失败:', err);
        return callback(err);
      } else {
        console.log('删除字典成功:', results);
        return callback(null, results);
      }
    })
}