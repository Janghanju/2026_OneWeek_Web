# One Week - Jang Hanju Portfolio & Tech News
# One Week - 장한주 포트폴리오 & 기술 뉴스

> **English**: A premium portfolio and IT news platform built with Next.js 14+ (App Router).
> 
> **한국어**: Next.js 14+ (App Router)를 기반으로 구축된 프리미엄 포트폴리오 및 IT 뉴스 플랫폼입니다.

---

## 🚀 Deployment Guide (Docker) / 배포 가이드 (도커)

This is the **recommended** way to deploy the application.
가장 권장되는 배포 방법입니다.

### 1. Prerequisites / 사전 준비
*   **Git**: [Download](https://git-scm.com/)
*   **Docker Desktop**: [Download](https://www.docker.com/products/docker-desktop/)

### 2. Quick Start / 빠른 시작

Run the following commands in your terminal:
터미널에서 아래 명령어들을 순서대로 실행하세요:

```bash
# 1. Clone the repository / 코드 다운로드
git clone https://github.com/Janghanju/2026_ReZero_Web.git
cd 2026_ReZero_Web

# 2. Setup Environment Variables / 환경 변수 설정
# Windows
copy .env.example .env
# Mac/Linux
cp .env.example .env

# 3. Start Services / 서비스 시작
docker-compose up -d --build

# 4. Initialize Database (Crucial!) / 데이터베이스 초기화 (필수!)
docker-compose exec backend npx prisma db push
```

### 3. Access / 접속
*   **Main Site**: [http://localhost:8080](http://localhost:8080)
*   **News Page**: [http://localhost:8080/ko/news](http://localhost:8080/ko/news)

### 4. Update & Maintenance / 업데이트 및 유지보수

```bash
# Update to latest code / 최신 코드 업데이트
git pull
docker-compose up -d --build
docker-compose exec backend npx prisma db push

# Stop services / 서비스 종료
docker-compose down
```

---

## 🛠️ Manual Deployment (Alternative) / 수동 배포 (대안)

If you cannot use Docker, follow these steps to deploy manually on a Linux server (Ubuntu).
도커를 사용할 수 없는 경우, 리눅스 서버에 직접 배포하는 방법입니다.

### 1. Install Dependencies / 의존성 설치
```bash
# Node.js, PostgreSQL, Nginx, PM2
sudo apt update && sudo apt install -y nodejs postgresql postgresql-contrib nginx
sudo npm install -g pm2
```

### 2. Database Setup / 데이터베이스 설정
```bash
sudo -u postgres psql
# In psql:
CREATE DATABASE mydb;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
\q
```

### 3. Build & Run / 빌드 및 실행
```bash
# Backend
cd backend
npm install
npm run build
pm2 start dist/main.js --name "backend"

# Frontend
cd ..
npm install
npm run build
pm2 start npm --name "frontend" -- start
```

### 4. Nginx Setup / Nginx 설정
Configure Nginx to proxy requests to port 3000 (Frontend) and 3001 (Backend).
Nginx를 설정하여 3000번(프론트)과 3001번(백엔드) 포트로 요청을 전달하세요.

---

## 🔒 HTTPS Setup Guide (SSL) / HTTPS 설정 가이드 (SSL)

To enable HTTPS with a free Let's Encrypt certificate, follow these steps on your server.
무료 Let's Encrypt 인증서를 사용하여 HTTPS를 적용하려면 서버에서 다음 단계를 따르세요.

### 1. Configure Nginx for HTTP (Temporary) / Nginx 임시 설정 (HTTP)

First, we need to start Nginx in HTTP mode to allow Certbot to verify your domain.
먼저 Certbot이 도메인을 확인할 수 있도록 Nginx를 HTTP 모드로 실행해야 합니다.

Edit `nginx/conf.d/app.conf`:
`nginx/conf.d/app.conf` 파일을 수정하세요:

```nginx
upstream frontend {
    server oneweek-web:3000;
}

upstream backend {
    server oneweek-backend:3001;
}

server {
    listen 80;
    server_name YOUR_DOMAIN.com; # 👈 Change this to your domain (도메인 변경 필수)

    # Certbot verification path
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Frontend proxy
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Backend proxy
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }
}
```

### 2. Start Nginx / Nginx 실행

```bash
# Remove existing container if any / 기존 컨테이너 삭제
sudo docker rm -f oneweek-nginx

# Run Nginx / Nginx 실행
sudo docker-compose up -d nginx
```

### 3. Issue Certificate / 인증서 발급

Run Certbot to get the certificate. Replace `YOUR_DOMAIN.com` with your actual domain.
Certbot을 실행하여 인증서를 발급받습니다. `YOUR_DOMAIN.com`을 실제 도메인으로 변경하세요.

```bash
sudo docker run --rm -it \
  -v $(pwd)/nginx/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/nginx/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d YOUR_DOMAIN.com
```

If successful, you will see a "Congratulations!" message.
성공하면 "Congratulations!" 메시지가 표시됩니다.

### 4. Enable HTTPS / HTTPS 활성화

Now that you have the certificate, update `nginx/conf.d/app.conf` to enable HTTPS.
인증서가 발급되었으므로 `nginx/conf.d/app.conf`를 수정하여 HTTPS를 활성화합니다.

(Uncomment the HTTPS section in the file or add the SSL configuration pointing to your new certificates.)
(파일 내의 HTTPS 섹션 주석을 해제하거나 새로운 인증서 경로로 SSL 설정을 추가하세요.)

Then restart Nginx:
그 후 Nginx를 재시작합니다:

```bash
sudo docker-compose restart nginx
```

---

Run the development server to view the website locally without Docker.
도커 없이 로컬에서 개발 서버를 실행하는 방법입니다.

```bash
# Install dependencies / 의존성 설치
npm install

# Run dev server / 개발 서버 실행
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features / 주요 기능

*   🌐 **Multilingual Support**: Korean and English interface
*   🔐 **Authentication**: GitHub and Google OAuth integration
*   📱 **Responsive Design**: Works seamlessly on all devices
*   🎨 **Premium UI**: Modern design with animations and glassmorphism
*   📰 **News Aggregator**: IT news fetching and display
*   💼 **Portfolio Showcase**: Project gallery with detailed information

---

## 🏗️ Tech Stack / 기술 스택

*   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
*   **Backend**: [Nest.js](https://nestjs.com/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/) & [Prisma](https://www.prisma.io/)
*   **Styling**: Vanilla CSS (CSS Modules)
*   **Authentication**: NextAuth.js

---

## 📄 License

Built with ❤️ by Jang Hanju.
This project is private and proprietary.
