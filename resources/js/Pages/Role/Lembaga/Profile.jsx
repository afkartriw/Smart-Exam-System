"use client";

import { useState } from "react";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";
import MainLayout from "@/Components/Lembaga/MainLayout";

const EditProfile = ({ lembaga }) => {
    const { data, setData, post, processing, errors } = useForm({
        nama_lembaga: lembaga.nama_lembaga || "",
        alamat: lembaga.alamat || "",
        kabupaten: lembaga.kabupaten || "",
        jenis: lembaga.jenis || "SMP/Sederajat",
        whatsapp: lembaga.whatsapp || "",
        nama_lengkap: lembaga.nama_lengkap || "",
        logo: null,
        username: lembaga.username || "",
        email: lembaga.email || "",
    });

    const [logoPreview, setLogoPreview] = useState(lembaga.logo_url || null); // Menyimpan URL logo yang sudah ada atau preview logo baru

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file); // Simpan file logo ke form data
            setLogoPreview(URL.createObjectURL(file)); // Tampilkan preview logo baru
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("lembaga.update"), {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Profil berhasil diperbarui!",
                    confirmButtonText: "OK",
                });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat memperbarui profil!",
                });
            },
        });
    };

    const handleCancel = () => {
        window.history.back();
    };


    return (
       <MainLayout>
                        <h1 className="text-3xl text-blue-900 p-3 px-6 font-bold">
                            PROFILE LEMBAGA
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className="border-y border-gray-300 p-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="row-span-3 relative">
                                        <label className="text-gray-700">
                                            Logo :
                                        </label>
                                        <div className="flex justify-center mt-4 relative">
                                            <img
                                                src={
                                                    logoPreview ||
                                                    lembaga.logo_url ||
                                                    "/path/to/default-logo.png"
                                                }
                                                alt="Institution Logo"
                                                className="h-52 w-52 object-cover border border-black rounded-lg"
                                            />
                                            {/* Label sebagai tombol unggah */}
                                            <label className="absolute -bottom-2 right-12 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-800">
                                                <FaPencilAlt size={20} />
                                                <input
                                                    type="file"
                                                    name="logo"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        {errors.logo && (
                                            <p className="text-red-500 text-sm mt-2">
                                                {errors.logo}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Nama Lembaga:
                                        </label>
                                        <input
                                            type="text"
                                            name="nama_lembaga"
                                            value={data.nama_lembaga}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
                                        />
                                        {errors.nama_lembaga && (
                                            <p className="text-red-500 text-sm">
                                                {errors.nama_lembaga}
                                            </p>
                                        )}
                                    </div>

                                    <div className="row-span-2">
                                        <label className="block text-gray-700">
                                            Alamat:
                                        </label>
                                        <textarea
                                            name="alamat"
                                            value={data.alamat}
                                            onChange={handleInputChange}
                                            className="w-full h-36 px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
                                        />
                                        {errors.alamat && (
                                            <p className="text-red-500 text-sm">
                                                {errors.alamat}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Kabupaten:
                                        </label>
                                        <input
                                            type="text"
                                            name="kabupaten"
                                            value={data.kabupaten}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
                                        />
                                        {errors.kabupaten && (
                                            <p className="text-red-500 text-sm">
                                                {errors.kabupaten}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Jenis:
                                        </label>
                                        <select
                                            name="jenis"
                                            value={data.jenis}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
                                        >
                                            <option value="SD/Sederajat">
                                                SD/Sederajat
                                            </option>
                                            <option value="SMP/Sederajat">
                                                SMP/Sederajat
                                            </option>
                                            <option value="SMA/Sederajat">
                                                SMA/Sederajat
                                            </option>
                                            <option value="Perguruan Tinggi">
                                                Perguruan Tinggi
                                            </option>
                                            <option value="Perusahaan">
                                                Perusahaan
                                            </option>
                                        </select>
                                        {errors.jenis && (
                                            <p className="text-red-500 text-sm">
                                                {errors.jenis}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Nama Lengkap:
                                        </label>
                                        <input
                                            type="text"
                                            name="nama_lengkap"
                                            value={data.nama_lengkap}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
                                        />
                                        {errors.nama_lengkap && (
                                            <p className="text-red-500 text-sm">
                                                {errors.nama_lengkap}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            WhatsApp:
                                        </label>
                                        <input
                                            type="text"
                                            name="whatsapp"
                                            value={data.whatsapp}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
                                        />
                                        {errors.whatsapp && (
                                            <p className="text-red-500 text-sm">
                                                {errors.whatsapp}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Username:
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={data.username}
                                            className="w-full px-4 py-2 border rounded-md bg-gray-100"
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full px-4 py-2 border rounded-md bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                </div>{" "}
                            </div>
                            <div className="col-span-2 flex justify-between p-6 gap-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full px-6 py-2 border text-white bg-gray-600 shadow rounded-md hover:bg-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-2 bg-blue-600 text-white shadow rounded-md hover:bg-blue-700"
                                    disabled={processing}
                                >
                                    {processing ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                        </MainLayout>
    );
};

export default EditProfile;
