import { useNavigate, Link } from "react-router-dom";
import NavButton from "./NavButton";

export default function Nav() {
  const navigate = useNavigate();

  const goMain = () => {
    navigate("/");
  };

  const GoRegister = () => {
    navigate("/hospital/register", { replace: true });
  };

  const GoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="w-full h-15 bg-gray-100 flex justify-between items-center">
      <p className="pl-5 font-bold text-3xl cursor-pointer" onClick={goMain}>
        FORHOS
      </p>
      <div className="flex gap-10 items-center">
        <Link to="/info" className="text-center text-xl cursor-pointer hover:scale-105">
          INFO
        </Link>
        <Link to="/hospital/list" className="text-center text-xl cursor-pointer hover:scale-105">
          LIST
        </Link>
        <NavButton onClick={GoLogin} className="border border-gray-500 bg-white">
          Login
        </NavButton>
        <NavButton onClick={GoRegister} className=" mr-10 text-white bg-[#5D5A88]">
          등록하기
        </NavButton>
      </div>
    </div>
  );
}
