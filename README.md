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

## 💻 Local Development / 로컬 개발

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
