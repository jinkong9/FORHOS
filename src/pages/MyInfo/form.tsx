import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { LocationCombobox } from "./locationbox";
import { GenderComboBOx } from "./genderbox";
import { Button } from "@/Components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Gender = {
  woman: "female",
  man: "male",
} as const;

type GenderEnum = (typeof Gender)[keyof typeof Gender];

export interface IFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birth: number;
  gender: GenderEnum;
}

const UserSchema = z
  .object({
    name: z.string().min(1, { message: "이름을 입력해주세요." }).max(5),
    email: z.email({ pattern: z.regexes.email }).min(1, { message: "이메일을 입력해주세요." }),
    password: z.string().min(8, { message: "8자 이상 입력 가능." }),
    confirmPassword: z.string(),
    gender: z.enum(["female", "male"]),
    birth: z.number().min(8, { message: "생년월일을 입력해주세요." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],

    when(payload) {
      return UserSchema.pick({ password: true, confirmPassword: true }).safeParse(payload.value).success;
    },
  });

type UserSchema = z.infer<typeof UserSchema>;

// const ZodResult = UserSchema.safeParse()
// https://curiousweek.tistory.com/206 서버 중복 확인 API 호출 검증 (비동기)
// https://zod.dev/api#check 비밀번호
// https://hcl-yeon.tistory.com/11 ul li radio 네이버처럼 선택

export default function Form() {
  const { control, register, handleSubmit, reset } = useForm<IFormInput>({ resolver: zodResolver(UserSchema) });
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-100 h-130 flex flex-col items-center border border-slate-300 justify-evenly rounded-3xl shadow-lg"
    >
      <div className="w-60 flex items-center justify-between">
        <label>이름</label>
        <input
          id="name"
          type="text"
          placeholder="이름"
          className="input-base input-focus"
          {...register("name", {
            required: true,
          })}
        />
      </div>

      <div className="w-60 flex items-center justify-between">
        <label>생년월일</label>
        <input
          id="birth"
          type="text"
          placeholder="생년월일 8자리"
          className="input-base input-focus"
          {...register("birth")}
          onBlur={(e) => {
            const len = e.target.value.replace(/\D/g, "");
            if (len.length !== 8) return;
            e.target.value = `${len.slice(0, 4)}.${len.slice(4, 6)}.${len.slice(6, 8)}`;
          }}
        />
      </div>
      <div className="w-60 flex items-center justify-between">
        <label>성별</label>
        <Controller control={control} name="gender" render={({ field }) => <GenderComboBOx field={field} />} />
      </div>
      <div className="w-full flex justify-evenly">
        <Button type="submit" variant="outline">
          제출하기
        </Button>
        <Button onClick={() => reset()} variant="outline">
          Reset
        </Button>
      </div>
    </form>
  );
}
{
  /* <div className="w-60 flex items-center justify-between">
        <label>지역</label>
        <Controller control={control} name="location" render={({ field }) => <LocationCombobox field={field} />} />
      </div> */
}
