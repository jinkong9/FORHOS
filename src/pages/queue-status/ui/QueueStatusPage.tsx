import { BellRing, Clock3, ListOrdered } from "lucide-react";
import { currentQueue } from "@/entities/queue/model/mockQueue";
import { Card } from "@/shared/ui/Card";

export function QueueStatusPage() {
  const progress = Math.max(10, Math.min(100, 100 - currentQueue.aheadCount * 12));

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-700">Queue Status</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">대기 현황</h1>
        <p className="mt-3 text-slate-600">현재 접수된 순번과 예상 대기 시간을 확인하세요.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">{currentQueue.hospitalName}</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">{currentQueue.patientName}님 대기 중</h2>
              <p className="mt-3 text-slate-600">접수 시각: {currentQueue.createdAt}</p>
            </div>
            <span className="rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-teal-700">진료 대기</span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-5">
              <ListOrdered className="mb-3 size-6 text-teal-700" aria-hidden="true" />
              <p className="text-sm text-slate-500">내 순번</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{currentQueue.order}번</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-5">
              <BellRing className="mb-3 size-6 text-teal-700" aria-hidden="true" />
              <p className="text-sm text-slate-500">앞 대기</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{currentQueue.aheadCount}명</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-5">
              <Clock3 className="mb-3 size-6 text-teal-700" aria-hidden="true" />
              <p className="text-sm text-slate-500">예상 시간</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{currentQueue.estimatedMinutes}분</p>
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
          <h2 className="text-lg font-black text-slate-950">안내</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>병원 상황에 따라 실제 호출 시간은 달라질 수 있습니다.</li>
            <li>호출 10분 전에는 병원 근처에서 대기해 주세요.</li>
            <li>접수 취소가 필요하면 병원으로 직접 연락해 주세요.</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
