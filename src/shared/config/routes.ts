export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  myInfo: "/info",
  hospitalList: "/hospital/list",
  hospitalDetail: "/hospital/:hospitalId",
  hospitalRegister: "/hospital/register",
  adminReceptions: "/admin/receptions",
  queueInput: "/hospital/input",
  queueDone: "/hospital/done",
  queueStatus: "/hospital/status",
  myReceptions: "/reception/me",
} as const;
