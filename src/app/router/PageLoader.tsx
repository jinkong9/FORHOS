import { Suspense, type ReactNode } from "react";

type PageLoaderProps = {
  children: ReactNode;
};

export function PageLoader({ children }: PageLoaderProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">페이지를 불러오는 중입니다.</div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
