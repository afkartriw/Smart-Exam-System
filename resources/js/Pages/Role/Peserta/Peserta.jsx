import Navbar from "@/Components/Admin/Navbar";
import { usePage } from "@inertiajs/react";
import React from "react";
import { Link } from "@inertiajs/react";

const Peserta = () => {
    const { sesiUjians, peserta, error } = usePage().props;

    const sesiFiltered = sesiUjians.filter((ujian) => {
        return (
            ujian.lembaga_id === peserta.lembaga_id &&
            (ujian.kelas_kelompok === "-" ||
                ujian.kelas_kelompok === peserta.kelompok)
        );
    });

    const formatTanggal = (tanggal) => {
        if (!tanggal) return "-";
        const options = { day: "numeric", month: "long", year: "numeric" };
        return new Date(tanggal).toLocaleDateString("id-ID", options);
    };

    const formatWaktu = (waktu) => {
        if (!waktu) return "-";
        const [jam, menit] = waktu.split(":");
        return `${jam}:${menit}`;
    };

    const hitungBatasAkhir = (waktu_mulai, waktu_pengerjaan) => {
        if (!waktu_mulai || !waktu_pengerjaan) return "-";

        const [jam, menit] = waktu_mulai.split(":").map(Number);
        let date = new Date();
        date.setHours(jam);
        date.setMinutes(menit);
        date.setMinutes(date.getMinutes() + waktu_pengerjaan);

        const batasJam = String(date.getHours()).padStart(2, "0");
        const batasMenit = String(date.getMinutes()).padStart(2, "0");

        return `${batasJam}:${batasMenit}`;
    };

    const formatKelompok = (kelasKelompok, modePeserta) => {
        if (kelasKelompok === "-") return "Semua";
        if (kelasKelompok) return kelasKelompok;
        if (modePeserta) return modePeserta;
        return "Tidak Diketahui";
    };

    //     console.log("sesiUjians:", sesiUjians);
    // console.log("peserta:", peserta);

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 mt-16">
                <main className="p-8">
                    {error && (
                        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="bg-blue-100 text-blue-800 p-4 rounded mb-6">
                        <p>Informasi</p>
                        <p>
                            Berikut ini ditampilkan daftar sesi ujian untuk
                            Anda, diurutkan berdasarkan waktu.
                        </p>
                    </div>

                    <h2 className="p-3 text-center border-b border-gray-400 text-2xl font-semibold my-4">
                        Ujian yang akan datang
                    </h2>

                    {sesiFiltered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {sesiFiltered.map((ujian) => (
                                <div
                                    key={ujian.id}
                                    className="border p-4 rounded shadow-sm bg-white"
                                >
                                    <h3 className="font-semibold">
                                        {ujian.nama_sesi_ujian ||
                                            "Ujian Tanpa Nama"}
                                    </h3>
                                    <p className="text-blue-600 font-medium">
                                        {ujian.paket_soal?.name ||
                                            "Mata Pelajaran Tidak Diketahui"}
                                    </p>
                                    <p>
                                        Tanggal:{" "}
                                        {formatTanggal(
                                            ujian.tanggal_pelaksanaan
                                        )}
                                    </p>
                                    <p>
                                        Pukul: {formatWaktu(ujian.waktu_mulai)}{" "}
                                        -{" "}
                                        {hitungBatasAkhir(
                                            ujian.waktu_mulai,
                                            ujian.waktu_pengerjaan
                                        )}{" "}
                                        WIB
                                    </p>
                                    <p>
                                        Durasi: {ujian.waktu_pengerjaan || 0}{" "}
                                        menit
                                    </p>
                                    <p>
                                        Peserta:{" "}
                                        {formatKelompok(
                                            ujian.kelas_kelompok,
                                            ujian.mode_peserta
                                        )}
                                    </p>
                                    <div className="mt-4 flex items-center">
                                    <Link
  href={`/peserta/sesi/${ujian.id}/detail`}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
>
  Mulai
</Link>

                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">
                            Tidak ada ujian yang tersedia.
                        </p>
                    )}

                    <h2 className="p-3 text-center border-b border-gray-400 text-2xl font-semibold my-4">
                        Histori Ujian
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border p-4 rounded shadow-sm bg-white">
                            <h3 className="font-semibold">Uji Kompetensi #1</h3>
                            <p className="text-blue-600 font-medium">
                                Bahasa Indonesia
                            </p>
                            <p>Tanggal: 02 Agustus 2021</p>
                            <p>Pukul: 17:45 - 19:45 WIB</p>
                            <p>Sifat: Serentak</p>
                            <p>Durasi: 120 menit</p>
                            <div className="mt-4 flex items-center">
                                <span className="text-4xl font-bold mr-2">
                                    80
                                </span>
                                <button className="bg-green-500 text-white px-3 py-1 rounded">
                                    Hasil
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Peserta;
