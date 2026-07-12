import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  callReception,
  cancelReceptionByAdmin,
  completeReception,
  getAdminReceptions,
  markNoShowReception,
  type ReceptionQueueStatus,
  type ReceptionResponse,
} from "@/features/queue/api/receptionApi";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, SelectField } from "@/shared/ui/Field";

const statusLabel: Record<ReceptionQueueStatus, string> = {
  WAITING: "대기",
  CALLED: "호출",
  COMPLETED: "완료",
  CANCELED: "취소",
  NO_SHOW: "노쇼",
};

const statusOptions: Array<{ label: string; value: ReceptionQueueStatus | "" }> = [
  { label: "전체", value: "" },
  { label: "대기", value: "WAITING" },
  { label: "호출", value: "CALLED" },
  { label: "완료", value: "COMPLETED" },
  { label: "취소", value: "CANCELED" },
  { label: "노쇼", value: "NO_SHOW" },
];

function formatTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return value.replace("T", " ").slice(11, 16);
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function AdminReceptionsPage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(getToday());
  const [status, setStatus] = useState<ReceptionQueueStatus | "">("");
  const [page, setPage] = useState(0);
  const queryKey = ["adminReceptions", date, status, page];

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getAdminReceptions({ date, status, page, size: 10 }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const receptions = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  function invalidateReceptions() {
    queryClient.invalidateQueries({ queryKey: ["adminReceptions"] });
  }

  const callMutation = useMutation({
    mutationFn: callReception,
    onSuccess: invalidateReceptions,
  });

  const completeMutation = useMutation({
    mutationFn: completeReception,
    onSuccess: invalidateReceptions,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelReceptionByAdmin,
    onSuccess: invalidateReceptions,
  });

  const noShowMutation = useMutation({
    mutationFn: markNoShowReception,
    onSuccess: invalidateReceptions,
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-teal-700">Admin Queue</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">접수 관리</h1>
          <p className="mt-3 text-slate-600">날짜와 상태별로 병원 접수 목록을 관리합니다.</p>
        </div>
        <Button variant="outline" disabled={isFetching} onClick={() => refetch()}>
          새로고침
        </Button>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[220px_180px_auto]">
        <Field
          label="조회 날짜"
          type="date"
          value={date}
          onChange={(event) => {
            setPage(0);
            setDate(event.target.value);
          }}
        />
        <SelectField
          label="접수 상태"
          value={status}
          onChange={(event) => {
            setPage(0);
            setStatus(event.target.value as ReceptionQueueStatus | "");
          }}
          options={statusOptions}
        />
        <div className="self-end text-sm text-slate-600">총 {totalElements.toLocaleString()}건</div>
      </div>

      {isLoading ? <Card className="p-8 text-center text-slate-600">접수 목록을 불러오는 중입니다.</Card> : null}

      {isError ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-black text-slate-950">접수 목록을 불러오지 못했습니다.</h2>
          <Button className="mt-5" onClick={() => refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : null}

      {!isLoading && !isError && receptions.length === 0 ? (
        <Card className="p-8 text-center text-slate-600">조건에 맞는 접수가 없습니다.</Card>
      ) : null}

      {!isLoading && !isError && receptions.length > 0 ? (
        <div className="grid gap-4">
          {receptions.map((reception: ReceptionResponse) => {
            const isCalling = callMutation.isPending && callMutation.variables === reception.id;
            const isCompleting = completeMutation.isPending && completeMutation.variables === reception.id;
            const isCanceling = cancelMutation.isPending && cancelMutation.variables === reception.id;
            const isMarkingNoShow = noShowMutation.isPending && noShowMutation.variables === reception.id;

            return (
              <Card key={reception.id} className="p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">
                        #{reception.queueNumber}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {statusLabel[reception.queueStatus]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {reception.hospitalName}
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-black text-slate-950">{reception.patientName}</h2>
                    <p className="mt-2 text-sm text-slate-600">{reception.symptom}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-500">접수 시간 {formatTime(reception.queueTime)}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      disabled={reception.queueStatus !== "WAITING" || isCalling}
                      onClick={() => callMutation.mutate(reception.id)}
                    >
                      {isCalling ? "호출 중..." : "호출"}
                    </Button>
                    <Button
                      disabled={reception.queueStatus !== "CALLED" || isCompleting}
                      onClick={() => completeMutation.mutate(reception.id)}
                    >
                      {isCompleting ? "완료 중..." : "완료"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={reception.queueStatus !== "CALLED" || isMarkingNoShow}
                      onClick={() => noShowMutation.mutate(reception.id)}
                    >
                      {isMarkingNoShow ? "처리 중..." : "노쇼"}
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={reception.queueStatus === "COMPLETED" || reception.queueStatus === "CANCELED" || isCanceling}
                      onClick={() => cancelMutation.mutate(reception.id)}
                    >
                      {isCanceling ? "취소 중..." : "취소"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {!isLoading && !isError && totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page === 0 || isFetching} onClick={() => setPage((current) => Math.max(0, current - 1))}>
            이전
          </Button>
          <span className="text-sm font-semibold text-slate-700">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page + 1 >= totalPages || isFetching}
            onClick={() => setPage((current) => current + 1)}
          >
            다음
          </Button>
        </div>
      ) : null}
    </section>
  );
}
