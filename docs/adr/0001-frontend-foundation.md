# 0001. 프론트 기본 구성

- 날짜: 2026-11-17
- 상태: 초기 구현 기준, 팀 검토 가능

## 배경

별도 Spring Boot 백엔드가 있고 지도·공동주문 중심의 모바일 웹을 개발합니다.

## 결정

React + TypeScript + Vite SPA, React Router, TanStack Query를 사용합니다. 스타일은 CSS Modules로 시작합니다. Node 24와 npm 및 lockfile로 환경을 통일합니다. ESLint 호환성을 위해 TypeScript는 5.9 계열을 사용합니다.

GitHub 협업 규칙과 PR 대상 브랜치는 백엔드에 맞춥니다. CI는 품질 검사와 빌드까지 담당하고 CD는 배포 서비스 확정 후 연결합니다.

## 영향

호스팅의 SPA fallback 설정이 필요합니다. SEO·서버 렌더링 요구가 생기면 앱 구조를 재검토합니다. 인증과 실시간 주문 동기화는 백엔드 명세에 따라 별도 결정합니다.
