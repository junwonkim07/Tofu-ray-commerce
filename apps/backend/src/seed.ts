import { db, initializeDatabase } from './database'
import { v4 as uuidv4 } from 'uuid'

export function seedDatabase() {
  // Add some initial test data
  const now = new Date().toISOString()

  // Add test notices
  const notice1Id = uuidv4()
  const notice2Id = uuidv4()

  db.run(
    "INSERT OR IGNORE INTO notices (id, title, content, author, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    [
      notice1Id,
      'VPN 구독 발급 안내',
      '결제 후 문의 탭에서 주문번호를 남겨주시면 순차적으로 구독 링크를 전달해드립니다.',
      '관리자',
      now,
      now,
    ],
    (err) => {
      if (err) console.error('Failed to insert notice 1:', err)
    }
  )

  db.run(
    "INSERT OR IGNORE INTO notices (id, title, content, author, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    [
      notice2Id,
      '야간 서빙 안내',
      '야간에도 문의 남겨주시면 다음 영업일에 빠르게 처리합니다.',
      '관리자',
      now,
      now,
    ],
    (err) => {
      if (err) console.error('Failed to insert notice 2:', err)
    }
  )

  // Add test comment
  db.run(
    "INSERT OR IGNORE INTO notice_comments (id, noticeId, author, content, createdAt) VALUES (?, ?, ?, ?, ?)",
    [
      uuidv4(),
      notice1Id,
      '운영팀',
      '추가로 궁금한 점이 있으시면 문의 탭에서 연락주세요.',
      now,
    ],
    (err) => {
      if (err) console.error('Failed to insert comment:', err)
    }
  )

  console.log('✅ Database seeded with initial data')
}
