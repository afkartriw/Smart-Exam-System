import Pagination from "@/Components/Layout/Pagination";
import Navbar from "@/Components/admin/Navbar";
import Sidebar from "@/Components/staff/Sidebar";
import { FaFilter, FaFileExport, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { usePage, router } from "@inertiajs/react";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
    const { pesertas } = usePage().props; // Mengambil data peserta dari props Inertia
    const [filter, setFilter] = useState("");
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleEntriesChange = (e) => {
        setEntries(parseInt(e.target.value));
        setCurrentPage(1); // Reset ke halaman pertama saat jumlah entri berubah
    };

    const filtered = pesertas.filter((participant) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            participant.nama_peserta.toLowerCase().includes(lowerCaseFilter) ||
            participant.no_peserta.toLowerCase().includes(lowerCaseFilter) ||
            participant.kelompok.toLowerCase().includes(lowerCaseFilter) ||
            participant.email.toLowerCase().includes(lowerCaseFilter)
        );
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const totalPages = Math.ceil(filtered.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedParticipants = filtered.slice(
        startIndex,
        startIndex + entries
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Peserta ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Iya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/staff/peserta/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Peserta telah dihapus.",
                            "success"
                        );
                    },
                });
            }
        });
    };

    const handleDeleteAll = () => {
        Swal.fire({
            title: "Hapus Semua Peserta?",
            text: "Semua data peserta akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Iya, hapus semua!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/staff/peserta`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Semua peserta telah dihapus.",
                            "success"
                        );
                    },
                });
            }
        });
    };

    return (
        <div className="relative flex min-h-screen">
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
                <main className="pt-20 p-6 bg-color-accent min-h-screen h-full bg-gray-200">
                    <div className="bg-white rounded-2xl my-4">
                        <div className="p-3 px-6">
                            <h1 className="text-2xl font-bold text-blue-900">
                                TABEL PESERTA
                            </h1>
                        </div>
                        <div className="flex justify-between items-center p-3 px-6 border-y">
                            <div className="flex gap-4">
                                <a
                                    href="/staff/peserta/tambah"
                                    className="flex items-center px-4 p-2 gap-2 bg-green-500 hover:bg-green-700 text-white rounded"
                                >
                                    <MdAddCircle /> Tambah
                                </a>
                                <a
                                    href="/staff/peserta/import"
                                    className="flex items-center px-4 p-2 gap-2 bg-green-500 text-white hover:bg-green-700 rounded"
                                >
                                    <FaFileExport /> Import Exel
                                </a>
                                <button
                                    onClick={handleDeleteAll}
                                    className="flex items-center px-4 p-2 gap-2 bg-red-500 hover:bg-red-700 text-white rounded"
                                >
                                    <FaTrashAlt /> Hapus Semua
                                </button>
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
                            <table className="w-full bg-white border rounded">
                                <thead>
                                    <tr className="bg-blue-500 text-white">
                                        <th className="p-2 border">No</th>
                                        <th className="p-2 border">
                                            Nama Peserta
                                        </th>
                                        <th className="p-2 border">
                                            No Peserta
                                        </th>
                                        <th className="p-2 border">Kelompok</th>
                                        <th className="p-2 border">Email</th>
                                        <th className="p-2 border w-32">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedParticipants.map(
                                        (participant, index) => (
                                            <tr
                                                key={participant.id}
                                                className="hover:bg-gray-100 text-center"
                                            >
                                                <td className="p-2 border">
                                                    {index + 1}
                                                </td>
                                                <td className="p-2 border">
                                                    {participant.nama_peserta}
                                                </td>
                                                <td className="p-2 border">
                                                    {participant.no_peserta}
                                                </td>
                                                <td className="p-2 border">
                                                    {participant.kelompok}
                                                </td>
                                                <td className="p-2 border">
                                                    {participant.email}
                                                </td>
                                                <td className="p-2 border">
                                                    <div className="flex justify-center gap-x-2">
                                                        <a
                                                            href={`/staff/peserta/${participant.id}/edit`}
                                                            className="border-2 p-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-800"
                                                        >
                                                            <FaEdit />
                                                        </a>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    participant.id
                                                                )
                                                            }
                                                            className="border-2 p-2.5 rounded-xl bg-red-500 hover:bg-red-800"
                                                        >
                                                            <FaTrashAlt color="white" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
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
                    </div>
                </main>
            </div>
        </div>
    );
}
