import { ArrowRight, Clock3, Hospital, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/shared/assets/images/hospital-hero.png";
import { hospitals } from "@/entities/hospital/model/mockHospitals";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

const strengths = [
  { icon: Clock3, title: "실시간 대기 확인", description: "병원별 예상 대기 시간과 접수 가능 상태를 한눈에 확인합니다." },
  { icon: Hospital, title: "가까운 병원 탐색", description: "진료 과목과 지역을 기준으로 필요한 병원을 빠르게 찾습니다." },
  { icon: ShieldCheck, title: "방문 정보 관리", description: "초진 정보와 기본 연락처를 미리 입력해 접수 시간을 줄입니다." },
];

export function HomePage() {
  const totalWaiting = hospitals.reduce((sum, hospital) => sum + hospital.waitingPeople, 0);


  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div className="space-y-7">
            <div>
              <p className="mb-3 text-sm font-bold text-teal-700">Hospital Wait Service</p>
              <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                병원 대기 시간을 보고 접수까지 빠르게
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                FORHOS는 병원 방문 전 대기 현황을 확인하고, 필요한 정보를 미리 등록해 접수 과정을 줄이는
                프론트엔드 서비스입니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={routes.hospitalList}>
                <Button className="w-full sm:w-auto">
                  병원 찾기
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to={routes.myInfo}>
                <Button variant="outline" className="w-full sm:w-auto">
                  내 정보 등록
                </Button>
              </Link>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-3">
              <Card className="p-4 text-center">
                <p className="text-2xl font-black text-slate-950">{hospitals.length}</p>
                <p className="mt-1 text-xs text-slate-500">등록 병원</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-black text-slate-950">{totalWaiting}</p>
                <p className="mt-1 text-xs text-slate-500">총 대기</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-black text-slate-950">24분</p>
                <p className="mt-1 text-xs text-slate-500">평균 예상</p>
              </Card>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 shadow-xl">
            <img className="aspect-[4/3] w-full object-cover" src={heroImage} alt="밝고 차분한 병원 접수 대기 공간" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {strengths.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="p-6">
                <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-teal-100 text-teal-700">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
                <p className="mt-3 leading-6 text-slate-600">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
