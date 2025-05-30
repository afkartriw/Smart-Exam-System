import React, { useState } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function EditKeunggulan() {
    const { keunggulan } = usePage().props;
    const [formData, setFormData] = useState({
        nama_keunggulan: keunggulan.nama_keunggulan,
        deskripsi: keunggulan.deskripsi,
        gambar: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            gambar: e.target.files[0],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("nama_keunggulan", formData.nama_keunggulan);
        form.append("deskripsi", formData.deskripsi);
        if (formData.gambar) {
            form.append("gambar", formData.gambar);
        }

        router.post(`/admin/keunggulan/${keunggulan.id}`, form, {
            method: "post",
            onSuccess: () => {
                Swal.fire(
                    "Berhasil!",
                    "Keunggulan berhasil diperbarui.",
                    "success"
                );
            },
            onError: () => {
                Swal.fire(
                    "Gagal!",
                    "Terjadi kesalahan saat mengupdate keunggulan.",
                    "error"
                );
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="EDIT KEUNGGULAN">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Nama Keunggulan
                        </label>
                        <input
                            type="text"
                            name="nama_keunggulan"
                            value={formData.nama_keunggulan}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Gambar</label>
                        <input
                            type="file"
                            name="gambar"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Deskripsi</label>
                        <textarea
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            className="w-full h-40 p-2 border rounded"
                            required
                        ></textarea>
                    </div>{" "}
                    <div>
                        {keunggulan.gambar && (
                            <img
                                src={keunggulan.gambar}
                                alt="Preview"
                                className="mt-6"
                            />
                        )}
                    </div>{" "}
                </div>
                <div className="p-3 px-6 flex justify-between">
                    <Link
                        href="/admin/keunggulan"
                        className="flex items-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Simpan
                    </button>{" "}
                </div>
            </form>
        </MainLayout2>
    );
}
