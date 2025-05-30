import React from "react";
import { FaDownload } from "react-icons/fa";
import { useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function ImportPeserta() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Validasi ukuran file sebelum upload
        if (selectedFile && selectedFile.size > 300 * 1024) {
            Swal.fire("Error!", "Ukuran file melebihi batas 300 KB!", "error");
            return;
        }

        setData("file", selectedFile);
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

        post(route("store.import"), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire(
                    "Sukses!",
                    "Peserta berhasil diimpor ke database!",
                    "success"
                );
                setData("file", null); // Reset input file
            },
            onError: (err) => {
                Swal.fire("Gagal!", "Periksa kembali format file!", "error");
                console.error("Error:", err);
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="IMPORT PESERTA">
            <div className="mx-6 m-3 p-4 bg-blue-200 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Informasi</h2>
                <p className="mb-4">
                    File yang diunggah harus berekstensi XLSX, berisi empat
                    kolom, yaitu NAMA PESERTA, KELOMPOK, dan EMAIL. Perjelasan:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        <strong>NAMA PESERTA</strong>, cukup jelas.
                    </li>
                    <li>
                        <strong>KELOMPOK</strong>, isikan uraian kelompok yang
                        jelas, misalnya "Kelas X Angkatan 2015".
                    </li>
                    <li>
                        <strong>EMAIL</strong>, diisi email peserta. kode akses
                        peserta akan dikirimkan ke email tersebut (tentu saja
                        email harus berbeda antara peserta yang satu dengan yang
                        lain).
                    </li>
                </ul>
                <p>
                    Proses import peserta menggunakan excel tidak berlangsung
                    seketika. Setelah upload selesai, mohon tunggu proses import
                    yang akan berjalan secara otomatis.
                </p>
            </div>
            <div>
                <div className="mb-6 px-6">
                    <a
                        href="/template/template_peserta.xlsx"
                        download
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded w-max"
                    >
                        <FaDownload className="mr-2" /> Template Excel Peserta
                    </a>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6 px-6">
                        <label className="block text-sm font-medium mb-2">
                            File Peserta
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="border rounded-lg block text-sm text-gray-500 bg-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-100"
                            accept=".xlsx"
                        />
                        {errors.file && (
                            <p className="text-red-500 text-sm">
                                {errors.file}
                            </p>
                        )}
                    </div>
                    <div className="px-6 p-3 flex justify-between border-t">
                        <a
                            href="/lembaga/peserta"
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
                        >
                            Kembali
                        </a>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                            disabled={processing}
                        >
                            {processing ? "Mengunggah..." : "Upload"}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout2>
    );
}
