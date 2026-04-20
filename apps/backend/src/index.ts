import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeDatabase } from './database'
import { seedDatabase } from './seed'
import { authRoutes } from './routes/auth'
import { orderRoutes } from './routes/orders'
import { inquiryRoutes } from './routes/inquiries'
import { noticeRoutes } from './routes/notices'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000
const isProduction = process.env.NODE_ENV === 'production'
const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

if (isProduction && configuredOrigins.length === 0) {
  throw new Error('CORS_ORIGIN must be configured in production')
}

const allowedOrigins =
  configuredOrigins.length > 0
    ? configuredOrigins
    : ['http://localhost:3000', 'http://localhost:3001']

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Not allowed by CORS'))
    },
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize database
initializeDatabase()
seedDatabase()

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  })
})

// API status check
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/notices', noticeRoutes)

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error('❌ [Server Error]', err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log('')
  console.log('╔════════════════════════════════════════╗')
  console.log('║    🚀 Tofu-Ray Backend API Server    ║')
  console.log(`║  Port: ${String(PORT).padEnd(30)}║`)
  console.log(`║  Env: ${String(process.env.NODE_ENV || 'development').padEnd(34)}║`)
  console.log('║  📚 Health: http://localhost:${PORT}/health  ║')
  console.log('║  🔌 API: http://localhost:${PORT}/api       ║')
  console.log('╚════════════════════════════════════════╝')
  console.log('')
})
