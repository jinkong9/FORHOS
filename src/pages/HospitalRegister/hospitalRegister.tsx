import Nav from "@/Components/nav";

import HospitalSlide from "../HospitalList/listSlide";

export default function HospitalRegister() {
  return (
    <>
      <Nav />
      <h2 className="text-center text-4xl pt-10">대기 등록하기</h2>
      <div className="flex justify-center">
        <HospitalSlide />
      </div>
    </>
  );
}
