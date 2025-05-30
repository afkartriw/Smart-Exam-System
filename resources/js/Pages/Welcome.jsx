import ClientSlider from "@/Components/HomePage/ClientSlider";
import Fitur from "@/Components/HomePage/Fitur";
import Keunggulan from "@/Components/HomePage/Keunggulan";
import Navbar from "@/Components/HomePage/Navbar";
import TestimonialSlider from "@/Components/HomePage/TestimonialSlider";
import { useEffect } from "react";

export default function Welcome({ keunggulans, fiturs, testimonis, abouts, lembagas }) {
    const dataAbout = abouts || [];

    useEffect(() => {
        // Memuat skrip JavaScript secara dinamis
        const scripts = [
            "assets/vendor/bootstrap/js/bootstrap.bundle.min.js",
            "assets/vendor/php-email-form/validate.js",
            "assets/vendor/aos/aos.js",
            "assets/vendor/glightbox/js/glightbox.min.js",
            "assets/vendor/purecounter/purecounter_vanilla.js",
            "assets/vendor/imagesloaded/imagesloaded.pkgd.min.js",
            "assets/vendor/isotope-layout/isotope.pkgd.min.js",
            "assets/vendor/swiper/swiper-bundle.min.js",
            "assets/js/main.js",
        ];

        scripts.forEach((src) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = false; // Memastikan skrip dieksekusi berurutan
            document.body.appendChild(script);
        });

        return () => {
            // Membersihkan skrip saat komponen di-unmount
            scripts.forEach((src) => {
                const script = document.querySelector(`script[src="${src}"]`);
                if (script) {
                    document.body.removeChild(script);
                }
            });
        };
    }, []);
    return (
        <>
            {/* Fonts */}
            <link href="https://fonts.googleapis.com" rel="preconnect" />
            <link
                href="https://fonts.gstatic.com"
                rel="preconnect"
                crossOrigin=""
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet"
            />
            {/* Vendor CSS Files */}
            <link
                href="assets/vendor/bootstrap/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <link
                href="assets/vendor/bootstrap-icons/bootstrap-icons.css"
                rel="stylesheet"
            />
            {/* <link href="assets/vendor/aos/aos.css" rel="stylesheet" /> */}
            <link
                href="assets/vendor/glightbox/css/glightbox.min.css"
                rel="stylesheet"
            />
            <link
                href="assets/vendor/swiper/swiper-bundle.min.css"
                rel="stylesheet"
            />
            {/* Main CSS File */}
            <link href="assets/css/main.css" rel="stylesheet" />
            <div>
            <Navbar abouts={abouts} />
                <main className="main">
                    {/* Hero Section */}
                    <section id="hero" className="hero section">
                        <div className="container">
                            <div className="row gy-4">
                                <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
                                    <h1 data-aos="fade-up">
                                        {dataAbout[0].slogan}
                                    </h1>
                                    <p data-aos="fade-up" data-aos-delay={100}>
                                        {dataAbout[0].subSlogan}
                                    </p>
                                    <div
                                        className="d-flex flex-column flex-md-row"
                                        data-aos="fade-up"
                                        data-aos-delay={200}
                                    >
                                        <a
                                            href="/konfirmasi"
                                            className="btn-get-started"
                                        >
                                            Daftar
                                            <i className="bi bi-arrow-right" />
                                        </a>
                                        <a
                                            href={dataAbout[0].linkYT}
                                            className="glightbox btn-watch-video d-flex align-items-center justify-content-center ms-0 ms-md-4 mt-4 mt-md-0"
                                        >
                                            <i className="bi bi-play-circle" />
                                            <span>Watch Video</span>
                                        </a>
                                    </div>
                                </div>
                                <div
                                    className="col-lg-6 order-1 order-lg-2 hero-img"
                                    data-aos="zoom-out"
                                >
                                    <img
                                        src="images/hero-img.png"
                                        className="img-fluid animated"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* /Hero Section */}
                    {/* About Section */}
                    <section id="about" className="about section">
                        <div className="container" data-aos="fade-up">
                            <div className="row gx-0">
                                <div
                                    className="col-lg-6 d-flex flex-column justify-content-center"
                                    data-aos="fade-up"
                                    data-aos-delay={200}
                                >
                                    <div className="content">
                                        <h3>Who We Are</h3>
                                        <h2> {dataAbout[0].nama}</h2>
                                        <p>{dataAbout[0].deskripsi}</p>
                                        <div className="text-center text-lg-start">
                                            <a
                                                href="#"
                                                className="btn-read-more d-inline-flex align-items-center justify-content-center align-self-center"
                                            >
                                                <span>Read More</span>
                                                <i className="bi bi-arrow-right" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-lg-6 d-flex align-items-center"
                                    data-aos="zoom-out"
                                    data-aos-delay={200}
                                >
                                    <img
                                        src="images/about.jpg"
                                        className="img-fluid"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* /About Section */}
                    {/* Values Section */}
                    <Keunggulan keunggulans={keunggulans} />
                    {/* /Values Section */}
                    {/* Stats Section */}
                    <section id="stats" className="stats section">
                        <div
                            className="container"
                            data-aos="fade-up"
                            data-aos-delay={100}
                        >
                            <div className="row gy-4">
                                <div className="col-lg-3 col-md-6">
                                    <div className="stats-item d-flex align-items-center w-100 h-100">
                                        <i className="bi bi-emoji-smile color-blue flex-shrink-0" />
                                        <div>
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={232}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                            <p>Happy Clients</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End Stats Item */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="stats-item d-flex align-items-center w-100 h-100">
                                        <i
                                            className="bi bi-journal-richtext color-orange flex-shrink-0"
                                            style={{ color: "#ee6c20" }}
                                        />
                                        <div>
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={521}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                            <p>Exam</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End Stats Item */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="stats-item d-flex align-items-center w-100 h-100">
                                        <i
                                            className="bi bi-headset color-green flex-shrink-0"
                                            style={{ color: "#15be56" }}
                                        />
                                        <div>
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={1463}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                            <p>Staff</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End Stats Item */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="stats-item d-flex align-items-center w-100 h-100">
                                        <i
                                            className="bi bi-people color-pink flex-shrink-0"
                                            style={{ color: "#bb0852" }}
                                        />
                                        <div>
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={15}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                            <p>Participant</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End Stats Item */}
                            </div>
                        </div>
                    </section>
                    {/* /Stats Section */}
                    {/* Features Section */}

                    <Fitur fiturs={fiturs} />

                    {/* Clients Section */}
                    <section id="clients" className="clients section">
                        {/* Section Title */}
                        <div
                            className="container section-title"
                            data-aos="fade-up"
                        >
                            <h2>Clients</h2>
                            <p>
                                We work with best clients
                                <br />
                            </p>
                        </div>
                        {/* End Section Title */}
                        <div
                            className="container"
                            data-aos="fade-up"
                            data-aos-delay={100}
                        >
                            <ClientSlider lembagas={lembagas}/>
                        </div>
                    </section>
                    {/* /Clients Section */}
                    {/* Testimonials Section */}
                    <section id="testimonials" className="testimonials section">
                        {/* Section Title */}
                        <div
                            className="container section-title"
                            data-aos="fade-up"
                        >
                            <h2>Testimonials</h2>
                            <p>
                                What they are saying about us
                                <br />
                            </p>
                        </div>
                        {/* End Section Title */}
                        <div
                            className="container"
                            data-aos="fade-up"
                            data-aos-delay={100}
                        >
                            <TestimonialSlider testimonis={testimonis} />
                        </div>
                    </section>
                    {/* /Testimonials Section */}
                </main>
                <footer id="footer" className="footer">
                    <div className="footer-newsletter">
                        <div className="container">
                            <div className="row justify-content-center text-center">
                                <div className="col-lg-6">
                                    <h4>Join Our Newsletter</h4>
                                    <p>
                                        Subscribe to our newsletter and receive
                                        the latest news about our products and
                                        services!
                                    </p>
                                    <form
                                        action="forms/newsletter.php"
                                        method="post"
                                        className="php-email-form"
                                    >
                                        <div className="newsletter-form">
                                            <input type="email" name="email" />
                                            <input
                                                type="submit"
                                                defaultValue="Subscribe"
                                            />
                                        </div>
                                        <div className="loading">Loading</div>
                                        <div className="error-message" />
                                        <div className="sent-message">
                                            Your subscription request has been
                                            sent. Thank you!
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container footer-top">
                        <div className="row gy-4">
                            <div className="col-lg-4 col-md-6 footer-about">
                                <a
                                    href="index.html"
                                    className="d-flex align-items-center"
                                >
                                    <span className="sitename">
                                        PT. xxxx
                                    </span>
                                </a>
                                <div className="footer-contact pt-3">
                                    <p> {dataAbout[0].alamat}</p>
                                    <p className="mt-3">
                                        <strong>Phone:</strong>{" "}
                                        <span> {dataAbout[0].phone}</span>
                                    </p>
                                    <p>
                                        <strong>Email:</strong>{" "}
                                        <span>{dataAbout[0].email}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3 footer-links">
                                <h4>Useful Links</h4>
                                <ul>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Home</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">About us</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Services</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Terms of service</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-2 col-md-3 footer-links">
                                <h4>Our Services</h4>
                                <ul>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Web Design</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Web Development</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Product Management</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Marketing</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <h4>Follow Us</h4>
                                <p>
                                    Cras fermentum odio eu feugiat lide par naso
                                    tierra videa magna derita valies
                                </p>
                                <div className="social-links d-flex">
                                    <a href="">
                                        <i className="bi bi-twitter-x" />
                                    </a>
                                    <a href="">
                                        <i className="bi bi-facebook" />
                                    </a>
                                    <a href="">
                                        <i className="bi bi-instagram" />
                                    </a>
                                    <a href="">
                                        <i className="bi bi-linkedin" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container copyright text-center mt-4">
                        <p>
                            © <span>Copyright</span>{" "}
                            <strong className="px-1 sitename">FlexStart</strong>{" "}
                            <span>All Rights Reserved</span>
                        </p>
                        <div className="credits">
                            {/* All the links in the footer should remain intact. */}
                            {/* You can delete the links only if you've purchased the pro version. */}
                            {/* Licensing information: https://bootstrapmade.com/license/ */}
                            {/* Purchase the pro version with working PHP/AJAX contact form: [buy-url] */}
                            Designed by{" "}
                            <a href="https://bootstrapmade.com/">
                                BootstrapMade
                            </a>{" "}
                            Distributed by{" "}
                            <a href="“https://themewagon.com">ThemeWagon</a>
                        </div>
                        <a href="“https://themewagon.com"></a>
                    </div>
                    <a href="“https://themewagon.com"></a>
                </footer>
                <a href="“https://themewagon.com">{/* Scroll Top */}</a>
                <a
                    href="#"
                    id="scroll-top"
                    className="scroll-top d-flex align-items-center justify-content-center"
                >
                    <i className="bi bi-arrow-up-short" />
                </a>
                {/* Vendor JS Files */}
                {/* Main JS File */}
            </div>{" "}
        </>
    );
}
