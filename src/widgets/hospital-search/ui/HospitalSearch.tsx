import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { HospitalCard } from "@/entities/hospital/ui/HospitalCard";
import { hospitalList } from "@/features/auth/api/hospitalListApi";
import { Field, SelectField } from "@/shared/ui/Field";

const statusOptions = [
  { label: "전체", value: "all" },
  { label: "진료중", value: "open" },
  { label: "접수마감", value: "closed" },
] as const;

type StatusFilter = (typeof statusOptions)[number]["value"];

export function HospitalSearch() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const {
    data: hospitals = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hospitals"],
    queryFn: hospitalList,
    retry: 2,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const filteredHospitals = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();

    return hospitals.filter((hospital) => {
      const matchesKeyword =
        trimmedKeyword.length === 0 ||
        [hospital.name, hospital.addr, hospital.number].some((value) => value.toLowerCase().includes(trimmedKeyword));
      const matchesStatus =
        status === "all" || (status === "open" && hospital.openStatus) || (status === "closed" && !hospital.openStatus);

      return matchesKeyword && matchesStatus;
    });
  }, [hospitals, keyword, status]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-10 size-4 text-slate-400" aria-hidden="true" />
          <Field
            label="검색어"
            placeholder="병원명, 주소, 전화번호"
            className="pl-9"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <SelectField
          label="접수 상태"
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
          options={statusOptions.map((item) => ({ label: item.label, value: item.value }))}
        />
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-600">
          병원 목록을 불러오는 중입니다.
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-10 text-center text-red-700">
          병원 목록을 불러오지 못했습니다.
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      ) : null}

      {!isLoading && !isError && filteredHospitals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          조건에 맞는 병원이 없습니다.
        </div>
      ) : null}
    </div>
  );
}
