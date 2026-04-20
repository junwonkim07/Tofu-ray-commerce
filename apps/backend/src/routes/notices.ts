import express, { Router, Request, Response } from 'express'
import { db } from '../database'
import { v4 as uuidv4 } from 'uuid'

export const noticeRoutes: Router = express.Router()

// Get all notices
noticeRoutes.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM notices ORDER BY createdAt DESC', (err, notices: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    res.json(notices || [])
  })
})

// Get notice with comments
noticeRoutes.get('/:noticeId', (req: Request, res: Response) => {
  const { noticeId } = req.params

  db.get('SELECT * FROM notices WHERE id = ?', [noticeId], (err, notice: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' })
    }

    // Get comments
    db.all(
      'SELECT * FROM notice_comments WHERE noticeId = ? ORDER BY createdAt ASC',
      [noticeId],
      (err, comments: any[]) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' })
        }

        res.json({
          ...notice,
          comments: comments || [],
        })
      }
    )
  })
})

// Create notice (admin only)
noticeRoutes.post('/', (req: Request, res: Response) => {
  try {
    const { title, content, author } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' })
    }

    const noticeId = uuidv4()
    const now = new Date().toISOString()

    console.log(`📝 [Notice] Creating new notice: "${title}"`)
    
    db.run(
      'INSERT INTO notices (id, title, content, author, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [noticeId, title, content, author || '관리자', now, now],
      function (err) {
        if (err) {
          console.error(`❌ [Notice] Database insert error:`, err.message)
          return res.status(500).json({ error: 'Failed to create notice' })
        }

        console.log(`✅ [Notice] Notice created successfully: ${noticeId}`)
        res.status(201).json({
          noticeId,
          title,
          content,
          author: author || '관리자',
          createdAt: now,
        })
      }
    )
  } catch (error) {
    console.error('❌ [Notice] Unexpected error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Add comment to notice
noticeRoutes.post('/:noticeId/comments', (req: Request, res: Response) => {
  const { noticeId } = req.params
  const { author, content } = req.body

  if (!author || !content) {
    return res.status(400).json({ error: 'Author and content required' })
  }

  const commentId = uuidv4()
  const now = new Date().toISOString()

  db.run(
    'INSERT INTO notice_comments (id, noticeId, author, content, createdAt) VALUES (?, ?, ?, ?, ?)',
    [commentId, noticeId, author, content, now],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add comment' })
      }

      res.status(201).json({
        commentId,
        author,
        content,
        createdAt: now,
      })
    }
  )
})
