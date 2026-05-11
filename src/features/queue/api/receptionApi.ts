import { apiClient } from "@/shared/api/apiClient";

export type ReceptionVisitType = "FIRST" | "RETURN";

export type ReceptionQueueStatus = "WAITING" | "CALLED" | "COMPLETED" | "CANCELED";

export type ReceptionCreateRequest = {
  hospitalId: number;
  patientName: string;
  visitType: ReceptionVisitType;
  symptom: string;
};

export type ReceptionResponse = {
  id: number;
  memberId: number;
  hospitalId: number;
  hospitalName: string;
  patientName: string;
  visitType: ReceptionVisitType;
  symptom: string;
  queueNumber: number;
  queueStatus: ReceptionQueueStatus;
  queueDate: string;
  queueTime: string;
  calledTime: string | null;
  doneTime: string | null;
  canceledTime: string | null;
};

export async function createReception(request: ReceptionCreateRequest) {
  const { data } = await apiClient.post<ReceptionResponse>("/reception", request);

  return data;
}

export async function getTodayReceptions(hospitalId: number) {
  const { data } = await apiClient.get<ReceptionResponse[]>(`/reception/hospital/${hospitalId}/tody`);

  return data;
}
