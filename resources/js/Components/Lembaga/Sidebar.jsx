import { Link, usePage } from "@inertiajs/react"; // Impor usePage
import {
    FaHome,
    FaChalkboardTeacher,
    FaUsers,
    FaBook, // Ikon untuk Soal
    FaFileAlt, // Ikon untuk Laporan
    FaMoneyBillAlt,
    FaCalendarAlt,
    FaHistory, // Ikon untuk 
} from "react-icons/fa"; // Contoh ikon dari react-icons
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { GiCctvCamera } from "react-icons/gi";

export default function SidebarLembaga({ isSidebarOpen, toggleSidebar }) {
    const { url } = usePage(); // Ambil URL saat ini

    // Fungsi untuk memeriksa apakah menu aktif
    const isActive = (href) => {
        if (href === "/lembaga") {
            // Hanya aktif jika URL persis "/lembaga"
            return url === href;
        } else {
            // Aktif jika URL dimulai dengan href dan bukan subpath lainnya
            return url.startsWith(href) && url !== "/lembaga";
        }
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
                    href="/lembaga"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga") ? "bg-blue-500 text-white" : ""
                    }`}
                >
                    <FaHome className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Dashboard</span>}
                </Link>
                <Link
                    href="/lembaga/staff"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga/staff")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <FaChalkboardTeacher className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Staff</span>}
                </Link>
                <Link
                    href="/lembaga/peserta"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga/peserta")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <FaUsers className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Peserta</span>}
                </Link>
                {/* Menu Soal */}
                <Link
                    href="/lembaga/paketsoal"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga/paketsoal")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <FaBook className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Paket Soal</span>}
                </Link>
                {/* SESI */}
                <Link
                    href="/lembaga/sesi"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga/sesi")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <FaCalendarAlt className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Sesi</span>}
                </Link>
                {/* Pengawas */}
                <Link
                    href="/lembaga/pengawas"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga/pengawas")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <GiCctvCamera className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">pengawas</span>}
                </Link>
                {/* Menu Laporan */}
                <Link
                    href="/lembaga/laporan"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga/laporan")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <FaFileAlt className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Laporan</span>}
                </Link>
                {/* Menu Beli Poin */}
                <Link
                    href="/lembaga/belipoin"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga/belipoin")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <FaMoneyBillAlt className="w-6 h-6" />
                    {isSidebarOpen && <span className="ml-2">Beli Poin</span>}
                </Link>
                {/* Menu Beli Poin */}
                <Link
                    href="/lembaga/riwayat"
                    className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-2xl ${
                        isActive("/lembaga/riwayat")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                >
                    <FaHistory className="w-5 h-5" />
                    {isSidebarOpen && <span className="ml-2">Riwayat</span>}
                </Link>
            </nav>
        </div>
    );
}
