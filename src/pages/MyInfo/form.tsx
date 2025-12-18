import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { LocationCombobox } from "./locationbox";
import { GenderComboBOx } from "./genderbox";
import { Button } from "@/Components/ui/button";

const Gender = {
  woman: "female",
  man: "male",
  none: "",
} as const;

type GenderEnum = (typeof Gender)[keyof typeof Gender];

export interface IFormInput {
  Name: string;
  gender: GenderEnum;
  Birth: string;
  location: string;
}

export default function Form() {
  const { control, register, handleSubmit, reset } = useForm<IFormInput>();
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
          {...register("Name", {
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
          {...register("Birth")}
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
      <div className="w-60 flex items-center justify-between">
        <label>지역</label>
        <Controller control={control} name="location" render={({ field }) => <LocationCombobox field={field} />} />
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
