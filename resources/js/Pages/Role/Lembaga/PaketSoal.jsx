import React, { useState, useEffect, useCallback } from "react";
import { usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import "react-tooltip/dist/react-tooltip.css";
import { MdAddCircle } from "react-icons/md";
import { FaEdit, FaFilter, FaTrashAlt, FaEye } from "react-icons/fa";
import Pagination from "@/Components/Layout/Pagination";
import { IoMdAdd } from "react-icons/io";
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function PaketSoal() {
    const { paketsoals = [] } = usePage().props;

    const [filter, setFilter] = useState("");
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredPaketSoals = paketsoals.filter(({ name, materi }) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            name.toLowerCase().includes(lowerCaseFilter) ||
            materi.toLowerCase().includes(lowerCaseFilter)
        );
    });

    const totalPages = Math.ceil(filteredPaketSoals.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedPaketSoals = filteredPaketSoals.slice(
        startIndex,
        startIndex + entries
    );


    const handlePageChange = useCallback(
        (newPage) => {
            if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
        },
        [totalPages]
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Menghapus paket soal akan menghapus semua soal yang telah dibuat.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/lembaga/paketsoal/${id}`);
                Swal.fire("Terhapus!", "Paket soal telah dihapus.", "success");
            }
        });
    };

    return (
        <MainLayout>
            <div className="p-3 px-6 border-b">
                <h1 className="text-2xl font-bold text-blue-900">
                    TABEL PAKET SOAL
                </h1>
            </div>
            <div className="flex justify-between items-center p-3 px-6 border-b">
                <a
                    href="/lembaga/paketsoal/tambah"
                    className="flex items-center px-4 p-2 gap-2 bg-green-500 hover:bg-green-700 text-white rounded"
                >
                    <MdAddCircle /> Tambah
                </a>
            </div>
            <div className="flex justify-between items-center p-3 px-6">
                <label className="flex items-center gap-2">
                    Show
                    <select
                        className="p-1 border rounded w-12"
                        value={entries}
                        onChange={(e) => setEntries(parseInt(e.target.value))}
                    >
                        {[5, 10, 15].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                    entries
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Filter..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="h-8 border rounded px-2"
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
                            <th className="p-2 border">Nama Paket Soal</th>
                            <th className="p-2 border">Materi</th>
                            <th className="p-2 border">Tanggal Dibuat</th>
                            <th className="p-2 border">Oleh</th>
                            <th className="p-2 border">Tambah Soal</th>
                            <th className="p-2 border">Lihat Soal</th>
                            <th className="p-2 border">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPaketSoals.map((paketsoal, index) => (
                            <tr
                                key={paketsoal.id}
                                className="hover:bg-gray-100 text-center"
                            >
                                <td className="p-2 border">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-2 border">{paketsoal.name}</td>
                                <td className="p-2 border">
                                    {paketsoal.materi}
                                </td>
                                <td className="p-2 border">
                                    {new Intl.DateTimeFormat("id-ID", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    }).format(new Date(paketsoal.created_at))}
                                </td>
                                <td className="p-2 border">
                                    {paketsoal.user?.name}
                                </td>
                                <td className="p-2 border">
                                    <div className="flex justify-center gap-x-2">
                                        <a
                                            className="border-2 p-2.5 rounded-xl bg-green-500 text-white hover:bg-green-800"
                                            href={`/lembaga/paketsoal/soal/${paketsoal.id}`}
                                        >
                                            <IoMdAdd />
                                        </a>
                                    </div>
                                </td>
                                <td className="p-2 border flex justify-center">
                                    <a
                                        href={`/lembaga/paketsoal/${paketsoal.id}/show`}
                                        className="border-2 p-2.5 rounded-xl bg-gray-500 text-white hover:bg-gray-800"
                                    >
                                        <FaEye />
                                    </a>
                                </td>

                                <td className="p-2 border">
                                    <div className="flex justify-center gap-x-2">
                                        <a
                                            href={`/lembaga/paketsoal/${paketsoal.id}/edit`}
                                            className="border-2 p-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-800"
                                        >
                                            <FaEdit />
                                        </a>
                                        <button
                                            onClick={() =>
                                                handleDelete(paketsoal.id)
                                            }
                                            className="border-2 p-2.5 rounded-xl bg-red-500 hover:bg-red-800"
                                        >
                                            <FaTrashAlt color="white" />
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
                />
            </div>
        </MainLayout>
    );
}
