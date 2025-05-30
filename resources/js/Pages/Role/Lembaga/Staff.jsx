import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Pagination from "@/Components/Layout/Pagination";
import React, { useState } from "react";
import {
    FaCheckCircle,
    FaEdit,
    FaTrashAlt,
    FaUsers,
    FaBook,
    FaCalendarAlt,
    FaFilter,
} from "react-icons/fa";
import { GiCctvCamera } from "react-icons/gi";
import { MdAddCircle } from "react-icons/md";
import { usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function Page() {
    const { staffs = [] } = usePage().props;
    const [filter, setFilter] = useState("");
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const icons = {
        peserta: { icon: <FaUsers />, label: "PESERTA" },
        paket_soal: { icon: <FaBook />, label: "PSOAL" },
        sesi: { icon: <FaCalendarAlt />, label: "SESI" },
        pengawas: { icon: <GiCctvCamera />, label: "PENGAWAS" },
    };

    const handleDelete = (staffId) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data staff ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/lembaga/staff/${staffId}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Berhasil!",
                            "Data staff telah dihapus.",
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

    const filtered = staffs.filter((s) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            s.nama_staff.toLowerCase().includes(lowerCaseFilter) ||
            s.email.toLowerCase().includes(lowerCaseFilter)
        );
    });

    const totalPages = Math.ceil(filtered.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedStaffs = filtered.slice(startIndex, startIndex + entries);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleStatusUpdate = (staffId, field, currentStatus) => {
        router.patch(
            `/lembaga/staff/${staffId}`,
            { [field]: currentStatus === "aktif" ? "tidak_aktif" : "aktif" },
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Berhasil!",
                        text: "Status staff berhasil diperbarui.",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                },
                onError: () => {
                    Swal.fire({
                        title: "Gagal!",
                        text: "Terjadi kesalahan saat memperbarui status.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                },
            }
        );
    };
    return (
        <MainLayout>
            <div className="p-3 px-6">
                <h1 className="text-2xl font-bold text-blue-900">
                    TABEL STAFF
                </h1>
            </div>
            <div className="flex justify-between items-center p-3 px-6 border-y">
                <a
                    href="/lembaga/staff/tambah"
                    className="flex items-center px-4 p-2 gap-2 bg-green-500 hover:bg-green-700 text-white rounded"
                >
                    <MdAddCircle />
                    Tambah
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
                            <th className="p-2 border text-center">
                                Nama Staff
                            </th>
                            <th className="p-2 border text-center">Email</th>
                            <th className="p-2 border">Kewenangan</th>
                            <th className="p-2 border">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStaffs.map((s, index) => (
                            <tr key={s.id} className="hover:bg-gray-100">
                                <td className="p-2 border text-center">
                                    {index + 1}
                                </td>
                                <td className="p-2 border text-center">
                                    {s.nama_staff}
                                </td>
                                <td className="p-2 border text-center">
                                    {s.email}
                                </td>
                                <td className="p-2 border">
                                    <div className="flex gap-3 justify-center">
                                        {Object.entries(icons).map(
                                            ([key, { icon, label }]) => {
                                                const isSelected =
                                                    s[key] === "aktif";
                                                return (
                                                    <div
                                                        key={key}
                                                        className="relative flex items-center gap-1"
                                                    >
                                                        <button
                                                            className={`p-2 rounded flex items-center justify-center ${
                                                                isSelected
                                                                    ? "bg-green-500 text-white"
                                                                    : "bg-gray-200 text-gray-700"
                                                            }`}
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    s.id,
                                                                    key,
                                                                    isSelected
                                                                        ? "aktif"
                                                                        : "tidak_aktif"
                                                                )
                                                            }
                                                        >
                                                            {icon}
                                                            {isSelected && (
                                                                <FaCheckCircle className="h-4 w-4 absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full" />
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </td>
                                <td className="border">
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            data-tooltip-id="delete-tooltip"
                                            data-tooltip-content="Hapus"
                                            onClick={() => handleDelete(s.id)}
                                            className="border-2 p-2.5 rounded-xl bg-red-500 hover:bg-red-800"
                                        >
                                            <FaTrashAlt color="white" />
                                        </button>
                                    </div>
                                    <Tooltip id="delete-tooltip" />
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
