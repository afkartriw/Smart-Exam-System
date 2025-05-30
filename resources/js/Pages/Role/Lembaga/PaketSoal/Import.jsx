import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function ImportSoal() {
    const { paket_soal_id } = usePage().props;
    const paketSoalId =
        paket_soal_id || window.location.pathname.split("/").slice(-2, -1)[0];
    const [tipeSoal, setTipeSoal] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        file: null,
        paket_soal_id: paketSoalId,
    });

    // Path gambar
    const pilihanGandaImg = "/images/tipe-soal/pilihan_ganda.png";
    const esaiImg = "/images/tipe-soal/esai.png";
    const isianImg = "/images/tipe-soal/isian.png";
    const trueFalseImg = "/images/tipe-soal/true_false.png";

    // Path template
    const templateFiles = {
        pilihan_ganda: "/template/pilihan_ganda.xlsx",
        esai: "/template/esai.xlsx",
        isian: "/template/isian.xlsx",
        true_false: "/template/true_false.xlsx",
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.size > 300 * 1024) {
            Swal.fire("Error!", "Ukuran file melebihi batas 300 KB!", "error");
            return;
        }

        setData("file", selectedFile);
    };

    const handleTipeSoalChange = (e) => {
        setTipeSoal(e.target.value);
    };

    const getTipeSoalImage = () => {
        switch (tipeSoal) {
            case "pilihan_ganda":
                return pilihanGandaImg;
            case "esai":
                return esaiImg;
            case "isian":
                return isianImg;
            case "true_false":
                return trueFalseImg;
            default:
                return null;
        }
    };

    const getTipeSoalDescription = () => {
        switch (tipeSoal) {
            case "pilihan_ganda":
                return (
                    <>
                        <p>
                            <strong>Jenis:</strong> Pilihan Ganda
                        </p>
                        <p>
                            Soal ini memiliki beberapa opsi jawaban, dan peserta
                            memilih satu atau lebih jawaban yang benar.
                        </p>
                    </>
                );
            case "esai":
                return (
                    <>
                        <p>
                            <strong>Jenis:</strong> Esai
                        </p>
                        <p>
                            Peserta mengisi jawaban dalam bentuk teks panjang
                            tanpa pilihan jawaban.
                        </p>
                        <p>
                            <strong>Metode koreksi:</strong> AI otomatis menilai
                            jawaban berdasarkan pemahaman konteks.
                        </p>
                    </>
                );
            case "isian":
                return (
                    <>
                        <p>
                            <strong>Jenis:</strong> Isian
                        </p>
                        <p>
                            Peserta mengisi jawaban singkat yang harus sesuai
                            dengan format yang ditentukan.
                        </p>
                        <p>
                            <strong>Metode koreksi:</strong> Exact (jawaban
                            harus benar-benar sesuai dengan kunci jawaban).
                        </p>
                    </>
                );
            case "true_false":
                return (
                    <>
                        <p>
                            <strong>Jenis:</strong> True/False
                        </p>
                        <p>
                            Soal ini memiliki dua pilihan jawaban: "Benar" atau
                            "Salah".
                        </p>
                        <p>
                            <strong>Metode koreksi:</strong> Sistem secara
                            otomatis membandingkan jawaban peserta dengan kunci
                            jawaban.
                        </p>
                    </>
                );
            default:
                return null;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.file) {
            Swal.fire(
                "Oops!",
                "Silakan pilih file terlebih dahulu.",
                "warning"
            );
            return;
        }

        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("paket_soal_id", data.paket_soal_id);

        post(route("import.soal"), {
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire(
                    "Sukses!",
                    "Soal berhasil diimpor ke database!",
                    "success"
                );
                setData("file", null);
            },
            onError: (err) => {
                Swal.fire("Gagal!", "Periksa kembali format file!", "error");
                console.error("Error:", err);
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="IMPORT SOAL">
    <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="px-6 p-3 border-y">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* File Soal */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        File Soal
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mt-1 border rounded-lg block w-full text-sm text-gray-500 bg-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-100"
                        accept=".xlsx"
                        required
                    />
                    {errors.file && (
                        <p className="text-red-500 text-sm">{errors.file}</p>
                    )}
                </div>

                {/* Contoh Tipe Soal */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Contoh Tipe Soal
                    </label>
                    <div className="flex items-center gap-2">
                        <select
                            onChange={handleTipeSoalChange}
                            className="mt-1 border rounded-lg p-2 w-full"
                            required
                        >
                            <option value="">-- Pilih Tipe Soal --</option>
                            <option value="pilihan_ganda">Pilihan Ganda</option>
                            <option value="esai">Esai</option>
                            <option value="isian">Isian</option>
                            <option value="true_false">True/False</option>
                        </select>
                        {tipeSoal && (
                            <a
                                href={templateFiles[tipeSoal]}
                                download
                                className="px-3 py-2 bg-green-500 text-white rounded flex items-center"
                            >
                                <FaDownload className="mr-2" /> Template
                            </a>
                        )}
                    </div>
                </div>

                {tipeSoal && (
                    <div className="sm:col-span-2">
                        <div className="flex justify-center">
                            <img
                                src={getTipeSoalImage()}
                                alt="Tipe Soal"
                                className="w-auto max-w-full h-auto rounded-lg shadow-md"
                            />
                        </div>
                        <div className="mx-6 m-3 p-4 bg-blue-200 rounded-lg">
                            <h2 className="text-lg font-semibold mb-2">
                                Informasi
                            </h2>
                            {getTipeSoalDescription()}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Tombol */}
        <div className="flex justify-between gap-2 px-6 p-3">
            <a
                href="/lembaga/paketsoal"
                className="px-4 py-2 bg-gray-500 text-white rounded"
            >
                Kembali
            </a>
            <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
                disabled={processing}
            >
                {processing ? "Mengunggah..." : "Upload"}
            </button>
        </div>
    </form>
</MainLayout2>

    );
}
