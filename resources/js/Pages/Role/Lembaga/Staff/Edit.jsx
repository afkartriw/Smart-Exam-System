import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react"; // Impor usePage, Link, dan Inertia
import { FaBook, FaCalendarAlt, FaUsers, FaCheckCircle } from "react-icons/fa"; // Impor FaCheckCircle
import { GiCctvCamera } from "react-icons/gi";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function Page() {
    const { props } = usePage(); // Akses data halaman melalui usePage
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        permissions: [],
    });

    const icons = {
        AP: <FaUsers />,
        PGJ: <FaBook />,
        POW: <FaCalendarAlt />,
        AL: <GiCctvCamera />,
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePermissionChange = (permission) => {
        setFormData((prevData) => ({
            ...prevData,
            permissions: prevData.permissions.includes(permission)
                ? prevData.permissions.filter((p) => p !== permission)
                : [...prevData.permissions, permission],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kirim data ke backend menggunakan Inertia.post
        Inertia.post("/staf/edit", formData, {
            onSuccess: () => {
                // Redirect ke halaman data staf setelah berhasil
                Inertia.visit("/data-staf");
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl">
            <form onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold px-6 py-3 text-blue-900">
                    EDIT STAFF
                </h1>
                <div className="border-y p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Staf
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
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
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
                            {["AP", "PGJ", "POW", "AL"].map((permission) => (
                                <div key={permission} className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePermissionChange(permission)
                                        }
                                        className={`px-3 py-1 rounded w-10 h-10 flex items-center justify-center ${
                                            formData.permissions.includes(
                                                permission
                                            )
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {icons[permission]}
                                    </button>
                                    {formData.permissions.includes(
                                        permission
                                    ) && (
                                        <FaCheckCircle className="h-4 w-4 absolute bottom-0.5 right-0.5 text-blue-500 bg-white rounded-full transform translate-x-1/4 translate-y-1/4" />
                                    )}
                                </div>
                            ))}
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
                        Edit
                    </button>
                </div>
            </form>
        </MainLayout2>
    );
}
