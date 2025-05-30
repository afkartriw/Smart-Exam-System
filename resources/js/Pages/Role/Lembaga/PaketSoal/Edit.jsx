import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function EditPaketSoal({ paketSoal }) {
    const { props } = usePage();
    const user = props.auth.user;

    const [formData, setFormData] = useState({
        name: paketSoal.name || "",
        materi: paketSoal.materi || "",
        skala_nilai: paketSoal.skala_nilai || 100,
        kkm: paketSoal.kkm || 1,
        acak_soal: paketSoal.acak_soal || false,
        acak_jawaban: paketSoal.acak_jawaban || false,
        petunjuk_pengerjaan: paketSoal.petunjuk_pengerjaan || "",
        soal_ids: paketSoal.soals?.map((soal) => soal.id) || [],
        user_id: user.id,
        lembaga_id: user.lembaga?.id || null,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.lembaga_id) {
            Swal.fire({
                title: "Gagal!",
                text: "Lembaga tidak ditemukan! Pastikan user memiliki lembaga.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        router.put(route("paketsoal.update", paketSoal.id), formData, {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Paket soal berhasil diperbarui.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => router.visit("/lembaga/paketsoal"));
            },
            onError: (errors) => {
                Swal.fire({
                    title: "Gagal!",
                    text: "Terjadi kesalahan saat memperbarui paket soal.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                console.error(errors);
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="EDIT PAKET SOAL">
            <form onSubmit={handleSubmit} className="px-6 p-3 border-y">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Paket Soal
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Materi
                        </label>
                        <input
                            type="text"
                            name="materi"
                            value={formData.materi}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            KKM
                        </label>
                        <input
                            type="number"
                            name="kkm"
                            value={formData.kkm}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            min="1"
                            max={formData.skala_nilai}
                            required
                        />
                    </div>
                    <div className="m-4 flex justify-between px-10">
    <div>
        <label className="block text-sm font-medium text-gray-700">
            Acak Soal
        </label>
        <input
            type="checkbox"
            name="acak_soal"
            checked={formData.acak_soal}
            onChange={handleInputChange}
            className="mr-2"
        />
        <span>Ya</span>
    </div>
    
    <div className="text-right">
        <label className="block text-sm font-medium text-gray-700">
            Acak Jawaban
        </label>
        <input
            type="checkbox"
            name="acak_jawaban"
            checked={formData.acak_jawaban}
            onChange={handleInputChange}
            className="mr-2"
        />
        <span>Ya</span>
    </div>
</div>


                    <div className="mb-4 col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Petunjuk Pengerjaan
                        </label>
                        <textarea
                            name="petunjuk_pengerjaan"
                            value={formData.petunjuk_pengerjaan}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Masukkan petunjuk pengerjaan"
                            required
                        />
                    </div>
                </div>
            </form>
            <div className="flex justify-between gap-2 px-6 p-3">
                <Link
                    href="/lembaga/paketsoal"
                    className="flex items-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                >
                    Kembali
                </Link>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex items-center px-4 py-2 gap-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                >
                    Perbarui Paket
                </button>
            </div>
        </MainLayout2>
    );
}
