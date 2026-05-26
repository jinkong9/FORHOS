import type { Hospital } from "@/entities/hospital/model/types";
import { apiClient } from "@/shared/api/apiClient";

export type HospitalListResponse = Hospital[];

export async function hospitalList() {
  const { data } = await apiClient.get<HospitalListResponse>("/hospital");

  return data;
}

export async function hospitalDetail(hospitalId: number) {
  const { data } = await apiClient.get<Hospital>(`/hospital/${hospitalId}`);

  return data;
}
