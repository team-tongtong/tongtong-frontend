# TONGTONG-FRONTEND

대학가·원룸촌 1인 가구를 위한 거점 공동주문 서비스 **통통**의 프론트엔드입니다.

## 시작하기

Node.js 24.16.0 / npm 11을 사용합니다. 저장소 루트(이 README가 있는 폴더)에서 실행합니다.

```sh
nvm install
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

개발 주소: http://localhost:5173. 포트가 사용 중이면 임의로 변경하지 않고 종료합니다. 백엔드 CORS 허용 출처에 맞춘 설정입니다.

## 기술 스택

React · TypeScript(strict) · Vite · React Router · TanStack Query · CSS Modules · ESLint · Prettier · Vitest

의존성 버전은 `package.json`, 재현 가능한 설치 버전은 `package-lock.json`에서 관리합니다.

## 명령어

| 명령어                 | 역할                       |
| ---------------------- | -------------------------- |
| `npm run dev`          | 개발 서버                  |
| `npm run build`        | 타입 검사 및 프로덕션 빌드 |
| `npm run preview`      | 빌드 결과 확인             |
| `npm run lint`         | ESLint 검사                |
| `npm run typecheck`    | TypeScript 검사            |
| `npm run format`       | 포맷 적용                  |
| `npm run format:check` | 포맷 검사                  |
| `npm test`             | API 클라이언트 테스트      |
| `npm run test:watch`   | 테스트 감시 모드           |

## 환경변수와 백엔드 연결

`.env.example`을 `.env.local`로 복사합니다. `VITE_API_BASE_URL`에는 API 경로를 제외한 서버 주소만 지정합니다.

- 로컬: `http://localhost:8080`
- 백엔드 README에 기재된 서버: `https://tongtong-api.p-e.kr`
- Swagger: https://tongtong-api.p-e.kr/swagger-ui/index.html
- 백엔드 저장소: https://github.com/team-tongtong/tongtong-backend

`VITE_` 변수는 클라이언트 번들에 공개됩니다. 비밀키를 넣지 않습니다. 환경변수를 변경하면 개발 서버를 재시작하고, 배포 시에는 다시 빌드합니다.

백엔드의 공통 응답 `{ code, message, data }`와 페이지 응답(0부터 시작하는 `page`)을 적용했습니다. 실제 기능 API와 인증 계약은 아직 구현하지 않았습니다. 예시 경로는 호출 방법을 보여주며 현재 제공되는 엔드포인트를 뜻하지 않습니다.

```ts
import { apiRequest } from '@/api/client'

// 실제 API 명세가 확정된 뒤 도메인의 api 파일에서 호출합니다.
const data = await apiRequest<YourResponse>('/api/v1/your-resources', {
  signal,
})
```

## 구조와 협업

구조는 [ARCHITECTURE](docs/ARCHITECTURE.md), 브랜치·커밋·PR 규칙은 [CONTRIBUTING](CONTRIBUTING.md)을 따릅니다.

현재 기본 홈 화면과 404 경로만 제공합니다. 지도·모집방·주문·로그인·결제 화면은 기능별 이슈에서 추가합니다.

## GitHub 저장소와 CI

저장소: https://github.com/team-tongtong/tongtong-frontend

`develop`은 개발 통합 브랜치, `main`은 운영 안정 브랜치로 사용합니다. 작업 브랜치는 `develop`으로 PR을 보냅니다.

PR이 `main` 또는 `develop`을 대상으로 할 때 CI가 포맷 → 린트 → 타입 → 테스트 → 빌드를 검증합니다. Actions에서 수동 실행할 수도 있습니다.

브랜치 보호 규칙은 GitHub 설정에서 별도로 관리합니다. `main`과 `develop`에 PR 및 CI의 `build` 검사 통과를 요구하고, 리뷰 승인 인원은 팀 구성에 맞춥니다.

## 배포

정적 빌드 결과는 `dist/`입니다. 배포 서비스와 도메인을 정한 뒤 CD를 연결합니다.

- 빌드 명령: `npm ci && npm run build`
- 출력 폴더: `dist`
- 빌드 환경변수: `VITE_API_BASE_URL`
- BrowserRouter의 하위 경로 새로고침을 위해 호스팅에서 SPA 경로를 `index.html`로 rewrite합니다.
- 프론트 배포 주소를 백엔드 `CORS_ALLOWED_ORIGINS`에 추가합니다.
- 쿠키 인증을 채택한다면 백엔드 credentials 허용과 프론트 요청 설정을 함께 조정합니다. 현재 인증 방식은 가정하지 않습니다.
