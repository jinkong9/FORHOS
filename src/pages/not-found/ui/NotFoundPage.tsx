import { Link } from "react-router-dom";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-sm font-bold text-teal-700">404</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-slate-600">주소가 변경되었거나 존재하지 않는 경로입니다.</p>
      <Link className="mt-8 inline-block" to={routes.home}>
        <Button>홈으로 이동</Button>
      </Link>
    </section>
  );
}
