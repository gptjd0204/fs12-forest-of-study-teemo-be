## 📌 프로젝트 소개

이 프로젝트는 공부의 숲을 위한 백엔드 입니다.

### 기술 스택

- Node.js
- Express
- Prisma
- PostgreSQL

## 🚀 실행 방법

### 1. 저장소 클론

git clone (repo-url)

cd (project)

### 2. 패키지 설치

npm install

### 3. 환경 변수 설정

.env 파일 생성 후 아래 값 추가

DATABASE_URL="데이터 베이스 URL 추가"

PORT=8080

### 4. Prisma 설정

npx prisma generate
npx prisma migrate dev

### 5. 서버 실행

npm run dev

## 📂 프로젝트 구조

```
src/
├── controllers/   # 요청 처리 로직
|    ├── EmojiController.js
|    ├── HabitReadController.js
|    ├── HabitWriteController.js
|    ├── pointsController.js
|    ├── studyController.js
|    ├── timerController.js
     └── pointsController.js
|
├── lib
|    ├── DateRange.js
|    └── prisma.js
|
├── routes/        # 라우터
|    ├── EmojiRoutes.js
|    ├── HabitRoutes.js
|    ├── LogsRoutes.js
|    ├── studyRoutes.js
|    ├── timerRoutes.js
     └── pointsRoutes.js
|
├── prisma/        # Prisma 스키마
     ├── schema.prisma
|    ├── seeds/
|        ├── seed.js
|        ├── seedDatas.js
|
└── server.js         # 서버 시작 파일
```

## 🧩 주요 기능

### 📌 스터디

- 스터디 목록 조회

- 최근 조회한 스터디 조회

- 스터디 생성

- 스터디 정보 수정

- 스터디 상세 조회

- 스터디 삭제

### 📌 응원 이모지

- 스터디 상세 페이지에서 응원 이모지 추가

### 📌 오늘의 습관

- 오늘의 습관 목록 조회

- 오늘의 습관 생성

- 습관 완료 체크

- 습관 수정 및 삭제

### 📌 오늘의 집중 (타이머)

- 집중 시작

- 집중 종료 및 기록 저장

### 📌 스터디 로그

- 포인트 획득 로그 조회

- 집중 시간 기록 로그 조회

## 📡 API Base URL

- /api/studies : 스터디 관련 API
- /api/habits : 습관 관련 API
- /api/emojis : 이모지 관련 API
- /api/timers : 타이머 관련 API
- /api/logs : 로그 관련 API
- /api/points : 포인트 관련 API

## 📡 API 명세

### 📌 스터디 (Studies)

### 스터디 목록 조회

GET /api/studies

### 스터디 상세 조회

GET /api/studies/:studyId

### 스터디 생성

POST /api/studies

### 스터디 수정

PATCH /api/studies/:studyId

### 스터디 삭제

DELETE /api/studies/:studyId

### 비밀번호 검증

POST /api/studies/:studyId/pw

## 📌 타이머 (Timers)

### 타이머 생성

POST /api/timers/:studyId

### 타이머 조회

GET /api/timers/:studyId

### 목표 시간 수정

PATCH /api/timers/:studyId/target-duration

### 타이머 시작

PATCH /api/timers/:studyId/start

### 타이머 일시정지

PATCH /api/timers/:studyId/pause

### 타이머 초기화

PATCH /api/timers/:studyId/reset

### 타이머 완료

PATCH /api/timers/:studyId/complete

## 📌 습관 (Habits)

### 오늘의 습관 조회

GET /api/habits/:studyId/today

### 주간 습관 조회

GET /api/habits/:studyId/weekly

### 습관 생성

POST /api/habits/:studyId

### 습관 완료 체크

PATCH /api/habits/:studyId/:habitId/today

### 습관 수정

PATCH /api/habits/:studyId/:habitId

### 습관 삭제

DELETE /api/habits/:studyId/:habitId

## 📌 이모지 (Emojis)

### 이모지 조회

GET /api/emojis/:studyId

### 이모지 생성

POST /api/emojis/:studyId

### 이모지 수정

PATCH /api/emojis/:studyId/:emojiId

## 📌 로그 (Logs)

### 스터디 로그 조회

GET /api/logs/:studyId/logs

## 📌 포인트 (Points)

GET /api/points/:id

## API 응답 형식

- 200 OK : 요청 성공

```jsx
{
  "success": true,
  "message": "요청이 정상적으로 처리되었습니다.",
  "data": {}
}
```

- 201 Created : 리소스 생성 성공

```jsx
{
  "success": true,
  "message": "리소스가 정상적으로 생성되었습니다.",
  "data": {}
}
```

- 400 Bad Request : 요청 값이 올바르지 않거나, 필수 값 누락

```jsx
{
  "success": false,
  "message": "잘못된 요청입니다.",
  "errors": []
}
```

- 404 Not Found : 요청한 리소스 찾을 수 없는 오류

```jsx
{
  "success": false,
  "message": "요청한 리소스를 찾을 수 없습니다.",
  "errors": []
}
```

- 500 Internal Server Error : 서버 내부 오류

```
{
  "success": false,
  "message": "서버 내부 오류가 발생했습니다.",
  "errors": []
}
```
