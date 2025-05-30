import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { FaEdit, FaSave } from "react-icons/fa"; // Pastikan FaEdit sudah diimpor
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function AboutUs() {
    const { abouts } = usePage().props;
    const [editing, setEditing] = useState({ id: null, field: null });
    const [tempValue, setTempValue] = useState("");
    const [imagePreviews, setImagePreviews] = useState({});

    const handleEdit = (id, field, value) => {
        setEditing({ id, field });
        setTempValue(value);
    };

    const handleSave = (id, field) => {
        router.put(`/admin/aboutus/${id}`, { [field]: tempValue });
        setEditing({ id: null, field: null });
    };

    const handleKeyDown = (e, id, field) => {
        if (e.key === "Enter") handleSave(id, field);
    };

    const handleFileChange = (id, field, event) => {
        const file = event.target.files[0];
        if (file) {
            setImagePreviews((prev) => ({
                ...prev,
                [field]: URL.createObjectURL(file),
            }));

            const formData = new FormData();
            formData.append(field, file);

            router.post(`/admin/aboutus/${id}`, formData, {
                forceFormData: true,
                onSuccess: () => alert("Gambar berhasil diperbarui"),
                onError: () => alert("Gagal memperbarui gambar"),
            });
        }
    };

    const renderEditableField = (about, field, label) => (
        <tr className="hover:bg-gray-100 text-center">
            <td className="p-2 border bg-blue-400 text-white">{label}</td>
            <td className="p-2 border text-start">
                {editing.id === about.id && editing.field === field ? (
                    <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, about.id, field)}
                        className="w-full px-2 py-1 border rounded"
                        autoFocus
                    />
                ) : (
                    <span
                        onClick={() =>
                            handleEdit(about.id, field, about[field])
                        }
                    >
                        {about[field]}
                    </span>
                )}
            </td>
            <td className="p-2 border">
                <div className="flex justify-center">
                    {editing.id === about.id && editing.field === field ? (
                        <button
                            onClick={() => handleSave(about.id, field)}
                            className="text-green-500"
                        >
                            <FaSave />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                handleEdit(about.id, field, about[field])
                            }
                            className="text-blue-500"
                        >
                            <FaEdit />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );

    const renderImageField = (about, field, label) => (
        <tr className="hover:bg-gray-100 text-center">
            <td className="p-2 border bg-blue-400 text-white">{label}</td>
            <td className="p-2 border flex items-center justify-start">
                <img
                    src={imagePreviews[field] || `/storage/${about[field]}`}
                    alt={label}
                    className="h-16 rounded-md shadow-md border"
                />
            </td>
            <td className="p-2 border">
                <div className="flex justify-center">
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(about.id, field, e)}
                        className="hidden"
                        id={`file-${field}-${about.id}`}
                    />
                    <label
                        htmlFor={`file-${field}-${about.id}`}
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                    >
                        <FaEdit />{" "}
                        {/* Mengganti tombol "Pilih File" dengan ikon FaEdit */}
                    </label>
                </div>
            </td>
        </tr>
    );

    return (
        <MainLayout>
            <div className="flex justify-between items-center p-3 px-6 border-y">
                <h1 className="text-2xl font-bold text-blue-900">
                    TABEL ABOUT US
                </h1>
            </div>
            <div className="p-6">
                <table className="w-full border rounded">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="p-2 border w-32">Konten</th>
                            <th className="p-2 border">Isi</th>
                            <th className="p-2 border w-20">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {abouts.map((about) => (
                            <React.Fragment key={about.id}>
                                {renderEditableField(about, "nama", "Nama")}
                                {renderImageField(about, "logo1", "Logo 1")}
                                {renderImageField(about, "logo2", "Logo 2")}
                                {renderEditableField(
                                    about,
                                    "slogan",
                                    "Slogan 1"
                                )}
                                {renderEditableField(
                                    about,
                                    "subSlogan",
                                    "Sub Slogan"
                                )}
                                {renderEditableField(
                                    about,
                                    "deskripsi",
                                    "Deskripsi"
                                )}
                                {renderEditableField(about, "alamat", "Alamat")}
                                {renderEditableField(about, "phone", "Phone")}
                                {renderEditableField(about, "email", "Email")}
                                {renderEditableField(
                                    about,
                                    "linkYT",
                                    "Link YouTube"
                                )}
                                {renderEditableField(
                                    about,
                                    "linkDrive",
                                    "Link Drive"
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}
