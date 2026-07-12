import { useQuery } from "@tanstack/react-query";
import { BellRing, ClipboardList, ListOrdered } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  getLatestReceptionStatus,
  getReceptionStatus,
  type ReceptionQueueStatus,
  type ReceptionResponse,
} from "@/features/queue/api/receptionApi";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

type QueueStatusLocationState = {
  reception?: ReceptionResponse;
  asyncRequest?: {
    requestId: string;
    status: "ACCEPTED";
  };
};

const LATEST_RECEPTION_KEY = "latest_reception";

const statusLabel: Record<ReceptionQueueStatus, string> = {
  WAITING: "진료 대기",
  CALLED: "호출됨",
  COMPLETED: "진료 완료",
  CANCELED: "접수 취소",
  NO_SHOW: "노쇼",
};

const statusMessage: Record<ReceptionQueueStatus, string> = {
  WAITING: "순서가 가까워지면 병원에서 호출합니다.",
  CALLED: "호출되었습니다. 접수한 병원 안내에 따라 이동해 주세요.",
  COMPLETED: "진료가 완료된 접수입니다.",
  CANCELED: "취소된 접수입니다.",
  NO_SHOW: "호출 후 방문하지 않아 노쇼 처리된 접수입니다.",
};

function getStoredReception() {
  const storedReception = sessionStorage.getItem(LATEST_RECEPTION_KEY);

  if (!storedReception) {
    return null;
  }

  try {
    return JSON.parse(storedReception) as ReceptionResponse;
  } catch {
    return null;
  }
}

export function QueueStatusPage() {
  const location = useLocation();
  const locationState = location.state as QueueStatusLocationState | null;
  const latestReception = locationState?.reception ?? getStoredReception();
  const asyncRequest = locationState?.asyncRequest;
  const receptionId = latestReception?.id;

  const statusByIdQuery = useQuery({
    queryKey: ["receptionStatus", receptionId],
    queryFn: () => getReceptionStatus(receptionId!),
    enabled: Boolean(receptionId),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const latestStatusQuery = useQuery({
    queryKey: ["latestReceptionStatus", asyncRequest?.requestId],
    queryFn: getLatestReceptionStatus,
    enabled: !receptionId,
    retry: asyncRequest ? false : 1,
    refetchInterval: (query) => (asyncRequest && !query.state.data ? 2000 : false),
    refetchOnWindowFocus: false,
  });

  const receptionStatus = statusByIdQuery.data ?? latestStatusQuery.data;
  const isLoading = statusByIdQuery.isLoading || latestStatusQuery.isLoading;
  const isAsyncPending = Boolean(asyncRequest && !receptionStatus);
  const isError = receptionId ? statusByIdQuery.isError : latestStatusQuery.isError && !isAsyncPending;
  const progress = receptionStatus ? Math.max(10, Math.min(100, 100 - receptionStatus.waitingCount * 12)) : 10;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-700">Queue Status</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">내 접수 상태</h1>
        <p className="mt-3 text-slate-600">현재 접수 상태와 내 앞 대기 인원을 확인하세요.</p>
      </div>

      {isLoading ? <Card className="p-8 text-center text-slate-600">대기 현황을 불러오는 중입니다.</Card> : null}

      {!isLoading && isAsyncPending ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-black text-slate-950">비동기 접수 요청을 처리 중입니다</h2>
          <p className="mt-3 text-slate-600">
            RabbitMQ Queue에 접수 요청이 등록되었습니다. 실제 접수 생성이 완료되면 대기 현황이 자동으로 표시됩니다.
          </p>
          <p className="mt-4 text-sm font-semibold text-teal-700">requestId: {asyncRequest?.requestId}</p>
        </Card>
      ) : null}

      {isError ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-black text-slate-950">접수 상태를 불러오지 못했습니다.</h2>
          <p className="mt-3 text-slate-600">진행 중인 접수가 없거나 접수 정보를 확인할 수 없습니다.</p>
          <Link className="mt-6 inline-block" to={routes.hospitalList}>
            <Button>병원 찾기</Button>
          </Link>
        </Card>
      ) : null}

      {!isLoading && !isError && receptionStatus ? (
        <Card className="p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">{receptionStatus.hospitalName}</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">{statusLabel[receptionStatus.status]}</h2>
              <p className="mt-3 text-slate-600">{statusMessage[receptionStatus.status]}</p>
            </div>
            <span className="rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-teal-700">
              {statusLabel[receptionStatus.status]}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-5">
              <ClipboardList className="mb-3 size-6 text-teal-700" aria-hidden="true" />
              <p className="text-sm text-slate-500">접수 ID</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{receptionStatus.receptionId}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-5">
              <ListOrdered className="mb-3 size-6 text-teal-700" aria-hidden="true" />
              <p className="text-sm text-slate-500">대기 번호</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{receptionStatus.queueNumber}번</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-5">
              <BellRing className="mb-3 size-6 text-teal-700" aria-hidden="true" />
              <p className="text-sm text-slate-500">앞 대기</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{receptionStatus.waitingCount}명</p>
            </div>
          </div>

          <div className="mt-8">
            {receptionStatus.waitingCount <= 2 && receptionStatus.status === "WAITING" ? (
              <p className="text-center text-xl font-bold text-teal-700">병원 근처에서 대기해 주세요.</p>
            ) : null}
            <div className="mb-2 mt-4 flex justify-between text-sm text-slate-600">
              <span>호출까지 진행률</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </Card>
      ) : null}
    </section>
  );
}
