import { Outlet } from "react-router-dom";
import { AppFooter } from "@/widgets/app-footer/ui/AppFooter";
import { AppHeader } from "@/widgets/app-header/ui/AppHeader";

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
