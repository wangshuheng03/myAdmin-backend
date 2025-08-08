import { connection } from '../sql.js'

/**
 * 递归函数来加载路由
 * @param {string} 获取字典和字典项表的sql语句
 * @returns {Array} - 字典数组
 */
export async function getUserPassword(data, callback) {
  const dataObj = data
  if (dataObj) {
    //当存在查询条件时

  } else {
    connection.query(
      "SELECT t.id AS type_id,t.dict_name,t.dict_code,t.remark AS type_remark,i.id AS item_id,i.item_key,i.item_value,i.sort_order,i.status AS item_status FROM system_dict_type  AS t LEFT JOIN system_dict_item AS i ON t.dict_code = i.dict_code ORDER BY t.dict_code, i.sort_order;",
      function (err, results) {
        if (err) {
          console.error('获取账号密码信息失败:', err)
          return callback(err)
        } else {
          console.log('获取账号密码信息成功:', results)
          return callback(null, results)
        }
      })
  }

}