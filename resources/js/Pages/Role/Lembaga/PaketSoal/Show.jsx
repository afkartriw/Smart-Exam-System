import React, { useCallback, useState } from "react";
import Navbar from "@/Components/Admin/Navbar";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaArrowLeft } from "react-icons/fa";

export default function LihatSoal() {
    const { soal = [], paket_soal_id } = usePage().props;
    const [selectedMedia, setSelectedMedia] = useState(null);
    const paketSoalId =
        paket_soal_id || window.location.pathname.split("/").slice(-2, -1)[0];

    const toggleSidebar = useCallback(
        () => setIsSidebarOpen((prev) => !prev),
        []
    );

    const handleDelete = (paketSoalId, soalId) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Soal yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(
                    route("soal.destroy", {
                        paketSoal: paketSoalId,
                        soal: soalId,
                    }),
                    {
                        onSuccess: () =>
                            Swal.fire(
                                "Terhapus!",
                                "Soal berhasil dihapus.",
                                "success"
                            ),
                        onError: (errors) =>
                            Swal.fire(
                                "Gagal!",
                                errors.message || "Terjadi kesalahan.",
                                "error"
                            ),
                    }
                );
            }
        });
    };

    const closeMedia = () => setSelectedMedia(null);

    const getMediaType = (url) => {
        if (!url) return null;
        const extension = url.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
        if (["mp3", "wav", "ogg"].includes(extension)) return "audio";
        if (["mp4", "webm", "ogg"].includes(extension)) return "video";
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="pt-24 p-6 bg-1 ">
                <div className="bg-white rounded-2xl relative">
                    <div className="py-3 px-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-900 text-center w-full">
                            DAFTAR SOAL
                        </h1>
                    </div>

                    {/* Tabel Soal */}
                    <div className="py-4 border-y px-6">
                        <table className="w-full border rounded">
                            <thead>
                                <tr className="bg-blue-500 text-white">
                                    <th className="p-2 border">No.</th>
                                    <th className="p-2 border">Pertanyaan</th>
                                    <th className="p-2 border">Tipe</th>
                                    <th className="p-2 border w-36">
                                        Metode Koreksi
                                    </th>
                                    <th className="p-2 border">Media</th>
                                    <th className="p-2 border">Jawaban</th>
                                    <th className="p-2 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {soal.length > 0 ? (
                                    soal.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-100 text-center"
                                        >
                                            <td className="p-2 border">
                                                {index + 1}
                                            </td>
                                            <td className="p-2 border">
                                                {item.pertanyaan.trim()}
                                            </td>
                                            <td className="p-2 border">
                                                {item.tipe.trim()}
                                            </td>
                                            <td className="p-2 border">
                                                {item.metode_koreksi?.trim() ||
                                                    "-"}
                                            </td>
                                            <td className="p-2 border">
                                                {item.media_url ? (
                                                    <button
                                                        onClick={() =>
                                                            setSelectedMedia(
                                                                item.media_url
                                                            )
                                                        }
                                                        className="text-blue-500 underline"
                                                    >
                                                        Lihat Media
                                                    </button>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="p-2 border text-left">
                                                <form>
                                                    {item.jawabans?.map(
                                                        (jawaban) => (
                                                            <label
                                                                key={jawaban.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    name={`soal_${item.id}[]`}
                                                                    value={
                                                                        jawaban.id
                                                                    }
                                                                    checked={
                                                                        jawaban.benar
                                                                    }
                                                                    readOnly
                                                                />
                                                                <span>
                                                                    {jawaban.jawaban.trim()}
                                                                </span>
                                                            </label>
                                                        )
                                                    )}
                                                </form>
                                            </td>
                                            <td className="p-2 border">
                                                <div className="flex justify-center gap-x-2">
                                                    <button
                                                        onClick={() =>
                                                            router.visit(
                                                                `/lembaga/paketsoal/${paketSoalId}/soal/${item.id}/edit`
                                                            )
                                                        }
                                                        className="border-2 p-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-800"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                paketSoalId,
                                                                item.id
                                                            )
                                                        }
                                                        className="border-2 p-2.5 rounded-xl bg-red-500 text-white hover:bg-red-800"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="p-4 text-center text-gray-500"
                                        >
                                            Tidak ada soal yang tersedia
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Tombol Kembali */}
                    <div className="py-4 px-6">
                        <a
                            href="/lembaga/paketsoal"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded shadow-md"
                        >
                            <FaArrowLeft /> Kembali
                        </a>
                    </div>
                </div>
            </main>

            {/* Modal untuk menampilkan media */}
            {selectedMedia && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative bg-white p-4 rounded-lg shadow-lg">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            onClick={closeMedia}
                        >
                            ✖
                        </button>
                        {getMediaType(selectedMedia) === "image" && (
                            <img
                                src={selectedMedia}
                                alt="Media"
                                className="max-w-full max-h-screen"
                            />
                        )}
                        {getMediaType(selectedMedia) === "audio" && (
                            <audio controls>
                                <source src={selectedMedia} type="audio/mp3" />
                                Your browser does not support the audio tag.
                            </audio>
                        )}
                        {getMediaType(selectedMedia) === "video" && (
                            <video controls className="max-w-full max-h-screen">
                                <source src={selectedMedia} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
