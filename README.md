# FORHOS

병원 방문 전 대기 현황을 확인하고, 기본 방문 정보를 입력해 접수 흐름을 빠르게 진행할 수 있도록 만든 병원 대기/접수 서비스입니다.

## 주요 기능

- 병원 목록 조회 및 진료 과목/지역 기반 검색
- 병원별 예상 대기 시간, 대기 인원, 운영 상태 확인
- 초진/재진 방문 유형 선택
- 방문자 기본 정보 등록
- 대기 접수 폼 작성 및 접수 완료 화면 이동
- 현재 대기 순번, 앞 대기 인원, 예상 대기 시간 확인
- 로그인 화면 및 기본 폼 검증

## 기술 스택

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- TanStack React Query
- Tailwind CSS
- Radix UI
- lucide-react

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

실행 후 Vite가 안내하는 로컬 주소로 접속합니다. 기본값은 보통 다음과 같습니다.

```text
http://localhost:5173
```

### 3. 프로덕션 빌드

```bash
npm run build
```

### 4. 빌드 결과 미리보기

```bash
npm run preview
```

### 5. 린트 검사

```bash
npm run lint
```

## 페이지 경로

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 |
| `/login` | 로그인 |
| `/info` | 방문자 정보 등록 |
| `/hospital/register` | 방문 유형 선택 |
| `/hospital/list` | 병원 목록 및 검색 |
| `/hospital/input` | 대기 접수 입력 |
| `/hospital/done` | 접수 완료 |
| `/hospital/status` | 대기 현황 |

## 폴더 구조

```text
src
├─ app
│  ├─ providers      # 전역 Provider
│  └─ router         # 라우터 및 레이아웃
├─ entities          # 병원, 대기 등 도메인 모델/목 데이터
├─ features          # 로그인, 프로필, 접수 폼 등 기능 단위 UI
├─ pages             # 라우트 단위 페이지
├─ shared            # 공용 UI, 설정, 유틸
└─ widgets           # 여러 기능을 조합한 화면 블록
```

## 데이터

현재 병원 목록과 대기 현황은 프론트엔드 내부 목 데이터를 사용합니다.

- 병원 데이터: `src/entities/hospital/model/mockHospitals.ts`
- 대기 데이터: `src/entities/queue/model/mockQueue.ts`

실제 API와 연동할 경우 위 목 데이터 사용 부분을 API 요청 로직으로 교체하면 됩니다.

## 개발 메모

- 경로 별칭 `@`는 `src` 디렉터리를 가리킵니다.
- 폼 검증은 `react-hook-form`과 `zod`를 함께 사용합니다.
- 라우트 상수는 `src/shared/config/routes.ts`에서 관리합니다.
