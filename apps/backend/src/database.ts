import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(__dirname, '..', '..', '..', 'data', 'tofu-ray.db')

// Ensure data directory exists
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log(`📁 Created data directory: ${dataDir}`)
}

// Set debug mode in development
if (process.env.NODE_ENV !== 'production') {
  sqlite3.verbose()
}

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to open database:', err.message)
    process.exit(1)
  }
  console.log(`✅ Connected to database at ${dbPath}`)
})

export function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        createdAt TEXT,
        updatedAt TEXT
      )
    `, (err) => {
      if (err) console.error('❌ Error creating users table:', err.message)
      else console.log('✅ Users table ready')
    })

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        orderNumber TEXT UNIQUE NOT NULL,
        items TEXT NOT NULL,
        totalPrice REAL NOT NULL,
        currency TEXT,
        status TEXT DEFAULT 'pending',
        email TEXT,
        firstName TEXT,
        lastName TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        postalCode TEXT,
        country TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('❌ Error creating orders table:', err.message)
      else console.log('✅ Orders table ready')
    })

    // Inquiries table
    db.run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        orderId TEXT,
        subject TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        createdAt TEXT,
        updatedAt TEXT,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(orderId) REFERENCES orders(id)
      )
    `, (err) => {
      if (err) console.error('❌ Error creating inquiries table:', err.message)
      else console.log('✅ Inquiries table ready')
    })

    // Inquiry messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS inquiry_messages (
        id TEXT PRIMARY KEY,
        inquiryId TEXT NOT NULL,
        sender TEXT NOT NULL,
        messageType TEXT DEFAULT 'text',
        content TEXT,
        createdAt TEXT,
        FOREIGN KEY(inquiryId) REFERENCES inquiries(id)
      )
    `, (err) => {
      if (err) console.error('❌ Error creating inquiry_messages table:', err.message)
      else console.log('✅ Inquiry_messages table ready')
    })

    // Notices table
    db.run(`
      CREATE TABLE IF NOT EXISTS notices (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT,
        createdAt TEXT,
        updatedAt TEXT
      )
    `, (err) => {
      if (err) console.error('❌ Error creating notices table:', err.message)
      else console.log('✅ Notices table ready')
    })

    // Notice comments table
    db.run(`
      CREATE TABLE IF NOT EXISTS notice_comments (
        id TEXT PRIMARY KEY,
        noticeId TEXT NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT,
        FOREIGN KEY(noticeId) REFERENCES notices(id)
      )
    `, (err) => {
      if (err) console.error('❌ Error creating notice_comments table:', err.message)
      else console.log('✅ Notice_comments table ready')
    })

    console.log('🗄️ Database initialization started')
  })
}
