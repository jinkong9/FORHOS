import { HospitalSearch } from "@/widgets/hospital-search/ui/HospitalSearch";

export function HospitalListPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-700">Hospital List</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">병원 찾기</h1>
        <p className="mt-3 text-slate-600">병원명, 주소, 운영 상태와 대기 정보를 기준으로 접수할 병원을 찾아보세요.</p>
      </div>
      <HospitalSearch />
    </section>
  );
}
