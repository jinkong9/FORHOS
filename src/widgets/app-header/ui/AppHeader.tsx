import { AxiosError } from "axios";
import { Activity, LogIn, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getMyName } from "@/features/auth/api/myinfoApi";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";

const navItems = [
  { to: routes.hospitalList, label: "병원 찾기" },
  { to: routes.queueStatus, label: "대기 현황" },
  { to: routes.myInfo, label: "내 정보" },
];

export function AppHeader() {
  const [myName, setMyName] = useState("");

  useEffect(() => {
    const handleName = async () => {
      try {
        const data = await getMyName();
        setMyName(data.name);
      } catch (err) {
        if (err instanceof AxiosError) {
          return;
        }
      }
    };

    handleName();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <NavLink to={routes.home} className="flex items-center gap-2 text-xl font-black text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-md bg-teal-700 text-white">
            <Activity className="size-5" aria-hidden="true" />
          </span>
          FORHOS
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                  isActive && "bg-slate-100 text-slate-950",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {myName ? <p className="font-bold">{myName}님 환영합니다.</p> : null}
          <NavLink to={routes.login}>
            <Button variant="ghost" className="hidden px-3 md:inline-flex">
              <LogIn className="size-4" aria-hidden="true" />
              로그인
            </Button>
          </NavLink>
          <NavLink to={routes.hospitalRegister}>
            <Button className="px-3">
              <UserRound className="size-4" aria-hidden="true" />
              접수 시작
            </Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
