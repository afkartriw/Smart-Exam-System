import Pagination from "@/Components/Layout/Pagination";
import MainLayout from "@/Components/Lembaga/MainLayout";
import React, { useState } from "react";
import { FaEye, FaFilter } from "react-icons/fa";

export default function Page() {
    const [filter, setFilter] = useState("");
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [soals, setSoals] = useState([
        {
            id: 1,
            name: "UTS Backend",
            kelompok: "TIA 23",
            tertinggi: "100",
            rerata: "70",
            total: "12",
            mengerjakan: "10",
            atas: "5",
            bawah: "7",
        },
        {
            id: 2,
            name: "UAS MTK",
            kelompok: "TID 21",
            tertinggi: "90",
            rerata: "84",
            total: "33",
            mengerjakan: "40",
            atas: "66",
            bawah: "22",
        },
        {
            id: 3,
            name: "Ulangan B. Jawa",
            kelompok: "TIC 24",
            tertinggi: "99",
            rerata: "2 Maret 2025",
            total: "52",
            mengerjakan: "24",
            atas: "22",
            bawah: "2",
        },
        {
            id: 4,
            name: "Ujian Agama",
            kelompok: "TIA 21",
            tertinggi: "55",
            rerata: "2 Maret 2025",
            total: "44",
            mengerjakan: "3",
            atas: "2",
            bawah: "4",
        },
        {
            id: 5,
            name: "UAS Pemrograman",
            kelompok: "TIB 22",
            tertinggi: "77",
            rerata: "2 Maret 2025",
            total: "53",
            mengerjakan: "55",
            atas: "4",
            bawah: "5",
        },
        {
            id: 6,
            name: "UN MTK",
            kelompok: "TIC 24",
            tertinggi: "-",
            rerata: "2 Maret 2025",
            total: "44",
            mengerjakan: "66",
            atas: "4",
            bawah: "56",
        },
    ]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
    };

    const handleEntriesChange = (e) => {
        setEntries(parseInt(e.target.value));
        setCurrentPage(1); // Reset ke halaman pertama saat jumlah entri berubah
    };

    const filteredSoals = soals.filter((sesi) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            sesi.name.toLowerCase().includes(lowerCaseFilter) ||
            sesi.kelompok.toLowerCase().includes(lowerCaseFilter)
        );
    });

    const totalPages = Math.ceil(filteredSoals.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedSoals = filteredSoals.slice(
        startIndex,
        startIndex + entries
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <MainLayout>
            <div className="p-3 px-6 border-b">
                <h1 className="text-2xl font-bold text-blue-900">LAPORAN</h1>
            </div>
            <div className="flex justify-between items-center p-3 px-6">
                <div>
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
                </div>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Filter..."
                        value={filter}
                        onChange={handleFilterChange}
                        className="h-8 border rounded"
                    />
                    <button className="ml-2 p-2 bg-blue-500 text-white rounded">
                        <FaFilter />
                    </button>
                </div>
            </div>
            <div className="px-6 pb-3">
                <table className="w-full border rounded">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="p-2 border" rowSpan="2">
                                No.
                            </th>
                            <th className="p-2 border" rowSpan="2">
                                Nama Sesi
                            </th>
                            <th className="p-2 border" rowSpan="2">
                                Kelompok
                            </th>
                            <th className="p-2 border" rowSpan="2">
                                Tertinggi
                            </th>
                            <th className="p-2 border" rowSpan="2">
                                Rerata
                            </th>
                            <th className="p-2 border" colSpan="4">
                                Peserta
                            </th>
                            <th className="p-2 border" rowSpan="2">
                                Aksi
                            </th>
                        </tr>
                        <tr className="bg-blue-400 text-white">
                            <th className="p-2 border">Total</th>
                            <th className="p-2 border">Mengerjakan</th>
                            <th className="p-2 border">Atas KKM</th>
                            <th className="p-2 border">Bawah KKM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSoals.map((sesi, index) => (
                            <tr
                                key={sesi.id}
                                className="hover:bg-gray-100 text-center"
                            >
                                <td className="p-2 border">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-2 border">{sesi.name}</td>
                                <td className="p-2 border">{sesi.kelompok}</td>
                                <td className="p-2 border">{sesi.tertinggi}</td>
                                <td className="p-2 border">{sesi.rerata}</td>
                                <td className="p-2 border">{sesi.total}</td>
                                <td className="p-2 border">
                                    {sesi.mengerjakan}
                                </td>
                                <td className="p-2 border">{sesi.atas}</td>
                                <td className="p-2 border">{sesi.bawah}</td>
                                <td className="p-2 border">
                                    <button className="flex mx-auto gap-2 text-blue-500">
                                        <FaEye />
                                    </button>
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
                    filtered={filteredSoals}
                />
            </div>
        </MainLayout>
    );
}
