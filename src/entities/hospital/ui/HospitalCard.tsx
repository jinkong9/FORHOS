import { Building2, Clock, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Hospital } from "@/entities/hospital/model/types";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

type HospitalCardProps = {
  hospital: Hospital;
};

function getHospitalDetailUrl(hospitalId: number) {
  return routes.hospitalDetail.replace(":hospitalId", hospitalId.toString());
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  const isOpen = hospital.openStatus;
  const queueInputUrl = `${routes.queueInput}?hospitalId=${hospital.id}`;
  const detailUrl = getHospitalDetailUrl(hospital.id);

  return (
    <Card className="overflow-hidden">
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-teal-500 to-sky-600">
        <Building2 className="size-14 text-white" aria-hidden="true" />
      </div>
      <div className="space-y-5 p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">병원</span>
            <span className={isOpen ? "text-sm font-semibold text-teal-700" : "text-sm font-semibold text-slate-500"}>
              {isOpen ? "진료중" : "접수마감"}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-950">{hospital.name}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {hospital.addr}
          </p>
          <p className="mt-1 text-sm text-slate-500">{hospital.number}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-md bg-slate-50 p-3 text-center">
          <div>
            <p className="text-xs text-slate-500">대기</p>
            <p className="mt-1 font-bold text-slate-950">{hospital.waitingPeople}명</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">예상</p>
            <p className="mt-1 flex items-center justify-center gap-1 font-bold text-slate-950">
              <Clock className="size-3" aria-hidden="true" />
              {hospital.waitingTime}분
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">평점</p>
            <p className="mt-1 flex items-center justify-center gap-1 font-bold text-slate-950">
              <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              {hospital.rating.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Link to={detailUrl}>
            <Button className="w-full" variant="outline">
              상세 보기
            </Button>
          </Link>
          {isOpen ? (
            <Link to={queueInputUrl}>
              <Button className="w-full">접수하러 가기</Button>
            </Link>
          ) : (
            <Button className="w-full" disabled>
              접수 불가
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
