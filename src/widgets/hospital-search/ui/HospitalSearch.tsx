import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { HospitalCard } from "@/entities/hospital/ui/HospitalCard";
import type { HospitalSpecialty } from "@/entities/hospital/model/types";
import { hospitals } from "@/entities/hospital/model/mockHospitals";
import { Field, SelectField } from "@/shared/ui/Field";

const specialties: Array<HospitalSpecialty | "전체"> = ["전체", "내과", "소아청소년과", "정형외과", "이비인후과", "치과", "피부과"];

export function HospitalSearch() {
  const [keyword, setKeyword] = useState("");
  const [specialty, setSpecialty] = useState<(typeof specialties)[number]>("전체");

  const filteredHospitals = useMemo(
    () =>
      hospitals.filter((hospital) => {
        const matchesKeyword = [hospital.name, hospital.address, hospital.specialty].some((value) =>
          value.toLowerCase().includes(keyword.trim().toLowerCase()),
        );
        const matchesSpecialty = specialty === "전체" || hospital.specialty === specialty;

        return matchesKeyword && matchesSpecialty;
      }),
    [keyword, specialty],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-10 size-4 text-slate-400" aria-hidden="true" />
          <Field
            label="검색어"
            placeholder="병원명, 지역, 진료 과목"
            className="pl-9"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <SelectField
          label="진료 과목"
          value={specialty}
          onChange={(event) => setSpecialty(event.target.value as (typeof specialties)[number])}
          options={specialties.map((item) => ({ label: item, value: item }))}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredHospitals.map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </div>

      {filteredHospitals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          조건에 맞는 병원이 없습니다.
        </div>
      ) : null}
    </div>
  );
}
