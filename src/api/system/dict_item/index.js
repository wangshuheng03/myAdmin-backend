import { getDictItems, addDictItem, updateDictItem, deleteDictItem} from '../../../db/system/dict_item.js'
import express from 'express'

const app = express()

app.use(express.json())

app.get('/system/dictItem/list',(req,res)=>{
  getDictItems(req.query,(err,data)=>{
    if(err){
      console.error(err)
      return res.status(500).json({error: err.message})
    } else {
      res.json({   data: data, code: 200 })
    }
  })
})

app.post('/system/dictItem/add',(req,res)=>{
  addDictItem(req.body,(err,data)=>{
    if(err){
      console.error(err)
      return res.status(500).json({error: err.message})
    } else {
      res.json({   data: data, code: 200 })
    }
  })
})

app.put('/system/dictItem/update',(req,res)=>{
  updateDictItem(req.body,(err,data)=>{
   if(err){
      console.error(err)
      return res.status(500).json({error: err.message})
    } else {
      res.json({   data: data, code: 200 })
    }
  })
})

app.delete('/system/dictItem/delete',(req,res)=>{
  deleteDictItem(req.body.id,(err,data)=>{
    if(err){
      console.error(err)
      return res.status(500).json({error: err.message})
    } else {
      res.json({   data: data, code: 200 })
    }
  })
})

export default app