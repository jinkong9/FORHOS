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

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: routes.home, element: <HomePage /> },
      { path: routes.login, element: <LoginPage /> },
      { path: routes.myInfo, element: <MyInfoPage /> },
      { path: routes.hospitalList, element: <HospitalListPage /> },
      { path: routes.hospitalRegister, element: <HospitalRegisterPage /> },
      { path: routes.queueInput, element: <QueueInputPage /> },
      { path: routes.queueDone, element: <QueueDonePage /> },
      { path: routes.queueStatus, element: <QueueStatusPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
