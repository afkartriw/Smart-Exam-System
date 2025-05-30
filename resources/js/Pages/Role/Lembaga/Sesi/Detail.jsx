import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function DetailSesi() {
    const { sesi_ujian } = usePage().props;
    const [pesertaStatus, setPesertaStatus] = useState(
        sesi_ujian.sesi_pesertas.reduce((acc, pesertaData) => {
            acc[pesertaData.peserta.id] = pesertaData.status === "aktif";
            return acc;
        }, {})
    );

    const toggleStatus = (id) => {
        setPesertaStatus((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

        router.patch(
            route("sesi_ujian.set_status", { id: sesi_ujian.id }),
            {
                peserta_id: id, // Kirim ID peserta
                status: !pesertaStatus[id] ? "aktif" : "non aktif", // Toggle status
            },
            {
                preserveScroll: true, // Agar tidak refresh halaman
                onSuccess: () => console.log("Status berhasil diperbarui"),
                onError: (errors) =>
                    console.error("Gagal memperbarui status", errors),
            }
        );
    };

    return (
        <MainLayout2 maxWidth="max-w-4xl">
            {" "}
            <div className="px-6 p-3">
                <h1 className="text-2xl font-bold text-blue-900">
                    Detail Sesi Ujian
                </h1>{" "}                </div>

                <div className="px-6 p-3 border-y">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-gray-700 font-semibold">Nama Sesi:</p>
                    <p>{sesi_ujian.nama_sesi_ujian}</p>
                </div>
                <div>
                    <p className="text-gray-700 font-semibold">Paket Soal:</p>
                    <p>{sesi_ujian.paket_soal.name}</p>
                </div>
                <div>
                    <p className="text-gray-700 font-semibold">Mode Peserta:</p>
                    <p>{sesi_ujian.mode_peserta}</p>
                </div>
                <div>
                    <p className="text-gray-700 font-semibold">
                        Tanggal Pelaksanaan:
                    </p>
                    <p>{sesi_ujian.tanggal_pelaksanaan}</p>
                </div>
                <div>
                    <p className="text-gray-700 font-semibold">Waktu Mulai:</p>
                    <p>{sesi_ujian.waktu_mulai}</p>
                </div>
                <div>
                    <p className="text-gray-700 font-semibold">
                        Waktu Pengerjaan:
                    </p>
                    <p>{sesi_ujian.waktu_pengerjaan} Menit</p>
                </div>
                <div>
                    <p className="text-gray-700 font-semibold">Wajib Kamera:</p>
                    <p>{sesi_ujian.wajib_kamera === "ya" ? "Ya" : "Tidak"}</p>
                </div>

                <div>
                    <p className="text-gray-700 font-semibold">
                        Batasi Browser:
                    </p>
                    <p>{sesi_ujian.batasi_browser === "ya" ? "Ya" : "Tidak"}</p>
                </div>

                <div>
                    <p className="text-gray-700 font-semibold">
                        Tampilkan Hasil:
                    </p>
                    <p>
                        {sesi_ujian.tampilkan_hasil === "ya" ? "Ya" : "Tidak"}
                    </p>
                </div>

                <div>
                    <p className="text-gray-700 font-semibold">
                        Tampilkan Pembahasan:
                    </p>
                    <p>
                        {sesi_ujian.tampilkan_pembahasan === "ya"
                            ? "Ya"
                            : "Tidak"}
                    </p>
                </div>

                <div>
                    <p className="text-gray-700 font-semibold">
                        Gunakan Sertifikat:
                    </p>
                    <p>
                        {sesi_ujian.gunakan_sertifikat === "ya"
                            ? "Ya"
                            : "Tidak"}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <p className="text-gray-700 font-semibold">
                        Petunjuk Pengerjaan:
                    </p>
                    <p>{sesi_ujian.petunjuk_pengerjaan || "-"}</p>
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                    Peserta Ujian
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border rounded-md shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">Nama</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-center">Status</th>
                                {/* <th className="p-3 text-center">Aksi</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {sesi_ujian.sesi_pesertas.map((pesertaData) => (
                                <tr
                                    key={pesertaData.peserta.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {pesertaData.peserta.nama_peserta}
                                    </td>
                                    <td className="p-3">
                                        {pesertaData.peserta.email}
                                    </td>
                                    <td className="p-3 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white ${
                                                pesertaStatus[
                                                    pesertaData.peserta.id
                                                ]
                                                    ? "bg-green-500"
                                                    : "bg-gray-500"
                                            }`}
                                        >
                                            {pesertaStatus[
                                                pesertaData.peserta.id
                                            ]
                                                ? "aktif"
                                                : "non_aktif"}
                                        </span>
                                    </td>
                                    {/* <td className="p-3 text-center">
                                                <Switch
                                                    checked={pesertaStatus[pesertaData.peserta.id]}
                                                    onChange={() => toggleStatus(pesertaData.peserta.id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${pesertaStatus[pesertaData.peserta.id] ? "bg-green-500" : "bg-gray-400"}`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pesertaStatus[pesertaData.peserta.id] ? "translate-x-6" : "translate-x-1"}`}
                                                    />
                                                </Switch>
                                            </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-6 flex space-x-4">
                <Link
                    href={route("sesi_ujian.index")}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Kembali
                </Link>
            </div> </div>
        </MainLayout2>
    );
}
