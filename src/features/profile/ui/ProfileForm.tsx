import { zodResolver } from "@hookform/resolvers/zod";
import { Save, RotateCcw } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, SelectField } from "@/shared/ui/Field";

const profileSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력해 주세요.").max(20, "이름은 20자 이하로 입력해 주세요."),
  birth: z.string().regex(/^\d{8}$/, "생년월일은 YYYYMMDD 형식으로 입력해 주세요."),
  gender: z.enum(["female", "male", "none"]),
  phone: z.string().regex(/^01\d-?\d{3,4}-?\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다."),
  region: z.string().min(1, "지역을 선택해 주세요."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      birth: "",
      gender: "none",
      phone: "",
      region: "",
    },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = () => undefined;

  return (
    <Card className="p-6">
      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Field label="이름" placeholder="홍길동" error={errors.name?.message} {...register("name")} />
        <Field label="생년월일" placeholder="19990101" inputMode="numeric" error={errors.birth?.message} {...register("birth")} />
        <SelectField
          label="성별"
          error={errors.gender?.message}
          options={[
            { label: "선택 안 함", value: "none" },
            { label: "여성", value: "female" },
            { label: "남성", value: "male" },
          ]}
          {...register("gender")}
        />
        <Field label="휴대폰 번호" placeholder="010-1234-5678" error={errors.phone?.message} {...register("phone")} />
        <SelectField
          label="주 이용 지역"
          error={errors.region?.message}
          options={[
            { label: "지역 선택", value: "" },
            { label: "서울", value: "seoul" },
            { label: "대전", value: "daejeon" },
            { label: "광주", value: "gwangju" },
            { label: "부산", value: "busan" },
            { label: "대구", value: "daegu" },
          ]}
          {...register("region")}
        />

        <div className="flex items-end gap-3 md:col-span-2">
          <Button type="submit">
            <Save className="size-4" aria-hidden="true" />
            저장하기
          </Button>
          <Button variant="outline" onClick={() => reset()}>
            <RotateCcw className="size-4" aria-hidden="true" />
            초기화
          </Button>
          {isSubmitSuccessful ? <span className="text-sm font-semibold text-teal-700">임시 저장되었습니다.</span> : null}
        </div>
      </form>
    </Card>
  );
}
