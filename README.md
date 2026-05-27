# FORHOS Frontend

> 병원 방문 전 대기 현황을 확인하고, 로그인한 사용자가 진료 접수부터 내 대기 상태 확인까지 이어서 처리할 수 있는 병원 대기 관리 서비스 프론트엔드입니다.

- Frontend Repository: <https://github.com/jinkong9/FORHOS>
- Backend Repository: <https://github.com/jinkong9/FORHOS_Backend>
- 주요 담당 범위: 화면 흐름, 라우팅, 인증 연동, API 통신 계층, 접수/대기열 UI, 테스트 자동화

---

## 프로젝트 소개

FORHOS는 사용자가 병원에 직접 도착하기 전에 병원 목록과 대기 정보를 확인하고, 로그인 후 진료 접수를 생성한 뒤, 내 순번과 앞 대기 인원을 확인할 수 있도록 만든 서비스입니다.

프론트엔드에서는 단순히 화면을 나열하는 것보다 **사용자 행동이 API 요청, 인증 상태, 서버 응답, 다음 화면 이동까지 끊기지 않고 이어지는 흐름**을 만드는 데 집중했습니다.

---

## 핵심 사용자 흐름

| 단계 | 사용자 행동 | 화면 | API |
| --- | --- | --- | --- |
| 1 | 회원가입 / 로그인 | `/signup`, `/login` | `POST /api/members/register`, `POST /api/members/login` |
| 2 | 병원 목록 확인 | `/hospital/list` | `GET /api/hospital` |
| 3 | 병원 상세 확인 | `/hospital/:hospitalId` | `GET /api/hospital/{hospitalId}` |
| 4 | 진료 접수 입력 | `/hospital/input` | `POST /api/reception` |
| 5 | 접수 완료 확인 | `/hospital/done` | 접수 생성 응답 사용 |
| 6 | 내 대기 상태 확인 | `/hospital/status` | `GET /api/reception/me/latest`, `GET /api/reception/hospital/{receptionId}/status` |
| 7 | 내 접수 목록 / 취소 | `/reception/me` | `GET /api/reception/me`, `PATCH /api/reception/{receptionId}/cancel` |
| 8 | 병원 관리자 접수 관리 | `/admin/receptions` | `GET /api/reception/hospital/{hospitalId}/today`, `PATCH /api/reception/{receptionId}/call`, `PATCH /api/reception/{receptionId}/complete` |

---

## 현재 구현 상태

| 상태 | 기능 |
| --- | --- |
| 구현 | 회원가입, 로그인, 로그아웃 |
| 구현 | access token / refresh token 쿠키 저장 |
| 구현 | Authorization 헤더 자동 주입 |
| 구현 | 401 + `TOKEN_EXPIRED` 응답 시 refresh token 재발급 시도 |
| 구현 | 보호 라우트와 역할 기반 관리자 라우트 |
| 구현 | 병원 목록 / 병원 상세 조회 |
| 구현 | 진료 접수 생성 |
| 구현 | 접수 완료 화면 |
| 구현 | 내 최신 접수 상태 조회 |
| 구현 | 내 접수 목록 조회 및 접수 취소 |
| 구현 | 병원 관리자용 당일 접수 조회, 호출, 완료 |
| 구현 | API 실패 / 빈 상태 / 로딩 / 재시도 UI |
| 구현 | Vitest 단위 테스트와 Playwright E2E 테스트 |
| 계획 | 증상 키워드 기반 진료과 추천 |
| 계획 | 병원별 평균 진료 시간 기반 예상 대기 시간 계산 |
| 계획 | No-show 방지 정책 |

---

## 기술 스택

| Category | Tech |
| --- | --- |
| Language | TypeScript |
| Framework | React 19 |
| Build Tool | Vite |
| Routing | React Router DOM |
| Server State | TanStack Query |
| HTTP Client | Axios |
| Form | React Hook Form |
| Validation | Zod |
| Styling | Tailwind CSS |
| UI | Radix UI, shadcn/ui 스타일 공통 컴포넌트 |
| Test | Vitest, Testing Library, Playwright |

---

## Frontend Architecture

```text
src
├─ app
│  ├─ providers
│  └─ router
├─ pages
├─ widgets
├─ features
├─ entities
└─ shared
```

