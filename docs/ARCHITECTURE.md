# 프론트 아키텍처

별도 Spring Boot API 서버와 통신하는 클라이언트 렌더링 SPA입니다.

```text
src/
  app/          앱 경로, 공통 Provider 설정
  api/          공통 HTTP 클라이언트와 오류
  pages/        라우트 단위 화면
  styles/       전역 스타일
  types/        백엔드 공통 응답 계약
```

도메인이 구현되면 `features/<domain>/`에 API, 훅, 컴포넌트, 타입을 모읍니다. 공통 컴포넌트는 `components/`에 추가합니다.

## API 계약

백엔드 `develop`의 `a30f907` 커밋을 기준으로 확인했습니다.

- `ApiResponse<T>`: `success`, `code`(숫자 HTTP 상태 코드), `message`, `data`
- `PageResponse<T>`: `content`, `page`, `size`, `totalElements`, `totalPages`, `hasNext`
- `page`는 0부터 시작합니다.
- API 경로 컨벤션은 `/api/v1/...`입니다. 도메인 API는 아직 없습니다.
- 성공 시 HTTP 클라이언트는 `data`를 반환합니다. HTTP 실패 또는 `success: false`는 `ApiError`로 전달합니다.
- 공통 응답 구조를 검증하며 개별 `data` 구조는 도메인 계약으로 정의합니다.
- HTML 등 비정상 응답은 `ApiError`로 처리합니다. 네트워크 오류와 AbortError는 그대로 전달합니다.
- 현재 계약은 JSON 응답입니다. 204 응답·파일 다운로드가 추가되면 별도 처리를 명시적으로 추가합니다.
- 인증 토큰 저장, 쿠키 전송, 토큰 갱신은 백엔드 명세 확정 후 구현합니다.

TanStack Query의 재시도는 기본 비활성화했습니다. 조회 재시도·갱신 간격은 각 기능이 정합니다. 주문·결제의 자동 반복 요청을 기본값으로 두지 않습니다.

## 환경과 배포

Vite 포트는 백엔드 허용 출처인 5173에 고정합니다. 프록시 없이 환경변수에 지정된 백엔드로 요청합니다. 배포 시 CORS와 SPA rewrite 설정이 필요합니다.
