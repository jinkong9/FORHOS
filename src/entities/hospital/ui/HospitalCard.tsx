import { Building2, Clock, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Hospital } from "@/entities/hospital/model/types";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

type HospitalCardProps = {
  hospital: Hospital;
};

export function HospitalCard({ hospital }: HospitalCardProps) {
  const isOpen = hospital.openStatus === "진료중";

  return (
    <Card className="overflow-hidden">
      <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${hospital.accentColor}`}>
        <Building2 className="size-14 text-white" aria-hidden="true" />
      </div>
      <div className="space-y-5 p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {hospital.specialty}
            </span>
            <span className={isOpen ? "text-sm font-semibold text-teal-700" : "text-sm font-semibold text-slate-500"}>
              {hospital.openStatus}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-950">{hospital.name}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="size-4" aria-hidden="true" />
            {hospital.address}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-md bg-slate-50 p-3 text-center">
          <div>
            <p className="text-xs text-slate-500">대기</p>
            <p className="mt-1 font-bold text-slate-950">{hospital.waitingCount}명</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">예상</p>
            <p className="mt-1 flex items-center justify-center gap-1 font-bold text-slate-950">
              <Clock className="size-3" aria-hidden="true" />
              {hospital.estimatedMinutes}분
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">평점</p>
            <p className="mt-1 flex items-center justify-center gap-1 font-bold text-slate-950">
              <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              {hospital.rating}
            </p>
          </div>
        </div>

        {isOpen ? (
          <Link to={routes.queueInput}>
            <Button className="w-full">접수하러 가기</Button>
          </Link>
        ) : (
          <Button className="w-full" disabled>
            접수 불가
          </Button>
        )}
      </div>
    </Card>
  );
}
