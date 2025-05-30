import React, { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { IoIosNotifications } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { FaBook, FaCoins, FaFilter, FaSearch } from "react-icons/fa";
import Sidebar from "@/Components/staff/Sidebar";
import Navbar from "@/Components/admin/Navbar";
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

const StatCard = ({ icon: Icon, value, label, subValue, subLabel }) => (
    <div className="flex pl-11 items-center bg-white shadow-md rounded-lg p-4 border-t-4 border-l-4 border-blue-600 hover:shadow-lg transition duration-200">
        <div className="flex justify-start items-center w-24">
            <Icon size={68} />
        </div>
        <div className="flex flex-col justify-center">
            <div className="flex items-center">
                <p className="w-16 text-3xl text-blue-600 font-bold">{value}</p>
                <h2 className="text-xl font-semibold text-gray-800">{label}</h2>
            </div>
            <div className="flex items-center">
                <p className="text-gray-600 w-16">{subValue}</p>
                <p className="text-gray-600">{subLabel}</p>
            </div>
        </div>
    </div>
);

const Page = () => {
    const chartRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
                <main className="pt-24 p-6 bg-gray-200 grid grid-cols-1 gap-6">
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

                        <StatCard
                            icon={IoPerson}
                            value="20"
                            label="Staff"
                            subValue="900"
                            subLabel="Peserta"
                        />
                        <StatCard
                            icon={FaBook}
                            value="10"
                            label="Sesi Ujian"
                            subValue="40"
                            subLabel="Paket Soal"
                        />
                        <StatCard
                            icon={FaCoins}
                            value="200"
                            label="Poin"
                            subValue="3"
                            subLabel="Transaksi"
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-l-4 border-blue-600 hover:shadow-lg transition duration-200">
                        <h3 className="text-2xl text-blue-900 font-bold border-b-2 text-center">
                            ACTIVITY LOG
                        </h3>
                        <div className="flex justify-end items-center my-2">
                            <div className="flex items-center justify-between">
                                <input
                                    type="text"
                                    placeholder="Carii..."
                                    className="h-8 border rounded-l-lg"
                                />
                                <button className="p-2 bg-blue-500 text-white rounded-r-lg">
                                    <FaSearch />
                                </button>
                                <button className="flex items-center ml-4 px-4 py-1 bg-blue-500 text-white rounded-lg">
                                    Filter
                                    <FaFilter className="ml-2"/>
                                </button>
                            </div>
                        </div>
                        <table className="min-w-full table-auto my-2">
                            <thead>
                                <tr className="border-gray-200 border-y bg-blue-100">
                                    <th className="py-2 px-4 text-left font-semibold">
                                        ID
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Username
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Tanggal
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Waktu
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Aksi
                                    </th>
                                    <th className="py-2 px-4 text-left font-semibold">
                                        Deskripsi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        id: 4,
                                        name: "Iqbal Farhan Rasyid",
                                        date: "December 22, 2024",
                                        time: "08.00",
                                        action: "Tambah",
                                        description:
                                            "Tambah paket soal dengan ID 12",
                                    },
                                    {
                                        id: 5,
                                        name: "Shafath M",
                                        date: "December 23, 2024",
                                        time: "09.30",
                                        action: "Edit",
                                        description:
                                            "Update paket soal dengan ID 15",
                                    },
                                    {
                                        id: 6,
                                        name: "Alya Pratama",
                                        date: "December 24, 2024",
                                        time: "14.00",
                                        action: "Hapus",
                                        description:
                                            "Hapus paket soal dengan ID 18",
                                    },
                                    {
                                        id: 7,
                                        name: "Rika Pramesti",
                                        date: "December 25, 2024",
                                        time: "16.00",
                                        action: "Edit",
                                        description:
                                            "Edit paket soal dengan ID 20",
                                    },
                                    {
                                        id: 8,
                                        name: "Rika Pramesti",
                                        date: "December 25, 2024",
                                        time: "16.00",
                                        action: "Hapus",
                                        description:
                                            "Edit paket soal dengan ID 20",
                                    },
                                ].map((log) => (
                                    <tr key={log.id} className="border-b">
                                        <td className="py-2 px-4">{log.id}</td>
                                        <td className="py-2 px-4">
                                            {log.name}
                                        </td>
                                        <td className="py-2 px-4">
                                            {log.date}
                                        </td>
                                        <td className="py-2 px-4">
                                            {log.time}
                                        </td>
                                        <td className="py-2 px-4">
                                            <span
                                                className={`p-1.5 px-3 rounded-lg font-semibold ${
                                                    log.action === "Tambah"
                                                        ? "bg-green-400 text-green-700"
                                                        : log.action === "Hapus"
                                                        ? "bg-red-400 text-red-700"
                                                        : log.action === "Edit"
                                                        ? "bg-blue-400 text-blue-700"
                                                        : ""
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
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Page;