| 폴더 | 역할 | 예시 |
| --- | --- | --- |
| `app` | 앱 전체 설정, 라우터, Provider 관리 | `router`, `QueryProvider` |
| `pages` | 라우트에 연결되는 페이지 단위 화면 | 홈, 로그인, 병원 목록, 접수 입력, 접수 완료 |
| `widgets` | 여러 기능을 조합한 큰 UI 블록 | 앱 헤더, 병원 검색 |
| `features` | 사용자 행동 중심 기능 | 인증 API, 접수 API, 접수 form, 프로필 form |
| `entities` | 도메인 타입과 도메인 UI | 병원 타입, 병원 카드 |
| `shared` | 공통 UI, API client, 인증, route 상수 | `Button`, `Card`, `ProtectedRoute`, `apiClient` |

이 구조를 사용한 이유는 페이지가 늘어나도 화면, 기능, 도메인, 공통 코드가 섞이지 않게 하기 위해서입니다. 특히 접수 기능은 여러 화면에서 사용되므로 `features/queue` 아래에 API 타입과 요청 함수를 모았습니다.

---

## 라우팅 구조

| Route | 접근 | 설명 |
| --- | --- | --- |
| `/` | 공개 | 홈 |
| `/login` | 공개 | 로그인 |
| `/signup` | 공개 | 회원가입 |
| `/hospital/list` | 공개 | 병원 목록 |
| `/hospital/:hospitalId` | 공개 | 병원 상세 |
| `/info` | 로그인 필요 | 내 정보 |
| `/hospital/register` | 로그인 필요 | 병원 등록 화면 |
| `/hospital/input` | 로그인 필요 | 진료 접수 입력 |
| `/hospital/done` | 로그인 필요 | 접수 완료 |
| `/hospital/status` | 로그인 필요 | 내 최신 대기 상태 |
| `/reception/me` | 로그인 필요 | 내 접수 목록 |
| `/admin/receptions` | `HOSPITAL_ADMIN`, `ADMIN` | 병원 관리자 접수 관리 |

로그인이 필요한 화면은 `ProtectedRoute`로 보호합니다. 관리자 화면은 JWT payload의 role을 읽어 `HOSPITAL_ADMIN`, `ADMIN` 권한이 있을 때만 접근할 수 있도록 구성했습니다.

---

## API 통신 구조

프론트엔드는 Axios 기반 `apiClient`를 사용하며, 모든 요청은 `/api` prefix로 시작합니다. 개발 환경에서는 Vite proxy가 `/api` 요청을 백엔드 서버로 전달합니다.

```ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
    },
  },
}
```

### 인증 처리

- 로그인 성공 시 `grant_type`, `access_token`, `refresh_token`을 쿠키에 저장합니다.
- 요청 인터셉터에서 access token이 있으면 `Authorization` 헤더를 붙입니다.
- `401` 응답과 `TOKEN_EXPIRED` 에러 코드가 오면 refresh token으로 `/api/auth/refresh`를 호출합니다.
- refresh 중 여러 요청이 동시에 실패하면 queue에 넣었다가 새 access token으로 재시도합니다.
- refresh 실패 시 토큰을 제거하고 로그아웃 흐름으로 보냅니다.

---

## API 연결 요약

프론트엔드 `apiClient`의 baseURL이 `/api`라서 아래 표는 화면 코드에서 사용하는 상대 경로 기준입니다.

| Method | Endpoint | 용도 |
| --- | --- | --- |
| `POST` | `/members/register` | 회원가입 |
| `POST` | `/members/login` | 로그인 |
| `POST` | `/members/logout` | 로그아웃 |
| `GET` | `/members/myinfo` | 내 정보 조회 |
| `PATCH` | `/members/myinfo` | 내 정보 수정 |
| `GET` | `/hospital` | 병원 목록 조회 |
| `GET` | `/hospital/{hospitalId}` | 병원 상세 조회 |
| `POST` | `/reception` | 진료 접수 생성 |
| `GET` | `/reception/hospital/{hospitalId}/today` | 병원별 당일 접수 목록 |
| `GET` | `/reception/hospital/{receptionId}/status` | 특정 접수 상태 조회 |
| `GET` | `/reception/me/latest` | 내 최신 진행 접수 상태 |
| `GET` | `/reception/me` | 내 접수 목록 |
| `PATCH` | `/reception/{receptionId}/cancel` | 내 접수 취소 |
| `PATCH` | `/reception/{receptionId}/call` | 관리자 접수 호출 |
| `PATCH` | `/reception/{receptionId}/complete` | 관리자 접수 완료 |

