import { useEffect, useRef } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function TestimonialSlider({ testimonis }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      new Swiper(swiperRef.current, {
        modules: [Pagination, Autoplay],
        loop: true,
        speed: 600,
        autoplay: {
          delay: 5000,
        },
        slidesPerView: "auto",
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 40 },
          1200: { slidesPerView: 3, spaceBetween: 1 },
        },
      });
    }
  }, []);

  return (
    <div className="swiper" ref={swiperRef}>
      <div className="swiper-wrapper">
        {testimonis.map((testimoni) => (
          <div className="swiper-slide" key={testimoni.id}>
            <div className="testimonial-item">
              <div>
                <FaQuoteLeft className="quote-icon" />
              </div>
              <p>{testimoni.isi}</p>
              <div className="profile mt-auto">
                <img
                  src={testimoni.foto}
                  className="testimonial-img"
                  alt={testimoni.nama}
                />
                <h3>{testimoni.nama}</h3>
                <h4>{testimoni.jabatan}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="swiper-pagination"></div>
    </div>
  );
}