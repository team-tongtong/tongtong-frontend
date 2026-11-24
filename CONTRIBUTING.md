# 협업 규칙

백엔드 저장소의 Git 규칙을 공유합니다.

## 브랜치

| 브랜치                        | 역할                  | 병합 대상         |
| ----------------------------- | --------------------- | ----------------- |
| `main`                        | 운영 안정 버전        | -                 |
| `develop`                     | 개발 통합·기본 브랜치 | `main`            |
| `feat/common`                 | 초기 공통 컴포넌트    | `main`            |
| `feat/#{이슈번호}/{기능명}`   | 기능 개발             | `develop`         |
| `release/{버전}`              | 배포 준비             | `main`, `develop` |
| `hotfix/#{이슈번호}/{버그명}` | 긴급 수정             | `main`, `develop` |

작업 시작 전에 원격 변경을 확인하고 동기화합니다. 일반 기능은 이슈별 브랜치에서 작업하고 `develop`으로 PR을 엽니다. 초기 공통 컴포넌트는 `feat/common`에서 여러 개를 함께 구현한 뒤, 하나의 GitHub PR로 `main`에 병합합니다.

## 커밋과 PR

커밋은 한 줄 `<type>(<scope>): <subject> (#이슈번호)` 형식입니다.

- type: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- scope: `user`, `common`, `config`, `deps` 등. 도메인 추가 시 확장합니다.
- subject: 50자 이내, 마침표 없이 명령문 형식
- 예: `feat(user): 로그인 화면 추가 (#12)`
- 이슈 제목: `[Feat] 로그인 화면`
- PR 제목: `[Feat] 로그인 화면 (#12)`
- PR 본문: 템플릿의 모든 항목 및 `closes #12`

UI 변경에는 모바일 화면 캡처와 동작 확인 방법을 첨부합니다. CI 통과 후 리뷰를 거쳐 병합합니다.

## 코드 규칙

- 컴포넌트는 PascalCase, 훅은 `use` 접두사, 컴포넌트 스타일은 CSS Modules를 사용합니다.
- 기능 API와 타입은 `src/features/<domain>/` 아래에 묶습니다.
- 범용 UI는 `src/components/`, 공통 계약은 `src/types/`에 둡니다. 실제 코드가 필요할 때 폴더를 추가합니다.
- 서버 데이터는 TanStack Query, 화면 내부 상태는 React state를 기본으로 사용합니다.
- API 요청은 `src/api/client.ts`를 통하며 임의로 인증 방식·주문 상태를 정하지 않습니다.
- 결제·주문 mutation은 자동 재시도하지 않습니다.
- 경로는 `@/` 별칭을 사용합니다.
- 사용자에게 보이는 문구는 한국어로 작성하고 접근 가능한 HTML 요소를 사용합니다.
- 로컬 확인: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
- 팀 전체에 영향을 주는 결정은 `docs/adr/`에 기록합니다.
