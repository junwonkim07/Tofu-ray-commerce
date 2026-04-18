import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
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

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Initialize database
initializeDatabase()
seedDatabase()

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/notices', noticeRoutes)

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
  console.log(`📚 API docs: http://localhost:${PORT}/api`)
})
