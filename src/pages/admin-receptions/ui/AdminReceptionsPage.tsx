import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  callReception,
  completeReception,
  getTodayReceptions,
  type ReceptionQueueStatus,
  type ReceptionResponse,
} from "@/features/queue/api/receptionApi";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

const statusLabel: Record<ReceptionQueueStatus, string> = {
  WAITING: "Waiting",
  CALLED: "Called",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

function formatTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return value.replace("T", " ").slice(11, 16);
}

export function AdminReceptionsPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const hospitalId = Number(searchParams.get("hospitalId") ?? "1");
  const queryKey = ["todayReceptions", hospitalId];

  const {
    data: receptions = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getTodayReceptions(hospitalId),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const callMutation = useMutation({
    mutationFn: callReception,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeReception,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-teal-700">Admin Queue</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Reception Management</h1>
          <p className="mt-3 text-slate-600">Hospital #{hospitalId} today queue</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading ? <Card className="p-8 text-center text-slate-600">Loading receptions...</Card> : null}

      {isError ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-black text-slate-950">Unable to load receptions</h2>
          <Button className="mt-5" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      ) : null}

      {!isLoading && !isError && receptions.length === 0 ? (
        <Card className="p-8 text-center text-slate-600">No receptions for today.</Card>
      ) : null}

      {!isLoading && !isError && receptions.length > 0 ? (
        <div className="grid gap-4">
          {receptions.map((reception: ReceptionResponse) => {
            const isCalling = callMutation.isPending && callMutation.variables === reception.id;
            const isCompleting = completeMutation.isPending && completeMutation.variables === reception.id;

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
                    </div>
                    <h2 className="mt-3 text-2xl font-black text-slate-950">{reception.patientName}</h2>
                    <p className="mt-2 text-sm text-slate-600">{reception.symptom}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-500">Reception time {formatTime(reception.queueTime)}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      disabled={reception.queueStatus !== "WAITING" || isCalling}
                      onClick={() => callMutation.mutate(reception.id)}
                    >
                      {isCalling ? "Calling..." : "Call"}
                    </Button>
                    <Button
                      disabled={reception.queueStatus !== "CALLED" || isCompleting}
                      onClick={() => completeMutation.mutate(reception.id)}
                    >
                      {isCompleting ? "Completing..." : "Complete"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
