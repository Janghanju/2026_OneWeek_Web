# 🛠️ Manual Deployment Guide (Docker 없이 직접 배포)

이 문서는 **Docker를 사용하지 않고**, 리눅스 서버(Ubuntu 등)에 직접 Node.js 환경을 구축하여 배포하는 방법을 설명합니다.

---

## 1. 사전 준비 (Prerequisites)

서버에 다음 프로그램들을 설치해야 합니다.

```bash
# 1. 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 2. Node.js (v18 이상) 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. PostgreSQL (데이터베이스) 설치
sudo apt install -y postgresql postgresql-contrib

# 4. Nginx (웹 서버) 설치
sudo apt install -y nginx

# 5. PM2 (프로세스 관리 도구) 설치
sudo npm install -g pm2
```

---

## 2. 데이터베이스 설정

PostgreSQL에 접속해서 사용자와 DB를 생성합니다.

```bash
sudo -u postgres psql
```

```sql
-- psql 내부에서 입력
CREATE DATABASE mydb;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
\q
```
*(비밀번호 'mypassword'는 본인이 원하는 강력한 비밀번호로 변경하세요)*

---

## 3. 프로젝트 설치 및 빌드

### 3.1 코드 가져오기
```bash
git clone https://github.com/Janghanju/2026_OneWeek_Web.git
cd 2026_OneWeek_Web
```

### 3.2 백엔드 (Nest.js) 설정
```bash
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
nano .env
# 내용:
# DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb?schema=public
# PORT=3001

# 빌드
npm run build
cd ..
```

### 3.3 프론트엔드 (Next.js) 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
nano .env.local
# 내용:
# DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb?schema=public
# NEXTAUTH_URL=https://내도메인.com
# NEXTAUTH_SECRET=복잡한비밀번호
# BACKEND_URL=http://localhost:3001

# 빌드
npm run build
```

---

## 4. 서비스 실행 (PM2)

PM2를 사용하여 백엔드와 프론트엔드를 백그라운드에서 실행합니다.

```bash
# 1. 백엔드 실행
cd backend
pm2 start dist/main.js --name "backend"
cd ..

# 2. 프론트엔드 실행
pm2 start npm --name "frontend" -- start

# 3. 상태 확인
pm2 status

# 4. 서버 재부팅 시 자동 실행 설정
pm2 startup
pm2 save
```

---

## 5. Nginx 및 SSL 설정 (도메인 연결)

### 5.1 Nginx 설정 파일 생성
```bash
sudo nano /etc/nginx/sites-available/oneweek
```

아래 내용을 붙여넣으세요. (`example.com`을 본인 도메인으로 변경)

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://localhost:3000; # Next.js로 전달
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 백엔드 API 직접 호출이 필요한 경우 (선택 사항)
    location /api/nest/ {
        proxy_pass http://localhost:3001/;
    }
}
```

### 5.2 설정 적용
```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/oneweek /etc/nginx/sites-enabled/

# 기본 설정 삭제 (충돌 방지)
sudo rm /etc/nginx/sites-enabled/default

# Nginx 재시작
sudo nginx -t
sudo systemctl restart nginx
```

### 5.3 SSL 인증서 발급 (HTTPS)
Certbot을 사용하여 무료로 HTTPS를 적용합니다.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

---

## ✅ 배포 완료!
이제 브라우저에서 `https://내도메인.com`으로 접속하면 사이트가 보입니다.
