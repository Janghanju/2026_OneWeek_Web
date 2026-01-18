# 🚀 깃허브에서 다운로드 및 서비스 시작 가이드

이 가이드는 깃허브(GitHub)에 올라와 있는 **One Week Web** 프로젝트를 다운로드받아, 도커(Docker)를 이용해 즉시 서비스를 시작하는 방법을 설명합니다.

---

## 1. 사전 준비 (Prerequisites)

컴퓨터에 다음 두 가지가 설치되어 있어야 합니다.

*   **Git**: 코드 다운로드용 ([설치 링크](https://git-scm.com/))
*   **Docker Desktop**: 서비스 실행용 ([설치 링크](https://www.docker.com/products/docker-desktop/))

---

## 2. 단계별 실행 방법

터미널(PowerShell, CMD, Git Bash, Terminal 등)을 열고 아래 순서대로 명령어를 입력하세요.

### 1단계: 코드 다운로드 (Clone)

원하는 폴더로 이동한 후, 깃허브에서 코드를 받아옵니다.

```bash
git clone https://github.com/Janghanju/2026_ReZero_Web.git
cd 2026_ReZero_Web
```

### 2단계: 환경 변수 설정

프로젝트 실행에 필요한 비밀번호 등을 설정합니다.
(윈도우 PowerShell 기준 명령어입니다. 맥/리눅스는 `cp` 명령어를 사용하세요.)

```bash
# .env 파일 생성 (기본 설정 복사)
copy .env.example .env
copy .env.example .env.local
```

> **⚠️ 중요**: `.env` 파일을 메모장이나 VS Code로 열어서 필요한 정보를 입력해야 합니다.
> *   `DATABASE_URL`: 기본값 그대로 사용해도 됩니다 (도커 내부 DB 사용 시).
> *   `GITHUB_ID`, `GITHUB_SECRET`: 깃허브 로그인을 위해 필요합니다.
> *   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: 구글 로그인을 위해 필요합니다.
> *   (테스트 목적이라면 소셜 로그인 설정은 건너뛰어도 사이트는 켜집니다.)

### 3단계: 서비스 실행 (Docker)

도커를 이용해 서버와 데이터베이스를 한 번에 실행합니다. (처음 실행 시 시간이 조금 걸립니다.)

```bash
docker-compose up -d --build
```

### 4단계: 데이터베이스 테이블 생성 (최초 1회 필수)

서버가 켜진 후, 데이터베이스에 테이블을 만들어줘야 합니다. **이 단계를 건너뛰면 "Server Connection Error"가 발생합니다.**

```bash
# 백엔드 컨테이너 내부에서 테이블 생성 명령어 실행
docker-compose exec backend npx prisma db push
```

### 5단계: 접속 확인

브라우저를 열고 아래 주소로 접속하세요.

*   **메인 사이트**: [http://localhost:8080](http://localhost:8080)
*   **뉴스 페이지**: [http://localhost:8080/ko/news](http://localhost:8080/ko/news)

---

## 3. 서비스 종료 및 재시작

### 서비스 종료
```bash
docker-compose down
```

### 서비스 재시작
```bash
docker-compose up -d
```

### 최신 코드 업데이트 (깃허브 내용 반영)
```bash
# 1. 최신 코드 받기
git pull

# 2. 변경 사항 반영하여 재시작
docker-compose up -d --build

# 3. (DB 변경사항이 있다면) DB 업데이트
docker-compose exec backend npx prisma db push
```

---

## ❓ 자주 묻는 질문 (FAQ)

**Q. "Server Connection Error"가 계속 떠요.**
A. 4단계(데이터베이스 테이블 생성)를 수행했는지 확인해주세요. 그래도 안 된다면 `docker-compose logs backend` 명령어로 에러 로그를 확인해보세요.

**Q. 포트가 이미 사용 중이라고 해요.**
A. `docker-compose.yml` 파일을 열어 `nginx` 부분의 포트(`8080:80`)를 다른 숫자(예: `8081:80`)로 변경하고 다시 실행하세요.

**Q. 로그인이 안 돼요.**
A. `.env` 파일에 깃허브/구글 아이디와 비밀키를 올바르게 입력했는지, 그리고 개발자 콘솔에서 `http://localhost:8080` 주소를 허용했는지 확인하세요.
