# Tofu-ray Backend API

## 설정 방법

### 1. 의존성 설치
```bash
cd apps/backend
pnpm install
```

### 2. 환경 변수 설정
`.env.local` 파일이 이미 생성되어 있습니다.

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=sqlite:./data/tofu-ray.db
```

프로덕션 환경에서는 `JWT_SECRET`을 변경하세요.

### 3. 개발 서버 실행
```bash
pnpm dev
```

서버는 `http://localhost:5000`에서 실행됩니다.

### 4. 빌드
```bash
pnpm build
```

### 5. 프로덕션 실행
```bash
pnpm build
pnpm start
```

## API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/login` - 로그인 (이메일/비밀번호)
- `POST /api/auth/verify` - 토큰 검증

### 주문 (Orders)
- `POST /api/orders` - 주문 생성
- `GET /api/orders/:orderNumber` - 주문번호로 조회
- `GET /api/orders/user/:userId` - 사용자 주문 목록
- `PATCH /api/orders/:orderNumber/status` - 주문 상태 변경

### 문의 (Inquiries)
- `POST /api/inquiries` - 문의 생성
- `GET /api/inquiries/:inquiryId` - 문의 조회 (메시지 포함)
- `POST /api/inquiries/:inquiryId/messages` - 메시지 추가
- `GET /api/inquiries/user/:userId` - 사용자 문의 목록

### 공지사항 (Notices)
- `GET /api/notices` - 공지사항 목록
- `GET /api/notices/:noticeId` - 공지사항 상세 조회 (댓글 포함)
- `POST /api/notices` - 공지사항 생성 (관리자)
- `POST /api/notices/:noticeId/comments` - 댓글 추가

## 데이터베이스

SQLite3를 사용합니다. 데이터베이스 파일은 `data/tofu-ray.db`에 생성됩니다.

### 테이블 구조
- `users` - 사용자 정보
- `orders` - 주문
- `inquiries` - 문의 채팅
- `inquiry_messages` - 문의 메시지
- `notices` - 공지사항
- `notice_comments` - 공지사항 댓글

## 인증

요청 헤더에 JWT 토큰을 포함하여 보내세요:
```
Authorization: Bearer <token>
```

## 프론트엔드 통합

`apps/storefront/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 개발 팁

- 로그인은 이메일만으로 가능합니다 (데모용)
- 프로덕션에서는 비밀번호 검증을 추가하세요
- JWT_SECRET을 안전한 값으로 변경하세요
- 데이터베이스는 SQLite이므로 프로덕션에서는 PostgreSQL 등으로 변경을 권장합니다
