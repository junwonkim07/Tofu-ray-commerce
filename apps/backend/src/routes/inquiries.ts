import express, { Router, Request, Response } from 'express'
import { db } from '../database'
import { v4 as uuidv4 } from 'uuid'

export const inquiryRoutes: Router = express.Router()

// Create inquiry
inquiryRoutes.post('/', (req: Request, res: Response) => {
  const { userId, orderId, subject, initialMessage } = req.body

  if (!subject) {
    return res.status(400).json({ error: 'Subject required' })
  }

  const inquiryId = uuidv4()
  const now = new Date().toISOString()

  db.run(
    'INSERT INTO inquiries (id, userId, orderId, subject, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [inquiryId, userId || null, orderId || null, subject, now, now],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create inquiry' })
      }

      // Add initial message if provided
      if (initialMessage) {
        const messageId = uuidv4()
        db.run(
          'INSERT INTO inquiry_messages (id, inquiryId, sender, messageType, content, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
          [messageId, inquiryId, 'user', 'text', initialMessage, now],
          (err) => {
            if (err) {
              console.error('Failed to add initial message:', err)
            }
          }
        )
      }

      res.status(201).json({
        inquiryId,
        subject,
        status: 'open',
        createdAt: now,
      })
    }
  )
})

// Get all inquiries
inquiryRoutes.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM inquiries ORDER BY createdAt DESC', (err, inquiries: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    res.json(inquiries || [])
  })
})

// Get inquiry with messages
inquiryRoutes.get('/:inquiryId', (req: Request, res: Response) => {
  const { inquiryId } = req.params

  db.get('SELECT * FROM inquiries WHERE id = ?', [inquiryId], (err, inquiry: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' })
    }

    // Get messages
    db.all(
      'SELECT * FROM inquiry_messages WHERE inquiryId = ? ORDER BY createdAt ASC',
      [inquiryId],
      (err, messages: any[]) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' })
        }

        res.json({
          ...inquiry,
          messages: messages || [],
        })
      }
    )
  })
})

// Add message to inquiry
inquiryRoutes.post('/:inquiryId/messages', (req: Request, res: Response) => {
  const { inquiryId } = req.params
  const { sender, content, messageType } = req.body

  if (!sender || !content) {
    return res.status(400).json({ error: 'Sender and content required' })
  }

  const messageId = uuidv4()
  const now = new Date().toISOString()

  db.run(
    'INSERT INTO inquiry_messages (id, inquiryId, sender, messageType, content, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [messageId, inquiryId, sender, messageType || 'text', content, now],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add message' })
      }

      res.status(201).json({
        messageId,
        sender,
        content,
        messageType: messageType || 'text',
        createdAt: now,
      })
    }
  )
})

// Get user inquiries
inquiryRoutes.get('/user/:userId', (req: Request, res: Response) => {
  const { userId } = req.params

  db.all(
    'SELECT * FROM inquiries WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, inquiries: any[]) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }

      res.json(inquiries || [])
    }
  )
})
