import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slide() {
  return (
    <>
      <div className="w-full mt-20">
        <Swiper
          style={{ width: "100%", height: "560px", padding: "0 16px" }}
          modules={[Pagination, Navigation, Autoplay]}
          slidesPerView={"auto"}
          spaceBetween={30}
          pagination={{ clickable: true }}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
        >
          {[1, 2, 3, 4].map((v) => (
            <SwiperSlide key={v} style={{ width: "51%" }}>
              <div
                style={{
                  background: "white",
                  border: "1px solid black",
                  width: "100%",
                  height: "400px",
                  borderRadius: "12px",
                }}
              >
                <h2>Card {v}</h2>
                <p>설명 텍스트…</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
