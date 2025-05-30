import { useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function ClientSlider() {
    const swiperRef = useRef(null);
    const { lembagas } = usePage().props; // Ambil data lembaga dari props

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
                    320: { slidesPerView: 2, spaceBetween: 40 },
                    480: { slidesPerView: 3, spaceBetween: 60 },
                    640: { slidesPerView: 4, spaceBetween: 80 },
                    992: { slidesPerView: 6, spaceBetween: 120 },
                },
            });
        }
    }, []);

    return (
        <div className="swiper" ref={swiperRef}>
            <div className="swiper-wrapper align-items-center">
                {lembagas && lembagas.length > 0 ? (
                    // Jika ada data lembaga, lakukan iterasi dan tampilkan logo
                    lembagas.map((lembaga) => (
                        <div className="swiper-slide" key={lembaga.id}>
                            <img
                                src={lembaga.logo} // Menambahkan fallback jika logo tidak ada
                                className="img-fluid"
                            />
                        </div>
                    ))
                ) : (
                    // Jika tidak ada data lembaga, tampilkan pesan
                    <div className="swiper-slide">
                        <p>No client data available.</p>
                    </div>
                )}
            </div>

            <div className="swiper-pagination"></div>
        </div>
    );
}