---

## 주요 구현 포인트

### 1. 접수 생성 후 화면 연결

접수 입력 화면에서 사용자가 입력한 값은 `createReception` 요청으로 백엔드에 전달됩니다. 응답으로 받은 `ReceptionResponse`는 접수 완료 화면에서 대기 번호와 접수 정보를 보여주는 데 사용합니다.

```text
사용자 입력
→ React Hook Form / Zod 검증
→ createReception 요청
→ ReceptionResponse 응답
→ 접수 완료 화면 표시
→ 접수 상태 API 조회
```

### 2. 서버 상태와 화면 상태 분리

병원 목록, 내 정보, 접수 생성, 접수 상태 조회처럼 서버에서 온 데이터는 TanStack Query로 관리합니다. 검색어, 선택 값, UI 표시 상태처럼 화면 안에서만 필요한 값은 컴포넌트 state로 관리했습니다.

### 3. 실패 상태 처리

백엔드 서버가 실행되지 않았거나 요청이 실패할 때 화면이 비어 보이지 않도록 로딩, 에러, 빈 상태, 재시도 버튼을 구성했습니다. 실제 서비스에서는 실패 상황이 자주 발생할 수 있으므로, 정상 데이터만 있는 화면보다 실패 흐름을 명시하는 것이 중요하다고 봤습니다.

### 4. 관리자 접수 관리

`/admin/receptions` 화면은 병원 관리자 권한이 있는 사용자만 접근할 수 있습니다. 화면에서는 병원별 당일 접수 목록을 불러오고, 접수 상태에 따라 `Call`, `Complete` 버튼을 활성화합니다.

---

## 테스트와 검증

| 종류 | 명령어 | 검증 내용 |
| --- | --- | --- |
| Unit / Component | `npm test` | 홈 화면, 헤더, 보호 라우트, 접수 완료 화면 등 |
| Lint | `npm run lint` | ESLint 정적 검사 |
| Build | `npm run build` | TypeScript build + Vite production build |
| E2E | `npm run e2e` | 실제 브라우저 기반 사용자 흐름 |

E2E에서 확인하는 대표 흐름:

- 홈 화면 렌더링
- 병원 목록 API 데이터 표시
- 보호 라우트의 로그인 리다이렉트
- 회원가입 성공 후 로그인 화면 이동
- 로그인 사용자의 진료 접수 생성, 접수 완료, 대기 상태 확인
- 내 접수 내역에서 접수 취소
- 병원 관리자 권한으로 대기 접수 호출

---

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

기본 Vite 개발 서버에서 실행됩니다. 백엔드 API는 `http://localhost:8080`에서 실행 중이어야 합니다.

### 3. 테스트 실행

```bash
npm test
npm run lint
npm run build
npm run e2e
```

---

## 실행 전 확인할 점

- 백엔드 서버가 `http://localhost:8080`에서 실행 중이어야 API 기반 화면이 정상 동작합니다.
- 백엔드 서버가 없으면 병원 목록, 접수, 내 정보 화면에서 실패 상태가 표시됩니다.
- E2E 테스트는 Playwright 브라우저 설치가 필요할 수 있습니다.

```bash
npx playwright install
```

---

## 결과 화면

![회원가입 화면](docs/images/forhos1-signup.png)

![로그인 화면](docs/images/forhos2-login.png)

![홈 화면](docs/images/forhos3-home.png)

![병원 찾기 화면](docs/images/forhos4-hospital-list.png)

![진료 접수 화면](docs/images/forhos5-reception-form.png)

![접수 완료 화면](docs/images/forhos6-reception-done.png)

![대기 현황 화면](docs/images/forhos7-queue-status.png)

---

## 프로젝트를 통해 배운 점

프론트엔드는 예쁜 화면만 만드는 영역이 아니라, 사용자 행동과 서버 데이터를 자연스럽게 이어주는 영역이라는 점을 배웠습니다.

특히 접수 생성 응답이 완료 화면과 상태 화면으로 이어지는 흐름을 만들면서 API 계약의 중요성을 체감했습니다. 인증 상태, 라우팅, 서버 상태, 실패 처리가 함께 맞아야 사용자가 끊기지 않는 흐름을 경험할 수 있다는 것을 배웠습니다.
