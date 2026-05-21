import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loginMember } from "@/features/auth/api/memberApi";
import { setAuthTokens } from "@/shared/api/apiClient";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";

const loginSchema = z.object({
  email: z.email("올바른 이메일을 입력해 주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState("");
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? routes.hospitalList;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      setSubmitError("");
      const tokens = await loginMember(values);
      setAuthTokens(tokens);
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        setSubmitError(error.response?.data?.message ?? "로그인에 실패했습니다.");
        return;
      }

      setSubmitError("이메일이나 비밀번호를 확인해주세요.");
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-teal-700 text-white">
          <LogIn className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-slate-950">로그인</h1>
        <p className="mt-2 text-sm text-slate-600">대기 접수와 내 정보를 한 곳에서 관리하세요.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="이메일"
          type="email"
          placeholder="forhos@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Field
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력"
          error={errors.password?.message}
          {...register("password")}
        />
        {submitError ? <p className="text-center text-sm font-semibold text-red-600">{submitError}</p> : null}
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          로그인
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        아직 계정이 없으신가요?{" "}
        <Link className="font-semibold text-teal-700 hover:text-teal-800" to={routes.signup}>
          회원가입
        </Link>
      </p>
    </Card>
  );
}
