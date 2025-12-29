import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/home";
import HospitalList from "../pages/HospitalList/hospitalList";
import HospitalRegister from "../pages/HospitalRegister/hospitalRegister";
import QueueInput from "../pages/QueueInput/queueInput";
import QueueDone from "../pages/QueueDone/queueDone";
import QueueStatus from "../pages/QueueStatus/queueStatus";
import Myinfo from "../pages/MyInfo/myinfo";
import Login from "@/pages/Login/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<Myinfo />} />
          <Route path="hospital/list" element={<HospitalList />} />
          <Route path="hospital/register" element={<HospitalRegister />} />
          <Route path="hospital/input" element={<QueueInput />} />
          <Route path="hospital/done" element={<QueueDone />} />
          <Route path="hospital/status" element={<QueueStatus />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
