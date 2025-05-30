import React, { useRef, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Line } from "react-chartjs-2";
import { IoIosNotifications } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { FaBook, FaCoins, FaFilter, FaSearch } from "react-icons/fa";
import Sidebar from "@/Components/Admin/Sidebar";
import Navbar from "@/Components/Admin/Navbar";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import Pagination from "@/Components/Layout/Pagination";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const VISITOR_DATA = [
    100, 150, 200, 250, 300, 350, 100, 50, 150, 300, 400, 450,
];

const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(54, 162, 235, 0.1)");
    gradient.addColorStop(1, "rgba(54, 162, 235, 1)");
    return gradient;
};

const data = {
    labels: MONTHS,
    datasets: [
        {
            label: "Jumlah Pengunjung",
            data: VISITOR_DATA,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: "rgba(54, 162, 235, 1)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.4,
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        legend: { display: false },
        title: { display: false },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { stepSize: 100 },
        },
    },
};

const Page = ({ logs }) => {
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState("");

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    // Handle perubahan jumlah entries
    const handleEntriesChange = (e) => {
        setEntries(parseInt(e.target.value));
        setCurrentPage(1);
    };

    // Handle perubahan halaman
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Filter data berdasarkan pencarian
    const filtered = logs.filter((log) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
        log.lembaga.toLowerCase().includes(lowerCaseFilter) ||
        log.description.toLowerCase().includes(lowerCaseFilter));
    }

    );

    const totalPages = Math.ceil(filtered.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedLogs = filtered.slice(startIndex, startIndex + entries);
    const chartRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Ambil data dari controller Laravel
    const { props } = usePage();

    // Berikan nilai default jika data tidak terdefinisi
    const {
        totalLembaga = 0,
        totalStaff = 0,
        totalPeserta = 0,
        totalSesiUjian = 0,
        totalPaketSoal = 0,
        totalPoinTerjual = 0,
        totalTransaksi = 0,
    } = props;

    return (
        <div className="relative flex bg-gray-200">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <div
                className={`flex-1 flex flex-col ${
                    isSidebarOpen ? "ml-56" : "ml-16"
                } transition-all duration-300`}
            >
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="pt-24 p-6 bg-1 grid grid-cols-1 gap-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Welcome!
                            </h1>
                            <p className="text-gray-600">
                                Lihat dan kontrol statistik laporan
                            </p>
                        </div>
                        <button className="flex items-center justify-center w-10 h-10">
                            <IoIosNotifications size={32} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-3 gap-4">
                        <div className="col-span-2 row-span-3 p-6 bg-white shadow-md rounded-lg border-t-4 border-l-4 border-blue-600 hover:shadow-lg transition duration-200">
                            <h1 className="text-lg font-semibold text-center text-gray-800 mb-4">
                                Jumlah Pengunjung Setiap Bulan
                            </h1>
                            <div className="flex justify-center h-[300px]">
                                <Line
                                    data={data}
                                    options={options}
                                    ref={chartRef}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>

                        {/* StatCard dengan data dinamis */}
                        <div className="flex pl-11 items-center bg-white shadow-md rounded-lg p-4 border-t-4 border-l-4 border-blue-600 hover:shadow-lg transition duration-200">
                            <div className="flex justify-start items-center w-24">
                                <IoPerson size={68} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center">
                                    <h2 className="w-28 text-xl font-semibold text-gray-800">
                                        Lembaga
                                    </h2>
                                    <p className="text-3xl text-blue-600 font-bold">
                                        {totalLembaga}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-28 text-gray-600">Staff</p>
                                    <p className="text-gray-600 ">
                                        {totalStaff}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-28 text-gray-600">
                                        Peserta
                                    </p>
                                    <p className="text-gray-600 ">
                                        {totalPeserta}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex pl-11 items-center bg-white shadow-md rounded-lg p-4 border-t-4 border-l-4 border-blue-600 hover:shadow-lg transition duration-200">
                            <div className="flex justify-start items-center w-24">
                                <FaBook size={68} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center">
                                    <h2 className="w-28 text-xl font-semibold text-gray-800">
                                        Sesi Ujian
                                    </h2>
                                    <p className="text-3xl text-blue-600 font-bold">
                                        {totalSesiUjian}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-28 text-gray-600">
                                        Paket Soal
                                    </p>
                                    <p className="text-gray-600 ">
                                        {totalPaketSoal}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex pl-11 items-center bg-white shadow-md rounded-lg p-4 border-t-4 border-l-4 border-blue-600 hover:shadow-lg transition duration-200">
                            <div className="flex justify-start items-center w-24">
                                <FaCoins size={68} />
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex items-center">
                                    <h2 className="w-28 text-xl font-semibold text-gray-800">
                                        Poin
                                    </h2>
                                    <p className="text-2xl text-blue-600 font-bold">
                                        {totalPoinTerjual}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-28 text-gray-600">
                                        Terjual
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Rp.
                                        {totalTransaksi.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-l-4 border-blue-600 hover:shadow-lg transition duration-200">
                        <h3 className="text-2xl text-blue-900 font-bold border-b-2 text-center">
                            ACTIVITY LOG
                        </h3>
                        <div className="flex items-center justify-between py-3">
                            <label className="flex items-center gap-2">
                                Show
                                <select
                                    className="p-1 border rounded w-12"
                                    value={entries}
                                    onChange={handleEntriesChange}
                                >
                                    {[5, 10, 15].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                                entries
                            </label>

                            <div className="ml-auto flex  gap-4">
                                {" "}
                                <div className="flex items-center">
                                <input
                        type="text"
                        placeholder="Filter..."
                        value={filter}
                        onChange={handleFilterChange}
                        className="h-8 border rounded-l-lg"
                        />
                                   
                                    <button className="p-2 bg-blue-500 text-white rounded-r-lg">
                                        <FaSearch />
                                    </button>
                                </div>
                                <button className="flex items-center px-4 py-1 bg-blue-500 text-white rounded-lg">
                                    Filter
                                    <FaFilter className="ml-2" />
                                </button>
                            </div>
                        </div>

                        <table className="min-w-full table-auto my-2">
                            <thead>
                                <tr className="border-gray-200 border-y bg-blue-100">
                                    <th className="py-2 px-4 font-semibold text-start">
                                        Lembaga
                                    </th>
                                    <th className="py-2 px-4 font-semibold text-start">
                                        Tanggal
                                    </th>
                                    <th className="py-2 px-4 font-semibold ">
                                        Waktu
                                    </th>
                                    <th className="py-2 px-4 font-semibold ">
                                        Aksi
                                    </th>
                                    <th className="py-2 px-4 font-semibold text-start">
                                        Deskripsi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-b "
                                    >
                                        <td className="py-2 px-4 ">
                                            {log.lembaga}
                                        </td>
                                        <td className="py-2 px-4 ">
                                            {log.date}
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                            {log.time}
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                        <span
  className={`p-1.5 px-3 rounded-lg font-semibold ${
    log.action === "Tambah"
      ? "bg-green-300 text-green-800" // Hijau muda untuk tambah
      : log.action === "Hapus"
      ? "bg-red-300 text-red-800" // Merah muda untuk hapus
      : log.action === "Edit"
      ? "bg-yellow-300 text-yellow-800" // Kuning muda untuk edit
      : log.action === "Log in"
      ? "bg-blue-300 text-blue-800" // Biru muda untuk log in
      : log.action === "Log out"
      ? "bg-gray-300 text-gray-800" // Abu-abu untuk log out
      : "bg-gray-300 text-gray-800" // Default
  }`}
>
  {log.action}
</span>

                                        </td>
                                        <td className="py-2 px-4">
                                            {log.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                            startIndex={startIndex}
                            entries={entries}
                            filtered={filtered}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Page;
