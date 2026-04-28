import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { hospitals } from "@/entities/hospital/model/mockHospitals";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, SelectField, TextareaField } from "@/shared/ui/Field";

const queueSchema = z.object({
  hospitalId: z.string().min(1, "병원을 선택해 주세요."),
  patientName: z.string().min(2, "이름을 입력해 주세요."),
  symptom: z.string().min(5, "증상을 5자 이상 입력해 주세요."),
  visitType: z.enum(["first", "return"]),
});

type QueueFormValues = z.infer<typeof queueSchema>;

export function QueueCreateForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QueueFormValues>({
    resolver: zodResolver(queueSchema),
    defaultValues: {
      hospitalId: hospitals[0]?.id ?? "",
      patientName: "",
      symptom: "",
      visitType: "first",
    },
  });

  const onSubmit: SubmitHandler<QueueFormValues> = () => {
    navigate(routes.queueDone);
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-md bg-teal-100 text-teal-700">
          <ClipboardCheck className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-950">대기 접수</h1>
          <p className="text-sm text-slate-600">방문 목적을 남기면 예상 대기 시간을 확인할 수 있어요.</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <SelectField
          label="방문 병원"
          error={errors.hospitalId?.message}
          options={hospitals.map((hospital) => ({ label: `${hospital.name} · ${hospital.specialty}`, value: hospital.id }))}
          {...register("hospitalId")}
        />
        <Field label="환자 이름" placeholder="홍길동" error={errors.patientName?.message} {...register("patientName")} />
        <SelectField
          label="방문 유형"
          error={errors.visitType?.message}
          options={[
            { label: "초진", value: "first" },
            { label: "재진", value: "return" },
          ]}
          {...register("visitType")}
        />
        <TextareaField
          label="증상 메모"
          placeholder="예: 목이 붓고 열이 있어요."
          error={errors.symptom?.message}
          {...register("symptom")}
        />
        <Button className="w-full" type="submit">
          접수 완료하기
        </Button>
      </form>
    </Card>
  );
}
