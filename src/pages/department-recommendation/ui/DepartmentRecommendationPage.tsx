import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ClipboardPlus, RotateCcw, Search, Stethoscope } from "lucide-react";
import { useState, type FormEvent } from "react";
import { recommendDepartment } from "@/features/recommendation/api/recommendationApi";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { TextareaField } from "@/shared/ui/Field";

type ApiErrorResponse = {
  message?: string;
};

const symptomExamples = ["목이 붓고 열이 나요", "무릎이 아파서 걷기 힘들어요", "피부에 발진이 생겼어요"];

export function DepartmentRecommendationPage() {
  const [symptom, setSymptom] = useState("");
  const [formError, setFormError] = useState("");

  const recommendationMutation = useMutation({
    mutationFn: recommendDepartment,
    onSuccess: () => {
      setFormError("");
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSymptom = symptom.trim();

    if (!trimmedSymptom) {
      setFormError("증상을 입력해 주세요.");
      return;
    }

    if (trimmedSymptom.length > 500) {
      setFormError("증상은 500자 이하로 입력해 주세요.");
      return;
    }

    try {
      setFormError("");
      await recommendationMutation.mutateAsync({ symptom: trimmedSymptom });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ApiErrorResponse | undefined;

        setFormError(errorResponse?.message ?? "추천 결과를 불러오지 못했습니다.");
        return;
      }

      setFormError("추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleReset = () => {
    setSymptom("");
    setFormError("");
    recommendationMutation.reset();
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-700">Department Recommendation</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">증상별 진료과 추천</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          증상을 입력하면 방문 전 참고할 수 있는 진료과와 추천 사유를 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md bg-teal-100 text-teal-700">
              <Stethoscope className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">증상 입력</h2>
              <p className="text-sm text-slate-600">불편한 증상을 한두 문장으로 적어 주세요.</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <TextareaField
              label="증상"
              placeholder="예: 목이 붓고 열이 나며 삼킬 때 통증이 있어요."
              maxLength={500}
              value={symptom}
              onChange={(event) => setSymptom(event.target.value)}
              error={formError}
            />
            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>최대 500자까지 입력할 수 있습니다.</span>
              <span>{symptom.length}/500</span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="w-full sm:w-auto" type="submit" disabled={recommendationMutation.isPending}>
                <Search className="size-4" aria-hidden="true" />
                {recommendationMutation.isPending ? "추천 중..." : "진료과 추천받기"}
              </Button>
              <Button className="w-full sm:w-auto" variant="outline" type="button" onClick={handleReset}>
                <RotateCcw className="size-4" aria-hidden="true" />
                초기화
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-black text-slate-950">추천 결과</h2>
            {recommendationMutation.data ? (
              <div className="mt-5 rounded-md bg-teal-50 p-5">
                <p className="text-sm font-bold text-teal-700">추천 진료과</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{recommendationMutation.data.department}</p>
                <p className="mt-4 leading-6 text-slate-700">{recommendationMutation.data.reason}</p>
              </div>
            ) : (
              <div className="mt-5 rounded-md bg-slate-50 p-5 text-slate-600">
                <ClipboardPlus className="mb-3 size-6 text-teal-700" aria-hidden="true" />
                <p>증상을 입력하면 추천 진료과가 이곳에 표시됩니다.</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-black text-slate-950">입력 예시</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {symptomExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
                  onClick={() => setSymptom(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
