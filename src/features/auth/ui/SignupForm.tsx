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
import { Field } from "@/shared/ui/Field";

const signupSchema = z
  .object({
    name: z.string().min(2, "이름을 2자 이상 입력해 주세요."),
    email: z.email("올바른 이메일을 입력해 주세요."),
    phone: z.string().regex(/^01\d-?\d{3,4}-?\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(8, "비밀번호 확인을 입력해 주세요."),
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
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
    try {
      setSubmitError("");
      await registerMember(values);
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
    <Card className="w-full max-w-md p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-teal-700 text-white">
          <UserPlus className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-slate-950">회원가입</h1>
        <p className="mt-2 text-sm text-slate-600">FORHOS에서 병원 접수와 대기 현황을 편하게 관리해 보세요.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Field label="이름" placeholder="홍길동" error={errors.name?.message} {...register("name")} />
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
        {submitError ? <p className="text-sm font-semibold text-red-600">{submitError}</p> : null}
        <Button className="w-full" type="submit" disabled={isSubmitting}>
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
