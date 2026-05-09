import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { getMyInfo, updateMyInfo } from "@/features/auth/api/myinfoApi";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, SelectField } from "@/shared/ui/Field";

const profileSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력해 주세요.").max(20, "이름은 20자 이하로 입력해 주세요."),
  birth: z.string().regex(/^\d+$/, "나이는 숫자로 입력해 주세요."),
  gender: z.enum(["female", "male", "none"]),
  phone: z.string().regex(/^01\d-?\d{3,4}-?\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다."),
  region: z.string().min(1, "지역을 선택해 주세요."),
  note: z.string().max(500, "특이사항은 500자 이하로 입력해 주세요.").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      birth: "",
      gender: "none",
      phone: "",
      region: "",
      note: "",
    },
  });

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!myInfo) {
      return;
    }

    reset({
      name: myInfo.name ?? "",
      birth: myInfo.age?.toString() ?? "",
      gender: myInfo.gender ?? "none",
      phone: myInfo.phone ?? "",
      region: myInfo.region ?? "",
      note: myInfo.extra ?? "",
    });
  }, [myInfo, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    await updateMyInfo({
      name: values.name,
      age: Number(values.birth),
      gender: values.gender,
      phone: values.phone,
      region: values.region,
      extra: values.note ?? "",
    });

    window.location.reload();
  };

  return (
    <Card className="p-6">
      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Field label="이름" placeholder="홍길동" error={errors.name?.message} {...register("name")} />
        <Field label="나이" type="number" placeholder="25" inputMode="numeric" error={errors.birth?.message} {...register("birth")} />
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
        <div className="md:col-span-2">
          <Field
            label="특이사항"
            placeholder="먹고 있는 약, 질병 유무 등을 입력해 주세요."
            error={errors.note?.message}
            {...register("note")}
          />
        </div>

        <div className="flex items-end gap-3 md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="size-4" aria-hidden="true" />
            {isSubmitting ? "저장 중..." : "저장하기"}
          </Button>
          <Button variant="outline" type="button" onClick={() => reset()}>
            <RotateCcw className="size-4" aria-hidden="true" />
            초기화
          </Button>
        </div>
      </form>
    </Card>
  );
}
