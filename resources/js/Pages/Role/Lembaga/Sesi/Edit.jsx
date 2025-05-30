import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function EditSesi() {
    const { sesiUjian, paketSoals, opsiYaTidak, kelompokPesertas } =
        usePage().props;

    const [formData, setFormData] = useState({
        nama_sesi_ujian: sesiUjian.nama_sesi_ujian || "",
        paket_soal_id: sesiUjian.paket_soal_id || "",
        mode_peserta: sesiUjian.mode_peserta || "",
        tanggal_pelaksanaan: sesiUjian.tanggal_pelaksanaan || "",
        waktu_mulai: sesiUjian.waktu_mulai || "",
        waktu_pengerjaan: sesiUjian.waktu_pengerjaan || "",
        wajib_kamera: sesiUjian.wajib_kamera || "",
        batasi_browser: sesiUjian.batasi_browser || "",
        tampilkan_hasil: sesiUjian.tampilkan_hasil || "",
        tampilkan_pembahasan: sesiUjian.tampilkan_pembahasan || "",
        gunakan_sertifikat: sesiUjian.gunakan_sertifikat || "",
        petunjuk_pengerjaan: sesiUjian.petunjuk_pengerjaan || "",
        kelas_kelompok: sesiUjian.kelas_kelompok || "-",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleModePesertaChange = (e) => {
        const mode = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            mode_peserta: mode,
            kelas_kelompok: mode === "Kelompok Peserta" ? "" : "-",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedFormData = {
            ...formData,
            kelas_kelompok:
                formData.kelas_kelompok.trim() === ""
                    ? "-"
                    : formData.kelas_kelompok,
        };

        router.put(route("sesi_ujian.update", sesiUjian.id), updatedFormData, {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Sesi ujian berhasil diperbarui.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    router.visit("/lembaga/sesi");
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Gagal!",
                    text: "Terjadi kesalahan saat memperbarui sesi ujian.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="EDIT SESI UJIAN">     
            <form onSubmit={handleSubmit} >
            <div className="px-6 p-3 border-y">       

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nama Sesi Ujian */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Sesi Ujian
                        </label>
                        <input
                            type="text"
                            name="nama_sesi_ujian"
                            value={formData.nama_sesi_ujian}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>

                    {/* Paket Soal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Paket Soal
                        </label>
                        <select
                            name="paket_soal_id"
                            value={formData.paket_soal_id}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        >
                            <option value="">Pilih Paket Soal</option>
                            {paketSoals.map((paket) => (
                                <option key={paket.id} value={paket.id}>
                                    {paket.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mode Peserta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mode Peserta
                        </label>
                        {["Semua", "Kelompok Peserta", "Manual"].map(
                            (mode, i) => (
                                <label key={i} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="mode_peserta"
                                        value={mode}
                                        checked={formData.mode_peserta === mode}
                                        onChange={handleModePesertaChange}
                                        className="mr-2"
                                        required
                                    />
                                    {mode}
                                </label>
                            )
                        )}
                    </div>

                    {formData.mode_peserta === "Kelompok Peserta" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pilih Kelompok
                            </label>
                            <select
                                name="kelas_kelompok"
                                value={formData.kelas_kelompok}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded w-full"
                                required
                            >
                                <option value="">Pilih Kelompok</option>
                                {kelompokPesertas?.map((kelompok, index) => (
                                    <option key={index} value={kelompok.value}>
                                        {kelompok.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Tanggal Pelaksanaan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tanggal Pelaksanaan
                        </label>
                        <input
                            type="date"
                            name="tanggal_pelaksanaan"
                            value={formData.tanggal_pelaksanaan}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>

                    {/* Waktu Mulai & Waktu Pengerjaan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Waktu Mulai
                        </label>
                        <input
                            type="time"
                            name="waktu_mulai"
                            value={formData.waktu_mulai}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Waktu Pengerjaan (Menit)
                        </label>
                        <input
                            type="number"
                            name="waktu_pengerjaan"
                            value={formData.waktu_pengerjaan}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>

                    {/* Opsi Ya/Tidak */}
                    {[
                        { label: "Wajibkan Kamera", name: "wajib_kamera" },
                        { label: "Batasi Browser", name: "batasi_browser" },
                        { label: "Tampilkan Hasil", name: "tampilkan_hasil" },
                        {
                            label: "Tampilkan Pembahasan",
                            name: "tampilkan_pembahasan",
                        },
                        {
                            label: "Gunakan Sertifikat",
                            name: "gunakan_sertifikat",
                        },
                    ].map((item, i) => (
                        <div key={i} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                {item.label}
                            </label>
                            <div className="flex gap-4 mt-1">
                                {/* Opsi "Ya" */}
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name={item.name}
                                        value="ya"
                                        checked={formData[item.name] === "ya"}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Ya
                                </label>

                                {/* Opsi "Tidak" */}
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name={item.name}
                                        value="tidak"
                                        checked={
                                            formData[item.name] === "tidak"
                                        }
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Tidak
                                </label>
                            </div>
                        </div>
                    ))}
                </div></div>

                {/* Tombol */}
                <div className="flex justify-between gap-2 px-6 p-3">
                    <Link
                        href="/lembaga/sesi"
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </MainLayout2>
    );
}
