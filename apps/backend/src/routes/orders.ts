import express, { Router, Request, Response } from 'express'
import { db } from '../database'
import { v4 as uuidv4 } from 'uuid'

export const orderRoutes: Router = express.Router()

// Generate order number
function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(5, '0')
  return `ORD-${year}${month}${day}${random}`
}

// Create order
orderRoutes.post('/', (req: Request, res: Response) => {
  const {
    userId,
    items,
    totalPrice,
    currency,
    email,
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    postalCode,
    country,
  } = req.body

  if (!items || !totalPrice || !email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const orderId = uuidv4()
  const orderNumber = generateOrderNumber()
  const now = new Date().toISOString()

  db.run(
    `INSERT INTO orders 
    (id, userId, orderNumber, items, totalPrice, currency, email, firstName, lastName, phone, address, city, state, postalCode, country, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderId,
      userId || null,
      orderNumber,
      JSON.stringify(items),
      totalPrice,
      currency || 'CNY',
      email,
      firstName || null,
      lastName || null,
      phone || null,
      address || null,
      city || null,
      state || null,
      postalCode || null,
      country || null,
      now,
      now,
    ],
    function (err) {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: 'Failed to create order' })
      }

      res.status(201).json({
        orderId,
        orderNumber,
        status: 'pending',
        createdAt: now,
      })
    }
  )
})

// Get all orders
orderRoutes.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM orders ORDER BY createdAt DESC', (err, orders: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    res.json(
      (orders || []).map((order) => ({
        ...order,
        items: JSON.parse(order.items),
      }))
    )
  })
})

// Get order
orderRoutes.get('/:orderNumber', (req: Request, res: Response) => {
  const { orderNumber } = req.params

  db.get('SELECT * FROM orders WHERE orderNumber = ?', [orderNumber], (err, order: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({
      ...order,
      items: JSON.parse(order.items),
    })
  })
})

// Get user orders
orderRoutes.get('/user/:userId', (req: Request, res: Response) => {
  const { userId } = req.params

  db.all(
    'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, orders: any[]) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }

      res.json(
        orders.map((order) => ({
          ...order,
          items: JSON.parse(order.items),
        }))
      )
    }
  )
})

// Update order status
orderRoutes.patch('/:orderNumber/status', (req: Request, res: Response) => {
  const { orderNumber } = req.params
  const { status } = req.body

  const now = new Date().toISOString()

  db.run(
    'UPDATE orders SET status = ?, updatedAt = ? WHERE orderNumber = ?',
    [status, now, orderNumber],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update order' })
      }

      res.json({ orderNumber, status, updatedAt: now })
    }
  )
})
