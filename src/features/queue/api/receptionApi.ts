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

export type ReceptionStatusResponse = {
  receptionId: number;
  hospitalId: number;
  hospitalName: string;
  status: ReceptionQueueStatus;
  queueNumber: number;
  waitingCount: number;
};

export async function createReception(request: ReceptionCreateRequest) {
  const { data } = await apiClient.post<ReceptionResponse>("/reception", request);

  return data;
}

export async function getTodayReceptions(hospitalId: number) {
  const { data } = await apiClient.get<ReceptionResponse[]>(`/reception/hospital/${hospitalId}/today`);

  return data;
}

export async function getReceptionStatus(receptionId: number) {
  const { data } = await apiClient.get<ReceptionStatusResponse>(`/reception/hospital/${receptionId}/status`);

  return data;
}

export async function getLatestReceptionStatus() {
  const { data } = await apiClient.get<ReceptionStatusResponse>("/reception/me/latest");

  return data;
}

export async function getMyReceptions() {
  const { data } = await apiClient.get<ReceptionResponse[]>("/reception/me");

  return data;
}

export async function cancelReception(receptionId: number) {
  const { data } = await apiClient.patch<ReceptionResponse>(`/reception/${receptionId}/cancel`);

  return data;
}
