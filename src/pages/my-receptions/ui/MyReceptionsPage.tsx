import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CalendarDays, ClipboardList, Clock3, RefreshCw, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  cancelReception,
  getMyReceptions,
  type ReceptionQueueStatus,
  type ReceptionResponse,
  type ReceptionVisitType,
} from "@/features/queue/api/receptionApi";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

type ApiErrorResponse = {
  message?: string;
};

const statusLabel: Record<ReceptionQueueStatus, string> = {
  WAITING: "대기 중",
  CALLED: "호출됨",
  COMPLETED: "진료 완료",
  CANCELED: "접수 취소",
  NO_SHOW: "노쇼",
};

const statusClassName: Record<ReceptionQueueStatus, string> = {
  WAITING: "bg-teal-100 text-teal-700",
  CALLED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  CANCELED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-orange-100 text-orange-700",
};

const visitTypeLabel: Record<ReceptionVisitType, string> = {
  FIRST: "초진",
  RETURN: "재진",
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return value.replace("T", " ").slice(0, 16);
}

function getCancelErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const errorResponse = error.response?.data as ApiErrorResponse | undefined;

    return errorResponse?.message ?? "접수를 취소하지 못했습니다.";
  }

  return "접수를 취소하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export function MyReceptionsPage() {
  const queryClient = useQueryClient();
  const {
    data: receptions = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["myReceptions"],
    queryFn: getMyReceptions,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelReception,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReceptions"] });
    },
  });

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-teal-700">My Receptions</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">내 접수 내역</h1>
          <p className="mt-3 text-slate-600">접수 상태를 확인하고, 대기 중인 접수를 취소할 수 있습니다.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className="size-4" aria-hidden="true" />
          새로고침
        </Button>
      </div>

      {isLoading ? <Card className="p-10 text-center text-slate-600">접수 내역을 불러오는 중입니다.</Card> : null}

      {isError ? (
        <Card className="p-10 text-center">
          <h2 className="text-xl font-black text-slate-950">접수 내역을 불러오지 못했습니다.</h2>
          <p className="mt-3 text-slate-600">로그인이 만료되었거나 네트워크 오류가 발생했을 수 있습니다.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              다시 시도
            </Button>
            <Link to={routes.login}>
              <Button>로그인</Button>
            </Link>
          </div>
        </Card>
      ) : null}

      {!isLoading && !isError && receptions.length === 0 ? (
        <Card className="p-10 text-center">
          <ClipboardList className="mx-auto mb-4 size-10 text-slate-400" aria-hidden="true" />
          <h2 className="text-xl font-black text-slate-950">아직 접수 내역이 없습니다.</h2>
          <p className="mt-3 text-slate-600">병원을 선택하고 접수를 진행하면 이곳에서 내역을 확인할 수 있습니다.</p>
          <Link className="mt-6 inline-block" to={routes.hospitalList}>
            <Button>병원 찾기</Button>
          </Link>
        </Card>
      ) : null}

      {!isLoading && !isError && receptions.length > 0 ? (
        <div className="grid gap-4">
          {receptions.map((reception: ReceptionResponse) => {
            const canCancel = reception.queueStatus === "WAITING";
            const isCanceling = cancelMutation.isPending && cancelMutation.variables === reception.id;

            return (
              <Card key={reception.id} className="p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClassName[reception.queueStatus]}`}>
                        {statusLabel[reception.queueStatus]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {visitTypeLabel[reception.visitType]}
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-black text-slate-950">{reception.hospitalName}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{reception.symptom}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link to={routes.queueStatus} state={{ reception }}>
                      <Button variant="outline">대기 현황</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      disabled={!canCancel || isCanceling}
                      onClick={() => cancelMutation.mutate(reception.id)}
                      className="text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="size-4" aria-hidden="true" />
                      {isCanceling ? "취소 중..." : "접수 취소"}
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <ClipboardList className="mb-2 size-5 text-teal-700" aria-hidden="true" />
                    <p className="text-xs font-semibold text-slate-500">접수 ID</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{reception.id}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <Clock3 className="mb-2 size-5 text-teal-700" aria-hidden="true" />
                    <p className="text-xs font-semibold text-slate-500">대기 번호</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{reception.queueNumber}번</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <CalendarDays className="mb-2 size-5 text-teal-700" aria-hidden="true" />
                    <p className="text-xs font-semibold text-slate-500">접수 시간</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{formatDateTime(reception.queueTime)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {cancelMutation.isError ? (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {getCancelErrorMessage(cancelMutation.error)}
        </p>
      ) : null}
    </section>
  );
}
