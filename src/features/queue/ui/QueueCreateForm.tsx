import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { hospitalList } from "@/features/auth/api/hospitalListApi";
import { createReception } from "@/features/queue/api/receptionApi";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, SelectField, TextareaField } from "@/shared/ui/Field";

const queueSchema = z.object({
  hospitalId: z.string().min(1, "병원을 선택해 주세요."),
  patientName: z.string().min(2, "이름은 2자 이상 입력해 주세요."),
  symptom: z.string().min(1, "증상을 입력해 주세요.").max(500, "증상은 500자 이하로 입력해 주세요."),
  visitType: z.enum(["FIRST", "RETURN"]),
});

type QueueFormValues = z.infer<typeof queueSchema>;
type ApiErrorResponse = {
  message?: string;
  detail?: string;
};

const LATEST_RECEPTION_KEY = "latest_reception";

export function QueueCreateForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedHospitalId = searchParams.get("hospitalId") ?? "";
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QueueFormValues>({
    resolver: zodResolver(queueSchema),
    defaultValues: {
      hospitalId: selectedHospitalId,
      patientName: "",
      symptom: "",
      visitType: "FIRST",
    },
  });

  const {
    data: hospitals = [],
    isLoading: isHospitalLoading,
    isError: isHospitalError,
  } = useQuery({
    queryKey: ["hospitals"],
    queryFn: hospitalList,
    retry: 2,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const createReceptionMutation = useMutation({
    mutationFn: createReception,
    onSuccess: (reception) => {
      sessionStorage.setItem(LATEST_RECEPTION_KEY, JSON.stringify(reception));
      navigate(routes.queueDone, { state: { reception } });
    },
  });

  const onSubmit: SubmitHandler<QueueFormValues> = async (values) => {
    try {
      setSubmitError("");
      await createReceptionMutation.mutateAsync({
        hospitalId: Number(values.hospitalId),
        patientName: values.patientName,
        visitType: values.visitType,
        symptom: values.symptom,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ApiErrorResponse | undefined;

        setSubmitError(errorResponse?.message ?? errorResponse?.detail ?? "접수에 실패했습니다.");
        return;
      }

      setSubmitError("접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-md bg-teal-100 text-teal-700">
          <ClipboardCheck className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-950">대기 접수</h1>
          <p className="text-sm text-slate-600">방문 병원과 증상을 입력하면 접수를 진행합니다.</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <SelectField
          label="방문 병원"
          disabled={isHospitalLoading || isHospitalError}
          error={errors.hospitalId?.message}
          options={[
            {
              label: isHospitalLoading ? "병원 목록을 불러오는 중입니다" : "병원을 선택하세요",
              value: "",
            },
            ...hospitals.map((hospital) => ({
              label: `${hospital.name}${hospital.openStatus ? "" : " (접수마감)"}`,
              value: hospital.id.toString(),
            })),
          ]}
          {...register("hospitalId")}
        />
        {isHospitalError ? <p className="text-sm font-semibold text-red-600">병원 목록을 불러오지 못했습니다.</p> : null}
        <Field label="환자 이름" placeholder="홍길동" error={errors.patientName?.message} {...register("patientName")} />
        <SelectField
          label="방문 유형"
          error={errors.visitType?.message}
          options={[
            { label: "초진", value: "FIRST" },
            { label: "재진", value: "RETURN" },
          ]}
          {...register("visitType")}
        />
        <TextareaField
          label="증상 메모"
          placeholder="목이 붓고 열이 있어요."
          error={errors.symptom?.message}
          {...register("symptom")}
        />
        {submitError ? <p className="text-sm font-semibold text-red-600">{submitError}</p> : null}
        <Button className="w-full" type="submit" disabled={isSubmitting || createReceptionMutation.isPending || isHospitalLoading || isHospitalError}>
          {createReceptionMutation.isPending ? "접수 중..." : "접수 완료하기"}
        </Button>
      </form>
    </Card>
  );
}
