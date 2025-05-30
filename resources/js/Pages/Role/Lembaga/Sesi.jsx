import Pagination from "@/Components/Layout/Pagination";
import React, { useState } from "react";
import { FaEdit, FaEye, FaFilter, FaTrashAlt } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function Page() {
    const { sesi_ujians } = usePage().props; // Data sesi ujian dari Inertia

    const [filter, setFilter] = useState("");
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const formatWaktu = (waktuMulai, waktuPengerjaan) => {
        if (!waktuMulai || !waktuPengerjaan) return "-";

        // Konversi waktu mulai ke jam dan menit
        const [jam, menit] = waktuMulai.split(":").map(Number);
        const waktuMulaiDate = new Date();
        waktuMulaiDate.setHours(jam, menit, 0);

        // Tambahkan waktu pengerjaan dalam menit
        waktuMulaiDate.setMinutes(
            waktuMulaiDate.getMinutes() + waktuPengerjaan
        );

        // Format waktu selesai
        const jamSelesai = waktuMulaiDate
            .getHours()
            .toString()
            .padStart(2, "0");
        const menitSelesai = waktuMulaiDate
            .getMinutes()
            .toString()
            .padStart(2, "0");

        // Format waktu agar selalu tampil dua digit (07.00, 08.30, dst.)
        const waktuMulaiFormatted = `${jam.toString().padStart(2, "0")}.${menit
            .toString()
            .padStart(2, "0")}`;
        const waktuSelesaiFormatted = `${jamSelesai}.${menitSelesai}`;

        return `${waktuMulaiFormatted} - ${waktuSelesaiFormatted}`;
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Sesi Ujian ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Iya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/lembaga/sesi/${id}`, {
                    onSuccess: () => {
                        Swal.fire("Dihapus!", "Sesi telah dihapus.", "success");
                    },
                });
            }
        });
    };
    const formatTanggal = (tanggal) => {
        if (!tanggal) return "-";

        const bulanIndo = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];

        const [tahun, bulan, hari] = tanggal.split("-").map(Number);
        return `${hari} ${bulanIndo[bulan - 1]} ${tahun}`;
    };

    // Filter data berdasarkan input pengguna
    const filteredSesi = sesi_ujians.filter((sesi) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            sesi.nama_sesi_ujian.toLowerCase().includes(lowerCaseFilter) ||
            sesi.paket_soal?.name.toLowerCase().includes(lowerCaseFilter) ||
            sesi.kelas_kelompok.toLowerCase().includes(lowerCaseFilter)
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredSesi.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedSesi = filteredSesi.slice(startIndex, startIndex + entries);

    return (
        <MainLayout>
            <div className="p-3 px-6">
                <h1 className="text-2xl font-bold text-blue-900">TABEL SESI</h1>
            </div>
            <div className="flex justify-between items-center p-3 px-6 border-y">
                <a
                    href="/lembaga/sesi/tambah"
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
                            <th className="p-2 border">Nama Sesi</th>
                            <th className="p-2 border">Paket Soal</th>
                            <th className="p-2 border">Kelompok</th>
                            <th className="p-2 border">Waktu</th>
                            <th className="p-2 border">Tanggal</th>
                            <th className="p-2 border">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSesi.map((sesi, index) => (
                            <tr
                                key={sesi.id}
                                className="hover:bg-gray-100 text-center"
                            >
                                <td className="p-2 border">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-2 border">
                                    {sesi.nama_sesi_ujian}
                                </td>
                                <td className="p-2 border">
                                    {sesi.paket_soal?.name || "-"}
                                </td>
                                <td className="p-2 border">
                                    {sesi.kelas_kelompok}
                                </td>
                                <td className="p-2 border">
                                    {formatWaktu(
                                        sesi.waktu_mulai,
                                        sesi.waktu_pengerjaan
                                    )}
                                </td>

                                <td className="p-2 border">
                                    {formatTanggal(sesi.tanggal_pelaksanaan)}
                                </td>
                                <td className="p-2 border">
                                    <div className="flex justify-center gap-2">
                                        <a
                                            href={`/lembaga/sesi/${sesi.id}/edit`}
                                            className="border-2 p-2.5 rounded-xl text-white bg-blue-500 hover:bg-blue-800"
                                        >
                                            <FaEdit />
                                        </a>
                                        <a
                                            href={`/lembaga/sesi/${sesi.id}/show`}
                                            className="border-2 p-2.5 rounded-xl text-white bg-gray-500 hover:bg-gray-800"
                                        >
                                            <FaEye />
                                        </a>
                                        <button
                                            onClick={() =>
                                                handleDelete(sesi.id)
                                            }
                                            className="border-2 p-2.5 rounded-xl text-white bg-red-500 hover:bg-red-800"
                                        >
                                            <FaTrashAlt />
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
                    handlePageChange={setCurrentPage}
                />
            </div>
        </MainLayout>
    );
}
