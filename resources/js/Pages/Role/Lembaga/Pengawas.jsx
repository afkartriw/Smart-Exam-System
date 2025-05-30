import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function Page() {
    const { pengawas = [] } = usePage().props; // Berikan default array kosong

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

    const hitungBatasAkhir = (tanggal, waktu_mulai, durasi) => {
        if (!tanggal || !waktu_mulai || !durasi) return "-";

        const [jam, menit] = waktu_mulai.split(":").map(Number);
        const totalMenit = jam * 60 + menit + durasi;
        const batasJam = Math.floor(totalMenit / 60) % 24;
        const batasMenit = totalMenit % 60;

        const jamFormatted = batasJam.toString().padStart(2, "0");
        const menitFormatted = batasMenit.toString().padStart(2, "0");

        return `${formatTanggal(tanggal)} ${jamFormatted}:${menitFormatted}`;
    };

    return (
        <MainLayout>
            <div className="border-b p-3 px-6">
                <h1 className="text-2xl text-blue-900 font-bold">
                    PENGAWASAN UJIAN
                </h1>
            </div>
            <div className="px-6 p-3">
                <h1 className="text-xl font-bold">
                    Ujian yang sedang berlangsung
                </h1>
            </div>

            {/* Menampilkan Sesi Ujian dari Backend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                {pengawas.length > 0 ? (
                    pengawas.map((sesi, index) => (
                        <div
                            key={sesi.id}
                            className="border p-4 rounded shadow-sm bg-white"
                        >
                            <h3 className="font-semibold">
                                {sesi.nama_sesi_ujian}
                            </h3>
                            <p className="text-blue-600 font-medium">
                                {sesi.paket_soal?.name || "Tanpa Paket Soal"}
                            </p>
                            <p>
                                Mulai: {sesi.tanggal_pelaksanaan}{" "}
                                {sesi.waktu_mulai}
                            </p>
                            <p>Sifat: {sesi.mode_peserta}</p>
                            <p>Durasi: {sesi.waktu_pengerjaan} menit</p>
                            <p>
                                Batas:{" "}
                                {hitungBatasAkhir(
                                    sesi.tanggal_pelaksanaan,
                                    sesi.waktu_mulai,
                                    sesi.waktu_pengerjaan
                                )}
                            </p>

                            <div className="mt-4 flex items-center">
                                <a
                                    href={`/lembaga/pengawas/${sesi.id}/show`}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Masuk
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-3 text-center text-gray-500">
                        Tidak ada ujian yang sedang berlangsung.
                    </p>
                )}
            </div>
        </MainLayout>
    );
}
