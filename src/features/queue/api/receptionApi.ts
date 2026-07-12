import { apiClient } from "@/shared/api/apiClient";

export type ReceptionVisitType = "FIRST" | "RETURN";

export type ReceptionQueueStatus = "WAITING" | "CALLED" | "COMPLETED" | "CANCELED" | "NO_SHOW";

export type ReceptionPageResponse = {
  content: ReceptionResponse[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ReceptionCreateRequest = {
  hospitalId: number;
  patientName: string;
  visitType: ReceptionVisitType;
  symptom: string;
};

export type ReceptionAsyncResponse = {
  requestId: string;
  status: "ACCEPTED";
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

export async function createReceptionAsync(request: ReceptionCreateRequest) {
  const { data } = await apiClient.post<ReceptionAsyncResponse>("/reception/async", request);

  return data;
}

export async function getTodayReceptions(hospitalId: number) {
  const { data } = await apiClient.get<ReceptionResponse[]>(`/reception/hospital/${hospitalId}/today`);

  return data;
}

export async function getAdminReceptions(params: {
  date?: string;
  status?: ReceptionQueueStatus | "";
  page?: number;
  size?: number;
}) {
  const { data } = await apiClient.get<ReceptionPageResponse>("/admin/receptions", { params });

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

export async function callReception(receptionId: number) {
  const { data } = await apiClient.patch<ReceptionResponse>(`/reception/${receptionId}/call`);

  return data;
}

export async function completeReception(receptionId: number) {
  const { data } = await apiClient.patch<ReceptionResponse>(`/reception/${receptionId}/complete`);

  return data;
}

export async function cancelReceptionByAdmin(receptionId: number) {
  const { data } = await apiClient.patch<ReceptionResponse>(`/admin/receptions/${receptionId}/cancel`);

  return data;
}

export async function markNoShowReception(receptionId: number) {
  const { data } = await apiClient.patch<ReceptionResponse>(`/admin/receptions/${receptionId}/no-show`);

  return data;
}
