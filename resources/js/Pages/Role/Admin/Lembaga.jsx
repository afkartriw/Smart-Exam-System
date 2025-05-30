import Pagination from "@/Components/Layout/Pagination";
import React, { useState } from "react";
import { FaEye, FaFilter } from "react-icons/fa";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function Page() {
    const [filter, setFilter] = useState("");
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { lembagas = [], isLoading, error } = usePage().props;

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleEntriesChange = (e) => {
        setEntries(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const filteredLembagas = lembagas.filter((lembaga) => {
        const lowerCaseFilter = filter.toLowerCase();
        const fieldsToFilter = ["name", "pj", "jenis", "kabupaten"];
        return fieldsToFilter.some((field) =>
            lembaga[field]?.toLowerCase().includes(lowerCaseFilter)
        );
    });

    const totalPages = Math.ceil(filteredLembagas.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedLembagas = filteredLembagas.slice(
        startIndex,
        startIndex + entries
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <MainLayout>
            <div className="p-3 px-6 border-b">
                <h1 className="text-2xl font-bold text-blue-900">LEMBAGA</h1>
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
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Nama Lembaga</th>
                            <th className="p-2 border">Nama Lengkap</th>
                            <th className="p-2 border">Kabupaten</th>
                            <th className="p-2 border">Jenis</th>
                            <th className="p-2 border">Poin</th>{" "}
                            {/* Tambahkan kolom Poin */}
                            <th className="p-2 border">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lembagas.map((lembaga, index) => (
                            <tr
                                key={lembaga.id}
                                className="hover:bg-gray-100 text-center"
                            >
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">
                                    {lembaga.nama_lembaga}
                                </td>
                                <td className="p-2 border">
                                    {lembaga.nama_lengkap}
                                </td>
                                <td className="p-2 border">
                                    {lembaga.kabupaten}
                                </td>
                                <td className="p-2 border">{lembaga.jenis}</td>
                                <td className="p-2 border">
                                    {lembaga.poin}
                                </td>{" "}
                                {/* Tampilkan jumlah poin */}
                                <td className="p-2 border">
                                    <div className="flex justify-center gap-x-4">
                                        <a
                                            href={`/admin/lembaga/detail/${lembaga.id}`}
                                            className="border-2 p-2 rounded-xl bg-gray-600 hover:bg-gray-800"
                                        >
                                            <FaEye
                                                size={20}
                                                className="text-white"
                                            />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        </MainLayout>
    );
}
