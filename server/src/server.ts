import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import proxy from 'express-http-proxy'
import bodyParser from 'body-parser'
import session from 'express-session'
import SessionFileStore from 'session-file-store'
import * as auth from './db/auth'
import cors from 'cors'
import { createSession, getSession } from './db/session'
import cookieParser from 'cookie-parser'

const FileStore = SessionFileStore(session)

declare module 'express-session' {
  export interface SessionData {
    [key: string]: any
  }
}

const app = express()
app.use(bodyParser())
app.use(cookieParser())
if (typeof process.env.COOKIE_SECRET === 'undefined') {
  console.error('Environment variable COOKIE_SECRET is required')
  process.exit(1)
}

app.use(cors({
  origin: false,
}))

app.use('/times-visited', (req, res) => {
  const timesVisited = Number(req.cookies["times-visited"]) + 1
  res.cookie('times-visited', timesVisited)
  res.end(timesVisited+'')
})

app.use(session({
  secret: process.env.COOKIE_SECRET,
  store: new FileStore({}),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365,
  }
}))

app.use(async (req, res, next) => {
  if (!/^\/api\//.test(req.url)) {
    return next()
  }
  const token = req.session.token
  if (typeof token !== 'undefined') {
    const session = await getSession(token)
    if (session) {
      res.locals.username = session.username
    } else {
      req.session.destroy(() => {})
    }
  }
  next()
})
const PORT = 4000

app.get('/ping', (req, res) => res.end('pong'))

app.get('/api/sign-out', async (req, res) => {
  const token = req.session.token
  if (typeof token !== 'undefined') {
    req.session.clear()
    req.session.destroy(() => {})
    return res.end('You are signed out')
  }
  return res.end('You are not signed in.')
})

app.post('/api/sign-up', async (req, res) => {
  try {
    await auth.createUser(req.body)
  } catch (err) {
    if (err.code === '23505') {
      res.status(409)
      res.end('That user already exists')
    } else {
      res.status(500)
      res.end("Something went wrong.")
    }
    return
  }
  req.session.token = await createSession(req.body.username)
  res.end('Success!')
})

app.post('/api/sign-in', async (req, res) => {
  const user = await auth.getUserByUsername(req.body.username)
  if (!user) {
    res.status(404)
    return res.end('Could not find that user')
  }
  if (!await auth.comparePassword(req.body.password, user.password)) {
    res.status(403)
    return res.end('Username or password incorrect')
  }
  req.session.token = await createSession(user.username)
  res.end('Success!')
})

app.get('/api/user-info', async (req, res) => {
  if (res.locals.username) {
    const user = await auth.getUserByUsername(res.locals.username)
    res.json({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    })
  }
  res.status(401)
  res.end('not logged in')
})

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