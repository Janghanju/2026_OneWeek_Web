# 🚀 Deployment & Development Guide (배포 및 개발 가이드)

이 문서는 **로컬 개발 환경 설정**과 **리눅스 서버 배포 방법**을 모두 다룹니다.

---

## 💻 1. Local Development (로컬 개발)

내 컴퓨터(Windows/Mac)에서 개발하고 테스트하는 방법입니다.

### 1.1 사전 준비
- Node.js 설치 (v18 이상)
- PostgreSQL 설치 (또는 Docker로 DB만 실행)

### 1.2 실행 방법
두 개의 터미널을 열어서 프론트엔드와 백엔드를 각각 실행해야 합니다.

**Terminal 1: Frontend (Next.js)**
```bash
# 루트 경로에서
npm install
npm run dev
```
- 접속 주소: http://localhost:3000

**Terminal 2: Backend (Nest.js)**
```bash
# backend 폴더에서
cd backend
npm install
npm run start:dev
```
- 접속 주소: http://localhost:3001

> **참고**: 백엔드가 켜져 있어야 뉴스 목록 등이 정상적으로 보입니다.

---

## 🌐 2. Server Deployment (서버 배포)

리눅스 서버(Ubuntu 등)에 Docker를 사용하여 안전하게 배포하는 방법입니다.

### 2.1 사전 준비 (서버)
- **Docker** & **Docker Compose** (V2) 설치
- **Git** 설치

### 2.2 배포 순서

#### 1단계: 코드 가져오기
```bash
git clone https://github.com/Janghanju/2026_OneWeek_Web.git
cd 2026_OneWeek_Web
```

#### 2단계: 환경 변수 설정 (보안 필수!)
서버에는 `.env` 파일이 없으므로 직접 생성해야 합니다.
**이 파일에 실제 비밀번호와 키를 입력합니다.**

```bash
nano .env
```

**`.env` 내용 예시 (복사해서 수정하세요):**
```env
# --- 데이터베이스 설정 (비밀번호 변경 필수) ---
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb

# DB 접속 주소 (변경 불필요)
DATABASE_URL=postgresql://myuser:mypassword@db:5432/mydb?schema=public

# --- Next.js 인증 설정 ---
# 실제 서비스 도메인 (https://...)
NEXTAUTH_URL=https://example.com
# 비밀번호 생성: `openssl rand -base64 32`
NEXTAUTH_SECRET=changeme_very_secret_key

# --- 백엔드 설정 ---
BACKEND_URL=http://backend:3001
```

#### 3단계: 도메인 및 SSL 설정
`init-letsencrypt.sh`와 `nginx/conf.d/app.conf` 파일을 열어 `example.com`을 본인의 도메인으로 변경합니다.

```bash
nano init-letsencrypt.sh
nano nginx/conf.d/app.conf
```

#### 4단계: 실행
```bash
# 1. SSL 인증서 발급 (최초 1회만)
chmod +x init-letsencrypt.sh
sudo ./init-letsencrypt.sh

# 2. 서비스 시작
docker-compose up -d --build
```

---

## 🔄 3. Update (업데이트 방법)

코드를 수정하고 깃허브에 올린 뒤, 서버에 반영하는 방법입니다.

```bash
# 1. 최신 코드 받기
git pull

# 2. 변경 사항 반영 (무중단 배포 시도)
docker-compose up -d --build

# 3. (필요시) DB 마이그레이션
docker-compose exec web npx prisma migrate deploy
```
