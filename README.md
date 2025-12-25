# One Week - Jang Hanju Portfolio & Tech News
# One Week - 장한주 포트폴리오 & 기술 뉴스

> **🚀 Deployment Guide / 배포 가이드**
>
> 상세한 배포 방법과 보안 설정은 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) 파일을 참고하세요.
>
> For detailed deployment instructions and security setup, please refer to [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md).


> **English**: A premium portfolio and IT news platform built with Next.js 14+ (App Router).
> 
> **한국어**: Next.js 14+ (App Router)를 기반으로 구축된 프리미엄 포트폴리오 및 IT 뉴스 플랫폼입니다.

## 🚀 Getting Started / 시작하기

**English**: Run the development server to view the website locally.

**한국어**: 개발 서버를 실행하여 로컬에서 웹사이트를 확인할 수 있습니다.

```bash
npm install
npm run dev
```

**English**: After running the command, open [http://localhost:3000](http://localhost:3000) in your browser.

**한국어**: 명령어를 실행한 후 브라우저에서 [http://localhost:3000](http://localhost:3000) 주소를 열어주세요.

## 🏗️ Architecture & Development Methodology / 아키텍처 및 개발 방법론

### 1. Core Stack / 핵심 기술

**English**:
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router) - Hybrid framework supporting both SSR and SSG
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type safety and better developer experience
- **Styling**: **Vanilla CSS (CSS Modules)** - Optimized styling without heavy libraries, using CSS variables and modules
- **Icons**: `lucide-react` - Lightweight and consistent icon system
- **Authentication**: NextAuth.js - Secure authentication with GitHub and Google OAuth
- **Internationalization**: next-intl - Multi-language support (Korean/English)

**한국어**:
- **프레임워크**: [Next.js 14+](https://nextjs.org/) (App Router) - 서버 사이드 렌더링(SSR)과 정적 생성(SSG)을 모두 지원하는 하이브리드 프레임워크
- **언어**: [TypeScript](https://www.typescriptlang.org/) - 정적 타입을 통한 안정성 확보
- **스타일링**: **Vanilla CSS (CSS Modules)** - 무거운 라이브러리 없이 CSS 변수와 모듈을 사용하여 최적화된 스타일링 구현
- **아이콘**: `lucide-react` - 가볍고 일관된 아이콘 시스템
- **인증**: NextAuth.js - GitHub 및 Google OAuth를 사용한 안전한 인증
- **다국어**: next-intl - 다국어 지원 (한국어/영어)

### 2. Design Philosophy / 디자인 철학

**English**:
- **Premium Dark Theme**: Deep dark blue/black backgrounds with neon accents
- **Glassmorphism**: Modern UI using backdrop blur and translucent layers
- **Micro-interactions**: Smooth hover effects and transitions
- **Dynamic Animations**: Animated backgrounds and interactive elements
- **Responsive Design**: Mobile-first approach with adaptive layouts

**한국어**:
- **프리미엄 다크 테마**: 깊이감 있는 다크 블루/블랙 배경과 네온 액센트
- **글래스모피즘**: 배경 블러(Backdrop Blur)와 반투명 레이어를 활용한 현대적인 UI
- **마이크로 인터랙션**: 부드러운 호버 효과와 트랜지션
- **동적 애니메이션**: 애니메이션 배경과 인터랙티브 요소
- **반응형 디자인**: 모바일 우선 접근 방식과 적응형 레이아웃

### 3. Directory Structure / 디렉토리 구조

```
src/
├── app/                    # App Router pages and layouts / 페이지 및 레이아웃
│   ├── [locale]/          # Internationalized routes / 다국어 라우트
│   │   ├── page.tsx       # Main landing page / 메인 랜딩 페이지
│   │   ├── login/         # Login page / 로그인 페이지
│   │   ├── portfolio/     # Portfolio showcase / 포트폴리오 쇼케이스
│   │   ├── services/      # Services page / 서비스 페이지
│   │   └── news/          # News aggregator / 뉴스 애그리게이터
│   ├── api/               # API routes / API 라우트
│   │   └── news/          # News fetching API / 뉴스 가져오기 API
│   └── globals.css        # Global styles and CSS variables / 전역 스타일 및 CSS 변수
├── components/            # Reusable UI components / 재사용 가능한 UI 컴포넌트
│   └── navbar.tsx         # Navigation bar / 네비게이션 바
├── i18n/                  # Internationalization / 다국어
│   └── routing.ts         # Routing configuration / 라우팅 설정
└── messages/              # Translation files / 번역 파일
    ├── en.json            # English translations / 영어 번역
    └── ko.json            # Korean translations / 한국어 번역
```

## ✨ Features / 주요 기능

**English**:
- 🌐 **Multilingual Support**: Korean and English interface
- 🔐 **Authentication**: GitHub and Google OAuth integration
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🎨 **Premium UI**: Modern design with animations and glassmorphism
- 📰 **News Aggregator**: IT news fetching and display
- 💼 **Portfolio Showcase**: Project gallery with detailed information
- ⚡ **Performance**: Optimized with Next.js App Router and SSR

**한국어**:
- 🌐 **다국어 지원**: 한국어 및 영어 인터페이스
- 🔐 **인증**: GitHub 및 Google OAuth 통합
- 📱 **반응형 디자인**: 모든 기기에서 완벽하게 작동
- 🎨 **프리미엄 UI**: 애니메이션과 글래스모피즘을 활용한 현대적 디자인
- 📰 **뉴스 애그리게이터**: IT 뉴스 가져오기 및 표시
- 💼 **포트폴리오 쇼케이스**: 상세 정보가 포함된 프로젝트 갤러리
- ⚡ **성능**: Next.js App Router 및 SSR로 최적화

## 🔄 Development Roadmap / 개발 로드맵

**English**:
1. ✅ **Landing Page**: Premium design with dynamic backgrounds
2. ✅ **Authentication**: NextAuth.js integration with OAuth providers
3. ✅ **Internationalization**: Korean/English language support
4. 🚧 **Portfolio**: GitHub API integration for automatic project sync
5. 🚧 **News Aggregator**: IT news crawling and summarization service
6. 📝 **Blog**: Technical blog with markdown support
7. 🚀 **Deployment**: Vercel deployment or Apache static hosting

**한국어**:
1. ✅ **랜딩 페이지**: 동적 배경의 프리미엄 디자인
2. ✅ **인증**: OAuth 제공자와 NextAuth.js 통합
3. ✅ **다국어화**: 한국어/영어 언어 지원
4. 🚧 **포트폴리오**: 프로젝트 자동 동기화를 위한 GitHub API 연동
5. 🚧 **뉴스 애그리게이터**: IT 뉴스 크롤링 및 요약 서비스
6. 📝 **블로그**: 마크다운 지원 기술 블로그
7. 🚀 **배포**: Vercel 배포 또는 Apache 정적 호스팅

## 🛠️ Environment Variables / 환경 변수

**English**: Create a `.env.local` file in the root directory:

**한국어**: 루트 디렉토리에 `.env.local` 파일을 생성하세요:

```bash
# NextAuth Configuration / NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📦 Build & Deploy / 빌드 및 배포

**English**:
```bash
# Build for production / 프로덕션 빌드
npm run build

# Start production server / 프로덕션 서버 시작
npm run start
```

**한국어**:
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm run start
```

## 📄 License / 라이선스

**English**: This project is private and proprietary.

**한국어**: 이 프로젝트는 비공개 및 독점 소유입니다.

---

**English**: Built with ❤️ by Jang Hanju

**한국어**: 장한주가 ❤️로 만들었습니다
