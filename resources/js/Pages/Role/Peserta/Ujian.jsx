import { usePage } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Navbar from "@/Components/Admin/Navbar";
import { router } from "@inertiajs/react";

// ... (debounce function tetap sama)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default function Ujian() {
    const { auth, paketSoal, soals, sesiUjianId, currentSoal, jawabanPeserta } =
        usePage().props;

    // Inisialisasi selectedJawaban dari jawabanPeserta yang sudah ada
    const initialSelectedJawaban = {};
    jawabanPeserta?.forEach((jp) => {
        initialSelectedJawaban[jp.soal_id] = jp.jawaban_id || jp.jawaban_teks;
    });

    const [soalIndex, setSoalIndex] = useState(
        currentSoal ? soals.findIndex((s) => s.id === currentSoal.id) : 0
    );
    const [selectedJawaban, setSelectedJawaban] = useState(
        initialSelectedJawaban
    );
    const [timeLeft, setTimeLeft] = useState(2237);

    const soalSekarang = soals[soalIndex];

    useEffect(() => {
        if (currentSoal) {
            const newIndex = soals.findIndex((s) => s.id === currentSoal.id);
            if (newIndex !== -1) {
                setSoalIndex(newIndex);
            }
        }
    }, [currentSoal?.id]);

    const handlePilihJawaban = (soalId, jawabanId) => {
        setSelectedJawaban((prev) => ({
            ...prev,
            [soalId]: jawabanId,
        }));

        // Langsung simpan jawaban pilihan ganda
        const userId = auth.user.id;
        router.post(
            "/jawaban-peserta",
            {
                sesi_ujian_id: sesiUjianId,
                soal_id: soalId,
                user_id: userId,
                jawaban_id: jawabanId,
                jawaban_teks: null,
            },
            {
                preserveScroll: true,
                onError: () => {
                    Swal.fire("Error", "Gagal menyimpan jawaban", "error");
                },
            }
        );
    };

    const handleJawabanTeks = useCallback(
        debounce((soalId, teks) => {
            const userId = auth.user.id;
            router.post(
                "/jawaban-peserta",
                {
                    sesi_ujian_id: sesiUjianId,
                    soal_id: soalId,
                    user_id: userId,
                    jawaban_id: null,
                    jawaban_teks: teks,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        // No need to update state here
                    },
                    onError: () => {
                        Swal.fire("Error", "Gagal menyimpan jawaban", "error");
                    },
                }
            );
        }, 500),
        [auth.user.id, sesiUjianId]
    );


    const handleSaveAnswer = (soalId) => {
        const jawaban = selectedJawaban[soalId];
        if (jawaban === undefined) return;

        const soal = soals.find((s) => s.id === soalId);
        if (!soal) return;

        const isPilihanGanda =
            soal.tipe === "pilihan_ganda" || soal.tipe === "true_false";

        router.post(
            "/jawaban-peserta",
            {
                sesi_ujian_id: sesiUjianId,
                soal_id: soalId,
                user_id: auth.user.id,
                jawaban_id: isPilihanGanda ? jawaban : null,
                jawaban_teks: isPilihanGanda ? null : jawaban,
            },
            {
                preserveScroll: true,
                onError: () => {
                    Swal.fire("Error", "Gagal menyimpan jawaban", "error");
                },
            }
        );
    };

    // Fungsi untuk mendapatkan soal berikutnya berdasarkan ID di database
    const getNextSoalId = () => {
        if (soalIndex < soals.length - 1) {
            return soals[soalIndex + 1].id;
        }
        return null;
    };

    // Fungsi untuk mendapatkan soal sebelumnya berdasarkan ID di database
    const getPrevSoalId = () => {
        if (soalIndex > 0) {
            return soals[soalIndex - 1].id;
        }
        return null;
    };

    const handleSelanjutnya = () => {
        const nextSoalId = getNextSoalId();
        if (nextSoalId) {
            handleSaveAnswer(soalSekarang.id);
            router.get(
                `/peserta/sesi/${sesiUjianId}/ujian/${paketSoal.id}/soal/${nextSoalId}`
            );
        }
    };

    const handleSebelumnya = () => {
        const prevSoalId = getPrevSoalId();
        if (prevSoalId) {
            handleSaveAnswer(soalSekarang.id);
            router.get(
                `/peserta/sesi/${sesiUjianId}/ujian/${paketSoal.id}/soal/${prevSoalId}`
            );
        }
    };

    const handleLompatKeSoal = (index) => {
        if (index >= 0 && index < soals.length) {
            const targetSoalId = soals[index].id;
            router.get(
                `/peserta/sesi/${sesiUjianId}/ujian/${paketSoal.id}/soal/${targetSoalId}`
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-full mx-auto p-6 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Sidebar Navigasi Soal */}
                    <div className="bg-white rounded shadow p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Navigasi Soal</h3>
                            <div className="text-lg font-bold text-blue-600">
                                waktu
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {soals.map((soal, index) => (
                                <button
                                    key={soal.id}
                                    onClick={() => handleLompatKeSoal(index)}
                                    className={`w-10 h-10 rounded flex items-center justify-center ${
                                        soalIndex === index
                                            ? "bg-blue-500 text-white"
                                            : selectedJawaban[soal.id]
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                        >
                            Selesaikan Ujian
                        </button>
                    </div>

                    {/* Konten Soal */}
                    <div className="col-span-3 bg-white rounded shadow p-4">
                        {soalSekarang && (
                            <>
                                <h3 className="text-lg font-semibold mb-2">
                                    Soal No #{soalIndex + 1}
                                </h3>
                                <p className="mb-4 whitespace-pre-line">
                                    {soalSekarang.pertanyaan}
                                </p>

                                <div className="space-y-4">
                                    {(soalSekarang.tipe === "pilihan_ganda" ||
                                        soalSekarang.tipe === "true_false") &&
                                        soalSekarang.jawabans?.map(
                                            (jawaban, index) => (
                                                <label
                                                    key={jawaban.id}
                                                    className={`block p-4 border rounded cursor-pointer hover:bg-gray-100 ${
                                                        selectedJawaban[
                                                            soalSekarang.id
                                                        ] === jawaban.id
                                                            ? "bg-blue-100 border-blue-500"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`soal-${soalSekarang.id}`}
                                                        className="mr-2"
                                                        value={jawaban.id}
                                                        checked={
                                                            selectedJawaban[
                                                                soalSekarang.id
                                                            ] === jawaban.id
                                                        }
                                                        onChange={() =>
                                                            handlePilihJawaban(
                                                                soalSekarang.id,
                                                                jawaban.id
                                                            )
                                                        }
                                                    />
                                                    {String.fromCharCode(
                                                        65 + index
                                                    )}
                                                    . {jawaban.jawaban}
                                                </label>
                                            )
                                        )}

                                    {soalSekarang.tipe === "isian" && (
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={
                                                selectedJawaban[
                                                    soalSekarang.id
                                                ] || ""
                                            }
                                            onChange={(e) => {
                                                setSelectedJawaban((prev) => ({
                                                    ...prev,
                                                    [soalSekarang.id]:
                                                        e.target.value,
                                                }));
                                                handleJawabanTeks(
                                                    soalSekarang.id,
                                                    e.target.value
                                                );
                                            }}
                                            placeholder="Masukkan jawaban"
                                        />
                                    )}

                                    {soalSekarang.tipe === "esai" && (
                                        <textarea
                                            className="w-full p-2 border rounded"
                                            rows="4"
                                            value={
                                                selectedJawaban[
                                                    soalSekarang.id
                                                ] || ""
                                            }
                                            onChange={(e) => {
                                                setSelectedJawaban((prev) => ({
                                                    ...prev,
                                                    [soalSekarang.id]:
                                                        e.target.value,
                                                }));
                                                handleJawabanTeks(
                                                    soalSekarang.id,
                                                    e.target.value
                                                );
                                            }}
                                            placeholder="Tuliskan jawaban esai Anda"
                                        />
                                    )}
                                </div>

                                <div className="flex justify-between mt-6">
                                    <button
                                        onClick={handleSebelumnya}
                                        disabled={soalIndex === 0}
                                        className={`px-4 py-2 rounded ${
                                            soalIndex === 0
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                    >
                                        Sebelumnya
                                    </button>
                                    <button
                                        onClick={handleSelanjutnya}
                                        disabled={
                                            soalIndex === soals.length - 1
                                        }
                                        className={`px-4 py-2 rounded ${
                                            soalIndex === soals.length - 1
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
