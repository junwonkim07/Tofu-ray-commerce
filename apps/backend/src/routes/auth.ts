import express, { Router, Request, Response } from 'express'
import { db } from '../database'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const authRoutes: Router = express.Router()

const isProduction = process.env.NODE_ENV === 'production'
const configuredJwtSecret = process.env.JWT_SECRET

if (isProduction && !configuredJwtSecret) {
  throw new Error('JWT_SECRET must be configured in production')
}

const JWT_SECRET = configuredJwtSecret || 'dev-only-secret-change-me'
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12)

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isBcryptHash(value: string) {
  return value.startsWith('$2a$') || value.startsWith('$2b$') || value.startsWith('$2y$')
}

// Signup
authRoutes.post('/signup', (req: Request, res: Response) => {
  const rawEmail = String(req.body?.email || '')
  const password = String(req.body?.password || '')

  const email = normalizeEmail(rawEmail)

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, existingUser: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    bcrypt.hash(password, BCRYPT_ROUNDS, (hashError, hashedPassword) => {
      if (hashError) {
        return res.status(500).json({ error: 'Failed to secure password' })
      }

      const userId = uuidv4()
      const now = new Date().toISOString()

      db.run(
        'INSERT INTO users (id, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        [userId, email, hashedPassword, now, now],
        function (insertError) {
          if (insertError) {
            return res.status(500).json({ error: 'Failed to create user' })
          }

          const token = jwt.sign({ userId, email }, JWT_SECRET, {
            expiresIn: '24h',
          })

          return res.status(201).json({ token, userId, email })
        }
      )
    })
  })
})

// Login
authRoutes.post('/login', (req: Request, res: Response) => {
  const rawEmail = String(req.body?.email || '')
  const password = String(req.body?.password || '')

  const email = normalizeEmail(rawEmail)

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const issueToken = () => {
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '24h',
      })
      return res.json({ token, userId: user.id, email: user.email })
    }

    const storedPassword = String(user.password || '')

    // Backward compatibility: migrate legacy plain-text passwords to bcrypt on successful login.
    if (!isBcryptHash(storedPassword)) {
      if (storedPassword !== password) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      bcrypt.hash(password, BCRYPT_ROUNDS, (hashError, hashedPassword) => {
        if (!hashError) {
          db.run('UPDATE users SET password = ?, updatedAt = ? WHERE id = ?', [
            hashedPassword,
            new Date().toISOString(),
            user.id,
          ])
        }
        return issueToken()
      })
      return
    }

    bcrypt.compare(password, storedPassword, (compareError, isMatch) => {
      if (compareError) {
        return res.status(500).json({ error: 'Password verification failed' })
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      return issueToken()
    })
  })
})

// Verify token
authRoutes.post('/verify', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    res.json({ valid: true, userId: decoded.userId, email: decoded.email })
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})
