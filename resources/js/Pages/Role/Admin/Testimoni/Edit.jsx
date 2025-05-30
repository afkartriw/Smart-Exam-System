import React, { useState } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function EditTestimoni() {
    const { testimoni } = usePage().props;
    const [formData, setFormData] = useState({
        nama: testimoni.nama,
        jabatan: testimoni.jabatan,
        isi: testimoni.isi,
        foto: null,
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
            foto: e.target.files[0],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("nama", formData.nama);
        form.append("jabatan", formData.jabatan);
        form.append("isi", formData.isi);
        if (formData.foto) {
            form.append("foto", formData.foto);
        }

        router.post(`/admin/testimoni/${testimoni.id}`, form, {
            method: "post",
            onSuccess: () => {
                Swal.fire(
                    "Berhasil!",
                    "Testimoni berhasil diperbarui.",
                    "success"
                );
            },
            onError: () => {
                Swal.fire(
                    "Gagal!",
                    "Terjadi kesalahan saat mengupdate testimoni.",
                    "error"
                );
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="EDIT TESTIMONI">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Nama</label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4 row-span-3">
                        <label className="block text-gray-700">Isi</label>
                        <textarea
                            name="isi"
                            value={formData.isi}
                            onChange={handleChange}
                            className="w-full h-40 p-2 border rounded"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <input
                            type="text"
                            name="jabatan"
                            value={formData.jabatan}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Foto</label>
                        <input
                            type="file"
                            name="foto"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />
                        {testimoni.foto && (
                            <img
                                src={testimoni.foto}
                                alt="Preview"
                                className="mt-6 h-36"
                            />
                        )}
                    </div>
                </div>
                <div className="p-3 px-6 flex justify-between">
                    <Link
                        href="/admin/testimoni"
                        className="flex items-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </MainLayout2>
    );
}
