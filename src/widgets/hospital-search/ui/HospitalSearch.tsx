import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { HospitalCard } from "@/entities/hospital/ui/HospitalCard";
import { searchHospitals, type HospitalSortOption } from "@/features/auth/api/hospitalListApi";
import { Button } from "@/shared/ui/Button";
import { Field, SelectField } from "@/shared/ui/Field";

const statusOptions = [
  { label: "전체", value: "all" },
  { label: "운영중만", value: "open" },
] as const;

const sortOptions: Array<{ label: string; value: HospitalSortOption }> = [
  { label: "기본순", value: "ID_ASC" },
  { label: "이름순", value: "NAME_ASC" },
  { label: "대기 인원 적은 순", value: "WAITING_PEOPLE_ASC" },
  { label: "대기 시간 짧은 순", value: "WAITING_TIME_ASC" },
  { label: "평점 높은 순", value: "RATING_DESC" },
];

type StatusFilter = (typeof statusOptions)[number]["value"];

export function HospitalSearch() {
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<HospitalSortOption>("ID_ASC");
  const [page, setPage] = useState(0);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["hospitals", submittedKeyword, status, sort, page],
    queryFn: () =>
      searchHospitals({
        keyword: submittedKeyword || undefined,
        openOnly: status === "open",
        sort,
        page,
        size: 9,
      }),
    retry: 2,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const hospitals = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  function submitSearch() {
    setPage(0);
    setSubmittedKeyword(keyword.trim());
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_160px_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-10 size-4 text-slate-400" aria-hidden="true" />
          <Field
            label="검색어"
            placeholder="병원명, 주소, 전화번호"
            className="pl-9"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitSearch();
              }
            }}
          />
        </div>
        <SelectField
          label="운영 상태"
          value={status}
          onChange={(event) => {
            setPage(0);
            setStatus(event.target.value as StatusFilter);
          }}
          options={statusOptions.map((item) => ({ label: item.label, value: item.value }))}
        />
        <SelectField
          label="정렬"
          value={sort}
          onChange={(event) => {
            setPage(0);
            setSort(event.target.value as HospitalSortOption);
          }}
          options={sortOptions}
        />
        <Button className="self-end" disabled={isFetching} onClick={submitSearch}>
          검색
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-600">
          병원 목록을 불러오는 중입니다.
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-10 text-center text-red-700">
          <p className="font-bold">병원 목록을 불러오지 못했습니다.</p>
          <p className="mt-2 text-sm">네트워크 상태와 백엔드 API 실행 여부를 확인한 뒤 다시 시도해 주세요.</p>
          <Button className="mt-5" variant="outline" disabled={isFetching} onClick={() => void refetch()}>
            다시 불러오기
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>총 {totalElements.toLocaleString()}개 병원</span>
          {isFetching ? <span>새로고침 중...</span> : null}
        </div>
      ) : null}

      {!isLoading && !isError && hospitals.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      ) : null}

      {!isLoading && !isError && hospitals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          조건에 맞는 병원이 없습니다.
        </div>
      ) : null}

      {!isLoading && !isError && totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page === 0 || isFetching} onClick={() => setPage((current) => Math.max(0, current - 1))}>
            이전
          </Button>
          <span className="text-sm font-semibold text-slate-700">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page + 1 >= totalPages || isFetching}
            onClick={() => setPage((current) => current + 1)}
          >
            다음
          </Button>
        </div>
      ) : null}
    </div>
  );
}
