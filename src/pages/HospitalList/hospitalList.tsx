import Nav from "@/Components/nav";
import HospitalSlide from "./listSlide";

export default function HospitalList() {
  return (
    <>
      <Nav />
      <h2 className="text-center text-4xl pt-10">병원 찾기</h2>
      <div className="flex justify-center">
        <HospitalSlide />
      </div>
    </>
  );
}
