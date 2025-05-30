import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function TambahPeserta() {
    const { paketSoals, opsiYaTidak, kelompokPesertas, pesertaManual } = usePage().props;

    const [formData, setFormData] = useState({
        nama_sesi_ujian: "",
        paket_soal_id: "",
        mode_peserta: "",
        tanggal_pelaksanaan: "",
        waktu_mulai: "",
        waktu_pengerjaan: "",
        wajib_kamera: "",
        batasi_browser: "",
        tampilkan_hasil: "",
        tampilkan_pembahasan: "",
        gunakan_sertifikat: "",
        petunjuk_pengerjaan: "",
        kelas_kelompok: "",
        peserta_manual: []
    });

    const [searchTerm, setSearchTerm] = useState("");
    
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
            peserta_manual: mode === "Manual" ? [] : []
        }));
    };

    const handleSelectPeserta = (id) => {
        setFormData((prevData) => {
            const isSelected = prevData.peserta_manual.includes(id);
            return {
                ...prevData,
                peserta_manual: isSelected ? prevData.peserta_manual.filter(pid => pid !== id) : [...prevData.peserta_manual, id]
            };
        });
    };

    const filteredPeserta = pesertaManual.filter(peserta =>
        peserta.nama_peserta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peserta.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("sesi_ujian.store"), formData, {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Sesi ujian berhasil ditambahkan.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    router.visit("/lembaga/sesi");
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Gagal!",
                    text: "Terjadi kesalahan saat menambahkan sesi ujian.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            },
        });
    };

    

    return (
        <MainLayout2 maxWidth="max-w-3xl">

                    <div className="px-6 p-3">
                        <h1 className="text-2xl font-bold text-blue-900">TAMBAH SESI UJIAN</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="px-6 p-3 border-y">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Nama Sesi Ujian */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Sesi Ujian</label>
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
                                <label className="block text-sm font-medium text-gray-700">Paket Soal</label>
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
                            <label className="block text-sm font-medium text-gray-700">Mode Peserta</label>
                            {["Semua", "Kelompok Peserta", "Manual"].map((mode, i) => (
                                <label key={i} className="flex items-center">
                                    <input type="radio" name="mode_peserta" value={mode} checked={formData.mode_peserta === mode} onChange={handleModePesertaChange} className="mr-2" required />
                                    {mode}
                                </label>
                            ))}

{formData.peserta_manual.length > 0 && (
    <div className="mt-4 p-3 border rounded bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Peserta Terpilih:</h3>
        <div className="max-h-32 overflow-auto"> {/* Maksimum tinggi 3 item */}
            <ul>
                {formData.peserta_manual.map((id) => {
                    const peserta = pesertaManual.find((p) => p.id === id);
                    return (
                        <li key={id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm mb-2">
                            <span>{peserta.nama_peserta} ({peserta.email})</span>
                            <button
                                type="button"
                                onClick={() => handleSelectPeserta(id)}
                                className="text-red-500 hover:text-red-700 text-sm font-semibold"
                            >
                                Hapus
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    </div>
)}
                        </div>

                        {/* Pilihan Kelompok Peserta */}
                        {formData.mode_peserta === "Kelompok Peserta" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pilih Kelompok</label>
                                <select name="kelas_kelompok" value={formData.kelas_kelompok} onChange={handleInputChange} className="mt-1 p-2 border rounded w-full">
                                    <option value="">Pilih Kelompok</option>
                                    {kelompokPesertas.map((kelompok) => (
                                        <option key={kelompok.value} value={kelompok.value}>{kelompok.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                       {/* Mode Manual: Search Peserta */}
{formData.mode_peserta === "Manual" && (
    <div>
        <label className="block text-sm font-medium text-gray-700">Cari Peserta</label>
        <div className="relative mt-1">
            <input
                type="text"
                placeholder="Cari berdasarkan nama atau email"
                className="p-2 pl-8 border rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
        </div>

        {/* Tampilkan daftar hanya jika ada input pencarian */}
        {searchTerm && (
            <div className="mt-2 max-h-40 overflow-auto border p-2 rounded">
                {filteredPeserta.map((peserta) => (
                    <div key={peserta.id} className="flex items-center justify-between p-2 border-b">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.peserta_manual.includes(peserta.id)}
                                onChange={() => handleSelectPeserta(peserta.id)}
                                className="mr-2"
                            />
                            {peserta.nama_peserta} ({peserta.email})
                        </label>
                    </div>
                ))}
            </div>
        )}

        {/* Daftar peserta yang sudah dipilih */}
     {/* Daftar peserta yang sudah dipilih */}


    </div>
)}


                            {/* Tanggal Pelaksanaan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Pelaksanaan</label>
                                <input
                                    type="date"
                                    name="tanggal_pelaksanaan"
                                    value={formData.tanggal_pelaksanaan}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 border rounded w-full"
                                    required
                                />
                            </div>

                            {/* Waktu Mulai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
                                <input
                                    type="time"
                                    name="waktu_mulai"
                                    value={formData.waktu_mulai}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 border rounded w-full"
                                    required
                                />
                            </div>

                            {/* Waktu Pengerjaan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Waktu Pengerjaan (Menit)</label>
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
                                { label: "Tampilkan Pembahasan", name: "tampilkan_pembahasan" },
                                { label: "Gunakan Sertifikat", name: "gunakan_sertifikat" },
                            ].map((item, i) => (
                                <div key={i}>
                                    <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                                    <div className="flex items-center space-x-4">
                                        {opsiYaTidak.map((option, j) => (
                                            <label key={j} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={item.name}
                                                    value={option.value}
                                                    checked={formData[item.name] === option.value}
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                    required
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Petunjuk Pengerjaan */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Petunjuk Pengerjaan</label>
                            <textarea
                                name="petunjuk_pengerjaan"
                                value={formData.petunjuk_pengerjaan}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded w-full"
                                rows="3"
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between gap-2 mt-6">
                            <Link href="/lembaga/sesi" className="px-4 py-2 bg-gray-500 text-white rounded">
                                Kembali
                            </Link>
                            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                                Tambah Sesi
                            </button>
                        </div>
                    </form>
                    </MainLayout2>
    );
}
