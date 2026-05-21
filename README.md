# FORHOS

> 병원 방문 전 대기 현황을 확인하고, 접수 정보를 미리 준비해 병원 이용 시간을 줄이는 프론트엔드 서비스

## 프로젝트 소개

FORHOS는 병원에 직접 방문하기 전에 현재 대기 현황과 예상 대기 시간을 확인하고, 필요한 사용자 정보를 미리 등록해 접수 흐름을 줄이는 서비스입니다.

이른 시간에 병원에 방문해도 오래 기다려야 했던 경험에서 시작했고, 특히 지방이나 소규모 병원에서 대기 정보를 미리 확인하기 어려운 문제를 개선하는 데 초점을 맞췄습니다.

## 현재 구현 상태

| 상태 | 기능 |
| --- | --- |
| 구현 | 회원가입, 로그인, 로그아웃 |
| 구현 | 사용자 이름 조회 및 헤더 표시 |
| 구현 | 보호 라우트와 인증 토큰 정리 |
| 구현 | 병원 목록 조회 및 검색/상태 필터 |
| 구현 | 병원 대기 현황 조회 |
| 구현 | 진료 접수 신청, 내 접수 조회, 접수 취소 |
| 구현 | 사용자 개인정보 및 건강 정보 입력 |
| 구현 | API 실패/빈 상태 안내와 재시도 UI |
| 계획 | 증상 키워드 기반 진료과 분류 |
| 계획 | No-show 방지를 위한 정책 흐름 |

## 로컬 실행

```bash
npm install
npm run dev
```

프론트엔드는 Vite 개발 서버에서 실행됩니다. API 요청은 `/api` 경로를 사용하며, 개발 환경에서는 Vite proxy를 통해 `http://localhost:8080` 백엔드 서버로 전달됩니다.

백엔드 서버가 실행 중이 아니면 병원 목록, 접수, 내 정보 화면에서 실패 상태가 표시됩니다.

## 검증 명령

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
```

## 기술 스택

| Category | Tech |
| --- | --- |
| Language | TypeScript, JavaScript |
| Frontend | React |
| Build Tool | Vite |
| Routing | React Router DOM |
| Server State | TanStack React Query |
| Form | React Hook Form |
| Validation | Zod |
| Styling | Tailwind CSS |
| UI | shadcn/ui 스타일의 공통 컴포넌트, Radix UI |
| Test | Vitest, Testing Library |

## API 연결 요약

| Method | Endpoint | 용도 |
| --- | --- | --- |
| POST | `/members/register` | 회원가입 |
| POST | `/members/login` | 로그인 |
| POST | `/members/logout` | 로그아웃 |
| GET | `/members/myinfo` | 사용자 이름 및 내 정보 조회 |
| PUT | `/members/myinfo` | 내 정보 저장 |
| GET | `/hospital` | 병원 목록 조회 |
| POST | `/reception` | 진료 접수 |
| GET | `/reception/me` | 내 접수 조회 |
| PATCH | `/reception/{id}/cancel` | 접수 취소 |
| GET | `/reception/hospital/{id}/today` | 병원별 당일 대기 조회 |
| PATCH | `/reception/hospital/{receptionId}/status` | 접수 상태 변경 |

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

| 폴더 | 역할 |
| --- | --- |
| `app` | 앱 전체 설정, 라우터, Provider 관리 |
| `pages` | 페이지 단위 화면 구성 |
| `widgets` | Header, Footer, 검색 영역 등 큰 UI 블록 |
| `features` | 로그인, 접수, 프로필 수정 등 기능 단위 UI |
| `entities` | 병원, 대기열 등 도메인 데이터와 타입 |
| `shared` | 공통 UI, 유틸 함수, route 설정 |

## 구현 포인트

- TanStack React Query로 서버 상태, 캐싱, 실패 상태를 관리합니다.
- 인증 토큰은 공통 API 클라이언트에서 관리하고, 401 응답 시 로그아웃 핸들러로 흐름을 정리합니다.
- 로그인 여부에 따라 보호 라우트가 비회원 접근을 로그인 화면으로 안내합니다.
- 헤더는 로그인 상태에서 실제 사용자 이름을 표시하고, 로그아웃 API 호출 후 로컬 토큰과 캐시를 함께 정리합니다.
- 병원 목록과 홈 통계는 실제 API 응답을 기준으로 표시하며, 실패 시 재시도 버튼을 제공합니다.
- 초기에는 mock 데이터를 활용해 화면을 구성했지만, 현재 주요 목록/접수 흐름은 API 연동 기준으로 정리되어 있습니다.

## 현재 한계와 다음 작업

- 백엔드 서버가 실행되지 않으면 API 기반 화면은 실패 상태로 진입합니다.
- 증상 기반 진료과 추천과 No-show 정책은 기획 범위로 남아 있습니다.
- 병원 운영자 전용 상태 변경 흐름은 API 연결은 있으나 권한/화면 정책을 더 명확히 다듬어야 합니다.

## 담당 역할

- 프론트엔드 화면 구현
- 페이지 라우팅 구조 설계
- 공통 UI 컴포넌트 구성
- 병원 목록 및 대기 상태 화면 구현
- 진료 접수 form 구현
- 사용자 정보 입력 form 구현
- TypeScript 기반 타입 정의
- Tailwind CSS 기반 UI 스타일링

## 결과 사진

![회원가입 화면](docs/images/forhos1-signup.png)

![로그인 화면](docs/images/forhos2-login.png)

![홈 화면](docs/images/forhos3-home.png)

![병원 찾기 화면](docs/images/forhos4-hospital-list.png)

![대기 접수 화면](docs/images/forhos5-reception-form.png)

![접수 완료 화면](docs/images/forhos6-reception-done.png)

![대기 현황 화면](docs/images/forhos7-queue-status.png)
