import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { Cookies } from "react-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const GRANT_TYPE_KEY = "grant_type";
const DEFAULT_GRANT_TYPE = "Bearer";
const REFRESH_URL = "/auth/refresh";
const cookies = new Cookies();

type AuthTokens = {
  grantType?: string;
  accessToken: string;
  refreshToken: string;
};

type RefreshTokenResponse = {
  grantType?: string;
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type FailedQueueItem = {
  resolve: (accessToken: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];
let onLogout: (() => void) | null = null;

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export function setLogoutHandler(logoutFn: () => void) {
  onLogout = logoutFn;
}

export function setAuthTokens({ grantType, accessToken, refreshToken }: AuthTokens) {
  const cookieOptions = {
    path: "/",
    sameSite: "lax" as const,
    secure: window.location.protocol === "https:",
  };

  cookies.set(GRANT_TYPE_KEY, grantType || DEFAULT_GRANT_TYPE, cookieOptions);
  cookies.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);
  cookies.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions);
}

export function clearAuthTokens() {
  const cookieOptions = { path: "/" };

  cookies.remove(GRANT_TYPE_KEY, cookieOptions);
  cookies.remove(ACCESS_TOKEN_KEY, cookieOptions);
  cookies.remove(REFRESH_TOKEN_KEY, cookieOptions);
}

function getAuthorizationHeader() {
  const accessToken = cookies.get<string | undefined>(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return null;
  }

  const grantType = cookies.get<string | undefined>(GRANT_TYPE_KEY) || DEFAULT_GRANT_TYPE;

  return `${grantType} ${accessToken}`;
}

function processQueue(error: unknown, accessToken?: string) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !accessToken) {
      reject(error);
      return;
    }

    resolve(accessToken);
  });
  failedQueue = [];
}

function getRefreshedTokens(data: RefreshTokenResponse) {
  const accessToken = data.accessToken ?? data.access_token;
  const refreshToken = data.refreshToken ?? data.refresh_token ?? cookies.get<string | undefined>(REFRESH_TOKEN_KEY);

  if (!accessToken || !refreshToken) {
    throw new Error("토큰 재발급 응답이 올바르지 않습니다.");
  }

  return {
    grantType: data.grantType ?? cookies.get<string | undefined>(GRANT_TYPE_KEY) ?? DEFAULT_GRANT_TYPE,
    accessToken,
    refreshToken,
  };
}

apiClient.interceptors.request.use((config) => {
  const authorization = getAuthorizationHeader();

  if (authorization && !config.url?.includes(REFRESH_URL)) {
    config.headers.Authorization = authorization;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ errorCode?: string }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || error.response.data?.errorCode !== "TOKEN_EXPIRED") {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((accessToken) => {
        originalRequest.headers.Authorization = `${DEFAULT_GRANT_TYPE} ${accessToken}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = cookies.get<string | undefined>(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        throw new Error("refreshToken이 없습니다.");
      }

      const { data } = await apiClient.post<RefreshTokenResponse>(
        REFRESH_URL,
        {},
        {
          headers: {
            Authorization: `${DEFAULT_GRANT_TYPE} ${refreshToken}`,
          },
        },
      );
      const tokens = getRefreshedTokens(data);
      const authorization = `${tokens.grantType ?? DEFAULT_GRANT_TYPE} ${tokens.accessToken}`;

      setAuthTokens(tokens);
      apiClient.defaults.headers.common.Authorization = authorization;
      originalRequest.headers.Authorization = authorization;
      processQueue(null, tokens.accessToken);

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      processQueue(refreshError);

      if (onLogout) {
        onLogout();
      } else {
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
