import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import analyzeHandler from './api/analyze.js'

function jsonBodyParser(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
    })

    request.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })

    request.on('error', reject)
  })
}

function localApiPlugin() {
  return {
    name: 'local-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/analyze', async (request, response) => {
        try {
          request.body = await jsonBodyParser(request)
          await analyzeHandler(request, {
            setHeader: (name, value) => response.setHeader(name, value),
            status(code) {
              response.statusCode = code
              return this
            },
            json(payload) {
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify(payload))
            },
          })
        } catch (error) {
          console.error('本地 API 代理失败:', error)
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ error: '请求格式无效' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
})
