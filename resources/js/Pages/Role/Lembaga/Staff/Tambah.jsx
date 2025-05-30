import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { FaBook, FaCalendarAlt, FaUsers, FaCheckCircle } from "react-icons/fa";
import { GiCctvCamera } from "react-icons/gi";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function TambahStaf() {
    const { props } = usePage();
    const [formData, setFormData] = useState({
        nama_staff: "",
        email: "",
        peserta: "aktif", // Default value
        paket_soal: "aktif", // Default value
        sesi: "aktif", // Default value
        pengawas: "aktif", // Default value
    });

    const allKewenangans = ["peserta", "paket_soal", "sesi", "pengawas"];

    const icons = {
        peserta: <FaUsers size={24} />,
        paket_soal: <FaBook size={24} />,
        sesi: <FaCalendarAlt size={24} />,
        pengawas: <GiCctvCamera size={24} />,
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handlePermissionChange = (role) => {
        setFormData((prevData) => ({
            ...prevData,
            [role]: prevData[role] === "aktif" ? "tidak_aktif" : "aktif", // Toggle antara 'aktif' dan 'tidak_aktif'
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Payload yang dikirim ke backend
        const payload = {
            nama_staff: formData.nama_staff,
            email: formData.email,
            peserta: formData.peserta,
            paket_soal: formData.paket_soal,
            sesi: formData.sesi,
            pengawas: formData.pengawas,
        };

        router.post(route("staff.store"), payload, {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Staff berhasil ditambahkan.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => router.visit("/lembaga/staff"));
            },
            onError: (errors) => {
                Swal.fire({
                    title: "Gagal!",
                    text:
                        errors?.message ||
                        "Terjadi kesalahan saat menambahkan staff.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-2xl font-bold px-6 py-3 text-blue-900">
                            TAMBAH STAFF
                        </h1>
                        <div className="border-y p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Nama Staf
                                </label>
                                <input
                                    type="text"
                                    name="nama_staff"
                                    value={formData.nama_staff}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Kewenangan
                                </label>
                                <div className="flex gap-2 mt-2">
                                    {allKewenangans.map((role) => {
                                        const isActive =
                                            formData[role] === "aktif";
                                        return (
                                            <div
                                                key={role}
                                                className="flex flex-col items-center"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handlePermissionChange(
                                                            role
                                                        )
                                                    }
                                                    className={`relative px-3 py-1 rounded w-12 h-12 flex items-center justify-center ${
                                                        isActive
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-200 text-gray-700"
                                                    }`}
                                                >
                                                    {icons[role]}
                                                    {isActive && (
                                                        <FaCheckCircle className="h-4 w-4 absolute -bottom-0.5 -right-0.5 text-blue-500 bg-white rounded-full transform translate-x-1/4 translate-y-1/4" />
                                                    )}
                                                </button>
                                                {/* Add text below the button */}
                                                <span className="text-xs mt-1">
                                                    {isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between gap-2 px-6 py-3">
                            <Link
                                href="/lembaga/staff"
                                className="flex items-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                            >
                                Kembali
                            </Link>
                            <button
                                type="submit"
                                className="flex items-center px-4 py-2 gap-2 bg-green-500 hover:bg-green-700 text-white rounded"
                            >
                                Tambah
                            </button>
                        </div>
                    </form>               
        </MainLayout2>
    );
}
