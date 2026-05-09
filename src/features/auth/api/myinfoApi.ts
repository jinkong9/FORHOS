import { apiClient } from "@/shared/api/apiClient";

export type MyInfoResponse = {
  name: string;
  age: number | string;
  gender: "female" | "male" | "none";
  phone: string;
  region: string;
  extra: string;
};

export type UpdateMyInfoRequest = {
  name: string;
  age: number;
  gender: "female" | "male" | "none";
  phone: string;
  region: string;
  extra?: string;
};

export async function getMyInfo() {
  const { data } = await apiClient.get<MyInfoResponse>("/members/myinfo");

  return data;
}

export async function updateMyInfo(request: UpdateMyInfoRequest) {
  const { data } = await apiClient.patch<MyInfoResponse>("/members/myinfo", request);

  return data;
}

export async function getMyName() {
  const data = await getMyInfo();

  return { name: data.name };
}
