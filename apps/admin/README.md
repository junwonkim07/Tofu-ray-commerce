# Tofu-ray 관리자 대시보드

## 개요

Tofu-ray VPN 서비스의 관리자 대시보드입니다. 주문, 문의, 공지사항을 관리할 수 있습니다.

## 실행 방법

### 1. 포트 확인
- 백엔드: `http://localhost:5000`
- 프론트엔드: `http://localhost:3001`
- 관리자 대시보드: `http://localhost:3002`

### 2. 관리자 앱 설치
```bash
cd apps/admin
pnpm install
```

### 3. 개발 서버 실행
```bash
pnpm dev
```

포트 3002에서 실행됩니다.

## 로그인

테스트 계정:
- **이메일**: admin@tofu-ray.com
- **비밀번호**: admin123

> **주의**: 현재는 데모용 로그인입니다. 프로덕션 환경에서는 실제 인증 시스템을 구현해야 합니다.

## 기능

### 1. 대시보드
- 주문, 문의, 공지사항 통계
- 각 관리 페이지로의 바로가기

### 2. 주문 관리
- 전체 주문 목록 조회
- 주문 상세 정보 확인
- 주문 상태 변경 (대기중 → 완료 → 취소)

### 3. 문의 관리
- 고객 문의 목록 조회
- 문의 상세 내용 확인
- 고객 문의에 답변 작성

### 4. 공지사항 관리
- 공지사항 목록 조회
- 공지사항 상세 조회 및 댓글 확인
- 새로운 공지사항 작성
- 공지사항 수정 (준비 중)

## 기술 스택

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Components**: Custom UI Components
- **Font**: Lacquer (Google Fonts)
- **Theme**: Dark Theme
- **API Client**: Fetch API

## 스타일

- **색상**: Tofu Orange (HSL: 35, 70%, 55%)
- **테마**: Dark Theme (자동 적용)
- **폰트**: Lacquer (제목), System Font (본문)

## 환경 변수

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 추가 기능 (준비 중)

- [ ] 주문 상세 페이지
- [ ] 주문 상태 변경 UI
- [ ] 문의 상세 페이지 및 답변 작성
- [ ] 공지사항 수정/삭제
- [ ] 사용자 관리
- [ ] 통계 및 분석 대시보드
- [ ] 실제 관리자 인증 시스템

## 개발 가이드

### 새로운 페이지 추가
```bash
# app/dashboard/example/page.tsx 생성
```

### API 호출
```typescript
import { adminOrderAPI, adminInquiryAPI, adminNoticeAPI } from '@/lib/api-client'

// 주문 조회
const result = await adminOrderAPI.getAll()

// 문의 조회
const result = await adminInquiryAPI.getById(inquiryId)

// 공지사항 작성
const result = await adminNoticeAPI.create({ title, content })
```

## 문제 해결

### 포트 이미 사용 중
```bash
# 다른 포트에서 실행
pnpm dev -- -p 3003
```

### API 연결 안 됨
1. 백엔드 서버 실행 확인: `http://localhost:5000/health`
2. `.env.local`의 `NEXT_PUBLIC_API_URL` 확인
3. CORS 설정 확인

## 라이선스

MIT
