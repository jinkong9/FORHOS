import type { Hospital } from "@/entities/hospital/model/types";
import { apiClient } from "@/shared/api/apiClient";

export type HospitalSortOption = "ID_ASC" | "NAME_ASC" | "WAITING_PEOPLE_ASC" | "WAITING_TIME_ASC" | "RATING_DESC";

export type PageResponse<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type HospitalListResponse = Hospital[];

export type HospitalSearchParams = {
  keyword?: string;
  openOnly?: boolean;
  sort?: HospitalSortOption;
  page?: number;
  size?: number;
};

export async function hospitalList() {
  const { data } = await apiClient.get<HospitalListResponse>("/hospital");

  return data;
}

export async function searchHospitals(params: HospitalSearchParams) {
  const { data } = await apiClient.get<PageResponse<Hospital>>("/hospital", { params });

  return data;
}

export async function hospitalDetail(hospitalId: number) {
  const { data } = await apiClient.get<Hospital>(`/hospital/${hospitalId}`);

  return data;
}
