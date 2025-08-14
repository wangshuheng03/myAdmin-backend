import { getUserPassword, addDictType, editDictType, deleteDictType } from '../../../db/system/dict.js'
import express from 'express'

const app = express()

app.use(express.json())

app.get('/system/dict/list', (req, res) => {
  //获取通过paeams传递的数据
  let data = req.query
  
  getUserPassword(data,(err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      // console.log('11111111111111111', buildTree(results))
      //对数据进行处理使其变成树形结构
      res.json({   data: results.data, code: 200, total: results.total })
    }
  })
})

//字典新增接口
app.post('/system/dict/add',(req,res) => {
  const data = req.body
  addDictType(data, (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      res.json({ message: '修改成功', data: results, code: 200 })
    }
  })
})

//字典编辑接口
app.post('/system/dict/edit',(req,res) => {
  const data = req.body
  console.log(data,'BBBBBBBBBBBBBBBBBBBBB')
  
  editDictType(data, (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      res.json({ message: '修改成功', data: results, code: 200 })
    }
  })
})

//字典删除接口
app.post('/system/dict/delete',(req,res) => {
  const id = req.body.id
  deleteDictType(id, (err, results) => {
      if (err) {
        console.error(err)
        res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
  
      } else {
        res.json({   data: results, code: 200 })
      }
    })
})

export default app