import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { registerMember } from "@/features/auth/api/memberApi";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, SelectField } from "@/shared/ui/Field";

const signupSchema = z
  .object({
    email: z.email("올바른 이메일을 입력해 주세요."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(8, "비밀번호 확인을 입력해 주세요."),
    name: z.string().min(2, "이름을 2자 이상 입력해 주세요."),
    age: z.string().regex(/^\d+$/, "나이는 숫자로 입력해 주세요."),
    phone: z.string().regex(/^01\d-?\d{3,4}-?\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다."),
    gender: z.string().min(1, "성별을 선택해 주세요."),
    region: z.string().optional(),
    extra: z.string().max(500, "특이사항은 500자 이하로 입력해 주세요.").optional(),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      age: "",
      phone: "",
      gender: "",
      region: "",
      extra: "",
    },
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
    try {
      setSubmitError("");
      await registerMember({
        email: values.email,
        password: values.password,
        name: values.name,
        age: Number(values.age),
        phone: values.phone,
        gender: values.gender,
        region: values.region,
        extra: values.extra,
      });
      navigate(routes.login);
    } catch (error) {
      if (error instanceof AxiosError) {
        setSubmitError(error.response?.data?.message ?? "회원가입에 실패했습니다.");
        return;
      }

      setSubmitError("회원가입에 실패했습니다.");
    }
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-teal-700 text-white">
          <UserPlus className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-slate-950">회원가입</h1>
        <p className="mt-2 text-sm text-slate-600">FORHOS에서 병원 접수와 대기 현황을 편하게 관리해 보세요.</p>
      </div>

      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Field label="이름" placeholder="홍길동" error={errors.name?.message} {...register("name")} />
        <Field label="나이" type="number" placeholder="25" min={0} error={errors.age?.message} {...register("age")} />
        <Field
          label="이메일"
          type="email"
          placeholder="forhos@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Field
          label="휴대폰 번호"
          placeholder="010-1234-5678"
          inputMode="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <SelectField
          label="성별"
          error={errors.gender?.message}
          options={[
            { label: "성별 선택", value: "" },
            { label: "여성", value: "female" },
            { label: "남성", value: "male" },
            { label: "선택 안 함", value: "none" },
          ]}
          {...register("gender")}
        />
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
        <Field
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력"
          error={errors.password?.message}
          {...register("password")}
        />
        <Field
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더 입력"
          error={errors.passwordConfirm?.message}
          {...register("passwordConfirm")}
        />
        <div className="md:col-span-2">
          <Field
            label="특이사항"
            placeholder="먹고 있는 약, 질병 유무 등을 입력해 주세요."
            error={errors.extra?.message}
            {...register("extra")}
          />
        </div>
        {submitError ? <p className="text-sm font-semibold text-red-600 md:col-span-2">{submitError}</p> : null}
        <Button className="w-full md:col-span-2" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "가입 중..." : "가입하기"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        이미 계정이 있으신가요?{" "}
        <Link className="font-semibold text-teal-700 hover:text-teal-800" to={routes.login}>
          로그인
        </Link>
      </p>
    </Card>
  );
}
