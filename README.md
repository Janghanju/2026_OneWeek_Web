# One Week - Jang Hanju Portfolio & Tech News

이 프로젝트는 Next.js 14+ (App Router)를 기반으로 구축된 프리미엄 포트폴리오 및 IT 뉴스 플랫폼입니다.

## 🚀 시작하기 (Getting Started)

개발 서버를 실행하여 로컬에서 웹사이트를 확인할 수 있습니다.

```bash
npm run dev
```

명령어를 실행한 후 브라우저에서 [http://localhost:3000](http://localhost:3000) 주소를 열어주세요.

## 🏗️ 아키텍처 및 개발 방법론

### 1. 핵심 기술 (Core Stack)
-   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router) - 서버 사이드 렌더링(SSR)과 정적 생성(SSG)을 모두 지원하는 하이브리드 프레임워크.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) - 정적 타입을 통한 안정성 확보.
-   **Styling**: **Vanilla CSS (CSS Modules)** - 무거운 라이브러리(Tailwind 등) 없이 CSS 변수와 모듈을 사용하여 "빅테크" 수준의 최적화된 스타일링 구현.
-   **Icons**: `lucide-react` - 가볍고 일관된 아이콘 시스템.

### 2. 디자인 철학 (Design Philosophy)
-   **Premium Dark Theme**: 깊이감 있는 다크 블루/블랙 배경과 네온 액센트.
-   **Glassmorphism**: 배경 블러(Backdrop Blur)와 반투명 레이어를 활용한 현대적인 UI.
-   **Micro-interactions**: 부드러운 호버 효과와 트랜지션.

### 3. 디렉토리 구조 (Directory Structure)
```
src/
├── app/              # App Router 페이지 및 레이아웃
│   ├── layout.tsx    # 전역 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx      # 메인 랜딩 페이지
│   └── globals.css   # 전역 스타일 및 CSS 변수
├── components/       # 재사용 가능한 UI 컴포넌트 (예정)
└── lib/              # 유틸리티 함수 및 API 로직 (예정)
```

## 🔄 개발 방향 (Development Roadmap)

1.  **Landing Page**: 프리미엄 디자인의 첫인상 (완료).
2.  **Portfolio**: GitHub API를 연동하여 프로젝트 자동 동기화.
3.  **News Aggregator**: IT 뉴스 크롤링 및 요약 서비스.
4.  **Deployment**: Vercel 배포 또는 Apache 서버 정적 호스팅.
