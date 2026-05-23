import { type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasAnyRole, hasAuthTokens, type MemberRole } from "@/shared/api/apiClient";
import { routes } from "@/shared/config/routes";

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles?: MemberRole[];
}>;

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!hasAuthTokens()) {
    return <Navigate to={routes.login} replace state={{ from: location }} />;
  }

  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to={routes.home} replace />;
  }

  return children;
}
