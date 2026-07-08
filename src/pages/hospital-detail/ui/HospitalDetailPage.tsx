import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, CalendarDays, Clock, MapPin, Phone, Star, UsersRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { hospitalDetail } from "@/features/auth/api/hospitalListApi";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

function formatTimeRange(start: string | null, end: string | null) {
  if (!start && !end) {
    return "미등록";
  }

  return `${start?.slice(0, 5) ?? "미정"} - ${end?.slice(0, 5) ?? "미정"}`;
}

export function HospitalDetailPage() {
  const { hospitalId } = useParams();
  const parsedHospitalId = Number(hospitalId);
  const isValidHospitalId = Number.isInteger(parsedHospitalId) && parsedHospitalId > 0;

  const {
    data: hospital,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["hospital", parsedHospitalId],
    queryFn: () => hospitalDetail(parsedHospitalId),
    enabled: isValidHospitalId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const queueInputUrl = hospital ? `${routes.queueInput}?hospitalId=${hospital.id}` : routes.hospitalList;

  if (!isValidHospitalId) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-black text-slate-950">잘못된 병원 주소입니다.</h1>
          <p className="mt-3 text-slate-600">병원 목록에서 다시 선택해 주세요.</p>
          <Link className="mt-6 inline-block" to={routes.hospitalList}>
            <Button>병원 목록으로 이동</Button>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950" to={routes.hospitalList}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        병원 목록
      </Link>

      {isLoading ? <Card className="p-8 text-center text-slate-600">병원 정보를 불러오는 중입니다.</Card> : null}

      {isError ? (
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-black text-slate-950">병원 정보를 불러오지 못했습니다.</h1>
          <p className="mt-3 text-slate-600">존재하지 않는 병원이거나 서버 응답을 확인할 수 없습니다.</p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => void refetch()}>
              다시 시도
            </Button>
            <Link to={routes.hospitalList}>
              <Button>병원 목록으로 이동</Button>
            </Link>
          </div>
        </Card>
      ) : null}

      {!isLoading && !isError && hospital ? (
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="overflow-hidden">
            <div className="flex h-52 items-center justify-center bg-gradient-to-br from-teal-600 to-sky-700">
              <Building2 className="size-20 text-white" aria-hidden="true" />
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-teal-700">Hospital Detail</p>
                  <h1 className="mt-2 text-3xl font-black text-slate-950">{hospital.name}</h1>
                  <p className="mt-3 flex items-start gap-2 text-slate-600">
                    <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
                    {hospital.addr}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-slate-600">
                    <Phone className="size-4 shrink-0" aria-hidden="true" />
                    {hospital.number}
                  </p>
                </div>
                <span className={hospital.openStatus ? "rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-teal-700" : "rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600"}>
                  {hospital.openStatus ? "운영중" : "접수마감"}
                </span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-slate-50 p-5">
                  <UsersRound className="mb-3 size-6 text-teal-700" aria-hidden="true" />
                  <p className="text-sm text-slate-500">현재 대기</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">{hospital.waitingPeople}명</p>
                </div>
                <div className="rounded-md bg-slate-50 p-5">
                  <Clock className="mb-3 size-6 text-teal-700" aria-hidden="true" />
                  <p className="text-sm text-slate-500">예상 대기</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">{hospital.waitingTime}분</p>
                </div>
                <div className="rounded-md bg-slate-50 p-5">
                  <Star className="mb-3 size-6 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <p className="text-sm text-slate-500">평점</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">{hospital.rating.toFixed(1)}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-slate-200 p-4">
                  <Clock className="mb-2 size-5 text-teal-700" aria-hidden="true" />
                  <p className="text-sm font-bold text-slate-900">진료시간</p>
                  <p className="mt-1 text-sm text-slate-600">{formatTimeRange(hospital.openTime, hospital.closeTime)}</p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <Clock className="mb-2 size-5 text-teal-700" aria-hidden="true" />
                  <p className="text-sm font-bold text-slate-900">점심시간</p>
                  <p className="mt-1 text-sm text-slate-600">{formatTimeRange(hospital.lunchStartTime, hospital.lunchEndTime)}</p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <CalendarDays className="mb-2 size-5 text-teal-700" aria-hidden="true" />
                  <p className="text-sm font-bold text-slate-900">휴무일</p>
                  <p className="mt-1 text-sm text-slate-600">{hospital.closedDays || "미등록"}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="h-fit p-6">
            <h2 className="text-xl font-black text-slate-950">방문 접수</h2>
            <p className="mt-3 leading-6 text-slate-600">
              병원 운영 상태와 대기 인원을 확인한 뒤 접수를 진행할 수 있습니다.
            </p>
            <div className="mt-6 grid gap-2">
              {hospital.openStatus ? (
                <Link to={queueInputUrl}>
                  <Button className="w-full">접수하러 가기</Button>
                </Link>
              ) : (
                <Button className="w-full" disabled>
                  접수 불가
                </Button>
              )}
              <Button className="w-full" variant="ghost" onClick={() => void refetch()}>
                상세 정보 새로고침
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
