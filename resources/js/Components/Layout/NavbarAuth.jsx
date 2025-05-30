import React, { useState, useEffect } from "react";
import { usePage } from '@inertiajs/react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
        const { abouts } = usePage().props;
    
        const aboutData = abouts.length > 0 ? abouts[0] : null;
        const logo2 = aboutData ? `${aboutData.logo2}` : null;
        const appName = aboutData ? aboutData.nama : "Smart Exam System";
    

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    return (
        <nav
            className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 bg-blue-600 h-16 ${
                isScrolled ? "shadow-md" : "" // Hanya tambahkan shadow saat di-scroll
            }`}
        >
            <div className="container mx-32 py-3 flex items-center">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <a href="/">
                    {logo2 ? (
                    <img src={logo2} alt="LOGO" className="h-10" />
                ) : (
                    <span>Loading...</span>
                )}                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;