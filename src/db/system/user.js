import { connection } from '../sql.js'

/**
 * 递归函数来加载路由
 * @param {string} 获取账号密码信息的SQL语句
 * @returns {Array} - 菜单数组
 */
export async function getUserPassword(data, callback) {
  const dataObj = data
  connection.query(
    //查询userNanme和password
    "SELECT username,password FROM sys_user WHERE username = ? AND password = ?",
    [dataObj.username, dataObj.password],
    function (err, results) {
      if (err) {
        console.error('获取账号密码信息失败:', err)
        return callback(err)
      } else {
        console.log('获取账号密码信息成功:', results)
        return callback(null,results)
      }
    })
}
