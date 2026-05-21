import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./Layout";
import { routes } from "@/shared/config/routes";
import { HomePage } from "@/pages/home/ui/HomePage";
import { HospitalListPage } from "@/pages/hospital-list/ui/HospitalListPage";
import { HospitalRegisterPage } from "@/pages/hospital-register/ui/HospitalRegisterPage";
import { LoginPage } from "@/pages/login/ui/LoginPage";
import { MyInfoPage } from "@/pages/my-info/ui/MyInfoPage";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { QueueDonePage } from "@/pages/queue-done/ui/QueueDonePage";
import { QueueInputPage } from "@/pages/queue-input/ui/QueueInputPage";
import { QueueStatusPage } from "@/pages/queue-status/ui/QueueStatusPage";
import { SignupPage } from "@/pages/signup/ui/SignupPage";
import { MyReceptionsPage } from "@/pages/my-receptions/ui/MyReceptionsPage";
import { ProtectedRoute } from "@/shared/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: routes.home, element: <HomePage /> },
      { path: routes.login, element: <LoginPage /> },
      { path: routes.signup, element: <SignupPage /> },
      {
        path: routes.myInfo,
        element: (
          <ProtectedRoute>
            <MyInfoPage />
          </ProtectedRoute>
        ),
      },
      { path: routes.hospitalList, element: <HospitalListPage /> },
      {
        path: routes.hospitalRegister,
        element: (
          <ProtectedRoute>
            <HospitalRegisterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.queueInput,
        element: (
          <ProtectedRoute>
            <QueueInputPage />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.queueDone,
        element: (
          <ProtectedRoute>
            <QueueDonePage />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.queueStatus,
        element: (
          <ProtectedRoute>
            <QueueStatusPage />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.myReceptions,
        element: (
          <ProtectedRoute>
            <MyReceptionsPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
