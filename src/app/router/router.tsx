import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { Layout } from "./Layout";
import { PageLoader } from "./PageLoader";
import { routes } from "@/shared/config/routes";
import { ProtectedRoute } from "@/shared/auth/ProtectedRoute";

const HomePage = lazy(() => import("@/pages/home/ui/HomePage").then((module) => ({ default: module.HomePage })));
const HospitalDetailPage = lazy(() =>
  import("@/pages/hospital-detail/ui/HospitalDetailPage").then((module) => ({ default: module.HospitalDetailPage })),
);
const HospitalListPage = lazy(() =>
  import("@/pages/hospital-list/ui/HospitalListPage").then((module) => ({ default: module.HospitalListPage })),
);
const HospitalRegisterPage = lazy(() =>
  import("@/pages/hospital-register/ui/HospitalRegisterPage").then((module) => ({ default: module.HospitalRegisterPage })),
);
const LoginPage = lazy(() => import("@/pages/login/ui/LoginPage").then((module) => ({ default: module.LoginPage })));
const MyInfoPage = lazy(() => import("@/pages/my-info/ui/MyInfoPage").then((module) => ({ default: module.MyInfoPage })));
const NotFoundPage = lazy(() => import("@/pages/not-found/ui/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const QueueDonePage = lazy(() => import("@/pages/queue-done/ui/QueueDonePage").then((module) => ({ default: module.QueueDonePage })));
const QueueInputPage = lazy(() =>
  import("@/pages/queue-input/ui/QueueInputPage").then((module) => ({ default: module.QueueInputPage })),
);
const QueueStatusPage = lazy(() =>
  import("@/pages/queue-status/ui/QueueStatusPage").then((module) => ({ default: module.QueueStatusPage })),
);
const SignupPage = lazy(() => import("@/pages/signup/ui/SignupPage").then((module) => ({ default: module.SignupPage })));
const MyReceptionsPage = lazy(() =>
  import("@/pages/my-receptions/ui/MyReceptionsPage").then((module) => ({ default: module.MyReceptionsPage })),
);
const AdminReceptionsPage = lazy(() =>
  import("@/pages/admin-receptions/ui/AdminReceptionsPage").then((module) => ({ default: module.AdminReceptionsPage })),
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: routes.home,
        element: (
          <PageLoader>
            <HomePage />
          </PageLoader>
        ),
      },
      {
        path: routes.login,
        element: (
          <PageLoader>
            <LoginPage />
          </PageLoader>
        ),
      },
      {
        path: routes.signup,
        element: (
          <PageLoader>
            <SignupPage />
          </PageLoader>
        ),
      },
      {
        path: routes.myInfo,
        element: (
          <ProtectedRoute>
            <PageLoader>
              <MyInfoPage />
            </PageLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: routes.hospitalList,
        element: (
          <PageLoader>
            <HospitalListPage />
          </PageLoader>
        ),
      },
      {
        path: routes.hospitalDetail,
        element: (
          <PageLoader>
            <HospitalDetailPage />
          </PageLoader>
        ),
      },
      {
        path: routes.hospitalRegister,
        element: (
          <ProtectedRoute>
            <PageLoader>
              <HospitalRegisterPage />
            </PageLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: routes.adminReceptions,
        element: (
          <ProtectedRoute allowedRoles={["HOSPITAL_ADMIN", "ADMIN"]}>
            <PageLoader>
              <AdminReceptionsPage />
            </PageLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: routes.queueInput,
        element: (
          <ProtectedRoute>
            <PageLoader>
              <QueueInputPage />
            </PageLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: routes.queueDone,
        element: (
          <ProtectedRoute>
            <PageLoader>
              <QueueDonePage />
            </PageLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: routes.queueStatus,
        element: (
          <ProtectedRoute>
            <PageLoader>
              <QueueStatusPage />
            </PageLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: routes.myReceptions,
        element: (
          <ProtectedRoute>
            <PageLoader>
              <MyReceptionsPage />
            </PageLoader>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <PageLoader>
            <NotFoundPage />
          </PageLoader>
        ),
      },
    ],
  },
]);
