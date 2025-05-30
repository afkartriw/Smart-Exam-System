import { Link, usePage } from "@inertiajs/react"; // Impor usePage
import { FaHome, FaMoneyBillAlt, FaBuilding } from "react-icons/fa"; // Contoh ikon dari react-icons
import { GiTwoCoins } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa6";
import { useState } from "react"; // Impor useState untuk mengontrol dropdown
import { HiOutlineBars3BottomRight } from "react-icons/hi2";

export default function SidebarAdmin({ isSidebarOpen, toggleSidebar }) {
    const { url } = usePage(); // Ambil URL saat ini
    const [isLandingPageOpen, setIsLandingPageOpen] = useState(false); // State untuk dropdown Landing Page

    // Fungsi untuk memeriksa apakah menu aktif
    const isActive = (href) => {
        if (href === "/admin") {
            // Hanya aktif jika URL persis "/Admin"
            return url === href;
        } else {
            // Aktif jika URL dimulai dengan href dan bukan subpath lainnya
            return url.startsWith(href) && url !== "/admin";
        }
    };

    // Fungsi untuk toggle dropdown Landing Page
    const toggleLandingPageDropdown = () => {
        setIsLandingPageOpen(!isLandingPageOpen);
    };

    return (
        <div
            className={`${
                isSidebarOpen ? "w-56" : "w-16"
            } bg-white shadow h-screen fixed top-0 left-0 z-20 transition-all duration-300 mt-16`}
        >
            {/* Tombol Toggle di Pojok Kanan Atas */}
            <div className="flex justify-end p-2">
                <button
                    onClick={toggleSidebar}
                    className="text-gray-600 focus:outline-none hover:bg-gray-200 rounded-full p-1 mt-4"
                >
                    <HiOutlineBars3BottomRight size={28} />
                </button>
            </div>

            {/* Menu Sidebar */}
            <nav className={`space-y-2 ${isSidebarOpen ? "p-4" : "p-1"}`}>
                <Link
                    href="/admin"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/admin") ? "bg-blue-500 text-white" : ""
                    }`}
                >
                    <FaHome className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Dashboard</span>}
                </Link>
                <Link
                    href="/admin/lembaga"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/admin/lembaga")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    {" "}
                    <FaBuilding className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Lembaga</span>}
                </Link>

                {/* Dropdown Landing Page */}
                <div>
                    <button
                        onClick={toggleLandingPageDropdown}
                        className={`flex items-center w-full px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                            isActive("/admin/fitur") ||
                            isActive("/admin/keunggulan") ||
                            isActive("/admin/testimoni") ||
                            isActive("/admin/aboutus")
                                ? "bg-blue-500 text-white"
                                : ""
                        }`}
                    >
                        <FaLaptopCode className="w-6 h-6" />
                        {isSidebarOpen && (
                            <span className="ml-2">Landing Page</span>
                        )}
                        {isSidebarOpen && (
                            <svg
                                className={`w-4 h-4 ml-auto transition-transform ${
                                    isLandingPageOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        )}
                    </button>

                    {/* Submenu Dropdown */}
                    {isLandingPageOpen && isSidebarOpen && (
                        <div className="pl-8 mt-2 space-y-2">
                            <Link
                                href="/admin/aboutus"
                                className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                                    isActive("/admin/aboutus")
                                        ? "bg-blue-500 text-white"
                                        : ""
                                }`}
                            >
                                <span>About us</span>
                            </Link>
                            <Link
                                href="/admin/keunggulan"
                                className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                                    isActive("/admin/keunggulan")
                                        ? "bg-blue-500 text-white"
                                        : ""
                                }`}
                            >
                                <span>Keunggulan</span>
                            </Link>
                            <Link
                                href="/admin/fitur"
                                className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                                    isActive("/admin/fitur")
                                        ? "bg-blue-500 text-white"
                                        : ""
                                }`}
                            >
                                <span>Fitur</span>
                            </Link>
                            <Link
                                href="/admin/testimoni"
                                className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                                    isActive("/admin/testimoni")
                                        ? "bg-blue-500 text-white"
                                        : ""
                                }`}
                            >
                                <span>Testimoni</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Menu Poin */}
                <Link
                    href="/admin/poin"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/admin/poin") ? "bg-blue-500 text-white" : ""
                    }`}
                >
                    <GiTwoCoins className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Penjualan</span>}
                </Link>

                {/* Menu Pembayaran */}
                <Link
                    href="/admin/pembayaran"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/admin/pembayaran")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <FaMoneyBillAlt className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Pembayaran</span>}
                </Link>
            </nav>
        </div>
    );
}
