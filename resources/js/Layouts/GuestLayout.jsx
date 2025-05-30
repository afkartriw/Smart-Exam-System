import { Link } from '@inertiajs/react';
const logoUrl = "/images/logo.png"; 



// URL logo dari folder public/images


export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-1">
            {/* Logo */}
            <div>
            <img src={logoUrl} alt="Logo" className="h-16 w-auto" />
            </div>

            {/* Container untuk Konten */}
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
