import { apiClient } from "@/shared/api/apiClient";

export type MyInfoResponse = {
    name : string;
}

export async function getMyName() {
    const { data } = await apiClient.get<MyInfoResponse>("/members/my");

    return data;
}