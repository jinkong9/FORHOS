import Nav from "../../Components/nav";
import Footer from "./footer";
import Slide from "./slide";
export default function Home() {
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center">
        <p className="pt-10 text-center font-bold text-4xl text-[#5D5A88]">
          병원 대기 서비스
        </p>
        <p className="pt-2 text-center font-bold text-4xl text-[#5D5A88]">
          (Hospital Wait Service)
        </p>
        <p className="pt-2 text-center font-semibold text-xl text-gray-600">
          대기상황과 예상 진료시간을 확인할 수 있어요
        </p>
      </div>
      <Slide />
      <Footer />
    </>
  );
}
