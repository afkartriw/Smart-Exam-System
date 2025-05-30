import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function EditPoinPage() {
    const { poin } = usePage().props; // Ambil data poin dari backend
    const [formData, setFormData] = useState({
        nama: poin.nama,
        jumlah_poin: poin.jumlah_poin,
        harga: poin.harga,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/poin/${poin.id}`, formData, {
            onSuccess: () => {
                Swal.fire(
                    "Berhasil!",
                    "Data poin berhasil diperbarui.",
                    "success"
                );
            },
            onError: () => {
                Swal.fire(
                    "Gagal!",
                    "Terjadi kesalahan saat memperbarui data.",
                    "error"
                );
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-2xl" judul="EDIT POIN">

                    <form onSubmit={handleSubmit}>
                        <div className="border-y p-3 px-6 grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-gray-700 font-bold">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold">
                                    Jumlah Poin
                                </label>
                                <input
                                    type="number"
                                    name="jumlah_poin"
                                    value={formData.jumlah_poin}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold">
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    name="harga"
                                    value={formData.harga}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded"
                                    required
                                />
                            </div>
                        </div>
                        <div className="p-3 px-6 flex justify-between">
                            <a
                                href="/admin/poin"
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                            >
                                Kembali
                            </a>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                    </MainLayout2>
    );
}
