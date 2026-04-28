import { ClipboardList, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

export function HospitalRegisterPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-sm font-bold text-teal-700">Start Queue</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">방문 유형을 선택하세요</h1>
        <p className="mt-3 text-slate-600">초진이면 기본 정보를 먼저 등록하고, 재진이면 바로 병원 목록으로 이동합니다.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-7">
          <UserRound className="mb-5 size-10 text-teal-700" aria-hidden="true" />
          <h2 className="text-2xl font-black text-slate-950">처음 방문해요</h2>
          <p className="mt-3 leading-6 text-slate-600">이름, 연락처, 주 이용 지역을 저장하고 다음 접수부터 더 빠르게 진행하세요.</p>
          <Link className="mt-6 block" to={routes.myInfo}>
            <Button className="w-full">내 정보 등록하기</Button>
          </Link>
        </Card>

        <Card className="p-7">
          <ClipboardList className="mb-5 size-10 text-slate-900" aria-hidden="true" />
          <h2 className="text-2xl font-black text-slate-950">방문한 적 있어요</h2>
          <p className="mt-3 leading-6 text-slate-600">저장된 정보를 기준으로 병원을 선택하고 대기 접수를 바로 시작합니다.</p>
          <Link className="mt-6 block" to={routes.hospitalList}>
            <Button variant="secondary" className="w-full">
              병원 선택하기
            </Button>
          </Link>
        </Card>
      </div>
    </section>
  );
}
