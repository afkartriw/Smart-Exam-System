import React, { useState, useEffect } from "react";
import Navbar from "@/Components/Admin/Navbar";
import { usePage } from "@inertiajs/react";

const Detail = () => {
    const { sesiUjian } = usePage().props;
    // Use the remaining_time from backend instead of hardcoded value
    const [timeLeft, setTimeLeft] = useState(sesiUjian?.remaining_time || 0);
    const [examStarted, setExamStarted] = useState(true);
    const [examEnded, setExamEnded] = useState(false);

    useEffect(() => {
        // Check if exam has ended
        if (timeLeft <= 0) {
            setExamEnded(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setExamEnded(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        
        if (hours > 0) {
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    // Safe navigation with optional chaining
    const paketSoalName = sesiUjian?.paket_soal?.name || "Paket Soal";
    const namaSesi = sesiUjian?.nama_sesi_ujian || "Sesi Ujian";
    const kelasKelompok = sesiUjian?.kelas_kelompok || "-";
    const waktuPengerjaan = sesiUjian?.waktu_pengerjaan || 0;
    const jumlahSoal = sesiUjian?.paket_soal?.soals_count || 0;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-4 pt-28">
                <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-center text-lg font-semibold text-gray-700">
                        {paketSoalName}
                    </h2>
                    <h1 className="text-center text-2xl font-bold mt-2 text-gray-900">
                        {namaSesi}
                    </h1>
                    <p className="text-center text-sm text-gray-500 mt-1">
                        {kelasKelompok}
                    </p>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Waktu Pengerjaan:{" "}
                            <span className="font-medium">
                                {waktuPengerjaan} menit
                            </span>
                        </p>
                        <p className="text-gray-600">
                            Jumlah Soal:{" "}
                            <span className="font-medium">{jumlahSoal} butir</span>
                        </p>
                    </div>

                    {examStarted && !examEnded && (
                        <>
                            <p className="mt-6 text-center text-red-600 font-medium">
                                Sesi tes sudah dimulai. Sisa waktu tes:
                            </p>
                            <div className="text-center mt-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatTime(timeLeft)}
                                </p>
                                <div className="text-sm text-gray-600 flex justify-center gap-2">
                                    {timeLeft >= 3600 && <span>hours</span>}
                                    <span>minutes</span>
                                    <span>seconds</span>
                                </div>
                            </div>
                        </>
                    )}

                    {examEnded && (
                        <p className="mt-6 text-center text-red-600 font-medium">
                            Waktu ujian telah habis!
                        </p>
                    )}

                    <div className="mt-6 text-center space-x-2">
                        <a
                            href="/peserta"
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600"
                        >
                            Kembali
                        </a>
                        {!examEnded && (
                            <a
                            href={`/peserta/sesi/${sesiUjian?.id}/ujian/${sesiUjian?.paket_soal_id}/soal/${sesiUjian?.soal_awal_id}`}
                            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600"
                          >
                            Kerjakan
                          </a>
                          
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Detail;

