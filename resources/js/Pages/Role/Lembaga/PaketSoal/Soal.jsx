import React, { useState, useEffect, useRef } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import { FaFileExport, FaTrashAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function TambahSoal() {
    const { props } = usePage();
    const paketSoalId =
        props.paket_soal_id || window.location.pathname.split("/").pop();
    const fileInputExcel = useRef(null);
    const fileInputWord = useRef(null);
    const [formData, setFormData] = useState({
        paket_soal_id: paketSoalId,
        pertanyaan: "",
        tipe: "pilihan_ganda",
        metode_koreksi: "exact",
        media: null,
        jawaban: [{ jawaban: "", benar: false }],
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            paket_soal_id: paketSoalId,
        }));
    }, [paketSoalId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "tipe" && {
                jawaban:
                    value === "pilihan_ganda"
                        ? [{ jawaban: "", benar: false }]
                        : value === "true_false"
                        ? [
                              { jawaban: "true", benar: false },
                              { jawaban: "false", benar: false },
                          ]
                        : [{ jawaban: "", benar: false }],
            }),
        }));
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        router.post("/import-excel", formData, {
            forceFormData: true,
            onSuccess: () =>
                Swal.fire(
                    "Berhasil!",
                    "Soal berhasil diimport dari EXCEL",
                    "success"
                ),
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setFormData((prev) => {
            const updatedFormData = { ...prev, media: file };

            // Jika file adalah MP3 dan tipe soal adalah pilihan ganda
            if (
                file &&
                file.type === "audio/mpeg" &&
                prev.tipe === "pilihan_ganda"
            ) {
                updatedFormData.jawaban = ["A", "B", "C", "D", "E"].map(
                    (label) => ({
                        jawaban: label,
                        benar: false,
                    })
                );

                Swal.fire({
                    title: "Informasi!",
                    text: "Jika keterangan jawaban sudah ada di dalam audio, maka Anda tidak perlu mengisi kolom jawaban, anda juga dapat mengubahnya menjadi keterangan jawaban sesuai kebutuhan pertanyaan , sesuaikan jumlah kolom dengan jumlah jawaban pada audio! ",
                    icon: "info",
                    confirmButtonText: "Mengerti",
                });
            }

            return updatedFormData;
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

    const handleAddOption = () => {
        if (formData.jawaban.length < 5) {
            setFormData({
                ...formData,
                jawaban: [...formData.jawaban, { jawaban: "", benar: false }],
            });
        }
    };

    const handleRemoveOption = (index) => {
        if (formData.jawaban.length > 1) {
            const updatedJawaban = formData.jawaban.filter(
                (_, i) => i !== index
            );
            setFormData({ ...formData, jawaban: updatedJawaban });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.pertanyaan.trim()) {
            Swal.fire("Perhatian!", "Silahkan isi pertanyaan.", "warning");
            return;
        }

        if (
            ["isian", "esai"].includes(formData.tipe) &&
            !formData.jawaban[0].jawaban.trim()
        ) {
            Swal.fire(
                "Perhatian!",
                "Silahkan isi jawaban untuk soal isian atau esai.",
                "warning"
            );
            return;
        }

        if (
            formData.tipe === "true_false" &&
            !formData.jawaban.some((j) => j.benar)
        ) {
            Swal.fire(
                "Perhatian!",
                "Silahkan pilih jawaban benar untuk soal True/False.",
                "warning"
            );
            return;
        }

        if (formData.tipe === "pilihan_ganda") {
            if (!formData.jawaban.some((j) => j.benar)) {
                Swal.fire(
                    "Perhatian!",
                    "Silahkan pilih jawaban yang benar untuk soal pilihan ganda.",
                    "warning"
                );
                return;
            }

            if (formData.jawaban.length < 3) {
                Swal.fire(
                    "Perhatian!",
                    "Soal pilihan ganda harus memiliki minimal 3 pilihan jawaban.",
                    "warning"
                );
                return;
            }
        }

        const formDataToSend = new FormData();
        formDataToSend.append("paket_soal_id", formData.paket_soal_id);
        formDataToSend.append("pertanyaan", formData.pertanyaan);
        formDataToSend.append("tipe", formData.tipe);
        formDataToSend.append("metode_koreksi", formData.metode_koreksi);
        if (formData.media) formDataToSend.append("media", formData.media);

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

        router.post(`/soal/store`, formDataToSend, {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire("Berhasil!", "Soal berhasil ditambahkan", "success");
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-md"
            >
                <div className="flex justify-between items-center p-3 px-6">
                    <h1 className="text-2xl font-bold text-blue-900">
                        TAMBAH SOAL
                    </h1>

                    <div className="flex items-center gap-2">
                        <a
                            href={`/lembaga/paketsoal/soal/${paketSoalId}/import`}
                            className="flex items-center px-4 p-2 gap-2 bg-green-500 text-white hover:bg-green-700 rounded"
                        >
                            <FaFileExport /> Import Excel
                        </a>

                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            ref={fileInputExcel}
                            className="hidden"
                            onChange={(e) => handleImport(e, "excel")}
                        />
                    </div>
                </div>

                <div className="border-y px-6 p-3">
                    <label className="block text-sm font-medium">
                        Pertanyaan:
                    </label>
                    <textarea
                        name="pertanyaan"
                        value={formData.pertanyaan}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-2 border mb-4"
                        placeholder="Masukkan pertanyaan..."
                    ></textarea>
                    <label className="block text-sm font-medium">
                        Tipe Soal:
                    </label>
                    <select
                        name="tipe"
                        value={formData.tipe}
                        onChange={handleChange}
                        className="w-full p-2 border mb-4"
                    >
                        <option value="pilihan_ganda">Pilihan Ganda</option>
                        <option value="true_false">True/False</option>
                        <option value="isian">Isian</option>
                        <option value="esai">Esai</option>
                    </select>
                    {["isian", "esai"].includes(formData.tipe) && (
                        <>
                            <label className="block text-sm font-medium">
                                Metode Koreksi:
                            </label>
                            <select
                                name="metode_koreksi"
                                value={formData.metode_koreksi}
                                onChange={handleChange}
                                className="w-full p-2 border mb-4"
                            >
                                <option value="exact">Exact</option>
                                <option value="fuzzy">Fuzzy</option>
                                <option value="ai">AI (Recommended)</option>
                            </select>
                        </>
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
                    {formData.tipe === "pilihan_ganda" && (
                        <>
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
                                        placeholder={`Jawaban ${index + 1}`}
                                    />
                                    <input
                                        type="checkbox"
                                        name="benar"
                                        checked={jawaban.benar}
                                        onChange={(e) =>
                                            handleJawabanChange(index, e)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveOption(index)
                                        }
                                        className="border-2 p-2.5 rounded-xl bg-red-500 hover:bg-red-800"
                                    >
                                        <FaTrashAlt color="white" />
                                    </button>
                                </div>
                            ))}
                            {formData.jawaban.length < 5 && (
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="border-2 p-2 rounded-xl bg-green-500 text-white hover:bg-green-800 flex items-center gap-2"
                                >
                                    <IoMdAdd />
                                    Tambah Opsi Jawaban
                                </button>
                            )}
                        </>
                    )}
                    {formData.tipe === "true_false" &&
                        formData.jawaban.map((jawaban, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 mb-2"
                            >
                                <input
                                    type="radio"
                                    name="benar"
                                    checked={jawaban.benar}
                                    onChange={() =>
                                        handleJawabanChange(index, {
                                            target: {
                                                name: "benar",
                                                value: true,
                                            },
                                        })
                                    }
                                />
                                <span>{jawaban.jawaban}</span>
                            </div>
                        ))}
                    {["isian", "esai"].includes(formData.tipe) && (
                        <input
                            type="text"
                            name="jawaban"
                            value={formData.jawaban[0].jawaban}
                            onChange={(e) => handleJawabanChange(0, e)}
                            className="w-full p-2 border mb-4"
                            placeholder="Jawaban..."
                        />
                    )}{" "}
                </div>
                <div className="flex justify-between py-4 px-6">
                    <Link
                        href="/lembaga/paketsoal"
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
                    >
                        Tambah Soal
                    </button>
                </div>
            </form>
        </MainLayout2>
    );
}
