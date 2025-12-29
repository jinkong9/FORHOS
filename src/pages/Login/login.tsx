import { useState, type ReactHTMLElement } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  interface Login {
    email: string;
    pw: string;
  }

  const [info, setInfo] = useState<Login>({
    email: "",
    pw: "",
  });

  const InputOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // className="bg-[url(./assets/hosIMG.png)] bg-cover bg-main-img bg-blend-darken bg-opacity-10"
  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center gap-10">
        <p className="font-bold text-black text-5xl text-center pt-7">Login</p>
        <form className="w-150 h-130  flex flex-col justify-center items-center border-2 border-zinc-500 rounded-2xl">
          <div className="flex items-baseline gap-x-4 mb-6">
            <label className="flex items-center justify-between w-full mb-4">
              <span className="w-18 text-center font-bold">E-Mail</span>
              <input
                className="flex-1 border border-black bg-white rounded-full p-5"
                type="email"
                id="email"
                value={info.email}
                placeholder="이메일을 적어주세요"
                onChange={InputOnchange}
              ></input>
            </label>
          </div>
          <div className="flex items-baseline gap-x-4">
            <label className="flex items-center justify-between w-full mb-7">
              <span className="w-18 text-center font-bold">PW</span>
              <input
                className="flex-1 border border-black bg-white rounded-full p-5"
                type="password"
                id="pw"
                value={info.pw}
                placeholder="비밀번호를 적어주세요"
                onChange={InputOnchange}
              ></input>
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Type inside me"
              className="peer bg-transparent h-10 w-72 rounded-lg px-2 text-black placeholder-transparent border-2 border-gray-500 focus:border-sky-600 focus:outline-none"
            />
            <label
              htmlFor="username"
              className="absolute cursor-text left-2 -top-3 text-sm px-1 text-gray-500 bg-white peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
            >
              Type inside me
            </label>
          </div>
          <button
            className="cursor-pointer hover:shadow-xl bg-gray-300 border border-black-100 rounded-full pl-7 pr-7 pt-3 pb-3 mb-10"
            type="submit"
          >
            Login
          </button>
          <p className="text-sm">
            계정이 없으신가요?{" "}
            <Link className="text-amber-700 text-sm" to="/join">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
