import { apiClient } from "@/shared/api/apiClient";

export type SymptomRecommendationRequest = {
  symptom: string;
};

export type SymptomRecommendationResponse = {
  department: string;
  reason: string;
};

export async function recommendDepartment(request: SymptomRecommendationRequest) {
  const { data } = await apiClient.post<SymptomRecommendationResponse>("/recommendations/departments", request);

  return data;
}
