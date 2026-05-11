import { CheckCircle2, Clock3, Ticket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { currentQueue } from "@/entities/queue/model/mockQueue";
import type { ReceptionResponse } from "@/features/queue/api/receptionApi";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

type QueueDoneLocationState = {
  reception?: ReceptionResponse;
};

const LATEST_RECEPTION_KEY = "latest_reception";

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
    return currentQueue.createdAt;
  }

  return queueTime.replace("T", " ").slice(0, 16);
}

export function QueueDonePage() {
  const location = useLocation();
  const reception = (location.state as QueueDoneLocationState | null)?.reception ?? getStoredReception();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Card className="p-8 text-center">
        <CheckCircle2 className="mx-auto mb-5 size-14 text-teal-700" aria-hidden="true" />
        <h1 className="text-3xl font-black text-slate-950">접수가 완료되었습니다</h1>
        <p className="mt-3 text-slate-600">
          {reception?.hospitalName ? `${reception.hospitalName} 접수가 완료되었습니다.` : "진료 순서가 가까워지면 병원 대기 현황에서 확인할 수 있습니다."}
        </p>

        <div className="mt-8 grid gap-3 rounded-lg bg-slate-50 p-4 text-left sm:grid-cols-3">
          <div className="rounded-md bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">접수 번호</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-black text-slate-950">
              <Ticket className="size-5 text-teal-700" aria-hidden="true" />
              {reception?.id ?? currentQueue.id}
            </p>
          </div>
          <div className="rounded-md bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">대기 순번</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-black text-slate-950">
              <Clock3 className="size-5 text-teal-700" aria-hidden="true" />
              {reception?.queueNumber ?? currentQueue.order}번
            </p>
          </div>
          <div className="rounded-md bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">접수 시각</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-black text-slate-950">
              <Clock3 className="size-5 text-teal-700" aria-hidden="true" />
              {formatQueueTime(reception?.queueTime)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={routes.queueStatus} state={{ reception }}>
            <Button className="w-full sm:w-auto">대기 현황 보기</Button>
          </Link>
          <Link to={routes.home}>
            <Button variant="outline" className="w-full sm:w-auto">
              홈으로 이동
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
