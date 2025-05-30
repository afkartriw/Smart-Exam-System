import Pagination from "@/Components/Layout/Pagination";
import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { FaPencilAlt, FaFilter, FaTrashAlt, FaEye } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import Swal from "sweetalert2";
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function Page() {
    const [filter, setFilter] = useState("");
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { fiturs = [] } = usePage().props;

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleEntriesChange = (e) => {
        setEntries(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const filtered = fiturs.filter((fitur) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            fitur.nama_fitur.toLowerCase().includes(lowerCaseFilter) ||
            fitur.deskripsi.toLowerCase().includes(lowerCaseFilter) ||
            fitur.gambar.toLowerCase().includes(lowerCaseFilter)
        );
    });

 

    const totalPages = Math.ceil(filtered.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedFiturs = filtered.slice(startIndex, startIndex + entries);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = (fiturId) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data fitur ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/fitur/${fiturId}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Berhasil!",
                            "Data fitur telah dihapus.",
                            "success"
                        );
                    },
                    onError: () => {
                        Swal.fire(
                            "Gagal!",
                            "Terjadi kesalahan saat menghapus data.",
                            "error"
                        );
                    },
                });
            }
        });
    };

    return (
        <MainLayout>
            <div className="p-3 px-6">
                <h1 className="text-2xl font-bold text-blue-900">
                    TABEL FITUR
                </h1>
            </div>
            <div className="flex justify-between items-center p-3 px-6 border-y">
                <div className="flex gap-4">
                    <a
                        href="/admin/fitur/tambah"
                        className="flex items-center px-4 p-2 gap-2 bg-green-500 hover:bg-green-700 text-white rounded"
                    >
                        <MdAddCircle />
                        Tambah
                    </a>
                </div>
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
                            <th className="p-2 border">No.</th>
                            <th className="p-2 border">Fitur</th>
                            <th className="p-2 border">Deskripsi</th>
                            <th className="p-2 border w-40">Gambar</th>
                            <th className="p-2 border w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedFiturs.map((fitur, index) => (
                            <tr
                                key={fitur.id}
                                className="hover:bg-gray-100 text-center"
                            >
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">
                                    {fitur.nama_fitur}
                                </td>
                                <td className="p-2 border text-start">
                                    {fitur.deskripsi}
                                </td>
                                <td className="p-2 border">
                                    {fitur.gambar
                                        ? fitur.gambar
                                              .split("/")
                                              .pop()
                                              .split("_")
                                              .slice(1)
                                              .join("_")
                                        : "No Image"}
                                </td>
                                <td className="p-2 border">
                                    <div className="flex justify-center gap-x-2">
                                        <a
                                            href={`/admin/fitur/${fitur.id}/detail`}
                                            className="border-2 p-2 rounded-xl flex items-center justify-center bg-gray-600 hover:bg-gray-800"
                                        >
                                            <button className="text-white w-6 h-6 flex items-center justify-center">
                                                <FaEye size={20} />
                                            </button>
                                        </a>
                                        <a
                                            href={`/admin/fitur/${fitur.id}/edit`}
                                            className="border-2 p-2 rounded-xl flex items-center justify-center bg-blue-500 hover:bg-blue-800"
                                        >
                                            <button className="text-white w-6 h-6 flex items-center justify-center">
                                                <FaPencilAlt size={20} />
                                            </button>
                                        </a>
                                        <button
                                            onClick={() =>
                                                handleDelete(fitur.id)
                                            }
                                            className="border-2 p-2 rounded-xl flex items-center justify-center bg-red-500 hover:bg-red-800"
                                        >
                                            <button className="text-white w-6 h-6 flex items-center justify-center">
                                                <FaTrashAlt />
                                            </button>
                                        </button>
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
                    startIndex={startIndex}
                    entries={entries}
                    filtered={filtered}
                />
            </div>
        </MainLayout>
    );
}
