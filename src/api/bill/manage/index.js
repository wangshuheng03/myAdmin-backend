import { getManage, insertManage, updateManage, deleteManage } from '../../../db/bill/manage.js'
import express from 'express'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const app = express()

app.use(express.json())

app.get('/bill/manage/list', (req, res) => {
  //获取通过paeams传递的数据
  let data = req.query
  console.log('获取账单列表信息:', data)
  
  getManage(data,(err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      const data = results.data.map(item => {
        return {
          id: item.id,
          title: item.title,
          type: item.type,
          amount: item.amount,
          expense_time: dayjs.utc(item.expense_time).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
          remark: item.remark,
        }
      })
      res.json({  data: data, code: 200, total: results.total })
    }
  })
})

app.post('/bill/manage/add', (req, res) => {
  //获取通过paeams传递的数据
  let data = req.body
  insertManage(data,(err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      res.json({ data: data, code: 200 })
    }
  })
})

app.post('/bill/manage/edit', (req, res) => {
  //获取通过paeams传递的数据
  let data = req.body
  updateManage(data,(err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      res.json({   data: data, code: 200 })
    }
  })
})

app.post('/bill/manage/delete', (req, res) => {
  //获取通过paeams传递的数据
  let data = req.body
  deleteManage(data,(err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      res.json({   data: data, code: 200 })
    }
  })
})

export default app