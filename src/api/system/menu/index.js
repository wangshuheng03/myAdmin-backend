import { getSystemenuAll, addSystemenuAll, deleteSystemenuAll, editSystemenuAll } from '../../../db/system/menu.js'
import express from 'express'

const app = express()

app.use(express.json())

function buildTree(items, parentId = null) {
  return items
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      ...item,
      children: buildTree(items, item.id)
    }))
}

app.get('/system/menu/list', (req, res) => {
  //获取通过paeams传递的数据
  let data = req.query
  
  getSystemenuAll(data,(err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      // console.log('11111111111111111', buildTree(results))
      //对数据进行处理使其变成树形结构
      res.json({   data: results, code: 200 })
    }
  })
})

app.get('/system/Role/menu/list', (req, res) => {
  //获取通过paeams传递的数据
  let data = req.query
  
  getSystemenuAll(data,(err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      // console.log('11111111111111111', buildTree(results))
      //对数据进行处理使其变成树形结构
      res.json({ data: results, code: 200 })
    }
  })
})
app.post('/system/menu/add', (req, res) => {
  let data = req.body
  console.log(data, '添加数据')
  data.create_at = new Date()
  addSystemenuAll(data, (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })

    } else {
      res.json({   data: results, code: 200 })
    }
  })
})

app.post('/system/menu/edit', (req, res) => {
  let data = req.body
  console.log(data, '编辑数据')
  data.update_at = new Date()
  editSystemenuAll(data, (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })
    } else {
      res.json({   data: results, code: 200 })
    }
  })
})
app.post('/system/menu/delete', (req, res) => {
  let id = req.body.id
  console.log(id, '删除数据')
  deleteSystemenuAll(id, (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: '系统错误请联系管理员', error: err.message })

    } else {
      res.json({   data: results, code: 200 })
    }
  })
})

export default app