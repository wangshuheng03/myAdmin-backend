import { createRequire } from 'module'
import moduleAlias from 'module-alias'

const require = createRequire(import.meta.url)

moduleAlias.addAliases({
  '@': require.resolve('../src'),
})

import express from 'express'
import cors from 'cors'
import { readdirSync, statSync } from 'fs'
import { join, extname, relative } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())          // 允许跨域
app.use(express.json())  // 解析 JSON 请求体

let blacklistedTokens = new Set()

// 退出登录路由
app.post('/system/user/logout', (req, res) => {
  const token = req.headers['x-access-token']
  if (token) {
    blacklistedTokens.add(token)
  }
  res.json({ message: '退出登录成功' })
})

// 检查token是否在黑名单中
app.get('/system/user/checkToken', (req, res) => {
  const token = req.headers['x-access-token']
  if (token && blacklistedTokens.has(token)) {
    return res.json({ message: 'Token已失效', code: 401 })
  }
  res.json({ message: 'Token有效', code: 200 })
})

// 请求拦截器
app.use((req, res, next) => {
  if (req.path === '/system/user/checkToken' || req.path === '/system/user/login' ||req.path === '/system/Role/menu/list' || req.path === '/__vite_ping') return next()
  const token = req.headers['x-access-token']
  if (!token) {
    console.log(req.path,'不存在token')
    return next()
  } else {
    console.log('存在token',token)
    if (!token) return res.sendStatus(401)
    // 检查token是否在黑名单中
    if (blacklistedTokens.has(token)) {
      return res.sendStatus(401)
    }
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) return res.sendStatus(401)
      req.user = user
      next()
    })
  }


})

// 递归函数来加载路由
async function loadRoutes(directory) {
  const files = readdirSync(directory)
  for (const file of files) {
    const filePath = join(directory, file)
    const fileStat = statSync(filePath)

    if (fileStat.isDirectory()) {
      // 如果是文件夹，递归加载文件夹中的路由
      await loadRoutes(filePath)
    } else if (extname(file) === '.js') {
      // 如果是 JavaScript 文件，动态导入路由文件
      const relativePath = './' + relative(__dirname, filePath).replace(/\\/g, '/')
      try {
        const routeModule = await import(relativePath)
        if (routeModule.default) {
          app.use(routeModule.default)
        } else {
          console.error('Module does not have a default export:', relativePath)
        }
      } catch (error) {
        console.error('Error importing module:', error)
      }
    }
  }
}

// 加载 API 文件夹中的路由
loadRoutes(join(__dirname, 'API'))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
