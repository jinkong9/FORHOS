# 로컬 개발 환경 실행

## 준비물

- Docker Desktop을 설치하고 실행합니다.
- 프론트엔드를 실행할 Node.js/npm이 필요합니다.
- 프론트엔드와 백엔드 저장소를 같은 상위 폴더에 나란히 clone합니다.

```powershell
mkdir forhos-local
cd forhos-local
git clone https://github.com/jinkong9/FORHOS.git
git clone https://github.com/jinkong9/FORHOS_Backend.git
```

폴더 구조는 아래와 같아야 합니다.

```text
forhos-local/
├─ FORHOS/          # 프론트엔드, compose.yaml 포함
└─ FORHOS_Backend/  # 백엔드, Dockerfile 포함
```

## 실행

백엔드와 MySQL, Redis, RabbitMQ를 Docker로 실행합니다.

```powershell
cd FORHOS
docker compose up -d --build
```

다른 터미널에서 프론트엔드를 실행합니다.

```powershell
cd FORHOS
npm ci
npm run dev
```

브라우저에서 <http://localhost:5173>을 엽니다. 백엔드 API 문서는 <http://localhost:8080/swagger-ui/index.html>에서 볼 수 있고, RabbitMQ 관리 화면은 <http://localhost:15672>입니다. RabbitMQ 관리 화면 로그인은 `forhos` / `forhos`입니다.

## 종료

프론트 개발 서버는 실행한 터미널에서 `Ctrl+C`로 종료합니다. 백엔드와 기반 서비스는 `FORHOS` 폴더에서 아래 명령으로 종료합니다.

```powershell
docker compose down
```

`docker compose down`은 DB 데이터를 보존합니다. 개발 데이터를 완전히 지우고 처음부터 시작할 때만 `docker compose down -v`를 사용하세요. 이 명령은 MySQL, Redis, RabbitMQ의 저장 데이터도 삭제합니다.
