import { useQuery } from "@tanstack/react-query";
import { BellRing, Clock3, ListOrdered } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getTodayReceptions, type ReceptionResponse } from "@/features/queue/api/receptionApi";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

type QueueStatusLocationState = {
  reception?: ReceptionResponse;
};

const LATEST_RECEPTION_KEY = "latest_reception";

const statusLabel: Record<ReceptionResponse["queueStatus"], string> = {
  WAITING: "진료 대기",
  CALLED: "호출됨",
  COMPLETED: "진료 완료",
  CANCELED: "접수 취소",
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

function formatQueueTime(queueTime?: string) {
  if (!queueTime) {
    return "-";
  }

  return queueTime.replace("T", " ").slice(0, 16);
}

export function QueueStatusPage() {
  const location = useLocation();
  const latestReception = (location.state as QueueStatusLocationState | null)?.reception ?? getStoredReception();
  const hospitalId = latestReception?.hospitalId;

  const {
    data: receptions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todayReceptions", hospitalId],
    queryFn: () => getTodayReceptions(hospitalId!),
    enabled: Boolean(hospitalId),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const currentReception =
    receptions.find((reception) => reception.id === latestReception?.id) ??
    receptions.find((reception) => reception.patientName === latestReception?.patientName) ??
    latestReception;
  const activeReceptions = receptions.filter((reception) => reception.queueStatus === "WAITING" || reception.queueStatus === "CALLED");
  const aheadCount = currentReception
    ? activeReceptions.filter((reception) => reception.queueNumber < currentReception.queueNumber).length
    : 0;
  const progress = currentReception ? Math.max(10, Math.min(100, 100 - aheadCount * 12)) : 10;

  if (!hospitalId) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-black text-slate-950">대기 현황</h1>
          <p className="mt-3 text-slate-600">최근 접수 정보가 없습니다. 먼저 병원 접수를 진행해 주세요.</p>
          <Link className="mt-6 inline-block" to={routes.hospitalList}>
            <Button>병원 찾기</Button>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-700">Queue Status</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">대기 현황</h1>
        <p className="mt-3 text-slate-600">현재 접수된 순번과 앞 대기 인원을 확인하세요.</p>
      </div>

      {isLoading ? <Card className="p-8 text-center text-slate-600">대기 현황을 불러오는 중입니다.</Card> : null}

      {isError ? <Card className="p-8 text-center text-red-700">대기 현황을 불러오지 못했습니다.</Card> : null}

      {!isLoading && !isError && currentReception ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <Card className="p-7">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{currentReception.hospitalName}</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">{currentReception.patientName}님 대기 중</h2>
                <p className="mt-3 text-slate-600">접수 시각: {formatQueueTime(currentReception.queueTime)}</p>
              </div>
              <span className="rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-teal-700">
                {statusLabel[currentReception.queueStatus]}
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-5">
                <ListOrdered className="mb-3 size-6 text-teal-700" aria-hidden="true" />
                <p className="text-sm text-slate-500">내 순번</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{currentReception.queueNumber}번</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-5">
                <BellRing className="mb-3 size-6 text-teal-700" aria-hidden="true" />
                <p className="text-sm text-slate-500">앞 대기</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{aheadCount}명</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-5">
                <Clock3 className="mb-3 size-6 text-teal-700" aria-hidden="true" />
                <p className="text-sm text-slate-500">오늘 접수</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{receptions.length}건</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>호출까지 진행률</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-black text-slate-950">오늘 대기 목록</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {receptions.map((reception) => (
                <li key={reception.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0">
                  <span>
                    {reception.queueNumber}번 {reception.patientName}
                  </span>
                  <span className="font-semibold text-slate-900">{statusLabel[reception.queueStatus]}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
