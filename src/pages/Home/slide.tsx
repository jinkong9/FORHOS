import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import left from "../../assets/left_3325051.png";
import right from "../../assets/right_3325048.png";
import re from "../../assets/react.svg";
export default function Slide() {
  return (
    <div className="w-full mt-20">
      <Swiper
        style={{ width: "60%", height: "400px", padding: "0 10px" }}
        modules={[Pagination, Navigation, Autoplay]}
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 3500, pauseOnMouseEnter: true }}
      >
        {[left, right, re].map((v) => (
          <SwiperSlide key={v}>
            <div
              style={{
                background: "white",
                border: "1px dotted black",
                width: "100%",
                height: "400px",
                borderRadius: "12px",
              }}
            >
              <img className="w-full h-full" src={v}></img>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
