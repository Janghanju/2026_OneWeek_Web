# 🚀 One Week Web - 배포 및 설정 가이드

이 가이드는 **One Week Web** 프로젝트를 로컬 환경이나 서버에 배포하기 위한 상세 설명서입니다.
초보 개발자도 따라 할 수 있도록 단계별로 설명되어 있습니다.

---

## 📋 목차
1. [사전 준비사항](#1-사전-준비사항)
2. [환경 변수 설정 (.env)](#2-환경-변수-설정-env)
    - [데이터베이스 (DB)](#데이터베이스-db-설정)
    - [소셜 로그인 (GitHub, Google)](#소셜-로그인-github-google-설정)
    - [기타 설정](#기타-설정)
3. [도커(Docker)로 실행하기](#3-도커docker로-실행하기)
    - [도커 설정 설명 (docker-compose.yml)](#도커-설정-설명-docker-composeyml)
    - [실행 명령어](#실행-명령어)
    - [포트 변경 방법](#포트-변경-방법)
4. [문제 해결 (Troubleshooting)](#4-문제-해결-troubleshooting)

---

## 1. 사전 준비사항

이 프로젝트를 실행하려면 컴퓨터에 다음 프로그램들이 설치되어 있어야 합니다.

*   **Git**: 소스 코드를 다운로드하기 위해 필요합니다. ([설치 링크](https://git-scm.com/))
*   **Docker & Docker Compose**: 컨테이너 기반으로 쉽게 실행하기 위해 필요합니다. ([Docker Desktop 설치](https://www.docker.com/products/docker-desktop/))
*   **Node.js** (선택 사항): 도커 없이 직접 코드를 수정하거나 실행할 때 필요합니다. (v18 이상 권장)

---

## 2. 환경 변수 설정 (.env)

프로젝트 루트 폴더에 `.env` 파일을 생성하고 아래 내용을 채워넣어야 합니다.
(`.env.example` 파일이 있다면 복사해서 `.env`로 이름을 바꾸세요.)

### 🗄️ 데이터베이스 (DB) 설정

이 프로젝트는 **PostgreSQL** 데이터베이스를 사용합니다.

**방법 A: 도커 내부 DB 사용 (가장 쉬움)**
도커 설정에 이미 DB가 포함되어 있으므로, 별도 설치 없이 아래 설정을 그대로 사용하면 됩니다.
```env
DATABASE_URL="postgresql://root:root@db:5432/oneweek?schema=public"
```

**방법 B: 외부 DB 사용 (Supabase 등)**
외부 클라우드 DB를 사용하려면 해당 서비스에서 제공하는 `Connection String`을 입력하세요.
```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

### 🔑 소셜 로그인 (GitHub, Google) 설정

로그인 기능을 사용하려면 각 서비스에서 **OAuth 앱**을 생성하고 ID와 Secret을 발급받아야 합니다.

#### 1. GitHub 로그인 설정
1.  [GitHub Developer Settings](https://github.com/settings/developers) 접속 -> **New OAuth App** 클릭.
2.  **Application Name**: 프로젝트 이름 (예: One Week Web)
3.  **Homepage URL**: `http://localhost:8080` (도커 실행 시) 또는 `http://localhost:3000` (npm 실행 시)
4.  **Authorization callback URL**:
    *   도커 실행 시: `http://localhost:8080/api/auth/callback/github`
    *   npm 실행 시: `http://localhost:3000/api/auth/callback/github`
5.  생성 후 **Client ID**와 **Client Secret**을 복사하여 `.env`에 입력합니다.

```env
GITHUB_ID=여기에_Client_ID_입력
GITHUB_SECRET=여기에_Client_Secret_입력
```

#### 2. Google 로그인 설정
1.  [Google Cloud Console](https://console.cloud.google.com/) 접속 -> 새 프로젝트 생성.
2.  **API 및 서비스** -> **사용자 인증 정보** -> **사용자 인증 정보 만들기** -> **OAuth 클라이언트 ID**.
3.  **애플리케이션 유형**: 웹 애플리케이션.
4.  **승인된 자바스크립트 원본**: `http://localhost:8080` (또는 3000)
5.  **승인된 리디렉션 URI**:
    *   도커 실행 시: `http://localhost:8080/api/auth/callback/google`
    *   npm 실행 시: `http://localhost:3000/api/auth/callback/google`
6.  생성 후 **클라이언트 ID**와 **클라이언트 보안 비밀**을 복사하여 `.env`에 입력합니다.

```env
GOOGLE_CLIENT_ID=여기에_Client_ID_입력
GOOGLE_CLIENT_SECRET=여기에_Client_Secret_입력
```

### ⚙️ 기타 설정

```env
# NextAuth 설정 (보안을 위한 랜덤 문자열)
# 터미널에서 `openssl rand -base64 32` 명령어로 생성하거나 아무 긴 문자열 입력
NEXTAUTH_SECRET="random_string_here"

# 사이트 주소 (도커 실행 시 8080, 로컬 개발 시 3000)
NEXTAUTH_URL="http://localhost:8080"

# 백엔드 주소 (도커 내부 통신용, 변경 불필요)
BACKEND_URL="http://backend:3001"
```

---

## 3. 도커(Docker)로 실행하기

도커를 사용하면 프론트엔드, 백엔드, 데이터베이스를 한 번에 실행할 수 있습니다.

### 🐳 도커 설정 설명 (docker-compose.yml)

*   **web (Frontend)**: Next.js 기반 웹사이트입니다.
*   **backend (Backend)**: Nest.js 기반 API 서버입니다.
*   **db (Database)**: PostgreSQL 데이터베이스입니다.
*   **nginx (Web Server)**: 사용자의 접속을 받아 프론트엔드로 연결해주는 문지기 역할을 합니다.

### ▶️ 실행 명령어

터미널(PowerShell, CMD, Git Bash 등)을 열고 프로젝트 폴더에서 아래 명령어를 입력하세요.

```bash
# 컨테이너 빌드 및 실행 (백그라운드 모드)
docker-compose up -d --build
```

실행이 완료되면 브라우저에서 **[http://localhost:8080](http://localhost:8080)** 으로 접속할 수 있습니다.

### 🛑 종료 명령어

```bash
docker-compose down
```

### 🔌 포트 변경 방법

기본적으로 `8080` 포트로 접속하도록 설정되어 있습니다. 만약 `80` 포트나 다른 포트를 쓰고 싶다면 `docker-compose.yml` 파일을 수정하세요.

```yaml
  nginx:
    ports:
      - "8080:80"   # 왼쪽 숫자를 원하는 포트로 변경 (예: "80:80")
      - "8443:443"  # HTTPS 포트
```
수정 후에는 반드시 `docker-compose up -d`를 다시 실행해야 적용됩니다.

### 🔐 DB 계정(ID/PW) 변경 방법

기본 설정은 `root` / `root`로 되어 있습니다. 보안을 위해 변경하고 싶다면 다음 두 파일을 수정해야 합니다.

1.  **docker-compose.yml** 파일에서 `db` 서비스의 환경 변수를 수정합니다.
    ```yaml
      db:
        environment:
          POSTGRES_USER: 새로운아이디  # 예: myuser
          POSTGRES_PASSWORD: 새로운비밀번호 # 예: mypassword
    ```

2.  **.env** 파일에서 `DATABASE_URL`을 이에 맞춰 수정합니다.
    ```env
    DATABASE_URL="postgresql://새로운아이디:새로운비밀번호@db:5432/oneweek?schema=public"
    ```

3.  **주의사항**: 이미 DB가 생성된 상태에서 변경하면 접속이 안 될 수 있습니다. 이 경우 DB 데이터를 초기화해야 합니다.
    ```bash
    docker-compose down -v  # 볼륨(데이터)까지 삭제
    docker-compose up -d    # 다시 실행
    ```

---

## 4. 문제 해결 (Troubleshooting)

**Q. "fetch failed" 에러가 나요.**
*   백엔드 컨테이너가 아직 켜지는 중일 수 있습니다. 1~2분 정도 기다렸다가 새로고침 해보세요.
*   `.env` 파일에 `BACKEND_URL` 설정이 올바른지 확인하세요.

**Q. 로그인이 안 돼요.**
*   GitHub/Google 개발자 콘솔에서 **Callback URL**이 정확한지 확인하세요. (`http://localhost:8080/...` 인지 `3000` 인지 확인)
*   `.env` 파일의 `NEXTAUTH_URL`이 현재 접속 주소와 일치하는지 확인하세요.

**Q. DB 에러가 나요.**
*   도커를 처음 실행했다면 DB 초기화에 시간이 걸릴 수 있습니다.
*   `docker-compose logs backend` 명령어로 에러 로그를 확인해 보세요.

---
**Happy Coding!** 🚀
