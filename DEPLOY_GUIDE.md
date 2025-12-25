# 🚀 Deployment Guide (배포 가이드)

이 문서는 **Docker**를 사용하여 이 프로젝트를 리눅스 서버에 안전하게 배포하는 방법을 설명합니다.

---

## 1. 사전 준비 (Prerequisites)

서버에 다음이 설치되어 있어야 합니다:
- **Docker**
- **Docker Compose** (V2 권장)
- **Git**

---

## 2. 프로젝트 설정 (Configuration)

### 2.1 코드 가져오기
```bash
git clone https://github.com/Janghanju/2026_OneWeek_Web.git
cd 2026_OneWeek_Web
```

### 2.2 환경 변수 설정 (중요!)
보안을 위해 비밀번호와 키는 깃허브에 올라가지 않습니다. 서버에서 직접 `.env` 파일을 생성해야 합니다.

```bash
nano .env
```

아래 내용을 복사하여 붙여넣고, **반드시 본인의 값으로 변경하세요.**

```env
# --- 데이터베이스 설정 ---
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb

# DB 접속 주소 (docker-compose 내부 통신용)
# 형식: postgresql://[USER]:[PASSWORD]@db:5432/[DB_NAME]?schema=public
DATABASE_URL=postgresql://myuser:mypassword@db:5432/mydb?schema=public

# --- Next.js 인증 설정 ---
# 실제 서비스 도메인 (https 필수)
NEXTAUTH_URL=https://example.com
# 비밀번호 생성: `openssl rand -base64 32` 명령어로 생성 추천
NEXTAUTH_SECRET=changeme_very_secret_key

# --- 기타 설정 ---
# 백엔드 주소 (변경 불필요)
BACKEND_URL=http://backend:3001
```

### 2.3 도메인 및 SSL 설정
`init-letsencrypt.sh` 파일을 열어 도메인과 이메일을 수정합니다.

```bash
nano init-letsencrypt.sh
```
- `domains=(example.com www.example.com)` -> 본인 도메인으로 변경
- `email=""` -> 본인 이메일 입력

`nginx/conf.d/app.conf` 파일도 수정합니다.
```bash
nano nginx/conf.d/app.conf
```
- `server_name example.com;` -> 본인 도메인으로 변경 (총 2곳)
- `ssl_certificate ...` 경로의 도메인 부분 변경 (총 2곳)

---

## 3. 실행 및 배포 (Run & Deploy)

### 3.1 SSL 인증서 발급 (최초 1회)
```bash
chmod +x init-letsencrypt.sh
sudo ./init-letsencrypt.sh
```

### 3.2 서비스 실행
```bash
docker-compose up -d --build
```
(또는 `docker compose up -d --build`)

### 3.3 데이터베이스 초기화
```bash
# 프론트엔드 (NextAuth 등)
docker-compose exec web npx prisma migrate deploy

# 백엔드 (NestJS)
docker-compose exec backend npx prisma migrate deploy
```

---

## 4. 업데이트 방법 (Update)

코드가 수정되었을 때 서버에 반영하는 방법입니다.

```bash
# 1. 최신 코드 받기
git pull

# 2. 컨테이너 재빌드 및 실행 (중단 없이 교체)
docker-compose up -d --build --no-deps web backend
# (전체 재시작이 필요하면 그냥 docker-compose up -d --build)

# 3. 필요시 DB 마이그레이션 실행
```
