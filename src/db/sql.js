import mysql from 'mysql2'

//建立连接
export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '111111',
  database: 'mysql',
});
