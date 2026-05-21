import { type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasAuthTokens } from "@/shared/api/apiClient";
import { routes } from "@/shared/config/routes";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();

  if (!hasAuthTokens()) {
    return <Navigate to={routes.login} replace state={{ from: location }} />;
  }

  return children;
}
