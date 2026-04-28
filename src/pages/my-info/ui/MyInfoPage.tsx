import { ProfileForm } from "@/features/profile/ui/ProfileForm";

export function MyInfoPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-700">My Info</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">내 정보</h1>
        <p className="mt-3 text-slate-600">병원 접수에 필요한 기본 정보를 미리 등록하세요.</p>
      </div>
      <ProfileForm />
    </section>
  );
}
