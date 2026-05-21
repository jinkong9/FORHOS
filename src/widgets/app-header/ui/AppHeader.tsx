import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, LogIn, LogOut, Menu, UserRound, X } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutMember } from "@/features/auth/api/memberApi";
import { getMyName } from "@/features/auth/api/myinfoApi";
import { clearAuthTokens, hasAuthTokens, setLogoutHandler } from "@/shared/api/apiClient";
import { cn } from "@/shared/lib/cn";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";

const navItems = [
  { to: routes.hospitalList, label: "병원 찾기" },
  { to: routes.queueStatus, label: "대기 현황" },
  { to: routes.myReceptions, label: "내 접수" },
  { to: routes.myInfo, label: "내 정보" },
];

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [, refreshAuth] = useReducer((value: number) => value + 1, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = hasAuthTokens();

  useEffect(() => {
    setLogoutHandler(() => {
      queryClient.removeQueries({ queryKey: ["myName"] });
      refreshAuth();
      navigate(routes.login);
    });
  }, [navigate, queryClient]);

  const { data: myName } = useQuery({
    queryKey: ["myName"],
    queryFn: getMyName,
    enabled: isAuthenticated,
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await logoutMember();
    } finally {
      clearAuthTokens();
      queryClient.removeQueries({ queryKey: ["myName"] });
      refreshAuth();
      navigate(routes.home);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const authAction = isAuthenticated ? (
    <Button variant="ghost" className="justify-start px-3" onClick={handleLogout}>
      <LogOut className="size-4" aria-hidden="true" />
      로그아웃
    </Button>
  ) : (
    <NavLink to={routes.login}>
      <Button variant="ghost" className="justify-start px-3">
        <LogIn className="size-4" aria-hidden="true" />
        로그인
      </Button>
    </NavLink>
  );

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
          {isAuthenticated && myName?.name ? (
            <p className="hidden text-sm font-bold text-slate-700 sm:block">{myName.name}님 환영합니다.</p>
          ) : null}
          <div className="hidden md:block">{authAction}</div>
          <NavLink to={routes.hospitalRegister}>
            <Button className="px-3">
              <UserRound className="size-4" aria-hidden="true" />
              접수 시작
            </Button>
          </NavLink>
          <Button
            variant="ghost"
            className="px-3 md:hidden"
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((value) => !value)}
          >
            {isMobileMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <nav aria-label="모바일 메뉴" className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {isAuthenticated && myName?.name ? (
              <p className="px-3 py-2 text-sm font-bold text-slate-700">{myName.name}님 환영합니다.</p>
            ) : null}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                    isActive && "bg-slate-100 text-slate-950",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {authAction}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
