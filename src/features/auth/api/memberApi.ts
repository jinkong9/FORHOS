import { apiClient } from "@/shared/api/apiClient";

export type RegisterMemberRequest = {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

export type RegisterMemberResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export async function registerMember(request: RegisterMemberRequest) {
  const { data } = await apiClient.post<RegisterMemberResponse>("/members/register", request);

  return data;
}
