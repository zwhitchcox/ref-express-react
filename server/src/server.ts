import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import proxy from 'express-http-proxy'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'


const app = express()
app.use(bodyParser())
app.use(cookieParser())
app.get('/ping', (req, res) => res.end('pong'))

const PORT = 4000

if (process.env.NODE_ENV === "production") {
  app.use(express.static('build'))
} else {
  app.use(
    '/sockjs-node',
    createProxyMiddleware(
      '/sockjs-node',
      {
        target: 'ws://localhost:3000',
        ws: true,
      }
    )
  )
  app.use(proxy('http://localhost:3000'))
}

app.listen(PORT, () => console.log(`listening ${PORT}`))