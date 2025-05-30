import React, { useState } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import Navbar from "@/Components/lembaga/Navbar";
import Swal from "sweetalert2";

export default function TambahPeserta() {
    const { data, setData, post, processing, errors } = useForm({
        nama_peserta: "",
        email: "",
        kelompok: "",
    });

    const handleInputChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Peserta akan ditambahkan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Tambahkan!",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                post(route("peserta.store"), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Berhasil!",
                            text: "Peserta berhasil ditambahkan.",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(() => {
                            window.location.href = "/staff/peserta";
                        });
                    },
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-2xl m-auto pt-32">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-3 px-6">
                        <h1 className="text-2xl font-bold text-blue-900">
                            TAMBAH PESERTA
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit} > <div className="border-y p-3 px-6 grid grid-cols-1 gap-2">
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nama Peserta</label>
        <input
            type="text"
            name="nama_peserta"
            value={data.nama_peserta}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded w-full"
            required
        />
        {errors.nama_peserta && <p className="text-red-500 text-sm">{errors.nama_peserta}</p>}
    </div>

    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded w-full"
            required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
    </div>

    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Kelompok</label>
        <input
            type="text"
            name="kelompok"
            value={data.kelompok}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded w-full"
            required
        />
        {errors.kelompok && <p className="text-red-500 text-sm">{errors.kelompok}</p>}
    </div>
    </div>
    <div className="p-3 px-6 flex justify-between">
        <Link
            href="/staff/peserta"
            className="flex items-center justify-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
        >
            Kembali
        </Link>
        <button
            type="submit"
            disabled={processing}
            className="flex items-center justify-center px-4 py-2 gap-2 bg-green-500 hover:bg-green-700 text-white rounded"
        >
            Tambah
        </button>
    </div>
</form>

                </div>
            </main>
        </div>
    );
}
