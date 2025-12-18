import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HospitalCard from "./listCard";

export interface Hospital {
  key: number;
  name: string;
  Subject: string;
  location: string;
}

export default function HospitalSlide() {
  const dummy: Hospital[] = [
    { key: 1, name: "A병원", Subject: "이비인후과", location: "학하서로 126-1" },
    { key: 2, name: "B병원", Subject: "치과", location: "학하서로 1262-21" },
    { key: 3, name: "C병원", Subject: "내과", location: "학하서로 1226-124" },
    { key: 4, name: "D병원", Subject: "정형외과", location: "학하서로 1262-112" },
    { key: 5, name: "E병원", Subject: "신경외과", location: "학하서로 54262-112" },
    { key: 6, name: "F병원", Subject: "비뇨기과", location: "학하서로 562-112" },
    { key: 7, name: "G병원", Subject: "이비인후과", location: "학하서로 126-1" },
    { key: 8, name: "H병원", Subject: "치과", location: "학하서로 1262-21" },
    { key: 9, name: "I병원", Subject: "내과", location: "학하서로 1226-124" },
    { key: 10, name: "J병원", Subject: "정형외과", location: "학하서로 1262-112" },
    { key: 11, name: "K병원", Subject: "신경외과", location: "학하서로 54262-112" },
    { key: 12, name: "L병원", Subject: "비뇨기과", location: "학하서로 562-112" },
  ];

  const CutArray = <T,>(arr: T[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const slides = CutArray(dummy, 6);

  return (
    <>
      <div className="w-full h-full mt-10">
        <Swiper
          style={{ width: "100%", height: "100%", padding: "0 16px" }}
          modules={[Pagination, Navigation]}
          spaceBetween={30}
          pagination={{ clickable: true, type: "fraction" }}
          centeredSlides={true}
          loop={true}
          navigation={true}
        >
          {slides.map((data, i) => (
            <SwiperSlide key={i} style={{ width: "70%" }}>
              <div className="flex justify-center">
                <div className="pt-10 pb-10 h-150 w-[80%] grid grid-cols-3 gap-8">
                  {data.map((hospital) => (
                    <HospitalCard key={hospital.key} hospital={hospital} />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
