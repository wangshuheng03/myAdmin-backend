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

/**
 * 递归函数来加载路由
 * @param {string} 获取所有用户信息的SQL语句不查询密码
 * @returns {Array} - 菜单数组
 */
export async function getUser(callback) {
  connection.query( "SELECT id, username, nickname, email, role FROM system_user",
    (error, results) => {
      if (error) {
        console.error("Error fetching user data: ", error)
        return callback(error, null)
      }
      callback(null, results)
    }
    )
}
