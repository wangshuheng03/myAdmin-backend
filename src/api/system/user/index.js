import { getUserPassword } from '../../../db/system/user.js'
import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()

app.use(express.json())

app.get('/system/user/username', async (req, res) => {
  let data = req.query
  getUserPassword(data, (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      if (results.length > 0) {
        const token = jwt.sign({ id: results[0].id }, 'your_secret_key', { expiresIn: '36000s' })
        res.json({ message: '登录成功', data: { token }, code: 200 })
      } else {
        res.json({ message: '账号或密码错误', data: { token: null }, code: 200 })
      }
    }
  })
})



export default app