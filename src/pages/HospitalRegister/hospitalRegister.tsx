import Nav from "@/Components/nav";
import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HospitalRegister() {
  const navigate = useNavigate();
  const GoInfo = () => {
    navigate("/info");
  };
  const GoList = () => {
    navigate("/hospital/register");
  };
  return (
    <>
      <Nav />
      <div className="w-full h-screen flex gap-x-10 justify-center items-center">
        <div className="w-140 h-130 flex flex-col justify-evenly items-center border-2 border-slate-300 rounded-3xl bg-[#5D5A88] hover:scale-103 transition ease-in-out">
          <div className="flex flex-col gap-4">
            <h3 className="text-center text-white text-3xl font-bold pt-3">병원 방문이 처음이신가요 ?</h3>
            <h2 className="text-center text-white text-lg font-extralight pt-3">
              첫 방문 경우 인적사항을 적어야합니다.
            </h2>
          </div>
          <Button
            variant="outline"
            className="w-50 h-20 rounded-4xl bg-white text-[#5D5A88] text-xl font-bold border-none cursor-pointer hover:bg-gray-300 hover:scale-103 transition ease-in-out"
            onClick={GoInfo}
          >
            이동하기
          </Button>
        </div>
        <div className="w-140 h-130 flex flex-col justify-evenly items-center border-2 border-slate-300 rounded-3xl bg-white hover:scale-103 transition ease-in-out">
          <div className="flex flex-col gap-4">
            <h3 className="text-center text-[#5D5A88] text-3xl font-bold pt-3">병원 방문을 한 적 있으신가요 ?</h3>
            <h2 className="text-center text-[#5D5A88] text-lg font-extralight pt-3">
              첫 방문 경우 인적사항을 적어야합니다.
            </h2>
          </div>
          <Button
            variant="outline"
            className="w-50 h-20 rounded-4xl bg-[#5D5A88] text-white text-xl font-bold border-none cursor-pointer hover:bg-gray-300 hover:scale-103 transition ease-in-out"
            onClick={GoList}
          >
            이동하기
          </Button>
        </div>
      </div>
    </>
  );
}
