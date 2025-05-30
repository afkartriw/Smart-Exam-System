import React, { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Navbar from "@/Components/Admin/Navbar";

export default function EditSoal() {
    const { props } = usePage();
    const { soal, paketSoal } = props;

    const [formData, setFormData] = useState({
        paket_soal_id: soal.paket_soal_id,
        pertanyaan: soal.pertanyaan,
        tipe: soal.tipe,
        metode_koreksi: soal.metode_koreksi || "",
        media: null,
        media_url: soal.media ? `/storage/${soal.media}` : null,
        jawaban: soal.jawabans || [{ jawaban: "", benar: false }],
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            paket_soal_id: soal.paket_soal_id,
        }));
    }, [soal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            media: file,
            media_url: URL.createObjectURL(file),
        });
    };

    const handleJawabanChange = (index, e) => {
        const { name, type, checked, value } = e.target;
        const updatedJawaban = [...formData.jawaban];

        if (formData.tipe === "true_false") {
            updatedJawaban.forEach((jwb) => (jwb.benar = false));
            updatedJawaban[index].benar = true;
        } else {
            updatedJawaban[index][name] = type === "checkbox" ? checked : value;
        }

        setFormData({ ...formData, jawaban: updatedJawaban });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.pertanyaan.trim()) {
            Swal.fire("Perhatian!", "Silahkan isi pertanyaan.", "warning");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("_method", "PUT");
        formDataToSend.append("paket_soal_id", formData.paket_soal_id);
        formDataToSend.append("pertanyaan", formData.pertanyaan);
        formDataToSend.append("tipe", formData.tipe);

        if (formData.tipe === "isian" || formData.tipe === "esai") {
            formDataToSend.append("metode_koreksi", formData.metode_koreksi);
        }

        if (formData.media) {
            formDataToSend.append("media", formData.media);
        }

        formData.jawaban.forEach((jawaban, index) => {
            formDataToSend.append(
                `jawaban[${index}][jawaban]`,
                jawaban.jawaban
            );
            formDataToSend.append(
                `jawaban[${index}][benar]`,
                jawaban.benar ? 1 : 0
            );
        });

        router.post(
            `/lembaga/paketsoal/${soal.paket_soal_id}/soal/${soal.id}`,
            formDataToSend,
            {
                forceFormData: true,
                onSuccess: () => {
                    Swal.fire(
                        "Berhasil!",
                        "Soal berhasil diperbarui",
                        "success"
                    );
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-3xl m-auto pt-24 pb-10">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg shadow-md"
                >
                    <h1 className="text-2xl font-bold text-blue-900 p-3 px-6">
                        EDIT SOAL
                    </h1>
                    <div className="border-y p-3 px-6">
                        <label className="block text-sm font-medium">
                            Pertanyaan:
                        </label>
                        <textarea
                            name="pertanyaan"
                            value={formData.pertanyaan}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border mb-4"
                        ></textarea>

                        <label className="block text-sm font-medium">
                            Tipe Soal:
                        </label>
                        <input
                            type="text"
                            value={formData.tipe}
                            readOnly
                            className="w-full p-2 border mb-4 bg-gray-100 text-gray-700"
                        />

                        {formData.media_url && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium">
                                    Media Saat Ini:
                                </label>
                                {formData.media_url.endsWith(".mp4") ? (
                                    <video
                                        controls
                                        src={formData.media_url}
                                        className="w-full h-40"
                                    />
                                ) : formData.media_url.endsWith(".mp3") ? (
                                    <audio
                                        controls
                                        src={formData.media_url}
                                        className="w-full"
                                    />
                                ) : (
                                    <img
                                        src={formData.media_url}
                                        alt="Media"
                                        className="w-full h-40 object-cover"
                                    />
                                )}
                            </div>
                        )}

                        <label className="block text-sm font-medium">
                            Upload Media (Opsional):
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border mb-4"
                        />

                        <label className="block text-sm font-medium">
                            Jawaban:
                        </label>
                        {formData.jawaban.map((jawaban, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 mb-2"
                            >
                                <input
                                    type="text"
                                    name="jawaban"
                                    value={jawaban.jawaban}
                                    onChange={(e) =>
                                        handleJawabanChange(index, e)
                                    }
                                    className="w-full p-2 border"
                                />
                                <input
                                    type={
                                        formData.tipe === "true_false"
                                            ? "radio"
                                            : "checkbox"
                                    }
                                    name="benar"
                                    checked={jawaban.benar}
                                    onChange={(e) =>
                                        handleJawabanChange(index, e)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between p-3 px-6">
                        <Link
                            href="/lembaga/paketsoal"
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Kembali
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
