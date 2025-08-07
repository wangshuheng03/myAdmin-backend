import { getAccountStatementALl } from '../.././db/bill/accountStatement.js'
import express from 'express'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const app = express()

app.use(express.json())

app.get('/bill/accountStatement/echarts/list', (req, res) => {
  //获取通过paeams传递的数据
  let data = req.query
  console.log('获取账单列表信息:', data)

  getAccountStatementALl(data, (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      console.log(results, 'AAAAAAAAAAAAAA')
      const dataTime = []
      results.map(item => {
        const day = new Date(item.expense_time).getDate()
        const time = String(day).padStart(2, '0')

        if (!dataTime.includes(time)) {
          dataTime.push(time)
        }
      })
      const dataList = {}

      results.forEach(item => {
        const day = new Date(item.expense_time).getDate()
        // const date = 
        const type = String(item.useType)
        if (!dataList[type]) dataList[type] = Array(dataTime.length).fill(0)
        dataList[type][day-1] = (dataList[type][day-1]*100 + (+item.amount)*100)/100
      })
      const data = { dataTime: dataTime, dataList: dataList }
      res.json({ data: data, code: 200, total: results.total })
    }
  })
})


export default app